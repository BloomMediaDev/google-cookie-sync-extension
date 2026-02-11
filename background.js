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

chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.sync.get(Object.keys(DEFAULTS));
  const settings = { ...DEFAULTS, ...stored };
  await chrome.storage.sync.set(settings);
  await chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: settings.sync_interval_minutes
  });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;
  const { auto_sync } = await chrome.storage.sync.get("auto_sync");
  if (!auto_sync) return;
  await syncCookies();
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "manual_sync") {
    syncCookies().then(() => sendResponse({ done: true }));
    return true;
  }
  return false;
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync") return;
  if (!changes.sync_interval_minutes) return;
  const nextValue = changes.sync_interval_minutes.newValue ?? DEFAULTS.sync_interval_minutes;
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: nextValue });
});

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

async function resolveName(settings) {
  if (settings.cookie_name) return settings.cookie_name;
  try {
    const info = await chrome.identity.getProfileUserInfo({ accountStatus: "ANY" });
    if (info.email) return info.email;
  } catch (error) {
    // Ignore identity lookup failures.
  }
  return `Chrome Sync - ${new Date().toISOString().slice(0, 19).replace("T", " ")}`;
}

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

async function updateStatus(status, error) {
  await chrome.storage.sync.set({
    last_sync_at: new Date().toISOString(),
    last_sync_status: status,
    last_sync_error: error || ""
  });
}
