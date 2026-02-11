# Phase 4: Options Logic (JS)

## Overview
- **Date:** 2026-02-11
- **Priority:** Critical
- **Status:** ⬜ TODO
- **Dependencies:** Phase 2, Phase 3

## Requirements
- Load/save settings from `chrome.storage.sync`
- Trigger manual sync via `chrome.runtime.sendMessage`
- Display live status (last sync time, status, error)
- User feedback on save/sync actions

## Files to Create

| File | Action | Description |
|------|--------|-------------|
| `options.js` | CREATE | Options page logic |

## Implementation Steps

### 1. Load Settings on Page Open
```js
document.addEventListener("DOMContentLoaded", async () => {
  const settings = await chrome.storage.sync.get(null);
  document.getElementById("endpoint_url").value = settings.endpoint_url || "";
  document.getElementById("cookie_name").value = settings.cookie_name || "";
  document.getElementById("sync_interval").value = settings.sync_interval_minutes || 15;
  document.getElementById("auto_sync").checked = settings.auto_sync !== false;
  renderStatus(settings);
});
```

### 2. Save Settings
```js
document.getElementById("btn_save").addEventListener("click", async () => {
  const settings = {
    endpoint_url: document.getElementById("endpoint_url").value.trim(),
    cookie_name: document.getElementById("cookie_name").value.trim(),
    sync_interval_minutes: parseInt(document.getElementById("sync_interval").value, 10) || 15,
    auto_sync: document.getElementById("auto_sync").checked
  };
  await chrome.storage.sync.set(settings);

  // Re-create alarm with new interval
  await chrome.alarms.clear("cookie_sync");
  if (settings.auto_sync) {
    await chrome.alarms.create("cookie_sync", {
      periodInMinutes: settings.sync_interval_minutes
    });
  }

  showFeedback("Settings saved");
});
```

### 3. Manual Sync
```js
document.getElementById("btn_sync").addEventListener("click", async () => {
  const btn = document.getElementById("btn_sync");
  btn.disabled = true;
  btn.textContent = "Syncing...";

  await chrome.runtime.sendMessage({ action: "manual_sync" });

  // Refresh status after short delay
  setTimeout(async () => {
    const settings = await chrome.storage.sync.get(null);
    renderStatus(settings);
    btn.disabled = false;
    btn.textContent = "Sync Now";
  }, 1000);
});
```

### 4. Render Status
```js
function renderStatus(settings) {
  const atEl = document.getElementById("last_sync_at");
  const statusEl = document.getElementById("last_sync_status");
  const errorEl = document.getElementById("last_sync_error");

  atEl.textContent = settings.last_sync_at
    ? new Date(settings.last_sync_at).toLocaleString()
    : "Never";

  statusEl.textContent = settings.last_sync_status || "idle";
  statusEl.className = `status-${settings.last_sync_status || "idle"}`;

  errorEl.textContent = settings.last_sync_error || "-";
}
```

### 5. User Feedback Helper
```js
function showFeedback(msg) {
  // Brief inline notification near save button
  const btn = document.getElementById("btn_save");
  const orig = btn.textContent;
  btn.textContent = msg;
  setTimeout(() => { btn.textContent = orig; }, 1500);
}
```

### 6. Live Status Updates
Listen for storage changes to auto-refresh status:
```js
chrome.storage.onChanged.addListener((changes) => {
  if (changes.last_sync_at || changes.last_sync_status || changes.last_sync_error) {
    chrome.storage.sync.get(null).then(renderStatus);
  }
});
```

## Todo
- [ ] Implement DOMContentLoaded settings loader
- [ ] Implement save handler with alarm re-creation
- [ ] Implement manual sync trigger
- [ ] Implement `renderStatus()`
- [ ] Implement `showFeedback()`
- [ ] Add `chrome.storage.onChanged` listener for live updates

## Success Criteria
- Settings load correctly on page open
- Settings persist after save
- Manual sync triggers background sync and updates status
- Status updates in real-time without page refresh
- Error messages display clearly

## Risk Assessment
- **Alarm re-creation in options.js:** Duplicates alarm management from background.js. Consider centralizing via message passing instead.
- **Race condition:** Manual sync + auto sync could fire simultaneously. Low risk since they call the same function.

## Next Steps
→ Phase 5 (Integration Testing)
