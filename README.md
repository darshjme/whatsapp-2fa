<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 180" width="800" height="180">
  <defs>
    <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d1117;stop-opacity:1"/>
      <stop offset="50%" style="stop-color:#111820;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#0d1117;stop-opacity:1"/>
    </linearGradient>
    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#25D366"/>
      <stop offset="40%" style="stop-color:#1EB854"/>
      <stop offset="60%" style="stop-color:#128C7E"/>
      <stop offset="100%" style="stop-color:#25D366"/>
    </linearGradient>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#25D366"/>
      <stop offset="100%" style="stop-color:#075E54"/>
    </linearGradient>
    <filter id="shieldGlow">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="subtleGlow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- Background -->
  <rect width="800" height="180" rx="12" fill="url(#heroBg)"/>
  <rect x="1" y="1" width="798" height="178" rx="12" fill="none" stroke="#25D366" stroke-opacity="0.12" stroke-width="1"/>
  <!-- Decorative grid lines -->
  <line x1="0" y1="60" x2="800" y2="60" stroke="#25D366" stroke-opacity="0.04" stroke-width="0.5"/>
  <line x1="0" y1="120" x2="800" y2="120" stroke="#25D366" stroke-opacity="0.04" stroke-width="0.5"/>
  <!-- Shield with lock icon -->
  <g filter="url(#shieldGlow)">
    <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="3s" repeatCount="indefinite" additive="sum"/>
    <g transform="translate(150, 90)">
      <!-- Shield shape -->
      <path d="M0,-48 L-35,-32 L-35,10 C-35,34 0,52 0,52 C0,52 35,34 35,10 L35,-32 Z" fill="url(#shieldGrad)" opacity="0.9"/>
      <path d="M0,-48 L-35,-32 L-35,10 C-35,34 0,52 0,52 C0,52 35,34 35,10 L35,-32 Z" fill="none" stroke="#25D366" stroke-width="1" stroke-opacity="0.4"/>
      <!-- Lock body -->
      <rect x="-10" y="-10" width="20" height="16" rx="3" fill="#0d1117" opacity="0.85"/>
      <!-- Lock shackle -->
      <path d="M-7,-10 L-7,-18 C-7,-25 7,-25 7,-18 L7,-10" fill="none" stroke="#0d1117" stroke-width="3" stroke-linecap="round" opacity="0.85"/>
      <!-- Keyhole -->
      <circle cx="0" cy="-3" r="3" fill="#25D366" opacity="0.9"/>
      <rect x="-1.2" y="-2" width="2.4" height="7" rx="1" fill="#25D366" opacity="0.9"/>
    </g>
  </g>
  <!-- Title -->
  <text x="440" y="78" font-family="'Segoe UI',Roboto,Helvetica,Arial,sans-serif" font-size="50" font-weight="800" fill="url(#titleGrad)" text-anchor="middle" letter-spacing="-1" filter="url(#subtleGlow)">WhatsApp 2FA</text>
  <!-- Subtitle -->
  <text x="440" y="112" font-family="'Segoe UI',Roboto,Helvetica,Arial,sans-serif" font-size="17" fill="#8b949e" text-anchor="middle" letter-spacing="3" font-weight="400">SELF-HOSTED OTP AUTHENTICATION</text>
  <!-- Version pill -->
  <rect x="377" y="128" width="126" height="26" rx="13" fill="#25D366" fill-opacity="0.08" stroke="#25D366" stroke-opacity="0.25" stroke-width="1"/>
  <text x="440" y="146" font-family="'Segoe UI',Roboto,Helvetica,Arial,sans-serif" font-size="11" fill="#25D366" text-anchor="middle" font-weight="600" letter-spacing="0.5">v1.0.0 &#183; MIT License</text>
</svg>
</p>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"></a>
  <a href="#api-reference"><img src="https://img.shields.io/badge/API-REST-0052CC?style=flat-square&logo=fastapi&logoColor=white" alt="REST API"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License MIT"></a>
  <a href="https://github.com/WhiskeySockets/Baileys"><img src="https://img.shields.io/badge/Baileys-WhatsApp%20Web-25D366?style=flat-square&logo=whatsapp&logoColor=white" alt="Baileys"></a>
</p>

---

## What is WhatsApp 2FA

WhatsApp 2FA is a self-hosted OTP authentication service that delivers verification codes over WhatsApp instead of SMS. Built on [Baileys](https://github.com/WhiskeySockets/Baileys), it connects directly to the WhatsApp multi-device protocol -- no Business API subscription, no SMS gateway fees, no third-party auth provider lock-in.

Pair a sender number once via QR scan, then integrate two REST endpoints into any backend to send and verify one-time passwords. Every OTP is generated with `crypto.randomInt` (CSPRNG) and verified through `crypto.timingSafeEqual` to eliminate timing side-channel attacks. A six-tier progressive rate limiter stops abuse before it starts.

**Why this over SMS-based 2FA:**

- **Zero per-message cost** -- WhatsApp delivery is free, no carrier contracts
- **Higher deliverability** -- messages bypass SMS spam filters and carrier blocks
- **End-to-end encryption** on the delivery channel by default
- **Global reach** without country-specific carrier agreements
- **Full data sovereignty** -- self-hosted, your data stays on your infrastructure

---

## Authentication Flow

<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 120" width="800" height="120">
  <defs>
    <marker id="arrBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6" fill="#58a6ff"/>
    </marker>
    <marker id="arrGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6" fill="#25D366"/>
    </marker>
    <marker id="arrGray" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6" fill="#8b949e"/>
    </marker>
  </defs>
  <rect width="800" height="120" rx="10" fill="#0d1117"/>
  <rect x="0.5" y="0.5" width="799" height="119" rx="10" fill="none" stroke="#25D366" stroke-opacity="0.08"/>
  <!-- Stage 1: Your App -->
  <rect x="18" y="32" width="124" height="56" rx="12" fill="#111d2e" stroke="#58a6ff" stroke-width="1.5"/>
  <text x="80" y="55" font-family="'Segoe UI',sans-serif" font-size="12" fill="#58a6ff" text-anchor="middle" font-weight="700">YOUR APP</text>
  <text x="80" y="72" font-family="'Segoe UI',sans-serif" font-size="9" fill="#6e7681" text-anchor="middle">POST /otp/send</text>
  <!-- Arrow 1 -->
  <line x1="147" y1="60" x2="177" y2="60" stroke="#58a6ff" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrBlue)">
    <animate attributeName="stroke-dashoffset" values="14;0" dur="1.2s" repeatCount="indefinite"/>
  </line>
  <!-- Stage 2: WhatsApp 2FA API -->
  <rect x="182" y="32" width="148" height="56" rx="12" fill="#0b1f13" stroke="#25D366" stroke-width="1.5"/>
  <text x="256" y="55" font-family="'Segoe UI',sans-serif" font-size="12" fill="#25D366" text-anchor="middle" font-weight="700">WhatsApp 2FA</text>
  <text x="256" y="72" font-family="'Segoe UI',sans-serif" font-size="9" fill="#6e7681" text-anchor="middle">Generate + Send OTP</text>
  <!-- Arrow 2 -->
  <line x1="335" y1="60" x2="370" y2="60" stroke="#25D366" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrGreen)">
    <animate attributeName="stroke-dashoffset" values="14;0" dur="1.2s" repeatCount="indefinite"/>
  </line>
  <!-- Stage 3: WhatsApp -->
  <rect x="375" y="32" width="118" height="56" rx="12" fill="#0b1f13" stroke="#25D366" stroke-width="1.5"/>
  <text x="434" y="55" font-family="'Segoe UI',sans-serif" font-size="12" fill="#25D366" text-anchor="middle" font-weight="700">WhatsApp</text>
  <text x="434" y="72" font-family="'Segoe UI',sans-serif" font-size="9" fill="#6e7681" text-anchor="middle">E2E Encrypted</text>
  <!-- Arrow 3 -->
  <line x1="498" y1="60" x2="533" y2="60" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrGray)">
    <animate attributeName="stroke-dashoffset" values="14;0" dur="1.2s" repeatCount="indefinite"/>
  </line>
  <!-- Stage 4: User Phone -->
  <rect x="538" y="32" width="112" height="56" rx="12" fill="#161b22" stroke="#8b949e" stroke-width="1.5"/>
  <text x="594" y="55" font-family="'Segoe UI',sans-serif" font-size="12" fill="#c9d1d9" text-anchor="middle" font-weight="700">User Phone</text>
  <text x="594" y="72" font-family="'Segoe UI',sans-serif" font-size="9" fill="#6e7681" text-anchor="middle">Reads Code</text>
  <!-- Arrow 4 -->
  <line x1="655" y1="60" x2="688" y2="60" stroke="#25D366" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrGreen)">
    <animate attributeName="stroke-dashoffset" values="14;0" dur="1.2s" repeatCount="indefinite"/>
  </line>
  <!-- Stage 5: Verified -->
  <rect x="693" y="32" width="88" height="56" rx="28" fill="#0b1f13" stroke="#25D366" stroke-width="2"/>
  <text x="737" y="54" font-family="'Segoe UI',sans-serif" font-size="22" fill="#25D366" text-anchor="middle">&#x2713;</text>
  <text x="737" y="74" font-family="'Segoe UI',sans-serif" font-size="10" fill="#25D366" text-anchor="middle" font-weight="700">Verified</text>
</svg>
</p>

1. Your backend calls `POST /api/otp/send` with the user's phone number and a session reference
2. WhatsApp 2FA generates a cryptographic OTP, stores it in memory, and delivers it via WhatsApp
3. The user receives the code on their phone and enters it in your application
4. Your backend calls `POST /api/otp/verify` -- a timing-safe comparison confirms the code

The OTP code is never returned in any API response. It exists only in server memory and the WhatsApp message delivered to the user.

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

On first launch, a QR code appears in the terminal. Scan it with the WhatsApp account that will deliver OTP messages. Credentials are persisted in `auth_store/` so subsequent starts reconnect automatically without re-scanning.

For development with auto-reload:

```bash
npm run dev

# Pipe through pino-pretty for human-readable logs
npm run dev | npx pino-pretty
```

---

## API Reference

All endpoints under `/api` require the `X-API-Key` header when `API_KEY` is configured. The `/health` endpoint is always unauthenticated.

### Health Check

```
GET /health
```

```bash
curl http://localhost:3000/health
```

**Response** (`200` when connected, `503` when unavailable):

```json
{
  "service": "whatsapp-2fa",
  "version": "1.0.0",
  "uptime": 3542,
  "whatsapp": "connected",
  "healthy": true
}
```

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
| `phone` | string | Recipient number with country code, digits only, no `+` prefix (7--15 digits) |
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

**Rate Limited** (`429`):

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
|--------|-------------|---------|
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

Returns metadata about the OTP -- verified status, attempt count, expiry time -- without ever revealing the code itself.

### Connection Status

```
GET /api/status
```

Returns the WhatsApp connection state. When status is `qr_pending`, the response includes the QR string for programmatic rendering in your admin interface.

---

## Progressive Rate Limiting

<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 80" width="800" height="80">
  <defs>
    <linearGradient id="rlBg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0d1117"/>
      <stop offset="100%" style="stop-color:#0d1117"/>
    </linearGradient>
  </defs>
  <rect width="800" height="80" rx="10" fill="url(#rlBg)"/>
  <rect x="0.5" y="0.5" width="799" height="79" rx="10" fill="none" stroke="#25D366" stroke-opacity="0.08"/>
  <!-- Pill 1: Instant (green) -->
  <rect x="12" y="18" width="105" height="44" rx="22" fill="#0b1f13" stroke="#25D366" stroke-width="1.5"/>
  <text x="64" y="35" font-family="'Segoe UI',sans-serif" font-size="9" fill="#8b949e" text-anchor="middle" font-weight="500">1st Request</text>
  <text x="64" y="51" font-family="'Segoe UI',sans-serif" font-size="13" fill="#25D366" text-anchor="middle" font-weight="700">Instant</text>
  <!-- Connector -->
  <text x="123" y="44" font-family="sans-serif" font-size="12" fill="#3d4450">&#x25B6;</text>
  <!-- Pill 2: 2 min (light green) -->
  <rect x="140" y="18" width="105" height="44" rx="22" fill="#12200e" stroke="#4dce3a" stroke-width="1.5"/>
  <text x="192" y="35" font-family="'Segoe UI',sans-serif" font-size="9" fill="#8b949e" text-anchor="middle" font-weight="500">2nd Request</text>
  <text x="192" y="51" font-family="'Segoe UI',sans-serif" font-size="13" fill="#4dce3a" text-anchor="middle" font-weight="700">2 min</text>
  <!-- Connector -->
  <text x="251" y="44" font-family="sans-serif" font-size="12" fill="#3d4450">&#x25B6;</text>
  <!-- Pill 3: 5 min (yellow-green) -->
  <rect x="268" y="18" width="105" height="44" rx="22" fill="#1a210e" stroke="#a3c93a" stroke-width="1.5"/>
  <text x="320" y="35" font-family="'Segoe UI',sans-serif" font-size="9" fill="#8b949e" text-anchor="middle" font-weight="500">3rd Request</text>
  <text x="320" y="51" font-family="'Segoe UI',sans-serif" font-size="13" fill="#a3c93a" text-anchor="middle" font-weight="700">5 min</text>
  <!-- Connector -->
  <text x="379" y="44" font-family="sans-serif" font-size="12" fill="#3d4450">&#x25B6;</text>
  <!-- Pill 4: 10 min (yellow) -->
  <rect x="396" y="18" width="105" height="44" rx="22" fill="#1f1d0e" stroke="#d4a017" stroke-width="1.5"/>
  <text x="448" y="35" font-family="'Segoe UI',sans-serif" font-size="9" fill="#8b949e" text-anchor="middle" font-weight="500">4th Request</text>
  <text x="448" y="51" font-family="'Segoe UI',sans-serif" font-size="13" fill="#d4a017" text-anchor="middle" font-weight="700">10 min</text>
  <!-- Connector -->
  <text x="507" y="44" font-family="sans-serif" font-size="12" fill="#3d4450">&#x25B6;</text>
  <!-- Pill 5: 60 min (orange) -->
  <rect x="524" y="18" width="105" height="44" rx="22" fill="#1f170e" stroke="#e8722a" stroke-width="1.5"/>
  <text x="576" y="35" font-family="'Segoe UI',sans-serif" font-size="9" fill="#8b949e" text-anchor="middle" font-weight="500">5th Request</text>
  <text x="576" y="51" font-family="'Segoe UI',sans-serif" font-size="13" fill="#e8722a" text-anchor="middle" font-weight="700">60 min</text>
  <!-- Connector -->
  <text x="635" y="44" font-family="sans-serif" font-size="12" fill="#3d4450">&#x25B6;</text>
  <!-- Pill 6: 1hr (red) -->
  <rect x="652" y="18" width="136" height="44" rx="22" fill="#1f0e0e" stroke="#da3633" stroke-width="1.5"/>
  <text x="720" y="35" font-family="'Segoe UI',sans-serif" font-size="9" fill="#8b949e" text-anchor="middle" font-weight="500">6th+ Request</text>
  <text x="720" y="51" font-family="'Segoe UI',sans-serif" font-size="13" fill="#da3633" text-anchor="middle" font-weight="700">60 hours</text>
</svg>
</p>

Every OTP request is rate-limited per phone number with escalating cooldown periods. After each OTP is sent, the sender must wait the required interval before requesting another for the same number.

| Request | Required Delay | Purpose |
|---------|----------------|---------|
| 1st | None | Immediate delivery for legitimate users |
| 2nd | 2 minutes | Brief pause to catch automated retries |
| 3rd | 5 minutes | Slows scripted phone number enumeration |
| 4th | 10 minutes | Meaningful friction for suspicious patterns |
| 5th | 60 minutes | Strong deterrent against sustained abuse |
| 6th+ | 3,600 minutes (60 hours) | Effective lockout -- makes brute-force economically impractical |

Progressive backoff allows real users to retry quickly on their first few attempts while making spam and enumeration attacks cost-prohibitive. Delay timers are measured from the timestamp of the previous request. Stale rate-limit entries are automatically cleaned up.

---

## Configuration

All settings are configured through environment variables. Copy `.env.example` to `.env` to get started.

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP server listen port |
| `API_KEY` | _(empty = open access)_ | API key for authenticating requests. Compared with `crypto.timingSafeEqual` |
| `APP_NAME` | `MyApp` | Application name inserted into the OTP message template |
| `LOG_LEVEL` | `info` | pino log level: `debug`, `info`, `warn`, `error`, `fatal` |
| `OTP_LENGTH` | `6` | Number of digits in generated OTP codes |
| `OTP_EXPIRY_SECONDS` | `600` | OTP validity duration in seconds (default: 10 minutes) |
| `OTP_MAX_ATTEMPTS` | `3` | Maximum incorrect verification attempts before the OTP is invalidated |
| `OTP_MESSAGE_TEMPLATE` | _(see below)_ | WhatsApp message template. Supports `{{otp}}` and `{{app_name}}` placeholders |

**Default message template:**

```
Your {{app_name}} verification code is: *{{otp}}*

This code expires in 10 minutes. Do not share it with anyone.
```

---

## Security

WhatsApp 2FA is built with a defense-in-depth approach. Every layer assumes the others might fail.

| Layer | Implementation |
|-------|----------------|
| **OTP generation** | `crypto.randomInt` (CSPRNG) -- not `Math.random`. Uniform distribution across the code space |
| **OTP verification** | `crypto.timingSafeEqual` prevents timing side-channel extraction of valid codes |
| **API authentication** | API key validated with constant-time comparison -- immune to timing attacks |
| **Progressive rate limiting** | Six-tier escalating per-phone delays (0 / 2 / 5 / 10 / 60 / 3600 minutes) |
| **Brute-force protection** | Maximum verification attempts per OTP (default 3), then code is permanently invalidated |
| **Input validation** | Strict regex enforcement on phone (`^\d{7,15}$`), reference (`^[\w.\-]{1,128}$`), and code fields |
| **Payload limits** | Request body capped at 16 KB to prevent oversized payload attacks |
| **Error isolation** | Global error handler catches all exceptions. Stack traces are never sent to clients |
| **Structured logging** | JSON logs via pino. OTP codes are never written to any log output |
| **Session persistence** | Multi-file auth state in `auth_store/` survives process restarts without QR re-scan |
| **Reconnection** | Exponential backoff with 25% jitter, capped at 60 seconds, prevents thundering herd |
| **Graceful shutdown** | SIGTERM/SIGINT handlers cleanly close HTTP server, WhatsApp socket, and OTP store timers |
| **Code secrecy** | OTP is never included in API responses -- exists only in server memory and the WhatsApp message |

---

## Integration Example

```javascript
const API_BASE = 'http://localhost:3000/api';
const API_KEY  = 'your-secret-key';

const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY,
};

// Step 1 -- Request OTP when user initiates login
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
const session = `login-${Date.now()}`;
await sendOtp('919876543210', session);
// User receives WhatsApp message, enters code in your app
const result = await verifyOtp('919876543210', session, '482910');
if (result.success) {
  console.log('User authenticated successfully');
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

- **Express HTTP server** -- REST API with JSON parsing, request logging, and 16 KB body limit
- **Baileys WebSocket client** -- Persistent connection to WhatsApp multi-device protocol with exponential backoff reconnection and 25% jitter
- **In-memory OTP store** -- Map-based storage with automatic expiry cleanup every 60 seconds
- **Progressive rate limiter** -- Six-tier escalating delay per phone number with automatic stale entry cleanup
- **Auth state persistence** -- Multi-file auth state saved to `auth_store/` for session continuity across restarts
- **Graceful shutdown** -- SIGTERM/SIGINT handlers cleanly tear down HTTP server, WhatsApp socket, and OTP store timers

---

## Contributing

Contributions are welcome. Please open an issue to discuss proposed changes before submitting a pull request.

```bash
# Development mode with auto-reload
npm run dev

# Human-readable structured logs
npm run dev | npx pino-pretty
```

---

## License

[MIT](LICENSE)

---

## Author

**Darshankumar Joshi** -- [https://darshj.me](https://darshj.me)
