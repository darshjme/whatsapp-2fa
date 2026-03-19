const express = require('express');
const { config } = require('./config');
const { connectWhatsApp } = require('./whatsapp');
const { router } = require('./routes');

const app = express();
app.use(express.json());
app.use('/api', router);

// Health check
app.get('/', (req, res) => {
  res.json({ service: 'whatsapp-2fa', version: '1.0.0' });
});

async function main() {
  // Connect to WhatsApp (will show QR if first time)
  await connectWhatsApp();

  app.listen(config.port, () => {
    console.log(`\n🚀 WhatsApp 2FA API running on http://localhost:${config.port}`);
    console.log(`\nEndpoints:`);
    console.log(`  GET  /api/status       — WhatsApp connection status`);
    console.log(`  POST /api/otp/send     — Send OTP { phone, reference }`);
    console.log(`  POST /api/otp/verify   — Verify OTP { phone, reference, code }`);
    console.log(`  GET  /api/otp/status   — Check OTP status ?phone=...&reference=...`);
  });
}

main().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
