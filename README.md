<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 180" width="800" height="180">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d1117;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#161b22;stop-opacity:1"/>
    </linearGradient>
    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#25D366"/>
      <stop offset="50%" style="stop-color:#128C7E"/>
      <stop offset="100%" style="stop-color:#25D366"/>
    </linearGradient>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#25D366"/>
      <stop offset="100%" style="stop-color:#128C7E"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="800" height="180" rx="12" fill="url(#bgGrad)"/>
  <rect x="1" y="1" width="798" height="178" rx="12" fill="none" stroke="#25D366" stroke-opacity="0.15" stroke-width="1"/>
  <!-- Shield icon -->
  <g transform="translate(140, 90)" filter="url(#glow)">
    <animateTransform attributeName="transform" type="translate" values="140,90;140,87;140,90" dur="3s" repeatCount="indefinite" additive="replace"/>
    <path d="M0,-42 L-30,-28 L-30,8 C-30,28 0,45 0,45 C0,45 30,28 30,8 L30,-28 Z" fill="url(#shieldGrad)" opacity="0.9"/>
    <rect x="-8" y="-18" width="16" height="24" rx="3" fill="none" stroke="#0d1117" stroke-width="2.5"/>
    <circle cx="0" cy="-4" r="3" fill="#0d1117"/>
    <rect x="-1" y="-4" width="2" height="8" fill="#0d1117"/>
    <rect x="-12" y="-8" width="24" height="3" rx="1.5" fill="none" stroke="#0d1117" stroke-width="2"/>
  </g>
  <!-- Title -->
  <text x="420" y="80" font-family="'Segoe UI',Roboto,Helvetica,Arial,sans-serif" font-size="48" font-weight="800" fill="url(#titleGrad)" text-anchor="middle" letter-spacing="-1">WhatsApp 2FA</text>
  <!-- Subtitle -->
  <text x="420" y="115" font-family="'Segoe UI',Roboto,Helvetica,Arial,sans-serif" font-size="18" fill="#8b949e" text-anchor="middle" letter-spacing="2">Self-Hosted OTP Authentication</text>
  <!-- Version pill -->
  <rect x="355" y="130" width="130" height="24" rx="12" fill="#25D366" fill-opacity="0.12" stroke="#25D366" stroke-opacity="0.3" stroke-width="1"/>
  <text x="420" y="147" font-family="'Segoe UI',Roboto,Helvetica,Arial,sans-serif" font-size="12" fill="#25D366" text-anchor="middle" font-weight="600">v1.0.0  --  MIT License</text>
</svg>
</p>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=node.js&logoColor=white" alt="Node.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript"></a>
  <a href="#api-reference"><img src="https://img.shields.io/badge/API-REST-0052CC?logo=fastapi&logoColor=white" alt="REST API"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT"></a>
</p>

---

## What is WhatsApp 2FA

WhatsApp 2FA is a lightweight, self-hosted OTP authentication service that delivers verification codes over WhatsApp. Built on [Baileys](https://github.com/WhiskeySockets/Baileys), it connects directly to WhatsApp Web using the multi-device protocol -- no Business API subscription, no SMS gateway fees, no third-party auth provider lock-in.

Pair a sender number once via QR scan, then integrate two REST endpoints into any backend to send and verify one-time passwords. Every OTP is generated with `crypto.randomInt` (CSPRNG) and verified through `crypto.timingSafeEqual` to eliminate timing side-channel attacks. A six-tier progressive rate limiter stops abuse before it starts.

**Why choose this over SMS-based 2FA:**

- Zero per-message cost -- WhatsApp delivery is free
- Higher deliverability -- WhatsApp messages bypass SMS spam filters
- End-to-end encryption on the delivery channel
- Works globally without carrier agreements
- Self-hosted -- your data never touches a third-party platform

---

## Authentication Flow

<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 120" width="800" height="120">
  <defs>
    <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6" fill="#25D366"/>
    </marker>
    <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6" fill="#58a6ff"/>
    </marker>
    <marker id="arrowGray" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6" fill="#8b949e"/>
    </marker>
  </defs>
  <rect width="800" height="120" rx="8" fill="#0d1117"/>
  <!-- Your App -->
  <rect x="20" y="35" width="120" height="50" rx="10" fill="#1a2332" stroke="#58a6ff" stroke-width="1.5"/>
  <text x="80" y="56" font-family="'Segoe UI',sans-serif" font-size="11" fill="#58a6ff" text-anchor="middle" font-weight="600">YOUR APP</text>
  <text x="80" y="72" font-family="'Segoe UI',sans-serif" font-size="9" fill="#8b949e" text-anchor="middle">Backend</text>
  <!-- Arrow 1 -->
  <line x1="145" y1="60" x2="175" y2="60" stroke="#58a6ff" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrowBlue)">
    <animate attributeName="stroke-dashoffset" values="14;0" dur="1.5s" repeatCount="indefinite"/>
  </line>
  <!-- WhatsApp 2FA API -->
  <rect x="180" y="35" width="150" height="50" rx="10" fill="#0f2618" stroke="#25D366" stroke-width="1.5"/>
  <text x="255" y="56" font-family="'Segoe UI',sans-serif" font-size="11" fill="#25D366" text-anchor="middle" font-weight="600">WhatsApp 2FA</text>
  <text x="255" y="72" font-family="'Segoe UI',sans-serif" font-size="9" fill="#8b949e" text-anchor="middle">REST API</text>
  <!-- Arrow 2 -->
  <line x1="335" y1="60" x2="370" y2="60" stroke="#25D366" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrowGreen)">
    <animate attributeName="stroke-dashoffset" values="14;0" dur="1.5s" repeatCount="indefinite"/>
  </line>
  <!-- WhatsApp -->
  <rect x="375" y="35" width="120" height="50" rx="10" fill="#0f2618" stroke="#25D366" stroke-width="1.5"/>
  <text x="435" y="56" font-family="'Segoe UI',sans-serif" font-size="11" fill="#25D366" text-anchor="middle" font-weight="600">WhatsApp</text>
  <text x="435" y="72" font-family="'Segoe UI',sans-serif" font-size="9" fill="#8b949e" text-anchor="middle">Delivery</text>
  <!-- Arrow 3 -->
  <line x1="500" y1="60" x2="535" y2="60" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrowGray)">
    <animate attributeName="stroke-dashoffset" values="14;0" dur="1.5s" repeatCount="indefinite"/>
  </line>
  <!-- User Phone -->
  <rect x="540" y="35" width="110" height="50" rx="10" fill="#1a1a24" stroke="#8b949e" stroke-width="1.5"/>
  <text x="595" y="56" font-family="'Segoe UI',sans-serif" font-size="11" fill="#c9d1d9" text-anchor="middle" font-weight="600">User Phone</text>
  <text x="595" y="72" font-family="'Segoe UI',sans-serif" font-size="9" fill="#8b949e" text-anchor="middle">Enters Code</text>
  <!-- Arrow 4 -->
  <line x1="655" y1="60" x2="685" y2="60" stroke="#25D366" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrowGreen)">
    <animate attributeName="stroke-dashoffset" values="14;0" dur="1.5s" repeatCount="indefinite"/>
  </line>
  <!-- Verify -->
  <rect x="690" y="35" width="90" height="50" rx="25" fill="#0f2618" stroke="#25D366" stroke-width="2"/>
  <text x="735" y="57" font-family="'Segoe UI',sans-serif" font-size="18" fill="#25D366" text-anchor="middle">&#x2713;</text>
  <text x="735" y="74" font-family="'Segoe UI',sans-serif" font-size="10" fill="#25D366" text-anchor="middle" font-weight="600">Verified</text>
</svg>
</p>

1. Your backend calls `POST /api/otp/send` with phone number and a session reference
2. WhatsApp 2FA generates a cryptographic OTP, stores it in memory, and delivers it via WhatsApp
3. User receives the code on their phone and enters it in your app
4. Your backend calls `POST /api/otp/verify` -- timing-safe comparison confirms the code

The OTP code is never returned in API responses. It only exists in server memory and the WhatsApp message.

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/darshjme/whatsapp-2fa.git
cd whatsapp-2fa
npm install

# Configure
cp .env.example .env
# Edit .env -- set API_KEY and APP_NAME at minimum

# Start the service
npm start
```

On first launch, a QR code appears in the terminal. Scan it with the WhatsApp account that will deliver OTP messages. Credentials are persisted in `auth_store/` so subsequent starts connect automatically.

For development with auto-reload:

```bash
npm run dev
```

---

## API Reference

All endpoints under `/api` require the `X-API-Key` header when `API_KEY` is set in the environment. The `/health` endpoint is always unauthenticated.

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

Returns `200` when connected, `503` when the WhatsApp socket is unavailable.

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
| `phone` | string | Recipient number with country code, digits only, no `+` (7--15 digits) |
| `reference` | string | Unique session or transaction identifier (alphanumeric, hyphens, underscores, dots; max 128 chars) |

**Success** (`200`):

```json
{
  "success": true,
  "phone": "919876543210",
  "reference": "login-session-abc",
  "expiresAt": "2025-01-15T10:10:00.000Z"
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
| `code` | string | 6-digit OTP code entered by the user |

**Success** (`200`):

```json
{ "success": true }
```

**Failure** (status varies by reason):

```json
{ "success": false, "reason": "invalid" }
```

| Reason | HTTP Status | Meaning |
|--------|------------|---------|
| `not_found` | 404 | No OTP exists for this phone/reference pair |
| `expired` | 410 | OTP has passed its 10-minute validity window |
| `max_attempts` | 429 | Too many wrong attempts (default 3), OTP invalidated |
| `invalid` | 401 | Code does not match |
| `already_verified` | 409 | OTP was already successfully verified |

### Check OTP Status

```
GET /api/otp/status?phone=919876543210&reference=login-session-abc
```

```bash
curl "http://localhost:3000/api/otp/status?phone=919876543210&reference=login-session-abc" \
  -H "X-API-Key: your-secret-key"
```

Returns metadata about the OTP (verified status, attempt count, expiry) without revealing the code itself.

### Connection Status

```
GET /api/status
```

Returns the WhatsApp connection state. When status is `qr_pending`, the response includes the QR string for programmatic rendering.

---

## Progressive Rate Limiting

<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 80" width="800" height="80">
  <rect width="800" height="80" rx="8" fill="#0d1117"/>
  <!-- Pill 1 -->
  <rect x="15" y="20" width="100" height="40" rx="20" fill="#0f2618" stroke="#25D366" stroke-width="1.5"/>
  <text x="65" y="36" font-family="'Segoe UI',sans-serif" font-size="9" fill="#8b949e" text-anchor="middle">1st</text>
  <text x="65" y="50" font-family="'Segoe UI',sans-serif" font-size="12" fill="#25D366" text-anchor="middle" font-weight="700">Instant</text>
  <!-- Arrow -->
  <text x="122" y="44" font-family="sans-serif" font-size="14" fill="#3d4450">&#x25B6;</text>
  <!-- Pill 2 -->
  <rect x="140" y="20" width="100" height="40" rx="20" fill="#1a2210" stroke="#4dce3a" stroke-width="1.5"/>
  <text x="190" y="36" font-family="'Segoe UI',sans-serif" font-size="9" fill="#8b949e" text-anchor="middle">2nd</text>
  <text x="190" y="50" font-family="'Segoe UI',sans-serif" font-size="12" fill="#4dce3a" text-anchor="middle" font-weight="700">2 min</text>
  <!-- Arrow -->
  <text x="247" y="44" font-family="sans-serif" font-size="14" fill="#3d4450">&#x25B6;</text>
  <!-- Pill 3 -->
  <rect x="265" y="20" width="100" height="40" rx="20" fill="#1f2210" stroke="#a3c93a" stroke-width="1.5"/>
  <text x="315" y="36" font-family="'Segoe UI',sans-serif" font-size="9" fill="#8b949e" text-anchor="middle">3rd</text>
  <text x="315" y="50" font-family="'Segoe UI',sans-serif" font-size="12" fill="#a3c93a" text-anchor="middle" font-weight="700">5 min</text>
  <!-- Arrow -->
  <text x="372" y="44" font-family="sans-serif" font-size="14" fill="#3d4450">&#x25B6;</text>
  <!-- Pill 4 -->
  <rect x="390" y="20" width="100" height="40" rx="20" fill="#22200e" stroke="#d4a017" stroke-width="1.5"/>
  <text x="440" y="36" font-family="'Segoe UI',sans-serif" font-size="9" fill="#8b949e" text-anchor="middle">4th</text>
  <text x="440" y="50" font-family="'Segoe UI',sans-serif" font-size="12" fill="#d4a017" text-anchor="middle" font-weight="700">10 min</text>
  <!-- Arrow -->
  <text x="497" y="44" font-family="sans-serif" font-size="14" fill="#3d4450">&#x25B6;</text>
  <!-- Pill 5 -->
  <rect x="515" y="20" width="100" height="40" rx="20" fill="#221a0e" stroke="#e8722a" stroke-width="1.5"/>
  <text x="565" y="36" font-family="'Segoe UI',sans-serif" font-size="9" fill="#8b949e" text-anchor="middle">5th</text>
  <text x="565" y="50" font-family="'Segoe UI',sans-serif" font-size="12" fill="#e8722a" text-anchor="middle" font-weight="700">60 min</text>
  <!-- Arrow -->
  <text x="622" y="44" font-family="sans-serif" font-size="14" fill="#3d4450">&#x25B6;</text>
  <!-- Pill 6 -->
  <rect x="640" y="20" width="140" height="40" rx="20" fill="#220e0e" stroke="#da3633" stroke-width="1.5"/>
  <text x="710" y="36" font-family="'Segoe UI',sans-serif" font-size="9" fill="#8b949e" text-anchor="middle">6th+</text>
  <text x="710" y="50" font-family="'Segoe UI',sans-serif" font-size="12" fill="#da3633" text-anchor="middle" font-weight="700">3600 min</text>
</svg>
</p>

OTP requests are rate-limited per phone number with escalating cooldown delays. After each OTP is sent, the sender must wait the required interval before requesting another for the same number.

| Request | Required Delay | Purpose |
|---------|---------------|---------|
| 1st | None | Immediate delivery for legitimate users |
| 2nd | 2 minutes | Brief pause to catch automated retries |
| 3rd | 5 minutes | Slows down scripted enumeration |
| 4th | 10 minutes | Meaningful friction for suspicious patterns |
| 5th | 60 minutes | Strong deterrent against sustained abuse |
| 6th+ | 3600 minutes (60 hours) | Effective lockout for attackers |

This progressive backoff lets real users retry quickly on their first few attempts while making brute-force and spam attacks economically impractical. Delay timers are measured from the timestamp of the previous OTP request.

---

## Configuration

All settings are configured via environment variables. Copy `.env.example` to `.env` to get started.

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP server port |
| `API_KEY` | _(empty = open access)_ | API key for authenticating requests. Validated with timing-safe comparison |
| `APP_NAME` | `MyApp` | Application name used in the OTP message template |
| `LOG_LEVEL` | `info` | pino log level: `debug`, `info`, `warn`, `error`, `fatal` |
| `OTP_LENGTH` | `6` | Number of digits in generated OTP codes |
| `OTP_EXPIRY_SECONDS` | `600` | OTP validity duration in seconds (default: 10 minutes) |
| `OTP_MAX_ATTEMPTS` | `3` | Maximum wrong verification attempts before OTP is invalidated |
| `OTP_MESSAGE_TEMPLATE` | _(see below)_ | WhatsApp message template. Supports `{{otp}}` and `{{app_name}}` placeholders |

**Default message template:**

```
Your {{app_name}} verification code is: *{{otp}}*

This code expires in 10 minutes. Do not share it with anyone.
```

---

## Security

| Layer | Implementation |
|-------|----------------|
| **OTP generation** | `crypto.randomInt` (CSPRNG) -- not `Math.random`. Configurable code length |
| **OTP verification** | `crypto.timingSafeEqual` prevents timing side-channel extraction of valid codes |
| **API authentication** | API key validated with constant-time comparison -- immune to timing attacks |
| **Rate limiting** | Six-tier progressive per-phone delays (0 / 2 / 5 / 10 / 60 / 3600 min) |
| **Brute-force protection** | Maximum verification attempts per OTP (default 3), then invalidated |
| **Input validation** | Strict regex on phone (`^\d{7,15}$`), reference (`^[\w.\-]{1,128}$`), and code fields |
| **Payload limits** | Request body capped at 16 KB to mitigate oversized payload attacks |
| **Error handling** | Global handler catches exceptions. Stack traces are never sent to clients |
| **Structured logging** | JSON logs via pino. OTP codes are never written to logs |
| **Session persistence** | Multi-file auth state in `auth_store/` survives restarts without re-scanning QR |
| **Reconnection** | Exponential backoff with 25% jitter, capped at 60 seconds |

---

## Integration Example

```javascript
const API_BASE = 'http://localhost:3000/api';
const API_KEY  = 'your-secret-key';

const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY,
};

// Step 1 -- Send OTP when user requests login
async function sendOtp(phone, sessionId) {
  const res = await fetch(`${API_BASE}/otp/send`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ phone, reference: sessionId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data; // { success, phone, reference, expiresAt }
}

// Step 2 -- Verify OTP when user submits the code
async function verifyOtp(phone, sessionId, code) {
  const res = await fetch(`${API_BASE}/otp/verify`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ phone, reference: sessionId, code }),
  });

  return res.json(); // { success: true } or { success: false, reason: "..." }
}

// Usage
const session = 'txn-' + Date.now();
await sendOtp('919876543210', session);
// User receives WhatsApp message, enters code in your app
const result = await verifyOtp('919876543210', session, '482910');
if (result.success) {
  console.log('User authenticated');
}
```

---

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

- **Express HTTP server** -- Handles REST API requests with JSON parsing, request logging, and 16 KB body limit
- **Baileys WebSocket client** -- Maintains persistent connection to WhatsApp multi-device protocol with exponential backoff reconnection
- **In-memory OTP store** -- Map-based storage with automatic expiry cleanup every 60 seconds
- **Progressive rate limiter** -- Six-tier escalating delay per phone number with automatic cleanup of stale entries
- **Auth state persistence** -- Multi-file auth state saved to `auth_store/` for session continuity across restarts
- **Graceful shutdown** -- SIGTERM/SIGINT handlers cleanly close HTTP server, WhatsApp socket, and OTP store timers

---

## Contributing

Contributions are welcome. Please open an issue to discuss proposed changes before submitting a pull request.

```bash
# Development mode with auto-reload
npm run dev

# Structured logs, human-readable
npm run dev | npx pino-pretty
```

---

## License

[MIT](LICENSE)

---

## Author

**Darshankumar Joshi** -- [https://darshj.me](https://darshj.me)
