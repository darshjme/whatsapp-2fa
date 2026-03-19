require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  apiKey: process.env.API_KEY || '',
  appName: process.env.APP_NAME || 'MyApp',
  logLevel: process.env.LOG_LEVEL || 'info',
  otp: {
    length: parseInt(process.env.OTP_LENGTH || '6', 10),
    expirySeconds: parseInt(process.env.OTP_EXPIRY_SECONDS || '300', 10),
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '3', 10),
    cooldownSeconds: parseInt(process.env.OTP_COOLDOWN_SECONDS || '60', 10),
    messageTemplate:
      process.env.OTP_MESSAGE_TEMPLATE ||
      'Your {{app_name}} verification code is: *{{otp}}*\n\nThis code expires in 5 minutes. Do not share it with anyone.',
  },
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '5', 10),
    windowSeconds: parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS || '3600', 10),
  },
  authStorePath: './auth_store',
};

module.exports = { config };
