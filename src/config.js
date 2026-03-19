require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  apiKey: process.env.API_KEY || '',
  otp: {
    length: parseInt(process.env.OTP_LENGTH || '6', 10),
    expirySeconds: parseInt(process.env.OTP_EXPIRY_SECONDS || '300', 10),
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '3', 10),
    messageTemplate:
      process.env.OTP_MESSAGE_TEMPLATE ||
      'Your verification code is: *{{otp}}*\n\nThis code expires in 5 minutes. Do not share it with anyone.',
  },
  authStorePath: './auth_store',
};

module.exports = { config };
