const crypto = require('crypto');
const express = require('express');
const { config } = require('./config');
const { logger } = require('./logger');
const { createOtp, verifyOtp, getStatus, checkRateLimit } = require('./otp-store');
const { sendMessage, getConnectionStatus } = require('./whatsapp');

const router = express.Router();

// ---- Validation helpers ----

/**
 * Validate phone number: must be 7-15 digits, no other characters.
 */
function isValidPhone(phone) {
  return typeof phone === 'string' && /^\d{7,15}$/.test(phone);
}

/**
 * Sanitize reference: allow alphanumeric, hyphens, underscores, dots. Max 128 chars.
 */
function isValidReference(ref) {
  return typeof ref === 'string' && /^[\w.\-]{1,128}$/.test(ref);
}

/**
 * Sanitize OTP code: must match expected length, digits only.
 */
function isValidCode(code) {
  return (
    typeof code === 'string' &&
    code.length === config.otp.length &&
    /^\d+$/.test(code)
  );
}

// ---- API key auth middleware (timing-safe) ----

function authMiddleware(req, res, next) {
  if (!config.apiKey) return next(); // no key configured = open access

  const key = req.headers['x-api-key'];
  if (typeof key !== 'string' || key.length === 0) {
    return res.status(401).json({ error: 'Missing API key' });
  }

  // Timing-safe comparison
  const expected = Buffer.from(config.apiKey, 'utf8');
  const provided = Buffer.from(key, 'utf8');

  if (expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
}

router.use(authMiddleware);

// ---- Health check (no auth required -- mounted separately in index.js) ----

// ---- GET /status -- WhatsApp connection status ----
router.get('/status', (req, res) => {
  const conn = getConnectionStatus();
  res.json({
    status: conn.status,
    // Only expose QR when pending so the client can display it
    qr: conn.status === 'qr_pending' ? conn.qr : undefined,
  });
});

// ---- POST /otp/send -- Generate and send OTP ----
router.post('/otp/send', async (req, res) => {
  try {
    const { phone, reference } = req.body;

    // Input validation
    if (!phone || !reference) {
      return res.status(400).json({ error: 'phone and reference are required' });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: 'Invalid phone number. Must be 7-15 digits (country code + number).' });
    }
    if (!isValidReference(reference)) {
      return res.status(400).json({ error: 'Invalid reference. Alphanumeric, hyphens, underscores, dots only. Max 128 chars.' });
    }

    // Check WhatsApp connection
    const conn = getConnectionStatus();
    if (conn.status !== 'connected') {
      return res.status(503).json({ error: 'WhatsApp is not connected' });
    }

    // Rate limit check (per phone, per hour)
    const rateCheck = checkRateLimit(phone);
    if (!rateCheck.allowed) {
      logger.warn({ phone }, 'Rate limit exceeded');
      return res.status(429).json({
        error: 'Too many OTP requests. Try again later.',
        retryAfterSeconds: rateCheck.retryAfterSeconds,
      });
    }

    // Create OTP and send
    const record = createOtp(phone, reference);
    const message = config.otp.messageTemplate
      .replace('{{otp}}', record.otp)
      .replace('{{app_name}}', config.appName);

    await sendMessage(phone, message);

    res.json({
      success: true,
      phone,
      reference,
      expiresAt: new Date(record.expiresAt).toISOString(),
    });
  } catch (err) {
    logger.error({ err: err.message, stack: err.stack }, 'OTP send error');
    // Do not leak internal error details
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
});

// ---- POST /otp/verify -- Verify an OTP ----
router.post('/otp/verify', (req, res) => {
  try {
    const { phone, reference, code } = req.body;

    if (!phone || !reference || !code) {
      return res.status(400).json({ error: 'phone, reference, and code are required' });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }
    if (!isValidReference(reference)) {
      return res.status(400).json({ error: 'Invalid reference' });
    }
    if (!isValidCode(code)) {
      return res.status(400).json({ error: `Invalid code format. Must be ${config.otp.length} digits.` });
    }

    const result = verifyOtp(phone, reference, code);

    if (result.success) {
      return res.json({ success: true });
    }

    const statusCodes = {
      not_found: 404,
      expired: 410,
      max_attempts: 429,
      invalid: 401,
      already_verified: 409,
    };

    res.status(statusCodes[result.reason] || 400).json({
      success: false,
      reason: result.reason,
    });
  } catch (err) {
    logger.error({ err: err.message, stack: err.stack }, 'OTP verify error');
    res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
});

// ---- GET /otp/status -- Check OTP status (never reveals the code) ----
router.get('/otp/status', (req, res) => {
  try {
    const { phone, reference } = req.query;

    if (!phone || !reference) {
      return res.status(400).json({ error: 'phone and reference query params are required' });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }
    if (!isValidReference(reference)) {
      return res.status(400).json({ error: 'Invalid reference' });
    }

    const record = getStatus(phone, reference);
    if (!record) {
      return res.status(404).json({ found: false });
    }

    res.json({ found: true, ...record });
  } catch (err) {
    logger.error({ err: err.message, stack: err.stack }, 'OTP status error');
    res.status(500).json({ error: 'Failed to check status.' });
  }
});

module.exports = { router };
