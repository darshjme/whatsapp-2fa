const crypto = require('crypto');
const { config } = require('./config');

// In-memory store: key = "phone:reference" → { otp, phone, reference, expiresAt, attempts, verified }
const store = new Map();

// Cleanup expired entries every 60s
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store) {
    if (record.expiresAt < now) store.delete(key);
  }
}, 60_000).unref();

function generateOtp() {
  const max = Math.pow(10, config.otp.length);
  const num = crypto.randomInt(0, max);
  return num.toString().padStart(config.otp.length, '0');
}

function makeKey(phone, reference) {
  return `${phone}:${reference}`;
}

function createOtp(phone, reference) {
  const key = makeKey(phone, reference);
  const record = {
    otp: generateOtp(),
    phone,
    reference,
    expiresAt: Date.now() + config.otp.expirySeconds * 1000,
    attempts: 0,
    verified: false,
  };
  store.set(key, record);
  return record;
}

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

  if (record.otp !== code) return { success: false, reason: 'invalid' };

  record.verified = true;
  setTimeout(() => store.delete(key), 30_000).unref();
  return { success: true };
}

function getStatus(phone, reference) {
  return store.get(makeKey(phone, reference)) || null;
}

module.exports = { createOtp, verifyOtp, getStatus };
