<p align="center">
  <h1 align="center">WhatsApp 2FA</h1>
  <p align="center">Self-hosted WhatsApp OTP authentication. Zero third-party dependency.</p>
</p>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=node.js&logoColor=white" alt="Node.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript"></a>
  <a href="#api-reference"><img src="https://img.shields.io/badge/API-REST-0052CC?logo=fastapi&logoColor=white" alt="REST API"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT"></a>
</p>

---

WhatsApp 2FA is a lightweight, self-hosted OTP authentication service that delivers verification codes over WhatsApp. Built on [Baileys](https://github.com/WhiskeySockets/Baileys), it connects directly to WhatsApp Web — no Business API subscription, no SMS gateway fees, no third-party auth provider.

Pair a sender number once via QR scan, then integrate two REST endpoints into any application to send and verify one-time passwords.

## Feature Highlights

- **Direct WhatsApp delivery** — OTPs arrive in the user's WhatsApp chat via Baileys multi-device protocol
- **Timing-safe verification** — OTP comparison uses `crypto.timingSafeEqual` to prevent timing side-channel attacks
- **Timing-safe API key auth** — API key validation also uses constant-time comparison
- **Rate limiting** — Configurable per-phone-number limit (default: 5 OTPs per hour) with per-reference cooldown
- **Cryptographic OTP generation** — Codes generated with `crypto.randomInt` (CSPRNG), not `Math.random`
- **Session persistence** — Auth credentials saved to disk (`auth_store/`); survives process restarts without re-scanning QR
- **Exponential backoff reconnection** — Automatic reconnection with jitter on WhatsApp disconnects
- **Graceful shutdown** — SIGTERM/SIGINT handlers cleanly close HTTP server, WhatsApp socket, and OTP store
- **Structured logging** — JSON logs via [pino](https://github.com/pinojs/pino) with configurable log levels
- **Request body size limits** — 16 KB maximum payload to mitigate abuse
- **Input validation** — Phone numbers, reference IDs, and OTP codes are validated against strict patterns
- **No stack trace leaks** — Global error handler ensures internal details are never exposed to clients

## Quick Start

```bash
git clone https://github.com/user/whatsapp-2fa.git
cd whatsapp-2fa
npm install
cp .env.example .env    # configure API_KEY and other settings
npm start               # scan QR code with the sender WhatsApp number
```

On first launch a QR code appears in the terminal. Scan it with the WhatsApp account that will deliver OTP messages. Credentials are persisted in `auth_store/` so subsequent starts connect automatically.

For development with auto-reload:

```bash
npm run dev
```

## API Reference

All endpoints are mounted under `/api` and require the `X-API-Key` header when `API_KEY` is set in the environment. A separate `/health` endpoint is available without authentication.

### Health Check

```
GET /health
```

```bash
curl http://localhost:3000/health
```

```json
{
  "service": "whatsapp-2fa",
  "version": "1.0.0",
  "uptime": 3542,
  "whatsapp": "connected",
  "healthy": true
}
```

Returns `200` when connected, `503` otherwise.

### Send OTP

```
POST /api/otp/send
```

```bash
curl -X POST http://localhost:3000/api/otp/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{"phone": "919876543210", "reference": "login-session-abc"}'
```

| Field | Type | Description |
|-------|------|-------------|
| `phone` | string | Recipient number with country code, digits only, no `+` (7-15 digits) |
| `reference` | string | Your unique session or transaction identifier (alphanumeric, hyphens, underscores, dots; max 128 chars) |

**Success response** (`200`):

```json
{
  "success": true,
  "phone": "919876543210",
  "reference": "login-session-abc",
  "expiresAt": "2025-01-15T10:05:00.000Z",
  "cooldownSeconds": 60
}
```

**Rate limited** (`429`):

```json
{
  "error": "Too many OTP requests. Try again later.",
  "retryAfterSeconds": 1823
}
```

### Verify OTP

```
POST /api/otp/verify
```

```bash
curl -X POST http://localhost:3000/api/otp/verify \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{"phone": "919876543210", "reference": "login-session-abc", "code": "482910"}'
```

| Field | Type | Description |
|-------|------|-------------|
| `phone` | string | Same phone number used in `/otp/send` |
| `reference` | string | Same reference used in `/otp/send` |
| `code` | string | OTP code entered by the user |

**Success** (`200`):

```json
{ "success": true }
```

**Failure** (status varies by reason):

```json
{ "success": false, "reason": "invalid" }
```

| Reason | HTTP Status | Description |
|--------|------------|-------------|
| `not_found` | 404 | No OTP exists for this phone/reference pair |
| `expired` | 410 | OTP has expired |
| `max_attempts` | 429 | Too many wrong attempts |
| `invalid` | 401 | Code does not match |
| `already_verified` | 409 | OTP was already verified |

### Check OTP Status

```
GET /api/otp/status?phone=919876543210&reference=login-session-abc
```

```bash
curl "http://localhost:3000/api/otp/status?phone=919876543210&reference=login-session-abc" \
  -H "X-API-Key: your-secret-key"
```

Returns metadata about the OTP (verified, attempts, expiry) without revealing the code itself.

### Connection Status

```
GET /api/status
```

Returns the current WhatsApp connection state. When status is `qr_pending`, the response includes the QR string for programmatic display.

## Configuration

All settings are configured via environment variables. Copy `.env.example` to `.env` to get started.

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP server port |
| `API_KEY` | _(empty = open access)_ | API key for authenticating requests |
| `APP_NAME` | `MyApp` | Application name used in OTP message template |
| `LOG_LEVEL` | `info` | pino log level (`debug`, `info`, `warn`, `error`, `fatal`) |
| `OTP_LENGTH` | `6` | Number of digits in generated OTP codes |
| `OTP_EXPIRY_SECONDS` | `300` | OTP validity duration in seconds |
| `OTP_MAX_ATTEMPTS` | `3` | Maximum wrong verification attempts before invalidation |
| `OTP_COOLDOWN_SECONDS` | `60` | Minimum wait between OTP requests for the same phone+reference |
| `RATE_LIMIT_MAX` | `5` | Maximum OTP requests per phone number within the rate window |
| `RATE_LIMIT_WINDOW_SECONDS` | `3600` | Rate limit sliding window duration in seconds |
| `OTP_MESSAGE_TEMPLATE` | _(see below)_ | WhatsApp message template with `{{otp}}` and `{{app_name}}` placeholders |

Default message template:

```
Your {{app_name}} verification code is: *{{otp}}*

This code expires in 5 minutes. Do not share it with anyone.
```

## Integration Example

```javascript
const API_BASE = 'http://localhost:3000/api';
const API_KEY  = 'your-secret-key';

const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY,
};

// Step 1: Send OTP when user requests login
async function sendOtp(phone, sessionId) {
  const res = await fetch(`${API_BASE}/otp/send`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ phone, reference: sessionId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data; // { success, phone, reference, expiresAt, cooldownSeconds }
}

// Step 2: Verify OTP when user submits the code
async function verifyOtp(phone, sessionId, code) {
  const res = await fetch(`${API_BASE}/otp/verify`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ phone, reference: sessionId, code }),
  });

  const data = await res.json();
  return data; // { success: true } or { success: false, reason: "..." }
}

// Usage
const session = 'txn-' + Date.now();
await sendOtp('919876543210', session);
// ... user receives WhatsApp message, enters code ...
const result = await verifyOtp('919876543210', session, '482910');
if (result.success) {
  console.log('User authenticated');
}
```

## Security

| Layer | Implementation |
|-------|----------------|
| OTP generation | `crypto.randomInt` (CSPRNG) with configurable code length |
| OTP verification | `crypto.timingSafeEqual` prevents timing side-channel attacks |
| API authentication | API key checked with constant-time comparison |
| Rate limiting | Per-phone sliding window (default 5/hour) plus per-reference cooldown |
| Brute-force protection | Maximum verification attempts per OTP (default 3), then invalidated |
| Input validation | Strict regex patterns on phone, reference, and code fields |
| Payload limits | Request body capped at 16 KB |
| Error handling | Global handler catches exceptions; stack traces never sent to clients |
| Logging | Structured JSON logs (pino) — OTP codes are never logged |

## Architecture

```
                         +------------------+
    Client App           |  WhatsApp 2FA    |         WhatsApp
   (your backend)        |  Service         |         Network
        |                |                  |            |
        |  POST /otp/send|                  |            |
        +--------------->|  Validate input  |            |
                         |  Check rate limit|            |
                         |  Generate OTP    |            |
                         |  (crypto.randomInt)           |
                         |  Store in memory |            |
                         |  Format message  |            |
                         |       +----------+----------->|  WhatsApp message
                         |       | Baileys WS connection |  delivered to user
                         |       +----------+            |
                         |  Return metadata |            |
        <----------------+  (no OTP in resp)|            |
        |                |                  |            |
        | POST /otp/verify                  |            |
        +--------------->|  Lookup record   |            |
                         |  timingSafeEqual |            |
                         |  Return result   |            |
        <----------------+                  |            |
                         +------------------+
```

**Components:**

- **Express HTTP server** — Handles REST API requests with JSON parsing and request logging
- **Baileys WebSocket client** — Maintains persistent connection to WhatsApp multi-device protocol
- **In-memory OTP store** — Map-based storage with automatic expiry cleanup every 60 seconds
- **Rate limiter** — Sliding window counter per phone number with configurable thresholds
- **Auth state persistence** — Multi-file auth state saved to `auth_store/` for session continuity

## License

MIT

## Author

**Darshankumar Joshi** — [https://darshj.me](https://darshj.me)
