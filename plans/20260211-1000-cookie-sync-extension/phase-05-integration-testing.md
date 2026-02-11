# Phase 5: Integration & Testing

## Overview
- **Date:** 2026-02-11
- **Priority:** High
- **Status:** ⬜ TODO
- **Dependencies:** Phase 2, Phase 4

## Testing Checklist

### 1. Extension Loading
- [ ] Load extension unpacked via `chrome://extensions`
- [ ] No manifest errors
- [ ] Service worker registered and active
- [ ] Options page accessible

### 2. Default Settings
- [ ] Open Options → verify defaults pre-filled
- [ ] Endpoint: `http://localhost:8765/sync-cookie`
- [ ] Interval: `15` minutes
- [ ] Auto sync: checked

### 3. Cookie Reading
- [ ] Logged into Google → cookies read successfully
- [ ] Not logged in → error: "Missing Google cookies"
- [ ] Verify cookie values match `chrome://settings/cookies`

### 4. Manual Sync
- [ ] Click "Sync Now" → POST request sent to endpoint
- [ ] Verify payload format: `{ name, secure_1psid, secure_1psidts }`
- [ ] Status updates to "success" on 200
- [ ] Status updates to "failed" on non-200

### 5. Auto Sync
- [ ] Set interval to 1 minute for testing
- [ ] Verify alarm fires and sync executes
- [ ] Disable auto sync → alarm should not trigger sync

### 6. Settings Persistence
- [ ] Save custom settings → reload options page → settings retained
- [ ] Change interval → alarm re-created with new period

### 7. Error Handling
- [ ] Endpoint unreachable → error message shown
- [ ] Invalid endpoint URL → graceful failure
- [ ] Server returns non-JSON → error captured

### 8. Name Resolution
- [ ] Custom name set → uses custom name
- [ ] No name + identity permission → uses email
- [ ] No name + no email → uses timestamp fallback

## Test Server (Optional)
Quick test server to verify POST requests:
```js
// test-server.js (Node.js)
const http = require("http");
http.createServer((req, res) => {
  let body = "";
  req.on("data", (d) => body += d);
  req.on("end", () => {
    console.log("Received:", JSON.parse(body));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "success" }));
  });
}).listen(8765, () => console.log("Test server on :8765"));
```

## Success Criteria
- All checklist items pass
- No console errors in service worker or options page
- Extension works end-to-end: install → configure → sync → verify

## Next Steps
→ Phase 6 (Documentation)
