# Phase 1: Project Scaffolding & Manifest

## Overview
- **Date:** 2026-02-11
- **Priority:** Critical
- **Status:** ⬜ TODO
- **Dependencies:** None

## Requirements
- MV3 manifest with correct permissions
- Proper host_permissions for Google cookies + default endpoint
- Service worker registration
- Options page declaration

## Files to Create

| File | Action | Description |
|------|--------|-------------|
| `manifest.json` | CREATE | MV3 manifest with all permissions |

## Implementation Steps

### 1. Create `manifest.json`
```json
{
  "manifest_version": 3,
  "name": "Cookie Sync for Gemini",
  "version": "0.1.0",
  "description": "Sync Google login cookies to a configurable server endpoint",
  "permissions": [
    "cookies",
    "storage",
    "alarms",
    "identity"
  ],
  "host_permissions": [
    "https://*.google.com/*",
    "http://localhost:8765/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "options_page": "options.html"
}
```

### Key Considerations
- `identity` permission: optional, used for auto-detecting email
- `host_permissions` must include target endpoint domain
  - Default `http://localhost:8765/*` only covers local dev
  - User may need to add custom host permissions for production endpoints
  - Consider using `"<all_urls>"` or documenting manual host_permissions update
- `cookies` permission + `host_permissions` for `*.google.com` required to read Google cookies

## Todo
- [ ] Create `manifest.json` with all required fields
- [ ] Verify permissions are MV3 compatible
- [ ] Test manifest loads without errors in `chrome://extensions`

## Success Criteria
- Extension loads in Chrome without errors
- No permission warnings beyond expected ones
- Service worker registered (visible in DevTools)

## Risk Assessment
- **Host permissions mismatch:** If user changes endpoint to non-localhost domain, extension won't have permission to fetch. Mitigation: document this limitation or use `optional_host_permissions`.
- **Identity permission:** May trigger extra permission warning. Consider making it optional.

## Next Steps
→ Phase 2 (Background Service Worker)
→ Phase 3 (Options UI)
