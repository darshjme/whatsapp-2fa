const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const { config } = require('./config');
const { logger } = require('./logger');

// Baileys internal logger -- keep quiet unless debugging
const baileysLogger = pino({ level: 'silent' });

let sock = null;
let connectionStatus = 'disconnected'; // disconnected | connecting | qr_pending | connected
let currentQr = null;
let reconnectAttempt = 0;
let reconnectTimer = null;
let shuttingDown = false;

const MAX_RECONNECT_DELAY_MS = 60_000;
const BASE_RECONNECT_DELAY_MS = 1_000;

function getConnectionStatus() {
  return { status: connectionStatus, qr: currentQr };
}

/**
 * Calculate exponential backoff delay with jitter.
 */
function getReconnectDelay() {
  const delay = Math.min(
    BASE_RECONNECT_DELAY_MS * Math.pow(2, reconnectAttempt),
    MAX_RECONNECT_DELAY_MS
  );
  // Add up to 25% jitter
  const jitter = delay * 0.25 * Math.random();
  return Math.floor(delay + jitter);
}

async function connectWhatsApp() {
  if (shuttingDown) return;

  const { state, saveCreds } = await useMultiFileAuthState(config.authStorePath);

  connectionStatus = 'connecting';
  currentQr = null;

  sock = makeWASocket({
    auth: state,
    logger: baileysLogger,
    printQRInTerminal: false,
    browser: Browsers.ubuntu('WhatsApp-2FA'),
    // Reduce reconnect noise
    connectTimeoutMs: 30_000,
    defaultQueryTimeoutMs: 30_000,
    keepAliveIntervalMs: 25_000,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      currentQr = qr;
      connectionStatus = 'qr_pending';
      logger.info('QR code received -- scan with WhatsApp sender number');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      currentQr = null;
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const reason = lastDisconnect?.error?.output?.payload?.message || 'unknown';

      if (statusCode === DisconnectReason.loggedOut) {
        connectionStatus = 'disconnected';
        logger.error('WhatsApp logged out. Delete auth_store/ directory and restart to re-authenticate.');
        return;
      }

      if (shuttingDown) {
        connectionStatus = 'disconnected';
        return;
      }

      reconnectAttempt++;
      const delay = getReconnectDelay();
      connectionStatus = 'disconnected';
      logger.warn(
        { statusCode, reason, attempt: reconnectAttempt, delayMs: delay },
        'Connection closed, scheduling reconnect'
      );

      reconnectTimer = setTimeout(() => {
        connectWhatsApp().catch((err) => {
          logger.error({ err: err.message }, 'Reconnection failed');
        });
      }, delay);
      reconnectTimer.unref();
    }

    if (connection === 'open') {
      connectionStatus = 'connected';
      currentQr = null;
      reconnectAttempt = 0; // Reset backoff on successful connect
      logger.info('WhatsApp connected successfully');
    }
  });
}

/**
 * Validate and format phone number to WhatsApp JID.
 * Expects digits only (country code + number), e.g. "919876543210".
 */
function formatPhone(phone) {
  return `${phone}@s.whatsapp.net`;
}

/**
 * Send a text message via WhatsApp.
 * Throws if not connected.
 */
async function sendMessage(phone, text) {
  if (!sock || connectionStatus !== 'connected') {
    throw new Error('WhatsApp is not connected');
  }
  const jid = formatPhone(phone);
  const result = await sock.sendMessage(jid, { text });
  logger.info({ phone, messageId: result?.key?.id }, 'Message sent');
  return result;
}

/**
 * Graceful shutdown: close socket, cancel reconnect timer.
 */
function shutdown() {
  shuttingDown = true;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (sock) {
    try {
      sock.end(undefined);
    } catch {
      // Ignore errors during shutdown
    }
    sock = null;
  }
  connectionStatus = 'disconnected';
  logger.info('WhatsApp connection shut down');
}

module.exports = { connectWhatsApp, sendMessage, getConnectionStatus, shutdown };
