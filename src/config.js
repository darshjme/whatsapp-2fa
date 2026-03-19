require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  apiKey: process.env.API_KEY || '',
  appName: process.env.APP_NAME || 'MyApp',
  logLevel: process.env.LOG_LEVEL || 'info',
  otp: {
    length: parseInt(process.env.OTP_LENGTH || '6', 10),
    expirySeconds: parseInt(process.env.OTP_EXPIRY_SECONDS || '600', 10),
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '3', 10),
    messageTemplate:
      process.env.OTP_MESSAGE_TEMPLATE ||
      'Your {{app_name}} verification code is: *{{otp}}*\n\nThis code expires in 10 minutes. Do not share it with anyone.',
  },
  rateLimit: {
    // Progressive delays in minutes: [1st, 2nd, 3rd, 4th, 5th, 6th+]
    progressiveDelaysMinutes: [0, 2, 5, 10, 60, 3600],
  },
  authStorePath: './auth_store',
};

module.exports = { config };
