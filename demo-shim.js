/**
 * Chrome API shim for running WikiHover content.js on the demo page (no extension).
 * Must load before compromise.min.js, hebrew_names.js, and content.js.
 */
(function () {
  const PREFIX = 'wikihover_demo_';

  function storageKey(key) {
    return PREFIX + key;
  }

  function storageGet(keys, callback) {
    const result = {};
    const list = Array.isArray(keys) ? keys : (keys && typeof keys === 'object' ? Object.keys(keys) : []);
    for (const key of list) {
      try {
        const raw = localStorage.getItem(storageKey(key));
        if (raw !== null) result[key] = JSON.parse(raw);
      } catch (e) {
        // leave result[key] undefined
      }
    }
    if (typeof callback === 'function') callback(result);
  }

  function storageSet(data, callback) {
    if (data && typeof data === 'object') {
      for (const key of Object.keys(data)) {
        try {
          localStorage.setItem(storageKey(key), JSON.stringify(data[key]));
        } catch (e) {
          // ignore quota etc.
        }
      }
    }
    if (typeof callback === 'function') callback();
  }

  // Seed demo defaults once so extension is "on" with all feeds visible (Wikipedia has data; others may show empty in demo)
  const seeded = localStorage.getItem(PREFIX + '_seeded_v2');
  if (!seeded) {
    const defaults = {
      enabled: true,
      dataSourceSettings: {
        wikipedia: true,
        tvmaze: true,
        imdb: true,
        books: true,
        instagram: true,
        twitter: true,
        football: true,
        tiktok: true,
        pinterest: true
      },
      tooltipTheme: 'light'
    };
    for (const key of Object.keys(defaults)) {
      try {
        localStorage.setItem(storageKey(key), JSON.stringify(defaults[key]));
      } catch (e) {}
    }
    try {
      localStorage.setItem(PREFIX + '_seeded_v2', '1');
    } catch (e) {}
  }

  function sendMessage(message, responseCallback) {
    const cb = typeof responseCallback === 'function' ? responseCallback : function () {};

    if (message && message.action === 'proxyFetch' && message.url) {
      fetch(message.url)
        .then(function (res) {
          if (!res.ok) {
            cb({ success: false });
            return;
          }
          return res.json().then(function (data) {
            cb({ success: true, data: data });
          });
        })
        .catch(function () {
          cb({ success: false });
        });
      return;
    }

    if (message && message.action === 'proxyImageFetch' && message.url) {
      fetch(message.url)
        .then(function (res) {
          if (!res.ok) {
            cb(null);
            return;
          }
          return res.blob();
        })
        .then(function (blob) {
          if (!blob) {
            cb(null);
            return;
          }
          const reader = new FileReader();
          reader.onloadend = function () {
            cb({ success: true, dataUrl: reader.result });
          };
          reader.readAsDataURL(blob);
        })
        .catch(function () {
          cb(null);
        });
      return;
    }

    // All other actions (Instagram, Twitter, TikTok, etc.) — return null so content.js doesn't throw
    cb(null);
  }

  window.chrome = window.chrome || {};
  window.chrome.runtime = {
    id: 'demo',
    get lastError() {
      return null;
    },
    sendMessage: sendMessage
  };
  window.chrome.storage = window.chrome.storage || {};
  window.chrome.storage.local = {
    get: storageGet,
    set: storageSet
  };
})();
