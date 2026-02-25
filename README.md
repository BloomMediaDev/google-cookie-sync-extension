# Google Cookie Sync Extension

Sync Google account cookies to a configurable endpoint on a schedule or on demand.

## Features
- Read Google cookies (`__Secure-1PSID`, `__Secure-1PSIDTS`)
- Send cookies to a configurable endpoint
- Scheduled auto-sync via alarms
- Manual sync from the options page
- Status tracking for last sync

## Installation
1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. Open **Details** → **Extension options** to configure.

## Permissions

| Permission | Why it is needed |
| --- | --- |
| `cookies` | Read Google cookies for sync |
| `storage` | Persist settings and status |
| `alarms` | Schedule periodic sync |
| `identity` | Resolve profile email for default name |
| `https://*.google.com/*` | Access Google cookies |
| `http://localhost:8765/*` | Default sync endpoint |

## Configuration
1. Set **Endpoint URL** to your sync server.
2. Optional: set a **Cookie Name**. If blank, we use profile email when available.
3. Adjust **Sync interval** and **Enable auto sync**.
4. Click **Save Settings**.
5. Click **Sync Now** to manually sync and confirm status.

## Payload
The extension sends a JSON payload to `/sync-cookie` with the following fields:

```json
{
  "name": "identifier (email or configured name)",
  "secure_1psid": "value of __Secure-1PSID",
  "secure_1psidts": "value of __Secure-1PSIDTS"
}
```

If `name` is empty or not found on the server, it can fall back to identifying the client by `secure_1psid`.

## Troubleshooting
- **Missing Google cookies**: Log into Google in the same Chrome profile, then try again.
- **Endpoint unreachable**: Verify the server is running and the URL is correct.
- **HTTP errors**: Check server logs for errors; responses other than 200 are treated as failures.
- **Custom endpoint not listed**: Update `manifest.json` host permissions to include the new URL.

## Local Test Server
Run the local test server to verify payloads.

```bash
node test-server.js
```

## Releases
- Tag a release with `vX.Y.Z` to publish a GitHub release containing the extension zip.
