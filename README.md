# WhatsApp 2FA

A self-hosted WhatsApp-based 2FA/OTP service powered by [Baileys](https://github.com/WhiskeySockets/Baileys). Configure one sender number via QR scan, then use the REST API to send and verify OTPs via WhatsApp.

## Quick Start

```bash
npm install
cp .env.example .env   # edit with your API key
npm start              # scan QR code with sender WhatsApp
```

On first run, a QR code appears in the terminal. Scan it with the WhatsApp account you want to use as the sender. Auth credentials are saved in `auth_store/` for subsequent runs.

## API

All endpoints are under `/api`. Set `X-API-Key` header if `API_KEY` is configured in `.env`.

### `GET /api/status`
Returns WhatsApp connection status.

### `POST /api/otp/send`
Send an OTP to a WhatsApp number.

```json
{
  "phone": "919876543210",
  "reference": "login-session-abc"
}
```

- `phone` — recipient's number with country code, no `+`
- `reference` — your unique session/transaction ID

### `POST /api/otp/verify`
Verify the OTP the user received.

```json
{
  "phone": "919876543210",
  "reference": "login-session-abc",
  "code": "482910"
}
```

Returns `{ "success": true }` or `{ "success": false, "reason": "..." }`.

Reasons: `not_found`, `expired`, `max_attempts`, `invalid`, `already_verified`.

### `GET /api/otp/status?phone=919876543210&reference=login-session-abc`
Check OTP status without revealing the code.

## Configuration

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Server port |
| `API_KEY` | _(empty = open)_ | API key for authentication |
| `OTP_LENGTH` | `6` | Number of digits in OTP |
| `OTP_EXPIRY_SECONDS` | `300` | OTP validity duration |
| `OTP_MAX_ATTEMPTS` | `3` | Max wrong attempts before invalidation |
| `OTP_MESSAGE_TEMPLATE` | See `.env.example` | Message template (`{{otp}}` placeholder) |

## Integration Example

```javascript
// Send OTP
const res = await fetch('http://localhost:3000/api/otp/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-API-Key': 'your-key' },
  body: JSON.stringify({ phone: '919876543210', reference: 'txn-123' }),
});

// Verify OTP (after user provides code)
const verify = await fetch('http://localhost:3000/api/otp/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-API-Key': 'your-key' },
  body: JSON.stringify({ phone: '919876543210', reference: 'txn-123', code: '482910' }),
});
```

## License

MIT
