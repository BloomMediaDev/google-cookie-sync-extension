# Phase 6: Documentation (README)

## Overview
- **Date:** 2026-02-11
- **Priority:** Medium
- **Status:** ⬜ TODO
- **Dependencies:** Phase 5

## Files to Create

| File | Action | Description |
|------|--------|-------------|
| `README.md` | CREATE | User-facing documentation |

## README Structure

### 1. Overview
- What the extension does
- Which cookies it reads
- Where it sends them

### 2. Installation
- Go to `chrome://extensions`
- Enable Developer Mode
- Click "Load unpacked"
- Select extension folder

### 3. Permissions Explained
| Permission | Why |
|------------|-----|
| `cookies` | Read Google login cookies |
| `storage` | Save settings and sync status |
| `alarms` | Schedule periodic sync |
| `identity` | (Optional) Auto-detect profile email |
| `host_permissions: *.google.com` | Access Google cookies |
| `host_permissions: localhost:8765` | Send cookies to local server |

### 4. Configuration
- Open extension Options page
- Set endpoint URL
- Set cookie name (or leave empty for auto)
- Set sync interval
- Click Save

### 5. Troubleshooting

| Issue | Solution |
|-------|----------|
| "Missing Google cookies" | Sign into Google in this Chrome profile |
| Sync fails with network error | Check endpoint URL is correct and server is running |
| HTTP 4xx/5xx errors | Check server logs, verify endpoint accepts POST JSON |
| Cookies not updating | Check `chrome://settings/cookies` for Google cookies |
| Custom endpoint needs permissions | Add domain to `host_permissions` in manifest.json |

## Todo
- [ ] Write README.md with all sections
- [ ] Include example payload
- [ ] Add troubleshooting section

## Success Criteria
- New user can install and configure without external help
- All common error scenarios documented
