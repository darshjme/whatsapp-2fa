const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const { config } = require('./config');

const logger = pino({ level: 'silent' });

let sock = null;
let connectionStatus = 'disconnected'; // disconnected | connecting | qr_pending | connected
let currentQr = null;

function getConnectionStatus() {
  return { status: connectionStatus, qr: currentQr };
}

async function connectWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(config.authStorePath);

  connectionStatus = 'connecting';
  currentQr = null;

  sock = makeWASocket({
    auth: state,
    logger,
    printQRInTerminal: false,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      currentQr = qr;
      connectionStatus = 'qr_pending';
      console.log('\n📱 Scan this QR code with your WhatsApp sender number:\n');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      currentQr = null;
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        connectionStatus = 'disconnected';
        console.log('WhatsApp logged out. Delete auth_store/ and restart to re-authenticate.');
      } else {
        console.log(`Connection closed (reason: ${reason}). Reconnecting...`);
        connectWhatsApp();
      }
    }

    if (connection === 'open') {
      connectionStatus = 'connected';
      currentQr = null;
      console.log('✅ WhatsApp connected successfully!');
    }
  });
}

function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return `${cleaned}@s.whatsapp.net`;
}

async function sendMessage(phone, text) {
  if (!sock || connectionStatus !== 'connected') {
    throw new Error('WhatsApp is not connected');
  }
  const jid = formatPhone(phone);
  await sock.sendMessage(jid, { text });
}

module.exports = { connectWhatsApp, sendMessage, getConnectionStatus };
