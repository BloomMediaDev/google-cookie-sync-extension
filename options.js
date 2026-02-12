const DEFAULTS = {
  endpoint_url: "",
  cookie_name: "",
  sync_interval_minutes: 15,
  auto_sync: true,
  last_sync_at: null,
  last_sync_status: "idle",
  sync_history: []
};

document.addEventListener("DOMContentLoaded", async () => {
  const settings = await chrome.storage.sync.get(null);
  const merged = { ...DEFAULTS, ...settings };

  document.getElementById("endpoint_url").value = merged.endpoint_url;
  document.getElementById("cookie_name").value = merged.cookie_name;
  document.getElementById("sync_interval").value = merged.sync_interval_minutes;
  document.getElementById("auto_sync").checked = merged.auto_sync !== false;
  renderStatus(merged);
  renderHistory(merged.sync_history);
});

document.getElementById("btn_save").addEventListener("click", async () => {
  const settings = {
    endpoint_url: document.getElementById("endpoint_url").value.trim(),
    cookie_name: document.getElementById("cookie_name").value.trim(),
    sync_interval_minutes:
      parseInt(document.getElementById("sync_interval").value, 10) || 15,
    auto_sync: document.getElementById("auto_sync").checked
  };

  await chrome.storage.sync.set(settings);

  await chrome.alarms.clear("cookie_sync");
  if (settings.auto_sync) {
    await chrome.alarms.create("cookie_sync", {
      periodInMinutes: settings.sync_interval_minutes
    });
  }

  showFeedback("Settings saved");
});

document.getElementById("btn_sync").addEventListener("click", async () => {
  const btn = document.getElementById("btn_sync");
  btn.disabled = true;
  btn.textContent = "Syncing...";

  await chrome.runtime.sendMessage({ action: "manual_sync" });

  setTimeout(async () => {
    const settings = await chrome.storage.sync.get(null);
    renderStatus({ ...DEFAULTS, ...settings });
    btn.disabled = false;
    btn.textContent = "Sync Now";
  }, 1000);
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync") return;
  chrome.storage.sync.get(null).then((settings) => {
    if (changes.last_sync_at || changes.last_sync_status || changes.last_sync_error) {
      renderStatus({ ...DEFAULTS, ...settings });
    }
    if (changes.sync_history) {
      renderHistory(settings.sync_history);
    }
  });
});

function renderHistory(history) {
  const list = document.getElementById("history_list");
  if (!history || history.length === 0) {
    list.innerHTML = "<p>No history yet.</p>";
    return;
  }

  list.innerHTML = `
    <table class="history-table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Status</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        ${history.map(item => `
          <tr class="${item.status === 'failed' ? 'error-row' : ''}">
            <td>${new Date(item.timestamp).toLocaleString()}</td>
            <td class="status-${item.status}">${item.status}</td>
            <td class="details-cell">${item.error || "Success"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderStatus(settings) {
  const atEl = document.getElementById("last_sync_at");
  const statusEl = document.getElementById("last_sync_status");
  const errorEl = document.getElementById("last_sync_error");

  atEl.textContent = settings.last_sync_at
    ? new Date(settings.last_sync_at).toLocaleString()
    : "Never";

  const status = settings.last_sync_status || "idle";
  statusEl.textContent = status;
  statusEl.className = `status-${status}`;

  errorEl.textContent = settings.last_sync_error || "-";
}

function showFeedback(msg) {
  const btn = document.getElementById("btn_save");
  const orig = btn.textContent;
  btn.textContent = msg;
  setTimeout(() => {
    btn.textContent = orig;
  }, 1500);
}
