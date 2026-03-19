const crypto = require('crypto');
const { config } = require('./config');
const { logger } = require('./logger');

// In-memory store: key = "phone:reference" -> { otp, phone, reference, expiresAt, createdAt, attempts, verified }
const store = new Map();

// Rate limit store: key = phone -> [timestamps]
const rateLimitStore = new Map();

// Cleanup expired entries every 60s
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const [key, record] of store) {
    // Remove expired records (keep for 30s after expiry for status checks)
    if (record.expiresAt + 30_000 < now) {
      store.delete(key);
      cleaned++;
    }
  }
  // Clean up old rate limit entries (remove phones with no recent activity in the last max window)
  const maxDelayMs = Math.max(...config.rateLimit.progressiveDelaysMinutes) * 60 * 1000;
  for (const [phone, timestamps] of rateLimitStore) {
    const valid = timestamps.filter((t) => t > now - maxDelayMs);
    if (valid.length === 0) {
      rateLimitStore.delete(phone);
    } else {
      rateLimitStore.set(phone, valid);
    }
  }
  if (cleaned > 0) {
    logger.debug({ cleaned }, 'OTP store cleanup');
  }
}, 60_000);
cleanupInterval.unref();

function generateOtp() {
  const max = Math.pow(10, config.otp.length);
  const num = crypto.randomInt(0, max);
  return num.toString().padStart(config.otp.length, '0');
}

function makeKey(phone, reference) {
  return `${phone}:${reference}`;
}

/**
 * Check progressive rate limit for a phone number.
 * Progressive delays (in minutes): [0, 2, 5, 10, 60, 3600]
 *   1st request: no delay
 *   2nd request: must wait 2 minutes after the 1st
 *   3rd request: must wait 5 minutes after the 2nd
 *   4th request: must wait 10 minutes after the 3rd
 *   5th request: must wait 60 minutes after the 4th
 *   6th+ request: must wait 3600 minutes after the previous
 * Returns { allowed: boolean, retryAfterSeconds?: number }
 */
function checkRateLimit(phone) {
  const now = Date.now();
  const timestamps = rateLimitStore.get(phone) || [];
  const delays = config.rateLimit.progressiveDelaysMinutes;
  const requestCount = timestamps.length;

  if (requestCount === 0) {
    return { allowed: true };
  }

  // Determine the required delay for the next request
  const delayIndex = Math.min(requestCount, delays.length - 1);
  const requiredDelayMs = delays[delayIndex] * 60 * 1000;
  const lastTimestamp = timestamps[timestamps.length - 1];
  const elapsed = now - lastTimestamp;

  if (elapsed < requiredDelayMs) {
    const retryAfterSeconds = Math.ceil((requiredDelayMs - elapsed) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true };
}

/**
 * Record a rate limit hit for a phone number.
 */
function recordRateLimitHit(phone) {
  const now = Date.now();
  const timestamps = rateLimitStore.get(phone) || [];
  timestamps.push(now);
  rateLimitStore.set(phone, timestamps);
}

/**
 * Create a new OTP for the given phone and reference.
 * Previous OTP for the same key is overwritten.
 */
function createOtp(phone, reference) {
  const key = makeKey(phone, reference);
  const otp = generateOtp();
  const record = {
    otp,
    phone,
    reference,
    createdAt: Date.now(),
    expiresAt: Date.now() + config.otp.expirySeconds * 1000,
    attempts: 0,
    verified: false,
  };
  store.set(key, record);
  recordRateLimitHit(phone);
  logger.info({ phone, reference }, 'OTP created');
  return record;
}

/**
 * Verify an OTP using timing-safe comparison.
 * Returns { success: boolean, reason?: string }
 */
function verifyOtp(phone, reference, code) {
  const key = makeKey(phone, reference);
  const record = store.get(key);

  if (!record) return { success: false, reason: 'not_found' };
  if (record.verified) return { success: false, reason: 'already_verified' };
  if (Date.now() > record.expiresAt) {
    store.delete(key);
    return { success: false, reason: 'expired' };
  }
  if (record.attempts >= config.otp.maxAttempts) {
    store.delete(key);
    return { success: false, reason: 'max_attempts' };
  }

  record.attempts++;

  // Timing-safe comparison to prevent timing attacks
  const codeStr = String(code).padStart(config.otp.length, '0');
  const otpBuf = Buffer.from(record.otp, 'utf8');
  const codeBuf = Buffer.from(codeStr, 'utf8');

  let match = false;
  if (otpBuf.length === codeBuf.length) {
    match = crypto.timingSafeEqual(otpBuf, codeBuf);
  }

  if (!match) {
    logger.info({ phone, reference, attempts: record.attempts }, 'OTP verification failed');
    return { success: false, reason: 'invalid' };
  }

  record.verified = true;
  // Auto-cleanup verified record after 30s
  const cleanupTimer = setTimeout(() => store.delete(key), 30_000);
  cleanupTimer.unref();

  logger.info({ phone, reference }, 'OTP verified successfully');
  return { success: true };
}

/**
 * Get status for a phone+reference (never returns the OTP itself).
 */
function getStatus(phone, reference) {
  const record = store.get(makeKey(phone, reference));
  if (!record) return null;
  return {
    phone: record.phone,
    reference: record.reference,
    verified: record.verified,
    attempts: record.attempts,
    maxAttempts: config.otp.maxAttempts,
    expired: Date.now() > record.expiresAt,
    expiresAt: new Date(record.expiresAt).toISOString(),
    createdAt: new Date(record.createdAt).toISOString(),
  };
}

/**
 * Shutdown: clear the cleanup interval.
 */
function shutdown() {
  clearInterval(cleanupInterval);
  store.clear();
  rateLimitStore.clear();
}

module.exports = { createOtp, verifyOtp, getStatus, checkRateLimit, shutdown };
