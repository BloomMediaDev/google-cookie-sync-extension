# Phase 2: Background Service Worker

## Overview
- **Date:** 2026-02-11
- **Priority:** Critical
- **Status:** ⬜ TODO
- **Dependencies:** Phase 1

## Requirements
- Read Google cookies (`__Secure-1PSID`, `__Secure-1PSIDTS`)
- POST cookies to configurable endpoint
- Periodic sync via `chrome.alarms`
- Manual sync via message passing
- Status tracking in `chrome.storage.sync`

## Files to Create

| File | Action | Description |
|------|--------|-------------|
| `background.js` | CREATE | Service worker with sync logic |

## Architecture

```
chrome.runtime.onInstalled → initDefaults() → createAlarm()
                                                    ↓
chrome.alarms.onAlarm ──────────────────→ syncCookies()
                                                    ↓
chrome.runtime.onMessage (manual_sync) → syncCookies()
                                                    ↓
                                          readCookies()
                                                    ↓
                                          resolveName()
                                                    ↓
                                          POST to endpoint
                                                    ↓
                                          updateStatus()
```

## Implementation Steps

### 1. Define Constants & Defaults
```js
const DEFAULTS = {
  endpoint_url: "http://localhost:8765/sync-cookie",
  cookie_name: "",
  sync_interval_minutes: 15,
  auto_sync: true,
  last_sync_at: null,
  last_sync_status: "idle",
  last_sync_error: ""
};

const ALARM_NAME = "cookie_sync";
const GOOGLE_COOKIES = ["__Secure-1PSID", "__Secure-1PSIDTS"];
const GOOGLE_URL = "https://accounts.google.com";
```

### 2. Install Handler
```js
chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.sync.get(Object.keys(DEFAULTS));
  const settings = { ...DEFAULTS, ...stored };
  await chrome.storage.sync.set(settings);
  await chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: settings.sync_interval_minutes
  });
});
```

### 3. Alarm Handler
```js
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;
  const { auto_sync } = await chrome.storage.sync.get("auto_sync");
  if (!auto_sync) return;
  await syncCookies();
});
```

### 4. Message Handler (Manual Sync)
```js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "manual_sync") {
    syncCookies().then(() => sendResponse({ done: true }));
    return true; // async response
  }
});
```

### 5. Cookie Read Logic
```js
async function readCookies() {
  const results = {};
  for (const name of GOOGLE_COOKIES) {
    const cookie = await chrome.cookies.get({
      url: GOOGLE_URL,
      name
    });
    if (!cookie) return null;
    results[name] = cookie.value;
  }
  return results;
}
```

### 6. Name Resolution
```js
async function resolveName(settings) {
  if (settings.cookie_name) return settings.cookie_name;
  try {
    const info = await chrome.identity.getProfileUserInfo({ accountStatus: "ANY" });
    if (info.email) return info.email;
  } catch (e) {}
  return `Chrome Sync - ${new Date().toISOString().slice(0, 19).replace("T", " ")}`;
}
```

### 7. Sync Function
```js
async function syncCookies() {
  try {
    const settings = await chrome.storage.sync.get(null);
    const cookies = await readCookies();

    if (!cookies) {
      await updateStatus("failed", "Missing Google cookies. Make sure you are logged in.");
      return;
    }

    const name = await resolveName(settings);
    const payload = {
      name,
      secure_1psid: cookies["__Secure-1PSID"],
      secure_1psidts: cookies["__Secure-1PSIDTS"]
    };

    const resp = await fetch(settings.endpoint_url || DEFAULTS.endpoint_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const text = await resp.text();
      await updateStatus("failed", `HTTP ${resp.status}: ${text}`);
      return;
    }

    const data = await resp.json();
    if (data.status === "success") {
      await updateStatus("success", "");
    } else {
      await updateStatus("failed", JSON.stringify(data));
    }
  } catch (err) {
    await updateStatus("failed", err.message);
  }
}
```

### 8. Status Update Helper
```js
async function updateStatus(status, error) {
  await chrome.storage.sync.set({
    last_sync_at: new Date().toISOString(),
    last_sync_status: status,
    last_sync_error: error || ""
  });
}
```

### 9. Re-create Alarm on Settings Change
Listen for `chrome.storage.onChanged` to update alarm period when `sync_interval_minutes` changes.

## Edge Cases
- Service worker wakes up cold → must re-read settings from storage
- `chrome.identity` may not be available if permission not granted
- Endpoint URL may be unreachable → catch network errors
- Cookie values may be very long strings → ensure no truncation in POST

## Todo
- [ ] Implement `DEFAULTS` and constants
- [ ] Implement `chrome.runtime.onInstalled` handler
- [ ] Implement `chrome.alarms.onAlarm` handler
- [ ] Implement `chrome.runtime.onMessage` handler
- [ ] Implement `readCookies()`
- [ ] Implement `resolveName()`
- [ ] Implement `syncCookies()`
- [ ] Implement `updateStatus()`
- [ ] Handle alarm re-creation on settings change

## Success Criteria
- Cookies read successfully from logged-in Google account
- POST request sent to endpoint with correct payload format
- Alarm fires at configured interval
- Manual sync works via message passing
- Status updated correctly on success/failure
- Graceful handling of missing cookies, network errors

## Risk Assessment
- **Service worker termination:** MV3 service workers can be terminated. All state must be in `chrome.storage`. No global variables for state.
- **Cookie access denied:** `host_permissions` must match. If Chrome profile has no Google login, cookies won't exist.
- **CORS on endpoint:** If endpoint doesn't set CORS headers, fetch from extension context should still work (extensions bypass CORS for hosts in `host_permissions`).

## Next Steps
→ Phase 4 (Options Logic - depends on message passing interface)
→ Phase 5 (Integration Testing)
