const express = require('express');
const { config } = require('./config');
const { createOtp, verifyOtp, getStatus } = require('./otp-store');
const { sendMessage, getConnectionStatus } = require('./whatsapp');

const router = express.Router();

// API key auth middleware
function authMiddleware(req, res, next) {
  if (!config.apiKey) return next(); // no key configured = open access
  const key = req.headers['x-api-key'];
  if (key !== config.apiKey) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  next();
}

router.use(authMiddleware);

// GET /status — WhatsApp connection status
router.get('/status', (req, res) => {
  const conn = getConnectionStatus();
  res.json(conn);
});

// POST /otp/send — Generate and send OTP
// Body: { phone: "919876543210", reference: "login-session-abc" }
router.post('/otp/send', async (req, res) => {
  try {
    const { phone, reference } = req.body;
    if (!phone || !reference) {
      return res.status(400).json({ error: 'phone and reference are required' });
    }

    const conn = getConnectionStatus();
    if (conn.status !== 'connected') {
      return res.status(503).json({ error: 'WhatsApp is not connected', status: conn.status });
    }

    const record = createOtp(phone, reference);
    const message = config.otp.messageTemplate.replace('{{otp}}', record.otp);

    await sendMessage(phone, message);

    res.json({
      success: true,
      phone,
      reference,
      expiresAt: new Date(record.expiresAt).toISOString(),
    });
  } catch (err) {
    console.error('OTP send error:', err.message);
    res.status(500).json({ error: 'Failed to send OTP', details: err.message });
  }
});

// POST /otp/verify — Verify an OTP
// Body: { phone: "919876543210", reference: "login-session-abc", code: "123456" }
router.post('/otp/verify', (req, res) => {
  const { phone, reference, code } = req.body;
  if (!phone || !reference || !code) {
    return res.status(400).json({ error: 'phone, reference, and code are required' });
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
});

// GET /otp/status — Check OTP status (without revealing code)
// Query: ?phone=919876543210&reference=login-session-abc
router.get('/otp/status', (req, res) => {
  const { phone, reference } = req.query;
  if (!phone || !reference) {
    return res.status(400).json({ error: 'phone and reference query params are required' });
  }

  const record = getStatus(phone, reference);
  if (!record) {
    return res.status(404).json({ found: false });
  }

  res.json({
    found: true,
    phone: record.phone,
    reference: record.reference,
    verified: record.verified,
    attempts: record.attempts,
    expired: Date.now() > record.expiresAt,
    expiresAt: new Date(record.expiresAt).toISOString(),
  });
});

module.exports = { router };
