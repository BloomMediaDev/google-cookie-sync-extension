document.addEventListener("DOMContentLoaded", async () => {
  const settings = await chrome.storage.sync.get(null);
  renderStatus(settings);
});

document.getElementById("btn_sync").addEventListener("click", async () => {
  const btn = document.getElementById("btn_sync");
  btn.disabled = true;
  btn.textContent = "Syncing...";

  await chrome.runtime.sendMessage({ action: "manual_sync" });

  // Poll for updates briefly
  setTimeout(async () => {
    const settings = await chrome.storage.sync.get(null);
    renderStatus(settings);
    btn.disabled = false;
    btn.textContent = "Sync Now";
  }, 1000);
});

document.getElementById("btn_options").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync") return;
  if (changes.last_sync_at || changes.last_sync_status || changes.last_sync_error) {
    chrome.storage.sync.get(null).then(renderStatus);
  }
});

function renderStatus(settings) {
  const atEl = document.getElementById("last_sync_at");
  const statusEl = document.getElementById("last_sync_status");
  const errorEl = document.getElementById("last_sync_error");
  const errorContainer = document.getElementById("error_container");

  if (settings.last_sync_at) {
    const date = new Date(settings.last_sync_at);
    // Format: HH:MM:SS
    atEl.textContent = date.toLocaleTimeString();
  } else {
    atEl.textContent = "Never";
  }

  const status = settings.last_sync_status || "idle";
  statusEl.textContent = status;
  statusEl.className = `value status-${status}`;

  if (settings.last_sync_error) {
    errorEl.textContent = settings.last_sync_error;
    errorContainer.style.display = "block";
  } else {
    errorContainer.style.display = "none";
  }
}
