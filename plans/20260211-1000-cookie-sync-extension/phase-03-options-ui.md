# Phase 3: Options UI (HTML + CSS)

## Overview
- **Date:** 2026-02-11
- **Priority:** Critical
- **Status:** ⬜ TODO
- **Dependencies:** Phase 1

## Requirements
- Clean, simple settings page
- Sections: Endpoint, Cookie Name, Schedule, Status, Actions
- No external font/CSS dependencies
- Responsive, readable layout

## Files to Create

| File | Action | Description |
|------|--------|-------------|
| `options.html` | CREATE | Settings page HTML |
| `styles.css` | CREATE | Simple styling |

## Implementation Steps

### 1. Create `options.html`

Structure:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Cookie Sync Settings</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Cookie Sync for Gemini</h1>

    <!-- Section 1: Endpoint -->
    <section>
      <h2>Endpoint</h2>
      <label for="endpoint_url">Endpoint URL</label>
      <input type="url" id="endpoint_url"
             placeholder="http://localhost:8765/sync-cookie">
    </section>

    <!-- Section 2: Cookie Name -->
    <section>
      <h2>Cookie Name</h2>
      <label for="cookie_name">Name</label>
      <input type="text" id="cookie_name"
             placeholder="My Google Account">
      <p class="helper">If empty, uses Chrome profile email if available</p>
    </section>

    <!-- Section 3: Schedule -->
    <section>
      <h2>Schedule</h2>
      <label for="sync_interval">Sync interval (minutes)</label>
      <input type="number" id="sync_interval" min="1" value="15">
      <label class="checkbox-label">
        <input type="checkbox" id="auto_sync" checked>
        Enable auto sync
      </label>
    </section>

    <!-- Section 4: Status -->
    <section>
      <h2>Status</h2>
      <div class="status-grid">
        <span>Last sync:</span> <span id="last_sync_at">Never</span>
        <span>Status:</span> <span id="last_sync_status">Idle</span>
        <span>Error:</span> <span id="last_sync_error">-</span>
      </div>
    </section>

    <!-- Section 5: Actions -->
    <section class="actions">
      <button id="btn_save" class="primary">Save Settings</button>
      <button id="btn_sync">Sync Now</button>
    </section>
  </div>

  <script src="options.js"></script>
</body>
</html>
```

### 2. Create `styles.css`

Design principles:
- Max width 600px, centered
- System font stack
- Clear section separation
- Status indicators with color coding (green/red/gray)
- Accessible contrast ratios

```css
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #f5f5f5;
  color: #333;
  padding: 24px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

h1 { font-size: 20px; margin-bottom: 20px; }
h2 { font-size: 14px; text-transform: uppercase; color: #666; margin-bottom: 8px; }

section { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
section:last-child { border-bottom: none; }

label { display: block; font-size: 13px; margin-bottom: 4px; color: #555; }
input[type="url"], input[type="text"], input[type="number"] {
  width: 100%; padding: 8px 12px; border: 1px solid #ddd;
  border-radius: 4px; font-size: 14px;
}

.helper { font-size: 12px; color: #888; margin-top: 4px; }
.checkbox-label { display: flex; align-items: center; gap: 6px; margin-top: 8px; }

.status-grid {
  display: grid; grid-template-columns: auto 1fr;
  gap: 4px 12px; font-size: 13px;
}

.status-success { color: #2e7d32; }
.status-failed { color: #c62828; }
.status-idle { color: #888; }

.actions { display: flex; gap: 8px; }
button {
  padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px;
  background: #fff; cursor: pointer; font-size: 14px;
}
button.primary { background: #1a73e8; color: #fff; border-color: #1a73e8; }
button:hover { opacity: 0.9; }
```

## Todo
- [ ] Create `options.html` with all 5 sections
- [ ] Create `styles.css` with clean layout
- [ ] Verify renders correctly in Chrome options tab
- [ ] Check accessibility (labels, contrast)

## Success Criteria
- Page renders cleanly at various widths
- All form inputs have labels and placeholders
- Status section shows live data from storage
- Buttons are clearly distinguishable

## Next Steps
→ Phase 4 (Options Logic)
