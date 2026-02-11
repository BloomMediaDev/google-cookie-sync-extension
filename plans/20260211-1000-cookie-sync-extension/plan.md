# Cookie Sync Extension - Development Plan

## Overview
Chrome extension (Manifest V3) that periodically reads Google login cookies (`__Secure-1PSID`, `__Secure-1PSIDTS`) and sends them to a configurable server endpoint.

**Source:** [cookie-sync-extension-plan.md](file:///home/minnyat/nano-banana-api/cookie-sync-extension-plan.md)

## Phases

| # | Phase | Status | Priority | Est. Time |
|---|-------|--------|----------|-----------|
| 1 | Project Scaffolding & Manifest | ⬜ TODO | Critical | 15 min |
| 2 | Background Service Worker | ⬜ TODO | Critical | 45 min |
| 3 | Options UI (HTML + CSS) | ⬜ TODO | Critical | 30 min |
| 4 | Options Logic (JS) | ⬜ TODO | Critical | 30 min |
| 5 | Integration & Testing | ⬜ TODO | High | 30 min |
| 6 | Documentation (README) | ⬜ TODO | Medium | 15 min |

## Dependencies
```
Phase 1 → Phase 2 → Phase 4
Phase 1 → Phase 3 → Phase 4
Phase 2 + Phase 4 → Phase 5 → Phase 6
```

## Key Decisions
- MV3 service worker (no persistent background page)
- `chrome.storage.sync` for settings (cross-device sync)
- `chrome.alarms` for periodic sync (MV3 required, no `setInterval`)
- `chrome.identity` optional for auto email detection
- Vanilla JS, no frameworks

## Target Output
```
cookie-nano-banana-sync-extension/
  manifest.json
  background.js
  options.html
  options.js
  styles.css
  README.md
```
