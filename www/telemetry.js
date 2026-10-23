// [TEL100] Telemetry & Analytics Module: Best-effort crash reporting and event logging.

// [TEL101] Crash Reporting: Discord webhook error reporter.
const ERROR_WEBHOOK_URL = '';

window.reportErrorToWebhook = function (info) {
  if (!ERROR_WEBHOOK_URL) return;
  const lines = [
    '\uD83D\uDEA8 SectorDefenseTD crash',
    `**${info.message}**`,
    `${info.source}:${info.lineno}:${info.colno}`,
    `Booted before crash: ${info.booted}`,
    `Time: ${info.ts}`,
    `UA: ${info.ua}`
  ];
  if (info.stack) lines.push('```' + info.stack.slice(0, 800) + '```');
  sendJSON(ERROR_WEBHOOK_URL, { content: lines.join('\n') });
};

// [TEL102] Lightweight Gameplay Analytics: GA4 event tracker.
const ANALYTICS_ENDPOINT_URL = '';
const ANALYTICS_CLIENT_ID_KEY = 'sectorDefenseTD_analytics_cid';

function getAnalyticsClientId() {
  try {
    let cid = localStorage.getItem(ANALYTICS_CLIENT_ID_KEY);
    if (!cid) {
      cid = 'cid_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2);
      localStorage.setItem(ANALYTICS_CLIENT_ID_KEY, cid);
    }
    return cid;
  } catch (e) {
    return 'cid_unknown';
  }
}

function trackEvent(name, params) {
  if (!ANALYTICS_ENDPOINT_URL) return;
  sendJSON(ANALYTICS_ENDPOINT_URL, {
    client_id: getAnalyticsClientId(),
    events: [{ name: name, params: params || {} }]
  });
}

// [TEL103] Shared Fire-and-Forget POST Request Dispatcher.
function sendJSON(url, body) {
  if (!url) return;
  try {
    const controller = ('AbortController' in window) ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 5000) : null;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller ? controller.signal : undefined
    }).catch(() => { /* offline / unreachable -- silently drop, never retry-spam */ })
      .finally(() => { if (timeoutId) clearTimeout(timeoutId); });
  } catch (e) {
    // fetch not available
  }
}
