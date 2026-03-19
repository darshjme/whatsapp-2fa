const express = require('express');
const { config } = require('./config');
const { logger } = require('./logger');
const { connectWhatsApp, getConnectionStatus, shutdown: shutdownWhatsApp } = require('./whatsapp');
const { shutdown: shutdownOtpStore } = require('./otp-store');
const { router } = require('./routes');

const app = express();

// Parse JSON bodies with a size limit
app.use(express.json({ limit: '16kb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(
      { method: req.method, url: req.originalUrl, status: res.statusCode, durationMs: duration },
      'request'
    );
  });
  next();
});

// Health check -- no auth, lightweight
app.get('/health', (req, res) => {
  const conn = getConnectionStatus();
  const healthy = conn.status === 'connected';
  res.status(healthy ? 200 : 503).json({
    service: 'whatsapp-2fa',
    version: '1.0.0',
    uptime: Math.floor(process.uptime()),
    whatsapp: conn.status,
    healthy,
  });
});

// Mount API routes
app.use('/api', router);

// 404 catch-all
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler -- never leak stack traces
app.use((err, req, res, _next) => {
  logger.error({ err: err.message, stack: err.stack }, 'Unhandled express error');
  res.status(500).json({ error: 'Internal server error' });
});

// ---- Server lifecycle ----

let server = null;

async function main() {
  logger.info('Starting WhatsApp 2FA service...');

  // Connect to WhatsApp (will show QR if first time)
  await connectWhatsApp();

  server = app.listen(config.port, () => {
    logger.info({ port: config.port }, 'WhatsApp 2FA API is running');
    logger.info('Endpoints:');
    logger.info('  GET  /health             -- Health check');
    logger.info('  GET  /api/status         -- WhatsApp connection status');
    logger.info('  POST /api/otp/send       -- Send OTP { phone, reference }');
    logger.info('  POST /api/otp/verify     -- Verify OTP { phone, reference, code }');
    logger.info('  GET  /api/otp/status     -- OTP status ?phone=...&reference=...');
  });
}

// ---- Graceful shutdown ----

async function gracefulShutdown(signal) {
  logger.info({ signal }, 'Shutdown signal received');

  // Stop accepting new connections
  if (server) {
    await new Promise((resolve) => {
      server.close((err) => {
        if (err) logger.error({ err: err.message }, 'Error closing HTTP server');
        resolve();
      });
    });
    logger.info('HTTP server closed');
  }

  // Tear down WhatsApp connection
  shutdownWhatsApp();

  // Clear OTP store timers
  shutdownOtpStore();

  logger.info('Shutdown complete');
  process.exit(0);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch unhandled errors so the process doesn't crash silently
process.on('unhandledRejection', (err) => {
  logger.error({ err: String(err) }, 'Unhandled promise rejection');
});
process.on('uncaughtException', (err) => {
  logger.fatal({ err: err.message, stack: err.stack }, 'Uncaught exception -- shutting down');
  gracefulShutdown('uncaughtException');
});

main().catch((err) => {
  logger.fatal({ err: err.message, stack: err.stack }, 'Failed to start');
  process.exit(1);
});
