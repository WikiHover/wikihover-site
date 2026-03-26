// WikiHover Content Script
// Set DEBUG = true to enable verbose logging during development
const DEBUG = false;
function debugLog(...args) {
  if (DEBUG) console.log('WikiHover:', ...args);
}

// Check if extension context is still valid (becomes invalid after extension reload)
function isExtensionValid() {
  try {
    return !!(chrome && chrome.runtime && chrome.runtime.id);
  } catch (e) {
    return false;
  }
}

// Safe wrapper for chrome.storage.local operations
function safeStorageGet(keys) {
  return new Promise(resolve => {
    if (!isExtensionValid()) { resolve({}); return; }
    try {
      chrome.storage.local.get(keys, result => {
        if (chrome.runtime.lastError) { resolve({}); return; }
        resolve(result);
      });
    } catch (e) { resolve({}); }
  });
}

// Safe wrapper for chrome.runtime.sendMessage (no-ops after extension reload)
function safeSendMessage(message, timeoutMs = 15000) {
  return new Promise(resolve => {
    if (!isExtensionValid()) { resolve(null); return; }
    try {
      // Safety timeout: if service worker dies mid-request, the callback may never fire
      const timeout = setTimeout(() => resolve(null), timeoutMs);
      chrome.runtime.sendMessage(message, resp => {
        clearTimeout(timeout);
        if (chrome.runtime.lastError) { resolve(null); return; }
        resolve(resp);
      });
    } catch (e) { resolve(null); }
  });
}

function safeStorageSet(data) {
  if (!isExtensionValid()) return;
  try {
    chrome.storage.local.set(data, () => {
      if (chrome.runtime.lastError) {
        debugLog('Storage set failed:', chrome.runtime.lastError.message);
      }
    });
  } catch (e) { /* context invalidated */ }
}

// Global variables
let tooltipElement = null;
let currentWord = null;
let currentHoveredElement = null;
let tooltipTimer = null;
const TOOLTIP_DELAY = 300;
let markedNames = new Set(); // names that have been marked (for tracking/preload, no marking limit)
let markedByDocument = new Set(); // names already processed by markNameInDocument (prevents re-wrapping/nesting)
let notPersonNames = new Set();  // names confirmed as non-person by Wikipedia — excluded from future scans
let confirmedPersonNames = new Set();  // names confirmed as persons by Wikipedia — approved even if NLP rejects
let processedNamesCount = 0;
let apiCallCount = 0;
let lastScanTimestamp = 0;
let observer = null;
let isScanning = false;
const MAX_API_CALLS = 50;
const RESCAN_INTERVAL = 500;
const VIEWPORT_BUFFER = 200; // px buffer above/below viewport for pre-marking
let isTooltipVisible = false;
let tooltipHideGraceUntil = 0; // timestamp until which hideTooltip() is suppressed (family tree navigation)
let lastRepositionTime = 0;    // after reposition, suppress "not over tooltip" hide for a short time to avoid flicker
const REPOSITION_GRACE_MS = 300;
let pendingScrollRAF = false;
let cachedTooltipWidth = 0;
let cachedTooltipHeight = 0;
let initialized = false;
let extensionEnabled = true;
let pinnedTooltips = [];
const MAX_PINNED_TOOLTIPS = 3;
let unmarkedNames = new Set();
let tabOrder = null;
let tooltipNavHistory = [];   // stack of visited names for back/forward navigation
let tooltipNavIndex = -1;     // current position in history
let navFromHistory = false;   // flag: true when navigating via back/forward buttons

// Bounded caches with LRU eviction
const MAX_CACHE_SIZE = 100;
let wikiCache = {};
let tvMazeCache = {};
let imdbCache = {};
let booksCache = {};
let wikidataCache = {};
let instagramCache = {};
let twitterCache = {};
let footballCache = {};
let tiktokCache = {};
let pinterestCache = {};
// Lazy tab loading - only fetch data when tab is activated
let tabFetchers = {};
let fetchedTabs = new Set();

// Per-name data cache — stores fetched API data so pinned tooltips can render independently
let tooltipDataCache = {};

// Request deduplication - prevents duplicate in-flight API calls
const pendingFetches = {};

function deduplicatedFetch(key, fetchFn) {
  if (pendingFetches[key]) return pendingFetches[key];
  const promise = fetchFn().finally(() => { delete pendingFetches[key]; });
  pendingFetches[key] = promise;
  // Safety: evict stuck entries after 30s so retries can create fresh fetches
  setTimeout(() => { delete pendingFetches[key]; }, 30000);
  return promise;
}

function addToCache(cache, key, value) {
  const keys = Object.keys(cache);
  if (keys.length >= MAX_CACHE_SIZE) {
    delete cache[keys[0]];
  }
  cache[key] = value;
}

// Regex for name detection — exactly 2 capitalized words (first name + last name)
// Each word: starts uppercase, then at least one lowercase, then any letters (handles McConaughey, LeBron, DeNiro)
const nameRegex = /\b[A-Z][a-zÀ-ÿ][a-zA-ZÀ-ÿ\-']*\s+[A-Z][a-zÀ-ÿ][a-zA-ZÀ-ÿ\-']*\b/g;

// Regex for multi-word capitalized sequences (3+ words).
// Captures phrases like "President Donald Trump", "Secretary General Antonio Guterres".
// Used alongside nameRegex — the longer match provides better context for extracting the actual person name.
const multiWordNameRegex = /\b[A-Z][a-zÀ-ÿ][a-zA-ZÀ-ÿ\-']*(?:\s+[A-Z][a-zÀ-ÿ][a-zA-ZÀ-ÿ\-']*){2,}\b/g;

// POS tags that indicate a candidate name is NOT a person
const NON_PERSON_POS_TAGS = [
  '#Demonym',       // Canadian, American, French
  '#Determiner',    // The, A, This
  '#Gerund',        // Cursing, Breaking, Running
  '#Adjective',     // Olympic, Grand, Metal, Red, Super
  '#Preposition',   // Of, In, At
  '#Pronoun',       // He, She, They
  '#QuestionWord',  // Who, What, Where
  '#Conjunction',   // And, But, Or
  '#Country',       // Korea, France (missed by .places())
  '#City',          // London, Paris (missed by .places())
  '#Region',        // Midwest, Scandinavia
  '#Month',         // January, March
  '#WeekDay',       // Monday, Friday
  '#Holiday',       // Christmas, Easter
  '#Currency',      // Dollar, Euro
  '#Activity',      // Sports, games
  '#Unit',          // Meter, Cup (unit of measure)
  '#Copula',        // is, am, are, was
  '#Modal',         // can, could, should
];

// Hebrew word regex - matches a single Hebrew word (2+ Hebrew chars)
const hebrewWordRegex = /[\u05D0-\u05EA][\u0590-\u05FF]+/g;

// Check if text contains Hebrew characters
function isHebrewText(text) {
  return /[\u05D0-\u05EA]/.test(text);
}

// Strip nikud (vowel marks) from Hebrew text for dictionary lookup
function stripNikud(text) {
  return text.replace(/[\u0591-\u05C7]/g, '');
}

// Find Hebrew names in text using the name dictionaries (first name + last name, exactly 2 words)
// A known first name followed by any Hebrew word is treated as a person name.
function findHebrewNames(text) {
  const matches = [];
  const words = [];

  // Extract all Hebrew words with their positions
  let m;
  hebrewWordRegex.lastIndex = 0;
  while ((m = hebrewWordRegex.exec(text)) !== null) {
    words.push({ word: stripNikud(m[0]), raw: m[0], index: m.index, end: m.index + m[0].length });
  }

  let i = 0;
  while (i < words.length) {
    const w1 = words[i];
    const isFirst = HEBREW_FIRST_NAMES.has(w1.word);

    // Try two-word match with the next adjacent Hebrew word
    if (i + 1 < words.length) {
      const w2 = words[i + 1];
      const gap = text.substring(w1.end, w2.index);

      if (/^\s+$/.test(gap)) {
        const isLast2 = HEBREW_LAST_NAMES.has(w2.word);

        // Known first name + any second Hebrew word (known last, known first, or unknown)
        // A recognized first name is a strong enough signal for a person name
        if (isFirst) {
          const fullMatch = text.substring(w1.index, w2.end);
          matches.push({ 0: fullMatch, index: w1.index });
          i += 2;
          continue;
        }
        // Any Hebrew word + known last name (catches unlisted first names)
        if (isLast2) {
          const fullMatch = text.substring(w1.index, w2.end);
          matches.push({ 0: fullMatch, index: w1.index });
          i += 2;
          continue;
        }
      }
    }

    i++;
  }

  return matches;
}

let enableEnhancedNameDetection = true;

// Define settings for available data sources
let dataSourceSettings = {
  wikipedia: true,
  tvmaze: true,
  imdb: true,
  books: true,
  instagram: true,
  twitter: true,
  football: true,
  tiktok: true,
  pinterest: true
};

// Video sound preference (default: muted)
let videoSoundEnabled = true;

// Load settings from storage
safeStorageGet(['dataSourceSettings', 'videoSound']).then(result => {
  if (result.dataSourceSettings) {
    dataSourceSettings = { ...dataSourceSettings, ...result.dataSourceSettings };
  }
  if (result.videoSound !== undefined) {
    videoSoundEnabled = result.videoSound !== false;
  }
});

// Add a rate limiter for Twitter API requests
const TWITTER_RATE_LIMIT = {
  timestamp: 0,
  count: 0,
  windowMs: 15 * 60 * 1000,
  maxRequests: 450,
  resetTimer: null
};

// Twitter API configuration - token loaded from storage only
const TWITTER_API_CONFIG = {
  bearerToken: '',
  baseUrl: 'https://api.twitter.com/2'
};

// Load Twitter bearer token from storage
safeStorageGet(['twitterBearerToken']).then(result => {
  if (result.twitterBearerToken) {
    TWITTER_API_CONFIG.bearerToken = result.twitterBearerToken;
  }
});

// Module-level Set for non-name words (O(1) lookups, created once)
const NON_NAME_WORDS = new Set([
  'a', 'an', 'the',
  'of', 'in', 'on', 'at', 'by', 'for', 'with', 'about', 'against', 'between',
  'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from',
  'up', 'down', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
  'and', 'but', 'or', 'yet', 'so', 'nor', 'while', 'because', 'unless', 'since',
  'although', 'even', 'if', 'though',
  'who', 'what', 'where', 'when', 'why', 'how', 'which', 'whom', 'whose',
  'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should',
  'can', 'could', 'may', 'might', 'must', 'say', 'says', 'said',
  'go', 'goes', 'went', 'gone', 'get', 'gets', 'got', 'gotten',
  'make', 'makes', 'made', 'see', 'sees', 'saw', 'seen',
  'going', 'coming', 'getting', 'making', 'taking', 'using', 'having',
  'doing', 'saying', 'seeing', 'knowing', 'thinking', 'looking', 'finding',
  'giving', 'telling', 'working', 'calling', 'trying', 'asking', 'needing',
  'feeling', 'becoming', 'leaving', 'putting', 'keeping', 'letting', 'seeming',
  'showing', 'bringing', 'writing', 'running', 'moving', 'waiting', 'reading',
  'starting', 'setting', 'meeting', 'winning', 'teaching', 'offering', 'playing',
  'following', 'learning', 'changing', 'watching', 'speaking', 'studying',
  'planning', 'continuing', 'beginning', 'developing',
  'now', 'today', 'tomorrow', 'yesterday', 'tonight', 'already',
  'still', 'soon', 'later', 'earlier', 'immediately', 'recently',
  'currently', 'presently', 'formerly', 'suddenly', 'finally', 'eventually',
  'meanwhile', 'sometimes', 'always', 'never', 'ever', 'often', 'frequently',
  'rarely', 'seldom', 'occasionally', 'periodically', 'constantly',
  'continuously', 'repeatedly', 'daily', 'weekly', 'monthly', 'yearly',
  'annually', 'nowadays', 'forever', 'temporarily',
  'not', 'very', 'too', 'only', 'just', 'more', 'most', 'also', 'much',
  'i', 'me', 'my', 'mine', 'myself',
  'you', 'your', 'yours', 'yourself',
  'he', 'him', 'his', 'himself',
  'she', 'her', 'hers', 'herself',
  'it', 'its', 'itself',
  'we', 'us', 'our', 'ours', 'ourselves',
  'they', 'them', 'their', 'theirs', 'themselves',
  'this', 'that', 'these', 'those',
  'all', 'any', 'both', 'each', 'few', 'many', 'some',
  'other', 'another', 'such', 'same', 'different', 'new', 'old', 'good', 'best',
  'better', 'bad', 'worse', 'worst', 'high', 'low', 'big', 'small', 'large',
  'little', 'long', 'short', 'great', 'major', 'minor', 'important', 'significant',
  'chief', 'main', 'key', 'primary', 'secondary', 'central', 'essential', 'crucial',
  'vital', 'critical', 'typical', 'usual', 'regular', 'normal', 'common', 'rare',
  'unique', 'special', 'specific', 'general', 'universal', 'particular', 'exclusive'
]);

// Single initialization gate
function initOnce() {
  if (initialized) return;
  initialized = true;

  debugLog('Initializing');
  createTooltip();

  // Load saved enabled state
  safeStorageGet(['enabled']).then(result => {
    if (result.enabled !== undefined) {
      extensionEnabled = result.enabled;
    }
  });

  // Apply saved theme to document for name highlight theming
  safeStorageGet(['tooltipTheme']).then(result => {
    const theme = result.tooltipTheme || 'light';
    if (theme !== 'light') {
      document.documentElement.setAttribute('data-wikihover-theme', theme);
    }
  });

  loadCompromiseLibrary()
    .then(() => {
      debugLog('Compromise loaded successfully');
      window.compromiseAvailable = true;
    })
    .catch((error) => {
      console.error('WikiHover: Failed to load Compromise:', error);
      handleCompromiseFailure();
    })
    .finally(() => {
      initializeExtensionOnPage();
    });
}

// Initialize when DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initOnce, 0);
} else {
  document.addEventListener('DOMContentLoaded', initOnce);
}

// Force-create the tooltip if it doesn't exist
function ensureTooltipExists() {
  if (!tooltipElement || !document.body.contains(tooltipElement)) {
    createTooltip();
  }
  return tooltipElement;
}

// Function to get Twitter API credentials
async function getTwitterCredentials() {
  const result = await safeStorageGet(['twitterApiKey', 'twitterApiSecretKey', 'twitterBearerToken']);
  return {
    apiKey: result.twitterApiKey || '',
    apiSecretKey: result.twitterApiSecretKey || '',
    bearerToken: result.twitterBearerToken || ''
  };
}

// Function to generate Twitter Bearer Token from API key and secret (via background script)
async function generateTwitterBearerToken(apiKey, apiSecretKey) {
  try {
    const response = await safeSendMessage({
      action: 'getTwitterBearerToken',
      apiKey: apiKey,
      apiSecretKey: apiSecretKey
    });

    if (response && response.success && response.bearerToken) {
      return response.bearerToken;
    } else {
      console.error('WikiHover: Error from background script:', response?.error || 'Unknown error');
      return '';
    }
  } catch (error) {
    console.error('WikiHover: Error generating Twitter bearer token:', error);
    return '';
  }
}

// Ensure we have a valid bearer token
async function ensureTwitterBearerToken() {
  if (TWITTER_API_CONFIG.bearerToken) {
    return TWITTER_API_CONFIG.bearerToken;
  }

  const credentials = await getTwitterCredentials();

  if (credentials.bearerToken) {
    TWITTER_API_CONFIG.bearerToken = credentials.bearerToken;
    return credentials.bearerToken;
  }

  // Only ask background script if we have API key+secret to generate a token from
  if (credentials.apiKey && credentials.apiSecretKey) {
    try {
      const response = await safeSendMessage({
        action: 'getTwitterBearerToken', apiKey: credentials.apiKey, apiSecretKey: credentials.apiSecretKey
      });

      if (response && response.success && response.bearerToken) {
        TWITTER_API_CONFIG.bearerToken = response.bearerToken;
        return response.bearerToken;
      }
    } catch (error) {
      debugLog('Error getting Twitter bearer token from background:', error);
    }
  }

  return '';
}

// Helper function to check and update rate limits
function checkRateLimit() {
  const now = Date.now();

  if (now - TWITTER_RATE_LIMIT.timestamp > TWITTER_RATE_LIMIT.windowMs) {
    TWITTER_RATE_LIMIT.timestamp = now;
    TWITTER_RATE_LIMIT.count = 0;

    if (TWITTER_RATE_LIMIT.resetTimer) {
      clearTimeout(TWITTER_RATE_LIMIT.resetTimer);
    }

    TWITTER_RATE_LIMIT.resetTimer = setTimeout(() => {
      TWITTER_RATE_LIMIT.count = 0;
      TWITTER_RATE_LIMIT.timestamp = Date.now();
    }, TWITTER_RATE_LIMIT.windowMs);
  }

  if (TWITTER_RATE_LIMIT.count >= TWITTER_RATE_LIMIT.maxRequests) {
    const resetTime = new Date(TWITTER_RATE_LIMIT.timestamp + TWITTER_RATE_LIMIT.windowMs);
    throw new Error(`Twitter API rate limit reached. Resets at ${resetTime.toLocaleTimeString()}`);
  }

  TWITTER_RATE_LIMIT.count++;
  return true;
}

// Make Twitter API request with rate limiting
async function makeTwitterApiRequest(url, method = 'GET', headers = {}, body = null) {
  try {
    checkRateLimit();

    const bearerToken = await ensureTwitterBearerToken();
    if (!bearerToken) {
      throw new Error('Twitter Bearer Token not found and could not be generated');
    }

    const response = await safeSendMessage({
      action: 'makeTwitterApiRequest',
      url: url,
      method: method,
      headers: headers,
      body: body,
      bearerToken: bearerToken
    });

    if (response && response.success) {
      return response.data;
    } else {
      if (response?.error && response.error.includes('429')) {
        TWITTER_RATE_LIMIT.count = TWITTER_RATE_LIMIT.maxRequests;
        throw new Error('Twitter API rate limit reached. Please try again later.');
      }
      throw new Error(response?.error || 'API request failed');
    }
  } catch (error) {
    console.error('WikiHover: Error making Twitter API request:', error);
    throw error;
  }
}

// Create tooltip element
function createTooltip() {
  debugLog('Creating tooltip');

  // Remove any existing tooltips to prevent duplicates
  const existingTooltips = document.querySelectorAll('.wikihover-tooltip');
  existingTooltips.forEach(tooltip => {
    if (tooltip !== tooltipElement) {
      tooltip.remove();
    }
  });

  // If tooltipElement exists but was removed from DOM (by host page or SPA navigation), reset it
  if (tooltipElement && !document.body.contains(tooltipElement)) {
    tooltipElement = null;
  }

  if (tooltipElement) {
    tooltipElement.classList.remove('visible');
    isTooltipVisible = false;
    return;
  }

  tooltipElement = document.createElement('div');
  tooltipElement.className = 'wikihover-tooltip';
  tooltipElement.setAttribute('data-wikihover-tooltip', 'true');
  tooltipElement.setAttribute('id', 'wikihover-tooltip-' + Date.now());

  // Apply saved theme
  safeStorageGet(['tooltipTheme']).then(result => {
    const theme = result.tooltipTheme || 'light';
    if (theme !== 'light') {
      tooltipElement.setAttribute('data-wikihover-theme', theme);
      document.documentElement.setAttribute('data-wikihover-theme', theme);
    }
  });

  // Create tooltip header
  const header = document.createElement('div');
  header.className = 'wikihover-header';

  const title = document.createElement('h3');
  title.className = 'wikihover-title';
  header.appendChild(title);

  // Back/Forward navigation buttons for family tree navigation
  const navButtons = document.createElement('div');
  navButtons.style.cssText = 'display:flex;align-items:center;gap:2px;margin-left:6px;';

  const navBack = document.createElement('span');
  navBack.innerHTML = '&#9664;';
  navBack.title = 'Back';
  navBack.style.cssText = 'display:none;cursor:pointer;font-size:11px;color:#999;padding:2px 5px;border-radius:3px;transition:color 0.2s,background 0.2s;user-select:none;line-height:1;white-space:nowrap;';
  navBack.addEventListener('mouseenter', () => { navBack.style.color = '#0645AD'; navBack.style.background = 'rgba(6,69,173,0.08)'; });
  navBack.addEventListener('mouseleave', () => { navBack.style.color = '#999'; navBack.style.background = 'transparent'; });
  navBack.addEventListener('click', (e) => {
    e.stopPropagation();
    if (tooltipNavIndex > 0) {
      tooltipNavIndex--;
      navFromHistory = true;
      navigateToHistoryEntry(tooltipNavHistory[tooltipNavIndex]);
    }
  });
  navButtons.appendChild(navBack);

  const navFwd = document.createElement('span');
  navFwd.innerHTML = '&#9654;';
  navFwd.title = 'Forward';
  navFwd.style.cssText = 'display:none;cursor:pointer;font-size:11px;color:#999;padding:2px 5px;border-radius:3px;transition:color 0.2s,background 0.2s;user-select:none;line-height:1;white-space:nowrap;';
  navFwd.addEventListener('mouseenter', () => { navFwd.style.color = '#0645AD'; navFwd.style.background = 'rgba(6,69,173,0.08)'; });
  navFwd.addEventListener('mouseleave', () => { navFwd.style.color = '#999'; navFwd.style.background = 'transparent'; });
  navFwd.addEventListener('click', (e) => {
    e.stopPropagation();
    if (tooltipNavIndex < tooltipNavHistory.length - 1) {
      tooltipNavIndex++;
      navFromHistory = true;
      navigateToHistoryEntry(tooltipNavHistory[tooltipNavIndex]);
    }
  });
  navButtons.appendChild(navFwd);

  header.appendChild(navButtons);

  // Store references for easy access
  tooltipElement._navBack = navBack;
  tooltipElement._navFwd = navFwd;

  const headerButtons = document.createElement('div');
  headerButtons.className = 'wikihover-header-buttons';

  const fullscreenBtn = document.createElement('span');
  fullscreenBtn.className = 'wikihover-fullscreen-btn';
  fullscreenBtn.innerHTML = '&#x26F6;';
  fullscreenBtn.title = 'Toggle fullscreen';
  fullscreenBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const tt = fullscreenBtn.closest('.wikihover-tooltip, .wikihover-pinned-tooltip');
    if (!tt) return;
    const isFullscreen = tt.classList.contains('wikihover-fullscreen');
    if (isFullscreen) {
      // Exit fullscreen — restore saved dimensions
      tt.classList.remove('wikihover-fullscreen');
      const savedLeft = tt.dataset.whFsLeft;
      const savedTop = tt.dataset.whFsTop;
      const savedWidth = tt.dataset.whFsWidth;
      const savedHeight = tt.dataset.whFsHeight;
      tt.style.setProperty('left', savedLeft, 'important');
      tt.style.setProperty('top', savedTop, 'important');
      applyTooltipSize(tt, parseFloat(savedWidth), parseFloat(savedHeight));
      delete tt.dataset.whFsLeft;
      delete tt.dataset.whFsTop;
      delete tt.dataset.whFsWidth;
      delete tt.dataset.whFsHeight;
      fullscreenBtn.innerHTML = '&#x26F6;';
      fullscreenBtn.title = 'Toggle fullscreen';
    } else {
      // Enter fullscreen — save current dimensions, expand to viewport
      const rect = tt.getBoundingClientRect();
      tt.dataset.whFsLeft = tt.style.getPropertyValue('left') || rect.left + 'px';
      tt.dataset.whFsTop = tt.style.getPropertyValue('top') || rect.top + 'px';
      tt.dataset.whFsWidth = rect.width;
      tt.dataset.whFsHeight = rect.height;
      tt.classList.add('wikihover-fullscreen');
      applyTooltipSize(tt, window.innerWidth, window.innerHeight);
      fullscreenBtn.innerHTML = '&#x29C4;';
      fullscreenBtn.title = 'Exit fullscreen';
    }
    tooltipHideGraceUntil = Date.now() + 2000;
  });
  headerButtons.appendChild(fullscreenBtn);

  const resizeBtn = document.createElement('span');
  resizeBtn.className = 'wikihover-resize-btn';
  resizeBtn.innerHTML = '&#9634;';
  resizeBtn.title = 'Reset size (500\u00D7500)';
  resizeBtn.style.cssText = 'cursor:pointer;font-size:16px;padding:0 4px;opacity:0.6;transition:opacity 0.2s;line-height:1;';
  resizeBtn.addEventListener('mouseenter', () => { resizeBtn.style.opacity = '1'; });
  resizeBtn.addEventListener('mouseleave', () => { resizeBtn.style.opacity = '0.6'; });
  resizeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const tt = resizeBtn.closest('.wikihover-tooltip, .wikihover-pinned-tooltip');
    if (tt) {
      // Exit fullscreen if active before resizing
      if (tt.classList.contains('wikihover-fullscreen')) {
        tt.classList.remove('wikihover-fullscreen');
        const savedLeft = tt.dataset.whFsLeft;
        const savedTop = tt.dataset.whFsTop;
        if (savedLeft) tt.style.setProperty('left', savedLeft, 'important');
        if (savedTop) tt.style.setProperty('top', savedTop, 'important');
        delete tt.dataset.whFsLeft;
        delete tt.dataset.whFsTop;
        delete tt.dataset.whFsWidth;
        delete tt.dataset.whFsHeight;
        const fsBtn = tt.querySelector('.wikihover-fullscreen-btn');
        if (fsBtn) { fsBtn.innerHTML = '&#x26F6;'; fsBtn.title = 'Toggle fullscreen'; }
      }
      applyTooltipSize(tt, 500, 500);
      safeStorageSet({ tooltipSize: { width: 500, height: 500 } });
      tooltipHideGraceUntil = Date.now() + 2000;
    }
  });
  headerButtons.appendChild(resizeBtn);

  const dupPinBtn = document.createElement('span');
  dupPinBtn.className = 'wikihover-duplicate-pin';
  dupPinBtn.innerHTML = '&#x29C9;';
  dupPinBtn.title = 'Duplicate & pin';
  dupPinBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    duplicateAndPinTooltip(dupPinBtn.closest('.wikihover-tooltip, .wikihover-pinned-tooltip'));
  });
  headerButtons.appendChild(dupPinBtn);

  const pinButton = document.createElement('span');
  pinButton.className = 'wikihover-pin';
  pinButton.innerHTML = '&#128204;';
  pinButton.title = 'Pin tooltip';
  pinButton.addEventListener('click', (e) => {
    e.stopPropagation();
    pinCurrentTooltip();
  });
  headerButtons.appendChild(pinButton);

  const unmarkButton = document.createElement('span');
  unmarkButton.className = 'wikihover-unmark';
  unmarkButton.innerHTML = '&#128683;';
  unmarkButton.title = 'Unmark this name';
  unmarkButton.addEventListener('click', (e) => {
    e.stopPropagation();
    unmarkCurrentName();
  });
  headerButtons.appendChild(unmarkButton);

  const closeButton = document.createElement('span');
  closeButton.className = 'wikihover-close';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', hideTooltip);
  headerButtons.appendChild(closeButton);

  header.appendChild(headerButtons);

  tooltipElement.appendChild(header);

  // Create sidebar
  const tabs = document.createElement('div');
  tabs.className = 'wikihover-sidebar';

  const tabDefs = [
    { key: 'wiki', label: 'Wikipedia', favicon: 'https://www.google.com/s2/favicons?domain=wikipedia.org&sz=128', active: true },
    { key: 'tvmaze', label: 'TVMaze', favicon: 'https://www.google.com/s2/favicons?domain=tvmaze.com&sz=128' },
    { key: 'imdb', label: 'IMDb', favicon: 'https://www.google.com/s2/favicons?domain=imdb.com&sz=128' },
    { key: 'books', label: 'Books', favicon: 'https://www.google.com/s2/favicons?domain=openlibrary.org&sz=128' },
    { key: 'instagram', label: 'Instagram', favicon: 'https://www.google.com/s2/favicons?domain=instagram.com&sz=128' },
    { key: 'twitter', label: 'X', favicon: 'https://www.google.com/s2/favicons?domain=x.com&sz=128' },
    { key: 'football', label: 'Football', favicon: 'https://www.google.com/s2/favicons?domain=api-football.com&sz=128' },
    { key: 'tiktok', label: 'TikTok', favicon: 'https://www.google.com/s2/favicons?domain=tiktok.com&sz=128' },
    { key: 'pinterest', label: 'Pinterest', favicon: 'https://www.google.com/s2/favicons?domain=pinterest.com&sz=128' },
  ];

  // Sort tabs by user's saved order
  if (tabOrder && tabOrder.length) {
    tabDefs.sort((a, b) => {
      const aIdx = tabOrder.indexOf(TAB_TO_SETTING[a.key]);
      const bIdx = tabOrder.indexOf(TAB_TO_SETTING[b.key]);
      return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
    });
  }

  const tabElements = {};
  tabDefs.forEach(def => {
    const tab = document.createElement('button');
    tab.className = 'wikihover-tab' + (def.active ? ' active' : '');
    tab.setAttribute('data-tab', def.key);
    tab.title = def.label;
    tab.setAttribute('aria-label', def.label);
    const wrap = document.createElement('div');
    wrap.className = 'wikihover-tab-favicon-wrap';
    const bwImg = document.createElement('img');
    bwImg.src = def.favicon;
    bwImg.alt = def.label;
    bwImg.className = 'wikihover-tab-favicon-bw';
    wrap.appendChild(bwImg);
    const colorDiv = document.createElement('div');
    colorDiv.className = 'wikihover-tab-favicon-color' + (def.key === 'wiki' ? ' wikihover-tab-favicon-revealed' : '');
    const colorImg = document.createElement('img');
    colorImg.src = def.favicon;
    colorImg.alt = def.label;
    colorDiv.appendChild(colorImg);
    wrap.appendChild(colorDiv);
    tab.appendChild(wrap);
    tab.addEventListener('click', () => switchTab(def.key));
    tabs.appendChild(tab);
    tabElements[def.key] = tab;
  });
  const wikiTab = tabElements.wiki;
  const tvMazeTab = tabElements.tvmaze;
  const imdbTab = tabElements.imdb;
  const booksTab = tabElements.books;
  const instagramTab = tabElements.instagram;
  const twitterTab = tabElements.twitter;
  const footballTab = tabElements.football;
  const tiktokTab = tabElements.tiktok;
  const pinterestTab = tabElements.pinterest;

  // Create body wrapper (sidebar + content side by side)
  const body = document.createElement('div');
  body.className = 'wikihover-body';
  body.appendChild(tabs);

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'wikihover-content-container';

  const wikiContent = document.createElement('div');
  wikiContent.className = 'wikihover-content wikihover-wiki-content active';
  contentContainer.appendChild(wikiContent);

  const tvMazeContent = document.createElement('div');
  tvMazeContent.className = 'wikihover-content wikihover-tvmaze-content';
  contentContainer.appendChild(tvMazeContent);

  const imdbContent = document.createElement('div');
  imdbContent.className = 'wikihover-content wikihover-imdb-content';
  contentContainer.appendChild(imdbContent);

  const booksContent = document.createElement('div');
  booksContent.className = 'wikihover-content wikihover-books-content';
  contentContainer.appendChild(booksContent);

  const instagramContent = document.createElement('div');
  instagramContent.className = 'wikihover-content wikihover-instagram-content';
  contentContainer.appendChild(instagramContent);

  const twitterContent = document.createElement('div');
  twitterContent.className = 'wikihover-content wikihover-twitter-content';
  contentContainer.appendChild(twitterContent);

  const footballContent = document.createElement('div');
  footballContent.className = 'wikihover-content wikihover-football-content';
  contentContainer.appendChild(footballContent);

  const tiktokContent = document.createElement('div');
  tiktokContent.className = 'wikihover-content wikihover-tiktok-content';
  contentContainer.appendChild(tiktokContent);

  const pinterestContent = document.createElement('div');
  pinterestContent.className = 'wikihover-content wikihover-pinterest-content';
  contentContainer.appendChild(pinterestContent);

  body.appendChild(contentContainer);
  tooltipElement.appendChild(body);

  // Powered by bar
  const poweredBy = document.createElement('div');
  poweredBy.className = 'wikihover-powered-by';
  const poweredLink = document.createElement('a');
  poweredLink.href = 'https://wikihover.com';
  poweredLink.target = '_blank';
  poweredLink.textContent = 'Powered by WikiHover';
  poweredBy.appendChild(poweredLink);
  tooltipElement.appendChild(poweredBy);

  // Resize handle (bottom-right corner)
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'wikihover-resize-handle';
  tooltipElement.appendChild(resizeHandle);

  document.body.appendChild(tooltipElement);

  // Restore saved tooltip size
  safeStorageGet(['tooltipSize']).then(result => {
    if (result.tooltipSize) {
      applyTooltipSize(tooltipElement, result.tooltipSize.width, result.tooltipSize.height);
    }
  });

  makeResizable(tooltipElement, resizeHandle);
  makeDraggable(tooltipElement);

  // Switch to first enabled tab in user's order
  const firstEnabledInit = tabDefs.find(d => dataSourceSettings[TAB_TO_SETTING[d.key]] !== false);
  switchTab(firstEnabledInit ? firstEnabledInit.key : 'wiki');

  // Single click handler for closing tooltip
  document.addEventListener('click', function(e) {
    if (isTooltipVisible && !isTooltipElement(e.target) && !currentHoveredElement?.contains(e.target)) {
      hideTooltip();
    }
  });

  // Hide tooltip when mouse leaves both tooltip and the hovered name
  let tooltipLeaveTimeout = null;

  tooltipElement.addEventListener('mouseleave', () => {
    tooltipLeaveTimeout = setTimeout(() => {
      if (Date.now() - lastRepositionTime < REPOSITION_GRACE_MS) return;
      if (isTooltipVisible && !isMouseOverTooltip() && !isMouseOverHoveredName()) {
        hideTooltip();
      }
    }, 900);
  });

  tooltipElement.addEventListener('mouseenter', () => {
    clearTimeout(tooltipLeaveTimeout);
  });

  hideTooltip();
}

// Pin the current tooltip as a fixed, independent copy
function pinCurrentTooltip() {
  if (!tooltipElement || !isTooltipVisible) return;
  if (pinnedTooltips.length >= MAX_PINNED_TOOLTIPS) return;

  const pinnedName = tooltipElement.querySelector('.wikihover-title').textContent;
  const pinnedFetchedTabs = new Set(fetchedTabs);

  // Create a new pinned container and MOVE (not clone) all children from the original.
  // Moving preserves video elements with their playback state and all content-level
  // event handlers (hover-to-play, click-to-expand, expanded player controls, etc.).
  const pinned = document.createElement('div');
  pinned.className = 'wikihover-pinned-tooltip';
  pinned.setAttribute('data-wikihover-tooltip', 'true');
  pinned.setAttribute('data-tooltip-name', pinnedName);
  pinned.setAttribute('id', 'wikihover-pinned-' + Date.now());

  // Copy theme attribute to pinned tooltip
  const currentTheme = tooltipElement.getAttribute('data-wikihover-theme');
  if (currentTheme) {
    pinned.setAttribute('data-wikihover-theme', currentTheme);
  }

  // Position at the same viewport location with exact same dimensions.
  // Must use setProperty with 'important' to override the CSS !important rules
  // on .wikihover-pinned-tooltip (width: 482px !important, max-height: 750px !important).
  const rect = tooltipElement.getBoundingClientRect();
  pinned.style.setProperty('position', 'fixed', 'important');
  pinned.style.setProperty('left', rect.left + 'px', 'important');
  pinned.style.setProperty('top', rect.top + 'px', 'important');
  pinned.style.setProperty('width', rect.width + 'px', 'important');
  pinned.style.setProperty('height', rect.height + 'px', 'important');
  pinned.style.setProperty('max-height', rect.height + 'px', 'important');
  pinned.style.setProperty('display', 'flex', 'important');
  pinned.style.setProperty('visibility', 'visible', 'important');
  pinned.style.setProperty('opacity', '1', 'important');
  pinned.style.setProperty('z-index', '9999999', 'important');

  // Move all children from the original tooltip to the pinned container.
  // This transfers the actual DOM nodes (not copies), so videos keep playing
  // and all event handlers on content elements remain attached.
  while (tooltipElement.firstChild) {
    pinned.appendChild(tooltipElement.firstChild);
  }

  // Remove pin button and duplicate-pin button (already pinned)
  const pinnedPinBtn = pinned.querySelector('.wikihover-pin');
  if (pinnedPinBtn) pinnedPinBtn.remove();
  const pinnedDupPinBtn = pinned.querySelector('.wikihover-duplicate-pin');
  if (pinnedDupPinBtn) pinnedDupPinBtn.remove();

  // Replace close button (clone removes old hideTooltip listener, add pinned-specific one)
  const oldCloseBtn = pinned.querySelector('.wikihover-close');
  if (oldCloseBtn) {
    const newCloseBtn = oldCloseBtn.cloneNode(true);
    newCloseBtn.addEventListener('click', () => {
      // Pause videos before removing
      pinned.querySelectorAll('video').forEach(v => { v.pause(); v.removeAttribute('src'); v.load(); });
      pinned.remove();
      pinnedTooltips = pinnedTooltips.filter(p => p !== pinned);
    });
    oldCloseBtn.parentNode.replaceChild(newCloseBtn, oldCloseBtn);
  }

  // Replace tab buttons (clone removes old switchTab listeners, add pinned-specific ones)
  pinned.querySelectorAll('.wikihover-tab').forEach(oldTab => {
    const newTab = oldTab.cloneNode(true);
    newTab.addEventListener('click', () => {
      const tabName = newTab.getAttribute('data-tab');
      // Save state of any playing videos before switching away
      pinned.querySelectorAll('video').forEach(v => {
        if (v.src && !v.paused) {
          v.dataset.whSavedSrc = v.src;
          v.dataset.whSavedTime = v.currentTime;
          v.dataset.whSavedMuted = v.muted;
        }
        v.pause();
      });
      // Switch visible content
      pinned.querySelectorAll('.wikihover-content').forEach(c => {
        c.style.display = 'none';
        c.style.visibility = 'hidden';
        c.style.opacity = '0';
        c.classList.remove('active');
      });
      pinned.querySelectorAll('.wikihover-tab').forEach(t => t.classList.remove('active'));
      newTab.classList.add('active');
      const selectedContent = pinned.querySelector(`.wikihover-${tabName}-content`);
      if (selectedContent) {
        selectedContent.style.display = 'block';
        selectedContent.style.visibility = 'visible';
        selectedContent.style.opacity = '1';
        selectedContent.classList.add('active');

        // Resume any video that was playing before tab switch
        const expandedVideo = selectedContent.querySelector('video[data-wh-saved-src]');
        if (expandedVideo) {
          const savedSrc = expandedVideo.dataset.whSavedSrc;
          const savedTime = parseFloat(expandedVideo.dataset.whSavedTime) || 0;
          const savedMuted = expandedVideo.dataset.whSavedMuted === 'true';
          delete expandedVideo.dataset.whSavedSrc;
          delete expandedVideo.dataset.whSavedTime;
          delete expandedVideo.dataset.whSavedMuted;
          expandedVideo.src = savedSrc;
          expandedVideo.muted = savedMuted;
          expandedVideo.addEventListener('loadeddata', function onLoaded() {
            expandedVideo.removeEventListener('loadeddata', onLoaded);
            expandedVideo.currentTime = savedTime;
            expandedVideo.play().catch(() => {});
          });
          expandedVideo.load();
        }
      }

      // Lazy load data for this tab if not yet fetched for this pinned tooltip
      if (!pinnedFetchedTabs.has(tabName) && tabName !== 'wiki') {
        pinnedFetchedTabs.add(tabName);
        fetchPinnedTabData(pinned, tabName, pinnedName);
      }
    });
    oldTab.parentNode.replaceChild(newTab, oldTab);
  });

  // Replace resize handle (clone removes old mousedown listener that references old tooltipElement)
  const oldResizeHandle = pinned.querySelector('.wikihover-resize-handle');
  if (oldResizeHandle) {
    const newResizeHandle = oldResizeHandle.cloneNode(true);
    oldResizeHandle.parentNode.replaceChild(newResizeHandle, oldResizeHandle);
    makeResizable(pinned, newResizeHandle);
  }

  // Make pinned tooltip draggable
  makeDraggable(pinned);

  // Apply tab visibility to pinned tooltip
  updateTabVisibility(pinned);

  document.body.appendChild(pinned);
  pinnedTooltips.push(pinned);

  // Enforce max pinned limit
  while (pinnedTooltips.length > MAX_PINNED_TOOLTIPS) {
    const oldest = pinnedTooltips.shift();
    oldest.remove();
  }

  const pinnedSidebar = pinned.querySelector('.wikihover-sidebar');

  // Clean up the now-empty original tooltip.
  // We can't call hideTooltip() because it tries to access children (title, content, etc.)
  // that were moved to the pinned container. Instead, remove the empty shell and reset state.
  tooltipElement.remove();
  tooltipElement = null;
  isTooltipVisible = false;
  stopTrackingMouse();
}

// Duplicate the tooltip content into a new pinned tooltip, keeping the original open
function duplicateAndPinTooltip(sourceTooltip) {
  if (!sourceTooltip) return;
  if (pinnedTooltips.length >= MAX_PINNED_TOOLTIPS) return;

  const pinnedName = sourceTooltip.querySelector('.wikihover-title')?.textContent;
  if (!pinnedName) return;

  // Determine which tabs have been fetched on the source
  const sourceFetchedTabs = sourceTooltip === tooltipElement
    ? new Set(fetchedTabs)
    : new Set(); // for pinned sources, all visible content is already in the DOM
  // For pinned sources, detect fetched tabs by checking for non-loading content
  if (sourceTooltip !== tooltipElement) {
    sourceTooltip.querySelectorAll('.wikihover-content').forEach(c => {
      const cls = Array.from(c.classList).find(cl => cl.startsWith('wikihover-') && cl.endsWith('-content') && cl !== 'wikihover-content');
      if (cls) {
        const tabKey = cls.replace('wikihover-', '').replace('-content', '');
        if (c.innerHTML.trim() && !c.querySelector('.wikihover-loading')) {
          sourceFetchedTabs.add(tabKey);
        }
      }
    });
  }
  const pinnedFetchedTabs = new Set(sourceFetchedTabs);

  const pinned = document.createElement('div');
  pinned.className = 'wikihover-pinned-tooltip';
  pinned.setAttribute('data-wikihover-tooltip', 'true');
  pinned.setAttribute('data-tooltip-name', pinnedName);
  pinned.setAttribute('id', 'wikihover-pinned-' + Date.now());

  // Copy theme attribute
  const currentTheme = sourceTooltip.getAttribute('data-wikihover-theme');
  if (currentTheme) pinned.setAttribute('data-wikihover-theme', currentTheme);

  // Position offset from source so it's visually distinct
  const rect = sourceTooltip.getBoundingClientRect();
  pinned.style.setProperty('position', 'fixed', 'important');
  pinned.style.setProperty('left', Math.min(rect.left + 20, window.innerWidth - rect.width) + 'px', 'important');
  pinned.style.setProperty('top', Math.min(rect.top + 20, window.innerHeight - rect.height) + 'px', 'important');
  pinned.style.setProperty('width', rect.width + 'px', 'important');
  pinned.style.setProperty('height', rect.height + 'px', 'important');
  pinned.style.setProperty('max-height', rect.height + 'px', 'important');
  pinned.style.setProperty('display', 'flex', 'important');
  pinned.style.setProperty('visibility', 'visible', 'important');
  pinned.style.setProperty('opacity', '1', 'important');
  pinned.style.setProperty('z-index', '9999999', 'important');

  // Clone all children (deep copy — original stays intact)
  Array.from(sourceTooltip.children).forEach(child => {
    pinned.appendChild(child.cloneNode(true));
  });

  // Remove pin button from clone (already pinned)
  const clonedPinBtn = pinned.querySelector('.wikihover-pin');
  if (clonedPinBtn) clonedPinBtn.remove();

  // Pause cloned videos and clear src to avoid duplicate streaming
  pinned.querySelectorAll('video').forEach(v => {
    v.pause();
    v.removeAttribute('src');
    v.load();
  });

  // Re-wire close button
  const oldCloseBtn = pinned.querySelector('.wikihover-close');
  if (oldCloseBtn) {
    const newCloseBtn = oldCloseBtn.cloneNode(true);
    newCloseBtn.addEventListener('click', () => {
      pinned.querySelectorAll('video').forEach(v => { v.pause(); v.removeAttribute('src'); v.load(); });
      pinned.remove();
      pinnedTooltips = pinnedTooltips.filter(p => p !== pinned);
    });
    oldCloseBtn.parentNode.replaceChild(newCloseBtn, oldCloseBtn);
  }

  // Re-wire fullscreen button
  const oldFsBtn = pinned.querySelector('.wikihover-fullscreen-btn');
  if (oldFsBtn) {
    const newFsBtn = oldFsBtn.cloneNode(true);
    newFsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tt = pinned;
      const isFs = tt.classList.contains('wikihover-fullscreen');
      if (isFs) {
        tt.classList.remove('wikihover-fullscreen');
        tt.style.setProperty('left', tt.dataset.whFsLeft, 'important');
        tt.style.setProperty('top', tt.dataset.whFsTop, 'important');
        applyTooltipSize(tt, parseFloat(tt.dataset.whFsWidth), parseFloat(tt.dataset.whFsHeight));
        delete tt.dataset.whFsLeft;
        delete tt.dataset.whFsTop;
        delete tt.dataset.whFsWidth;
        delete tt.dataset.whFsHeight;
        newFsBtn.innerHTML = '\u26F6';
        newFsBtn.title = 'Toggle fullscreen';
      } else {
        const r = tt.getBoundingClientRect();
        tt.dataset.whFsLeft = tt.style.getPropertyValue('left') || r.left + 'px';
        tt.dataset.whFsTop = tt.style.getPropertyValue('top') || r.top + 'px';
        tt.dataset.whFsWidth = r.width;
        tt.dataset.whFsHeight = r.height;
        tt.classList.add('wikihover-fullscreen');
        applyTooltipSize(tt, window.innerWidth, window.innerHeight);
        newFsBtn.innerHTML = '\u29C4';
        newFsBtn.title = 'Exit fullscreen';
      }
    });
    oldFsBtn.parentNode.replaceChild(newFsBtn, oldFsBtn);
  }

  // Re-wire duplicate-pin button (so you can duplicate from a pinned tooltip)
  const oldDupBtn = pinned.querySelector('.wikihover-duplicate-pin');
  if (oldDupBtn) {
    const newDupBtn = oldDupBtn.cloneNode(true);
    newDupBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      duplicateAndPinTooltip(pinned);
    });
    oldDupBtn.parentNode.replaceChild(newDupBtn, oldDupBtn);
  }

  // Re-wire resize button
  const oldResizeBtn = pinned.querySelector('.wikihover-resize-btn');
  if (oldResizeBtn) {
    const newResizeBtn = oldResizeBtn.cloneNode(true);
    newResizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (pinned.classList.contains('wikihover-fullscreen')) {
        pinned.classList.remove('wikihover-fullscreen');
        const savedLeft = pinned.dataset.whFsLeft;
        const savedTop = pinned.dataset.whFsTop;
        if (savedLeft) pinned.style.setProperty('left', savedLeft, 'important');
        if (savedTop) pinned.style.setProperty('top', savedTop, 'important');
        delete pinned.dataset.whFsLeft;
        delete pinned.dataset.whFsTop;
        delete pinned.dataset.whFsWidth;
        delete pinned.dataset.whFsHeight;
        const fsBtn = pinned.querySelector('.wikihover-fullscreen-btn');
        if (fsBtn) { fsBtn.innerHTML = '&#x26F6;'; fsBtn.title = 'Toggle fullscreen'; }
      }
      applyTooltipSize(pinned, 500, 500);
    });
    newResizeBtn.addEventListener('mouseenter', () => { newResizeBtn.style.opacity = '1'; });
    newResizeBtn.addEventListener('mouseleave', () => { newResizeBtn.style.opacity = '0.6'; });
    oldResizeBtn.parentNode.replaceChild(newResizeBtn, oldResizeBtn);
  }

  // Re-wire tab buttons
  pinned.querySelectorAll('.wikihover-tab').forEach(oldTab => {
    const newTab = oldTab.cloneNode(true);
    newTab.addEventListener('click', () => {
      const tabName = newTab.getAttribute('data-tab');
      pinned.querySelectorAll('video').forEach(v => {
        if (v.src && !v.paused) {
          v.dataset.whSavedSrc = v.src;
          v.dataset.whSavedTime = v.currentTime;
          v.dataset.whSavedMuted = v.muted;
        }
        v.pause();
      });
      pinned.querySelectorAll('.wikihover-content').forEach(c => {
        c.style.display = 'none';
        c.style.visibility = 'hidden';
        c.style.opacity = '0';
        c.classList.remove('active');
      });
      pinned.querySelectorAll('.wikihover-tab').forEach(t => t.classList.remove('active'));
      newTab.classList.add('active');
      const selectedContent = pinned.querySelector(`.wikihover-${tabName}-content`);
      if (selectedContent) {
        selectedContent.style.display = 'block';
        selectedContent.style.visibility = 'visible';
        selectedContent.style.opacity = '1';
        selectedContent.classList.add('active');
        const expandedVideo = selectedContent.querySelector('video[data-wh-saved-src]');
        if (expandedVideo) {
          const savedSrc = expandedVideo.dataset.whSavedSrc;
          const savedTime = parseFloat(expandedVideo.dataset.whSavedTime) || 0;
          const savedMuted = expandedVideo.dataset.whSavedMuted === 'true';
          delete expandedVideo.dataset.whSavedSrc;
          delete expandedVideo.dataset.whSavedTime;
          delete expandedVideo.dataset.whSavedMuted;
          expandedVideo.src = savedSrc;
          expandedVideo.muted = savedMuted;
          expandedVideo.addEventListener('loadeddata', function onLoaded() {
            expandedVideo.removeEventListener('loadeddata', onLoaded);
            expandedVideo.currentTime = savedTime;
            expandedVideo.play().catch(() => {});
          });
          expandedVideo.load();
        }
      }
      if (!pinnedFetchedTabs.has(tabName) && tabName !== 'wiki') {
        pinnedFetchedTabs.add(tabName);
        fetchPinnedTabData(pinned, tabName, pinnedName);
      }
    });
    oldTab.parentNode.replaceChild(newTab, oldTab);
  });

  // Initialize per-pinned navigation history
  pinned._navHistory = [pinnedName];
  pinned._navIndex = 0;

  // Re-wire back/forward nav buttons for pinned tooltip
  const navBtns = pinned.querySelectorAll('[title="Back"], [title="Forward"]');
  navBtns.forEach(oldBtn => {
    const newBtn = oldBtn.cloneNode(true);
    const isBack = newBtn.title === 'Back';
    newBtn.addEventListener('mouseenter', () => { newBtn.style.color = '#0645AD'; newBtn.style.background = 'rgba(6,69,173,0.08)'; });
    newBtn.addEventListener('mouseleave', () => { newBtn.style.color = '#999'; newBtn.style.background = 'transparent'; });
    newBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isBack && pinned._navIndex > 0) {
        pinned._navIndex--;
        navigateInPinnedTooltip(pinned, pinned._navHistory[pinned._navIndex], true);
      } else if (!isBack && pinned._navIndex < pinned._navHistory.length - 1) {
        pinned._navIndex++;
        navigateInPinnedTooltip(pinned, pinned._navHistory[pinned._navIndex], true);
      }
    });
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
  });

  // Re-wire resize handle
  const oldResizeHandle = pinned.querySelector('.wikihover-resize-handle');
  if (oldResizeHandle) {
    const newResizeHandle = oldResizeHandle.cloneNode(true);
    oldResizeHandle.parentNode.replaceChild(newResizeHandle, oldResizeHandle);
    makeResizable(pinned, newResizeHandle);
  }

  // Make draggable
  makeDraggable(pinned);

  // Apply tab visibility
  updateTabVisibility(pinned);

  // Re-render content tabs from cached data to restore event handlers.
  // cloneNode(true) copies DOM structure but NOT event listeners, so interactive
  // elements (video hover-to-play, click-to-expand, load-more, player controls)
  // are dead in the cloned DOM. Re-rendering creates fresh handlers.
  const cachedData = tooltipDataCache[pinnedName];
  if (cachedData) {
    for (const tabKey of pinnedFetchedTabs) {
      if (tabKey === 'wiki') continue; // Wiki content is static HTML — clone is fine
      const container = pinned.querySelector(`.wikihover-${tabKey}-content`);
      if (container && cachedData[tabKey]) {
        renderTabData(container, tabKey, cachedData[tabKey], pinnedName);
      }
    }
  }

  document.body.appendChild(pinned);
  pinnedTooltips.push(pinned);

  // Enforce max pinned limit
  while (pinnedTooltips.length > MAX_PINNED_TOOLTIPS) {
    const oldest = pinnedTooltips.shift();
    oldest.remove();
  }

  const pinnedSidebar = pinned.querySelector('.wikihover-sidebar');

  tooltipHideGraceUntil = Date.now() + 2000;
}

// Fetch and render data for a tab in a pinned tooltip (independent of the active tooltip)
function fetchPinnedTabData(pinnedEl, tabName, name) {
  const container = pinnedEl.querySelector(`.wikihover-${tabName}-content`);
  if (!container) return;

  // Check per-name data cache first
  const cached = tooltipDataCache[name] && tooltipDataCache[name][tabName];
  if (cached) {
    revealTabIconColor(pinnedEl, tabName);
    renderTabData(container, tabName, cached, name);
    if (!dataHasContent(tabName, cached)) hideTabButton(pinnedEl, tabName);
    return;
  }

  // Fetch fresh data
  const fetchMap = {
    tvmaze: () => dataSourceSettings.tvmaze ? fetchTVMazeData(name) : null,
    imdb: () => dataSourceSettings.imdb ? fetchIMDbData(name) : null,
    books: () => dataSourceSettings.books ? fetchBooksData(name) : null,
    instagram: () => dataSourceSettings.instagram ? fetchInstagramData(name) : null,
    twitter: () => dataSourceSettings.twitter ? fetchTwitterData(name) : null,
    football: () => dataSourceSettings.football ? fetchFootballData(name) : null,
    tiktok: () => dataSourceSettings.tiktok ? fetchTikTokData(name) : null,
    pinterest: () => dataSourceSettings.pinterest ? fetchPinterestData(name) : null,
  };

  const fetcher = fetchMap[tabName];
  if (!fetcher) return;

  const fetchPromise = fetcher();
  if (!fetchPromise) {
    container.innerHTML = `<p>${tabName} data source is disabled in settings.</p>`;
    revealTabIconColor(pinnedEl, tabName);
    return;
  }

  fetchPromise.then(data => {
    revealTabIconColor(pinnedEl, tabName);
    // Store in per-name cache
    if (!tooltipDataCache[name]) tooltipDataCache[name] = {};
    tooltipDataCache[name][tabName] = data;
    // Render into the pinned tooltip's container
    renderTabData(container, tabName, data, name);
    if (!dataHasContent(tabName, data)) hideTabButton(pinnedEl, tabName);
  }).catch(err => {
    revealTabIconColor(pinnedEl, tabName);
    container.innerHTML = `<p>Error loading data: ${err.message}</p>`;
  });
}

// Render fetched data into a tab container using the existing update functions
function renderTabData(container, tabName, data, name) {
  switch (tabName) {
    case 'tvmaze': updateTVMazeContent(container, data, name); break;
    case 'imdb': updateIMDbContent(container, data, name); break;
    case 'books': updateBooksContent(container, data, name); break;
    case 'instagram': updateInstagramContent(container, data, name); break;
    case 'twitter': updateTwitterContent(container, data, name); break;
    case 'football': updateFootballContent(container, data, name); break;
    case 'tiktok': updateTikTokContent(container, data, name); break;
    case 'pinterest': updatePinterestContent(container, data, name); break;
  }
}

// Make a tooltip element draggable by its header
function makeDraggable(tooltipEl) {
  const header = tooltipEl.querySelector('.wikihover-header');
  if (!header) return;

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener('mousedown', (e) => {
    // Don't start drag if clicking on buttons
    if (e.target.closest('.wikihover-close') || e.target.closest('.wikihover-pin')) return;

    isDragging = true;
    const rect = tooltipEl.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    // Exit fullscreen if dragging while fullscreen
    if (tooltipEl.classList.contains('wikihover-fullscreen')) {
      tooltipEl.classList.remove('wikihover-fullscreen');
      delete tooltipEl.dataset.whFsLeft;
      delete tooltipEl.dataset.whFsTop;
      delete tooltipEl.dataset.whFsWidth;
      delete tooltipEl.dataset.whFsHeight;
      const fsBtn = tooltipEl.querySelector('.wikihover-fullscreen-btn');
      if (fsBtn) { fsBtn.innerHTML = '&#x26F6;'; fsBtn.title = 'Toggle fullscreen'; }
    }

    // Switch to fixed positioning on first drag move
    tooltipEl.style.setProperty('position', 'fixed', 'important');
    tooltipEl.style.setProperty('left', (e.clientX - offsetX) + 'px', 'important');
    tooltipEl.style.setProperty('top', (e.clientY - offsetY) + 'px', 'important');
    tooltipEl.setAttribute('data-dragged', 'true');
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

function getContentContainerHeight(tooltipEl, totalH) {
  // Calculate height used by non-content siblings (header, footer, powered-by)
  // Exclude .wikihover-body (it IS the content area) and .wikihover-resize-handle
  let usedH = 0;
  const cc = tooltipEl.querySelector('.wikihover-content-container');
  const body = tooltipEl.querySelector('.wikihover-body');
  Array.from(tooltipEl.children).forEach(child => {
    if (child !== cc && child !== body && child.classList && !child.classList.contains('wikihover-resize-handle')) {
      usedH += child.offsetHeight || 0;
    }
  });
  return Math.max(50, totalH - usedH - 4);
}

// Get usable inner height for expanded players: tooltip height minus siblings minus padding
function getExpandedPlayerHeight(contentContainer) {
  if (!contentContainer) return 350;
  const tooltipEl = contentContainer.closest('.wikihover-tooltip, .wikihover-pinned-tooltip');
  if (!tooltipEl) return 350;
  const tooltipH = tooltipEl.offsetHeight || tooltipEl.getBoundingClientRect().height;
  if (tooltipH < 100) return 350;
  const ccH = getContentContainerHeight(tooltipEl, tooltipH);
  const style = getComputedStyle(contentContainer);
  const pad = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
  return Math.max(150, Math.floor(ccH - pad));
}

function applyTooltipSize(tooltipEl, width, height) {
  if (width) tooltipEl.style.setProperty('width', width + 'px', 'important');
  if (height) {
    tooltipEl.style.setProperty('max-height', height + 'px', 'important');
    tooltipEl.style.setProperty('height', height + 'px', 'important');
    const cc = tooltipEl.querySelector('.wikihover-content-container');
    const body = tooltipEl.querySelector('.wikihover-body');
    if (cc) {
      const ccH = getContentContainerHeight(tooltipEl, height);
      if (body) {
        body.style.setProperty('max-height', ccH + 'px', 'important');
        body.style.setProperty('height', ccH + 'px', 'important');
      }
      cc.style.setProperty('max-height', ccH + 'px', 'important');
      cc.style.setProperty('height', ccH + 'px', 'important');

      // Resize any visible expanded player (subtract padding so it fits without scrolling)
      const ccPadStyle = getComputedStyle(cc);
      const ccPad = (parseFloat(ccPadStyle.paddingTop) || 0) + (parseFloat(ccPadStyle.paddingBottom) || 0);
      const expandH = Math.floor(ccH - ccPad);
      cc.querySelectorAll('.wikihover-reel-expanded-player, .wikihover-tiktok-expanded-player, .wikihover-imdb-expanded-player').forEach(player => {
        if (player.style.display !== 'none') {
          player.style.height = expandH + 'px';
          player.style.maxHeight = expandH + 'px';
          const video = player.querySelector('video');
          if (video) video.style.height = expandH + 'px';
          const img = player.querySelector('img');
          if (img) img.style.height = expandH + 'px';
        }
      });
    }
  }
}

function makeResizable(tooltipEl, handle) {
  let isResizing = false;
  let startX, startY, startW, startH;
  let resizeSaveTimeout = null;

  handle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing = true;
    const rect = tooltipEl.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startW = rect.width;
    startH = rect.height;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    e.preventDefault();
    const newW = Math.max(320, startW + (e.clientX - startX));
    const newH = Math.max(200, startH + (e.clientY - startY));
    applyTooltipSize(tooltipEl, newW, newH);
  });

  document.addEventListener('mouseup', () => {
    if (!isResizing) return;
    isResizing = false;
    clearTimeout(resizeSaveTimeout);
    resizeSaveTimeout = setTimeout(() => {
      const rect = tooltipEl.getBoundingClientRect();
      safeStorageSet({ tooltipSize: { width: Math.round(rect.width), height: Math.round(rect.height) } });
    }, 300);
  });
}

// Map tab keys to dataSourceSettings keys
const TAB_TO_SETTING = {
  wiki: 'wikipedia',
  tvmaze: 'tvmaze',
  imdb: 'imdb',
  books: 'books',
  instagram: 'instagram',
  twitter: 'twitter',
  football: 'football',
  tiktok: 'tiktok',
  pinterest: 'pinterest'
};

// Get the first enabled tab key based on user's tab order
function getFirstEnabledTabKey() {
  if (tabOrder && tabOrder.length) {
    // tabOrder uses setting keys, convert to tab keys
    const settingToTab = {};
    for (const [tabKey, settingKey] of Object.entries(TAB_TO_SETTING)) {
      settingToTab[settingKey] = tabKey;
    }
    for (const settingKey of tabOrder) {
      if (dataSourceSettings[settingKey] !== false && settingToTab[settingKey]) {
        return settingToTab[settingKey];
      }
    }
  }
  // Fallback: find first enabled from default order
  for (const [tabKey, settingKey] of Object.entries(TAB_TO_SETTING)) {
    if (dataSourceSettings[settingKey] !== false) return tabKey;
  }
  return 'wiki';
}

// Reorder tab buttons in an existing tooltip based on tabOrder
function reorderTooltipTabs(tooltipEl) {
  if (!tabOrder || !tabOrder.length) return;
  const tabsContainer = tooltipEl.querySelector('.wikihover-sidebar');
  if (!tabsContainer) return;
  const tabButtons = [...tabsContainer.querySelectorAll('.wikihover-tab')];
  tabButtons.sort((a, b) => {
    const aKey = TAB_TO_SETTING[a.getAttribute('data-tab')];
    const bKey = TAB_TO_SETTING[b.getAttribute('data-tab')];
    const aIdx = tabOrder.indexOf(aKey);
    const bIdx = tabOrder.indexOf(bKey);
    return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
  });
  tabButtons.forEach(btn => tabsContainer.appendChild(btn));
}

// Show/hide tabs based on current dataSourceSettings
function updateTabVisibility(tooltipEl) {
  if (!tooltipEl) return;
  tooltipEl.querySelectorAll('.wikihover-tab').forEach(tab => {
    const tabKey = tab.getAttribute('data-tab');
    const settingKey = TAB_TO_SETTING[tabKey];
    const disabled = settingKey && dataSourceSettings[settingKey] === false;
    tab.style.setProperty('display', disabled ? 'none' : '', 'important');

    // Also hide the content area for disabled tabs
    const contentEl = tooltipEl.querySelector(`.wikihover-${tabKey}-content`);
    if (contentEl && disabled) {
      contentEl.style.setProperty('display', 'none', 'important');
      contentEl.style.visibility = 'hidden';
      contentEl.style.opacity = '0';
      contentEl.style.height = '0';
      contentEl.classList.remove('active');
    }
  });

  // If the currently active tab is now hidden, switch to first visible tab
  const activeTab = tooltipEl.querySelector('.wikihover-tab.active');
  if (!activeTab || activeTab.style.display === 'none') {
    const firstVisible = tooltipEl.querySelector('.wikihover-tab:not([style*="display: none"])');
    if (firstVisible) {
      const tabKey = firstVisible.getAttribute('data-tab');
      if (tooltipEl === tooltipElement) {
        switchTab(tabKey);
      } else {
        firstVisible.click();
      }
    }
  }
}

// Returns true if fetched data has meaningful content to display for a given tab.
function dataHasContent(tabKey, data) {
  if (!data) return false;
  switch (tabKey) {
    case 'tvmaze': return !!(data.shows && data.shows.length > 0);
    case 'imdb':   return !!(data.movies && data.movies.length > 0);
    case 'books':  return !!(data.books && data.books.length > 0);
    default:       return !data.notFound;
  }
}

// Reveal the color layer on a tab's favicon (B&W → color fill animation).
function revealTabIconColor(tooltipEl, tabKey) {
  if (!tooltipEl) return;
  const tabBtn = tooltipEl.querySelector(`.wikihover-tab[data-tab="${tabKey}"]`);
  if (!tabBtn) return;
  const colorDiv = tabBtn.querySelector('.wikihover-tab-favicon-color');
  if (colorDiv) colorDiv.classList.add('wikihover-tab-favicon-revealed');
}

// Reset non-Wikipedia tab icons to B&W (remove revealed) when switching to a new name.
// Wikipedia stays colored by re-applying revealed to its tab.
function resetTabIconsToBw(tooltipEl) {
  if (!tooltipEl) return;
  tooltipEl.querySelectorAll('.wikihover-tab[data-tab]').forEach(tab => {
    const key = tab.getAttribute('data-tab');
    const colorDiv = tab.querySelector('.wikihover-tab-favicon-color');
    if (!colorDiv) return;
    if (key === 'wiki') {
      colorDiv.classList.add('wikihover-tab-favicon-revealed');
    } else {
      colorDiv.classList.remove('wikihover-tab-favicon-revealed');
    }
  });
}

// Hide a tab button (and its content panel) when the feed returns no data.
// If the tab was active, auto-switches to the first remaining visible tab.
function hideTabButton(tooltipEl, tabKey) {
  if (!tooltipEl) return;
  const tabBtn = tooltipEl.querySelector(`.wikihover-tab[data-tab="${tabKey}"]`);
  if (!tabBtn) return;
  tabBtn.style.setProperty('display', 'none', 'important');
  tabBtn.removeAttribute('data-wh-pending'); // mark as definitively hidden (no content)
  const contentEl = tooltipEl.querySelector(`.wikihover-${tabKey}-content`);
  if (contentEl) {
    contentEl.style.setProperty('display', 'none', 'important');
    contentEl.classList.remove('active');
  }
  // If this tab was active, switch to the first still-visible tab
  if (tabBtn.classList.contains('active')) {
    const firstVisible = tooltipEl.querySelector('.wikihover-tab:not([style*="display: none"])');
    if (firstVisible) {
      if (tooltipEl === tooltipElement) {
        switchTab(firstVisible.getAttribute('data-tab'));
      } else {
        firstVisible.click();
      }
    }
  }
}

// Reveal a pending tab button once its fetch confirms it has content.
function showTabButton(tooltipEl, tabKey) {
  if (!tooltipEl) return;
  const tabBtn = tooltipEl.querySelector(`.wikihover-tab[data-tab="${tabKey}"]`);
  if (!tabBtn || tabBtn.getAttribute('data-wh-pending') !== 'true') return;
  tabBtn.removeAttribute('data-wh-pending');
  tabBtn.style.removeProperty('display');
}

function switchTab(tabName) {
  if (!tooltipElement) return;

  // Save state of any playing videos before switching away
  tooltipElement.querySelectorAll('video').forEach(v => {
    if (v.src && !v.paused) {
      v.dataset.whSavedSrc = v.src;
      v.dataset.whSavedTime = v.currentTime;
      v.dataset.whSavedMuted = v.muted;
    }
    v.pause();
  });

  debugLog('Switching to tab:', tabName);

  const contents = tooltipElement.querySelectorAll('.wikihover-content');
  contents.forEach(content => {
    content.style.display = 'none';
    content.style.visibility = 'hidden';
    content.style.opacity = '0';
    content.style.position = 'absolute';
    content.style.zIndex = '-1';
    content.classList.remove('active');
  });

  const tabs = tooltipElement.querySelectorAll('.wikihover-tab');
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });

  const selectedTab = tooltipElement.querySelector(`[data-tab="${tabName}"]`);
  const selectedContent = tooltipElement.querySelector(`.wikihover-${tabName}-content`);

  if (selectedTab) {
    selectedTab.classList.add('active');
  }

  if (selectedContent) {
    selectedContent.style.display = 'block';
    selectedContent.style.visibility = 'visible';
    selectedContent.style.opacity = '1';
    selectedContent.style.position = 'relative';
    selectedContent.style.zIndex = '1';
    selectedContent.classList.add('active');

    // Resume any video that was playing before tab switch
    const expandedVideo = selectedContent.querySelector('video[data-wh-saved-src]');
    if (expandedVideo) {
      const savedSrc = expandedVideo.dataset.whSavedSrc;
      const savedTime = parseFloat(expandedVideo.dataset.whSavedTime) || 0;
      const savedMuted = expandedVideo.dataset.whSavedMuted === 'true';
      delete expandedVideo.dataset.whSavedSrc;
      delete expandedVideo.dataset.whSavedTime;
      delete expandedVideo.dataset.whSavedMuted;
      // Re-init video: set src, seek to saved position, play
      expandedVideo.src = savedSrc;
      expandedVideo.muted = savedMuted;
      expandedVideo.addEventListener('loadeddata', function onLoaded() {
        expandedVideo.removeEventListener('loadeddata', onLoaded);
        expandedVideo.currentTime = savedTime;
        expandedVideo.play().catch(() => {});
      });
      expandedVideo.load();
    }
  }

  // Lazy-load data for this tab if not yet fetched
  if (!fetchedTabs.has(tabName) && tabFetchers[tabName]) {
    fetchedTabs.add(tabName);
    tabFetchers[tabName]();
  }
}

// Function to check data source settings - returns a Promise
async function checkDataSourceSettings() {
  const result = await safeStorageGet(['dataSourceSettings', 'unmarkedNames', 'tabOrder']);
  if (result.dataSourceSettings) {
    dataSourceSettings = { ...dataSourceSettings, ...result.dataSourceSettings };
  }
  if (result.unmarkedNames && Array.isArray(result.unmarkedNames)) {
    unmarkedNames = new Set(result.unmarkedNames);
  }
  if (result.tabOrder && Array.isArray(result.tabOrder)) {
    tabOrder = result.tabOrder;
  }
}

// Debounce utility
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Debounced scroll handler
const debouncedScanOnScroll = debounce(function() {
  const now = Date.now();
  if (now - lastScanTimestamp > RESCAN_INTERVAL && !isScanning) {
    scanForNames();
  }
}, 200);

// Function to initialize the extension on the page
function initializeExtensionOnPage() {
  debugLog('Initializing extension on page');

  ensureTooltipExists();

  // Debounced scroll handler for scanning + immediate reposition for visible tooltip
  window.addEventListener('scroll', function() {
    debouncedScanOnScroll();
    if (isTooltipVisible && !pendingScrollRAF) {
      pendingScrollRAF = true;
      requestAnimationFrame(function() {
        pendingScrollRAF = false;
        repositionTooltip();
      });
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isTooltipVisible) {
      hideTooltip();
    }
  });

  // Check data source settings then scan
  checkDataSourceSettings().then(() => {
    // Reorder tooltip tabs now that tabOrder is loaded from storage
    if (tooltipElement) reorderTooltipTabs(tooltipElement);
    loadCompromiseLibrary().catch(() => {
      debugLog('Proceeding without Compromise');
    }).finally(() => {
      debugLog('Starting name scan');
      scanForNames();

      // MutationObserver that skips self-mutations
      observer = new MutationObserver(function(mutations) {
        // Skip if we're currently scanning (our own DOM changes)
        if (isScanning) return;

        const hasRelevantMutation = mutations.some(function(mutation) {
          if (!mutation.addedNodes || mutation.addedNodes.length === 0) return false;

          // Check if the mutation target itself is a wikihover element
          if (mutation.target && mutation.target.nodeType === Node.ELEMENT_NODE) {
            if (mutation.target.closest && mutation.target.closest('.wikihover-name, .wikihover-processed, .wikihover-tooltip')) {
              return false;
            }
          }

          // Check each added node - skip if ALL are wikihover-related
          let allWikihover = true;
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.classList && (node.classList.contains('wikihover-tooltip') ||
                  node.classList.contains('wikihover-name') ||
                  node.classList.contains('wikihover-processed'))) {
                continue; // this node is wikihover, check next
              }
              if (node.getAttribute && node.getAttribute('data-wikihover-tooltip') === 'true') {
                continue;
              }
            }
            // Text nodes inserted next to wikihover spans (our fragment replacements)
            if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
              if (node.parentElement.closest && node.parentElement.closest('.wikihover-name, .wikihover-processed')) {
                continue;
              }
              // Check if sibling is a wikihover element (from our fragment insertions)
              if (node.previousSibling && node.previousSibling.classList && node.previousSibling.classList.contains('wikihover-name')) {
                continue;
              }
              if (node.nextSibling && node.nextSibling.classList && node.nextSibling.classList.contains('wikihover-name')) {
                continue;
              }
            }
            allWikihover = false;
          }
          return !allWikihover;
        });

        if (hasRelevantMutation) {
          setTimeout(function() {
            scanForNames();
          }, 500);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
      debugLog('Mutation observer started');
    });
  });
}

// Function to scan for names in visible content
function scanForNames() {
  if (isScanning || !extensionEnabled) return;

  isScanning = true;
  lastScanTimestamp = Date.now();

  // Disconnect observer during scanning to prevent feedback loops
  if (observer) observer.disconnect();

  debugLog('Scanning for names');

  // Scan specific elements that are likely to contain celebrity names
  scanSpecificNameElements();

  // Then get all text nodes in the visible area
  const textNodes = getVisibleTextNodes();

  textNodes.forEach(function(node) {
    if (!node.parentElement) return;

    if (
      node.parentElement.tagName === 'SCRIPT' ||
      node.parentElement.tagName === 'STYLE' ||
      node.parentElement.tagName === 'NOSCRIPT' ||
      isTooltipElement(node.parentElement) ||
      hasWikiHoverAncestor(node.parentElement)
    ) {
      return;
    }

    processTextNode(node);
  });

  // Scan for names split across child elements (e.g. "Paul<br>Skenes")
  scanSplitNames();

  isScanning = false;

  // Reconnect observer after scanning is done
  if (observer) {
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Preload data for the first visible marked names
  preloadTopNames();
}

// Preload Wikipedia only for the top N visible marked names (other sources fetched on tab click)
const PRELOAD_COUNT = 3;
let preloadedNames = new Set();

function preloadTopNames() {
  const nameElements = document.querySelectorAll('.wikihover-name[data-name]');
  let count = 0;

  for (const el of nameElements) {
    if (count >= PRELOAD_COUNT) break;
    const name = el.getAttribute('data-name');
    if (!name || preloadedNames.has(name)) continue;

    // Only preload names currently visible in the viewport
    if (!isInViewport(el)) continue;

    preloadedNames.add(name);
    count++;

    debugLog('Preloading data for:', name);

    // Only preload Wikipedia (the default tab) to avoid overwhelming APIs
    // Other data sources are fetched lazily when the user clicks the tab
    if (dataSourceSettings.wikipedia) {
      deduplicatedFetch(`wiki_${name}`, () => fetchWikipediaData(name));
    }
  }
}


// Function to scan specific elements that are likely to contain names
function scanSpecificNameElements() {
  const imdbNameSelectors = [
    'h1.header',
    'h1[data-testid="hero__pageTitle"]',
    'span[data-testid="hero__primary-text"]',
    'a[data-testid="title-cast-item__actor"]',
    'a[data-testid="title-cast-item__character"]',
    '[data-testid="title-pc-principal-credit"] a',
    'a.name-link',
    'td.name a',
    '.cast-item-actor a',
    '.primary_photo + td a',
    '.titlereference-primary-name',
  ];

  const wikiNameSelectors = [
    '.vcard .fn',
    '.infobox-above',
    'h1.firstHeading',
    '.mw-page-title-main',
  ];

  const generalNameSelectors = [
    '.actor-name',
    '.celebrity-name',
    '.person-name',
    '.artist-name',
    '.cast-name',
    'h1.name',
    'h1.title',
    '[data-testid*="name"]',
    '[data-testid*="title"]',
    '[data-testid*="primary-text"]'
  ];

  const allSelectors = [...imdbNameSelectors, ...wikiNameSelectors, ...generalNameSelectors].join(',');

  try {
    const potentialNameElements = document.querySelectorAll(allSelectors);

    potentialNameElements.forEach(element => {
      if (isTooltipElement(element) || hasWikiHoverAncestor(element)) {
        return;
      }

      // Only process elements within the current viewport
      if (!isInViewport(element)) {
        return;
      }

      markWholeElementAsName(element);
    });
  } catch (e) {
    console.error('WikiHover: Error scanning specific name elements:', e);
  }
}

// Scan for names split across child nodes (e.g. "Paul<br>Skenes" or "<span>Paul</span><span>Skenes</span>")
// Collects the parent's textContent and checks if it forms a valid 2-word name.
function scanSplitNames() {
  const checked = new Set();

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
    acceptNode: function(el) {
      // Skip script/style/tooltip/already-processed elements
      const tag = el.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
      if (isTooltipElement(el) || hasWikiHoverAncestor(el)) return NodeFilter.FILTER_REJECT;
      if (el.getAttribute('data-wikihover-processed') === 'true') return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  while (walker.nextNode()) {
    const el = walker.currentNode;

    // Only check elements with multiple child nodes (text + br/span/etc)
    if (el.childNodes.length < 2) continue;

    // Skip if not visible
    if (!isInViewport(el)) continue;

    // Avoid re-checking the same element
    if (checked.has(el)) continue;
    checked.add(el);

    // Collapse textContent: replace newlines/multiple spaces with single space
    const text = el.textContent.replace(/\s+/g, ' ').trim();

    // Must be a short string that looks like a 2-word name (avoid processing large containers)
    if (text.length < 3 || text.length > 50) continue;

    // Check it matches our name regex (exactly 2 capitalized words)
    nameRegex.lastIndex = 0;
    const match = nameRegex.exec(text);
    if (!match || match[0] !== text) continue;

    // Also check Hebrew names
    // (Hebrew names are already handled as 2-word pairs by findHebrewNames, but
    //  they won't match here since nameRegex is English-only — that's fine,
    //  Hebrew split names are very rare in web layouts)

    // Never mark names confirmed as non-person by Wikipedia
    if (notPersonNames.has(normalizeNameForDedup(text))) continue;

    // Use NLP to verify it's a person name (if available), with parent context for accuracy
    if (window.compromiseAvailable && !isHebrewText(text)) {
      const parentText = el.parentElement ? el.parentElement.textContent : '';
      const contextText = parentText.length > text.length && parentText.length < 500 ? parentText : null;
      const enhanced = enhanceNameDetection(text, contextText);
      // If NLP rejects, still allow if Wikipedia confirmed it as a person
      if (enhanced === null && !confirmedPersonNames.has(normalizeNameForDedup(text))) continue;
    }

    markWholeElementAsName(el);
  }
}

// Check if an element or any ancestor is already processed by WikiHover
function hasWikiHoverAncestor(element) {
  // Check the element itself for data-wikihover-processed (prevents re-processing)
  if (element.getAttribute && element.getAttribute('data-wikihover-processed') === 'true') {
    return true;
  }
  // Walk up ancestors checking only for wikihover CSS classes (set on successful wraps).
  // Do NOT check ancestors for data-wikihover-processed — a parent container that failed
  // processing (e.g. broad [data-testid*="title"] match) should not block its children.
  let el = element;
  while (el) {
    if (el.classList && (
      el.classList.contains('wikihover-name') ||
      el.classList.contains('wikihover-processed')
    )) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
}

// Check if an element is within the viewport (with buffer)
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  const viewportTop = -VIEWPORT_BUFFER;
  const viewportBottom = window.innerHeight + VIEWPORT_BUFFER;
  return rect.bottom >= viewportTop && rect.top <= viewportBottom;
}

// Function to get all visible text nodes in the current viewport
function getVisibleTextNodes() {
  const textNodes = [];
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        if (!node.textContent.trim()) {
          return NodeFilter.FILTER_REJECT;
        }

        if (!node.parentElement || node.parentElement.offsetParent === null) {
          return NodeFilter.FILTER_REJECT;
        }

        // Use offsetHeight check instead of getComputedStyle (much cheaper)
        if (node.parentElement.offsetHeight === 0) {
          return NodeFilter.FILTER_REJECT;
        }

        // Only process nodes within the current viewport (with buffer)
        if (!isInViewport(node.parentElement)) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  return textNodes;
}

// Function to process a text node and mark potential names.
// Uses batch NLP: processes the FULL text node through Compromise once for context-aware detection.
// Multi-word sequences (3+ capitalized words) are handled specially: the actual person name is
// extracted from within the sequence (e.g. "President Donald Trump" → marks only "Donald Trump").
function processTextNode(textNode) {
  try {
    const text = textNode.nodeValue;

    // English 2-word matches
    const twoWordMatches = Array.from(text.matchAll(nameRegex));

    // English 3+ word sequences (provides better context for name extraction)
    const multiWordMatches = Array.from(text.matchAll(multiWordNameRegex));

    // Merge: prefer multi-word matches over 2-word matches when they overlap.
    const englishMatches = [];
    const coveredRanges = [];

    for (const m of multiWordMatches) {
      englishMatches.push({ text: m[0], index: m.index, isMultiWord: true });
      coveredRanges.push({ start: m.index, end: m.index + m[0].length });
    }

    for (const m of twoWordMatches) {
      const mStart = m.index;
      const mEnd = m.index + m[0].length;
      const overlaps = coveredRanges.some(r => mStart < r.end && mEnd > r.start);
      if (!overlaps) {
        englishMatches.push({ text: m[0], index: m.index, isMultiWord: false });
      }
    }

    // Hebrew matches (dictionary-based: first name + optional last name)
    const hebrewMatches = findHebrewNames(text);

    // Combine and sort by position
    const allMatches = [
      ...englishMatches.map(m => ({ 0: m.text, index: m.index, isMultiWord: m.isMultiWord })),
      ...hebrewMatches
    ].sort((a, b) => a.index - b.index);

    // Remove overlapping matches (keep the earlier one)
    const matches = [];
    let lastEnd = -1;
    for (const match of allMatches) {
      if (match.index > lastEnd) {
        matches.push(match);
        lastEnd = match.index + match[0].length - 1;
      }
    }

    if (matches.length === 0) return;

    // Batch NLP: process the full text node ONCE for context-aware name detection.
    // Compromise is much more accurate when it can see the whole sentence
    // (e.g. "John Smith went to New York" → tags John Smith as person, New York as place).
    let nlpApproved = null;
    const hasEnglishMatches = englishMatches.length > 0;
    if (window.compromiseAvailable && enableEnhancedNameDetection && hasEnglishMatches) {
      nlpApproved = getNlpApprovedNames(text);
    }

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let markedCount = 0;

    for (const match of matches) {
      const matchText = match[0];
      const matchStart = match.index;
      const isHebrew = isHebrewText(matchText);

      // --- Multi-word sequence handling ---
      // For 3+ word sequences, extract the actual person name from within
      if (match.isMultiWord && !isHebrew) {
        const extracted = extractPersonFromSequence(matchText, nlpApproved);

        if (extracted) {
          const normalizedName = normalizeNameForDedup(extracted.name);

          // Only block if Wikipedia confirmed it's not a person
          if (!notPersonNames.has(normalizedName)) {
            if (matchStart > lastIndex) {
              fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchStart)));
            }
            if (extracted.startOffset > 0) {
              fragment.appendChild(document.createTextNode(matchText.substring(0, extracted.startOffset)));
            }
            fragment.appendChild(document.createTextNode(extracted.name));
            if (dataSourceSettings.wikipedia) {
              deduplicatedFetch(`wiki_${extracted.name}`, () => fetchWikipediaData(extracted.name)).then(data => {
                if (!data.notFound) markNameInDocument(extracted.name);
              });
            }
            markedCount++;
            if (extracted.endOffset < matchText.length) {
              fragment.appendChild(document.createTextNode(matchText.substring(extracted.endOffset)));
            }
            lastIndex = matchStart + matchText.length;
            continue;
          }
        }

        // No person found in multi-word sequence — emit as plain text
        if (matchStart > lastIndex) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchStart)));
        }
        fragment.appendChild(document.createTextNode(matchText));
        lastIndex = matchStart + matchText.length;
        debugLog('rejected multi-word (no person):', matchText);
        continue;
      }

      // --- Standard 2-word match handling ---
      if (matchStart > lastIndex) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchStart)));
      }

      const normalizedMatch = normalizeNameForDedup(matchText);

      // Never mark names confirmed as non-person by Wikipedia
      if (notPersonNames.has(normalizedMatch)) {
        fragment.appendChild(document.createTextNode(matchText));
        lastIndex = matchStart + matchText.length;
        continue;
      }

      // Dual approval: NLP approves OR Wikipedia previously confirmed this is a person
      let approved = true;
      if (!isHebrew && nlpApproved !== null) {
        const nlpSaysYes = isNameNlpApproved(matchText, nlpApproved);
        const wikiSaysYes = confirmedPersonNames.has(normalizedMatch);
        approved = nlpSaysYes || wikiSaysYes;
        if (!approved) {
          debugLog('rejected (batch NLP + no wiki confirmation):', matchText);
        }
      }

      if (approved) {
        fragment.appendChild(document.createTextNode(matchText));
        if (dataSourceSettings.wikipedia) {
          deduplicatedFetch(`wiki_${matchText}`, () => fetchWikipediaData(matchText)).then(data => {
            if (!data.notFound) markNameInDocument(matchText);
          });
        }
        markedCount++;
      } else {
        fragment.appendChild(document.createTextNode(matchText));
      }

      lastIndex = matchStart + matchText.length;
    }

    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
    }

    textNode.parentNode.replaceChild(fragment, textNode);
    processedNamesCount += markedCount;
  } catch (error) {
    console.error('WikiHover: Error processing text node:', error);
  }
}

// Function to filter out connecting words (uses module-level Set)
function filterConnectingWords(name) {
  // For Hebrew text, return as-is (already validated by dictionary lookup)
  if (isHebrewText(name)) {
    return name;
  }

  const isIngVerb = word => {
    const lowerWord = word.toLowerCase();
    return lowerWord.length > 5 && lowerWord.endsWith('ing') &&
           !lowerWord.endsWith('king') && !lowerWord.endsWith('ling') &&
           !lowerWord.endsWith('ring') && !lowerWord.endsWith('sing') &&
           !lowerWord.endsWith('ding') && !lowerWord.endsWith('ting') &&
           !lowerWord.endsWith('ming') && !lowerWord.endsWith('ning');
  };

  const words = name.split(' ');

  const filteredWords = words.filter(word => {
    const lowerWord = word.toLowerCase();
    return !NON_NAME_WORDS.has(lowerWord) && !isIngVerb(word);
  });

  return filteredWords.length > 0 ? filteredWords.join(' ') : name;
}

// Normalize name: strip possessive suffixes ('s) and trailing punctuation (-!,.:; etc.)
function normalizeNameForDedup(name) {
  return name
    .replace(/['\u2019]s$/i, '')
    .replace(/[\-\!\,\.\:\;\?\)\]\u2014\u2013]+$/, '')
    .trim();
}

// Function to mark a name with hover capability.
// When nlpPreApproved is true, skips the per-name NLP check (already batch-validated by processTextNode).
function markName(name, nlpPreApproved) {
  // Skip names the user has unmarked
  if (unmarkedNames.has(name) || unmarkedNames.has(normalizeNameForDedup(name))) {
    return document.createTextNode(name);
  }

  // Never mark names confirmed as non-person by Wikipedia
  if (notPersonNames.has(normalizeNameForDedup(name))) {
    return document.createTextNode(name);
  }

  debugLog('Marking name:', name);

  let enhancedName = name;
  if (!nlpPreApproved && window.compromiseAvailable && !isHebrewText(name)) {
    enhancedName = enhanceNameDetection(name);

    // If NLP rejected it, check if Wikipedia previously confirmed it as a person
    if (enhancedName === null) {
      if (confirmedPersonNames.has(normalizeNameForDedup(name))) {
        enhancedName = name; // Wikipedia override
      } else {
        return document.createTextNode(name);
      }
    }

    if (enhancedName !== name && name.indexOf(enhancedName) !== -1) {
      const cleanEnhanced = normalizeNameForDedup(enhancedName);

      const fragment = document.createDocumentFragment();

      const namePosition = name.indexOf(cleanEnhanced);
      if (namePosition > 0) {
        fragment.appendChild(document.createTextNode(name.substring(0, namePosition)));
      }

      fragment.appendChild(createNameSpan(cleanEnhanced, cleanEnhanced));

      const afterNamePosition = namePosition + cleanEnhanced.length;
      if (afterNamePosition < name.length) {
        fragment.appendChild(document.createTextNode(name.substring(afterNamePosition)));
      }

      return fragment;
    }
  }

  const cleanName = normalizeNameForDedup(enhancedName);

  // Figure out what was stripped so we can append it as plain text
  const suffix = name.substring(name.indexOf(cleanName) + cleanName.length);
  const prefix = name.substring(0, name.indexOf(cleanName));

  const span = createNameSpan(cleanName, cleanName);

  // If there's trailing punctuation, return a fragment with span + suffix
  if (prefix || suffix) {
    const fragment = document.createDocumentFragment();
    if (prefix) fragment.appendChild(document.createTextNode(prefix));
    fragment.appendChild(span);
    if (suffix) fragment.appendChild(document.createTextNode(suffix));
    return fragment;
  }
  return span;
}

// Mark a whole element as containing a name
function markWholeElementAsName(element) {
  if (hasWikiHoverAncestor(element)) {
    return;
  }

  const rawText = element.textContent.trim();

  // Skip names the user has unmarked
  if (unmarkedNames.has(rawText) || unmarkedNames.has(normalizeNameForDedup(rawText))) {
    element.setAttribute('data-wikihover-processed', 'true');
    return;
  }

  if (rawText.length === 0 || rawText.length > 60) {
    element.setAttribute('data-wikihover-processed', 'true');
    return;
  }

  // Collapse whitespace (handles names split by <br> etc.) and validate against nameRegex
  const collapsed = rawText.replace(/\s+/g, ' ');
  nameRegex.lastIndex = 0;
  const regexMatch = nameRegex.exec(collapsed);

  // Only proceed if the text is a valid name — extract the matched name portion
  let text;
  if (regexMatch) {
    text = regexMatch[0];
  } else if (isHebrewText(collapsed) && findHebrewNames(collapsed).length > 0) {
    text = findHebrewNames(collapsed)[0][0];
  } else {
    element.setAttribute('data-wikihover-processed', 'true');
    return;
  }

  // Never mark names confirmed as non-person by Wikipedia
  if (notPersonNames.has(normalizeNameForDedup(text))) {
    element.setAttribute('data-wikihover-processed', 'true');
    return;
  }

  let enhancedName = text;
  if (window.compromiseAvailable && enableEnhancedNameDetection && !isHebrewText(text)) {
    // Try to get parent context for better NLP accuracy
    const parentText = element.parentElement ? element.parentElement.textContent : '';
    const contextText = parentText.length > text.length && parentText.length < 500 ? parentText : null;
    enhancedName = enhanceNameDetection(text, contextText);

    // If NLP rejected it, check if Wikipedia previously confirmed it as a person
    if (enhancedName === null) {
      if (confirmedPersonNames.has(normalizeNameForDedup(text))) {
        enhancedName = text; // Wikipedia override
      } else {
        element.setAttribute('data-wikihover-processed', 'true');
        return;
      }
    }
  }

  const wrapper = document.createElement('span');
  wrapper.className = 'wikihover-processed';
  wrapper.setAttribute('data-wikihover-processed', 'true');

  const nameSpan = document.createElement('span');
  nameSpan.className = 'wikihover-name';
  nameSpan.setAttribute('data-name', normalizeNameForDedup(enhancedName));

  // Only mark if the name matches the full element text (or its whitespace-collapsed form).
  // If the element has extra content (e.g. "Anne Hathaway(I)"), skip and let
  // processTextNode handle the text nodes individually.
  if (text !== collapsed) {
    element.setAttribute('data-wikihover-processed', 'true');
    return;
  }

  const clonedChildren = Array.from(element.childNodes).map(node => node.cloneNode(true));
  clonedChildren.forEach(child => nameSpan.appendChild(child));

  nameSpan.addEventListener('mouseenter', handleNameHover);
  nameSpan.addEventListener('mouseleave', function() {
    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(function() {
      if (Date.now() - lastRepositionTime < REPOSITION_GRACE_MS) return;
      if (!isMouseOverTooltip()) {
        hideTooltip();
      }
    }, TOOLTIP_DELAY);
  });

  wrapper.appendChild(nameSpan);

  const tag = element.tagName.toLowerCase();
  if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'a' ||
      tag === 'span' || tag === 'td' || tag === 'li') {
    element.innerHTML = '';
    element.appendChild(wrapper);
    element.setAttribute('data-wikihover-processed', 'true');
  } else {
    try {
      element.parentNode.replaceChild(wrapper, element);
    } catch (e) {
      element.setAttribute('data-wikihover-processed', 'true');
    }
  }

  markedNames.add(normalizeNameForDedup(text));
}

// Function to handle hovering over a name
function handleNameHover(event) {
  if (!extensionEnabled) return;
  clearTimeout(tooltipTimer);
  currentHoveredElement = event.target;
  currentWord = event.target.getAttribute('data-name');

  // Start Wikipedia prefetch immediately (overlaps with tooltip delay)
  if (currentWord && dataSourceSettings.wikipedia) {
    deduplicatedFetch(`wiki_${currentWord}`, () => fetchWikipediaData(currentWord));
  }

  // Start Instagram & TikTok prefetch on hover (data ready before tab click)
  if (currentWord && dataSourceSettings.instagram) {
    deduplicatedFetch(`instagram_${currentWord}`, () => fetchInstagramData(currentWord));
  }
  if (currentWord && dataSourceSettings.tiktok) {
    deduplicatedFetch(`tiktok_${currentWord}`, () => fetchTikTokData(currentWord));
  }
  if (currentWord && dataSourceSettings.pinterest) {
    deduplicatedFetch(`pinterest_${currentWord}`, () => fetchPinterestData(currentWord));
  }

  tooltipTimer = setTimeout(async function() {
    if (currentWord) {
      try {
        // Ensure tooltip exists (may need to recreate after pinning)
        ensureTooltipExists();

        // Query content containers AFTER ensureTooltipExists so tooltipElement is guaranteed valid
        const wikiContent = tooltipElement.querySelector('.wikihover-wiki-content');
        const tvMazeContent = tooltipElement.querySelector('.wikihover-tvmaze-content');
        const imdbContent = tooltipElement.querySelector('.wikihover-imdb-content');
        const booksContent = tooltipElement.querySelector('.wikihover-books-content');
        const instagramContent = tooltipElement.querySelector('.wikihover-instagram-content');
        const twitterContent = tooltipElement.querySelector('.wikihover-twitter-content');
        const footballContent = tooltipElement.querySelector('.wikihover-football-content');
        const tiktokContent = tooltipElement.querySelector('.wikihover-tiktok-content');
        const pinterestContent = tooltipElement.querySelector('.wikihover-pinterest-content');

        // Set tooltip title
        tooltipElement.querySelector('.wikihover-title').textContent = currentWord;

        // Manage navigation history
        if (navFromHistory) {
          // Back/forward navigation — history already updated, just refresh buttons
          navFromHistory = false;
        } else if (tooltipNavHistory.length === 0 || tooltipNavHistory[tooltipNavIndex] !== currentWord) {
          // Fresh hover from the page — reset history to this person
          tooltipNavHistory = [currentWord];
          tooltipNavIndex = 0;
        }
        updateNavButtons();

        // Show loading indicators in all content containers
        [wikiContent, tvMazeContent, imdbContent, booksContent, instagramContent, twitterContent, footballContent, tiktokContent, pinterestContent].forEach(content => {
          if (content) content.innerHTML = '<div class="wikihover-loader"></div>';
        });

        // Update tab visibility based on settings
        updateTabVisibility(tooltipElement);

        // All tabs are shown immediately in B&W; each fades to color when its feed loads.
        // Tabs with no data are hidden by hideTabButton() after the fetch completes.
        const firstEnabledTab = getFirstEnabledTabKey();

        showTooltip();

        // Reset lazy tab loading state
        fetchedTabs.clear();
        tabFetchers = {};
        resetTabIconsToBw(tooltipElement);
        const nameToFetch = currentWord;

        // Initialize per-name data cache entry
        if (!tooltipDataCache[nameToFetch]) tooltipDataCache[nameToFetch] = {};

        // Fetch Wikipedia immediately (visible tab)
        fetchedTabs.add('wiki');
        if (dataSourceSettings.wikipedia) {
          deduplicatedFetch(`wiki_${nameToFetch}`, () => fetchWikipediaData(nameToFetch)).then(data => {
            if (isTooltipVisible && currentHoveredElement === event.target) {
              if (!data.notFound) {
                wikiContent.innerHTML = '';

                // Header with image and title
                const headerContainer = document.createElement('div');
                headerContainer.style.display = 'flex';
                headerContainer.style.alignItems = 'flex-start';
                headerContainer.style.marginBottom = '12px';
                headerContainer.style.paddingBottom = '10px';
                headerContainer.style.borderBottom = '1px solid #eee';

                let headerImg = null;
                const imgSrc = data.originalimage || data.thumbnail;
                if (imgSrc) {
                  headerImg = document.createElement('img');
                  headerImg.src = imgSrc;
                  headerImg.alt = data.title;
                  headerImg.style.width = '48%';
                  headerImg.style.maxWidth = '240px';
                  headerImg.style.height = 'auto';
                  headerImg.style.borderRadius = '8px';
                  headerImg.style.marginRight = '14px';
                  headerImg.style.flexShrink = '0';
                  headerImg.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                  headerImg.style.display = 'block';
                  headerContainer.appendChild(headerImg);
                }

                const titleBlock = document.createElement('div');
                titleBlock.style.flex = '1';

                const titleLink = document.createElement('a');
                titleLink.href = data.url;
                titleLink.target = '_blank';
                titleLink.style.textDecoration = 'none';

                const titleEl = document.createElement('h3');
                titleEl.style.margin = '0 0 4px 0';
                titleEl.style.fontSize = '16px';
                titleEl.style.color = 'var(--wh-accent)';
                titleEl.style.fontWeight = '600';
                titleEl.textContent = data.title;
                titleLink.appendChild(titleEl);
                titleBlock.appendChild(titleLink);

                if (data.description) {
                  const descEl = document.createElement('div');
                  descEl.style.fontSize = '12px';
                  descEl.style.color = 'var(--wh-text-secondary)';
                  descEl.style.fontStyle = 'italic';
                  descEl.style.marginBottom = '4px';
                  descEl.textContent = data.description;
                  titleBlock.appendChild(descEl);
                }

                // Placeholder for birth info (filled async)
                const birthInfoEl = document.createElement('div');
                birthInfoEl.style.fontSize = '12.5px';
                birthInfoEl.style.color = 'var(--wh-text-secondary)';
                birthInfoEl.style.marginBottom = '4px';
                birthInfoEl.style.lineHeight = '1.5';
                titleBlock.appendChild(birthInfoEl);

                // Fetch birth info from Wikidata asynchronously
                if (data.wikibase_item) {
                  fetchWikidataBirthInfo(data.wikibase_item).then(birthData => {
                    if (!birthData) return;
                    const parts = [];
                    if (birthData.birthDate) {
                      let bornStr = `<b>Born:</b> ${birthData.birthDate}`;
                      if (birthData.birthPlace || birthData.country) {
                        const location = [birthData.birthPlace, birthData.country].filter(Boolean).join(', ');
                        bornStr += ` — ${location}`;
                      }
                      parts.push(bornStr);
                    }
                    if (birthData.deathDate) {
                      parts.push(`<b>Died:</b> ${birthData.deathDate}`);
                    }
                    if (birthData.occupations?.length) {
                      parts.push(`<span style="font-style:italic">${birthData.occupations.join(', ')}</span>`);
                    }
                    if (birthData.education?.length) {
                      parts.push(`<b>Education:</b> ${birthData.education.join(', ')}`);
                    }
                    if (birthData.spouses?.length) {
                      parts.push(`<b>Spouse:</b> ${birthData.spouses.join(', ')}`);
                    }
                    if (birthData.positions?.length) {
                      parts.push(`<b>Position:</b> ${birthData.positions.join(', ')}`);
                    }
                    if (birthData.awards?.length) {
                      let awardsStr = birthData.awards.slice(0, 2).join(', ');
                      if (birthData.awards.length > 2) {
                        awardsStr += ` (+${birthData.awards.length - 2} more)`;
                      }
                      parts.push(`<b>Awards:</b> ${awardsStr}`);
                    }
                    if (birthData.height) {
                      parts.push(`Height: ${(birthData.height / 100).toFixed(2)} m`);
                    }
                    if (birthData.childrenCount != null) {
                      parts.push(`Children: ${birthData.childrenCount}`);
                    }
                    if (birthData.website) {
                      try {
                        const domain = new URL(birthData.website).hostname.replace(/^www\./, '');
                        parts.push(`Website: <a href="${birthData.website}" target="_blank" style="color:var(--wh-accent);text-decoration:none">${domain}</a>`);
                      } catch (e) {
                        parts.push(`Website: <a href="${birthData.website}" target="_blank" style="color:var(--wh-accent);text-decoration:none">${birthData.website}</a>`);
                      }
                    }
                    if (birthData.causeOfDeath) {
                      parts.push(`Cause of death: ${birthData.causeOfDeath}`);
                    }
                    if (parts.length > 0) {
                      birthInfoEl.innerHTML = parts.map(p => `<span>${p}</span>`).join('<br>');
                    }
                  }).catch(() => {});
                }

                const wikiIcon = document.createElement('a');
                wikiIcon.href = data.url;
                wikiIcon.target = '_blank';
                wikiIcon.style.fontSize = '11px';
                wikiIcon.style.color = 'var(--wh-accent)';
                wikiIcon.style.textDecoration = 'none';
                wikiIcon.textContent = 'Read full article on Wikipedia →';
                titleBlock.appendChild(wikiIcon);

                // Clamp text column height to match the image height
                if (headerImg) {
                  titleBlock.style.overflow = 'hidden';
                  const clampToImage = () => {
                    requestAnimationFrame(() => {
                      if (headerImg.offsetHeight > 0) {
                        titleBlock.style.maxHeight = headerImg.offsetHeight + 'px';
                      }
                    });
                  };
                  if (headerImg.complete) clampToImage();
                  else headerImg.addEventListener('load', clampToImage);
                }

                headerContainer.appendChild(titleBlock);
                wikiContent.appendChild(headerContainer);

                // Extract content
                const extractContainer = document.createElement('div');
                extractContainer.style.fontSize = '13px';
                extractContainer.style.lineHeight = '1.5';
                extractContainer.style.color = 'var(--wh-text)';

                if (data.extract) {
                  const sanitized = data.extract
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
                  extractContainer.innerHTML = sanitized;
                } else {
                  extractContainer.textContent = 'No description available.';
                }
                wikiContent.appendChild(extractContainer);

                // Fetch and render family tree asynchronously
                if (data.wikibase_item) {
                  fetchWikidataFamilyTree(data.wikibase_item).then(familyData => {
                    if (familyData && isTooltipVisible && currentHoveredElement === event.target) {
                      wikiContent.appendChild(createFamilyTreeElement(familyData, data.title, data.originalimage || data.thumbnail || ''));
                      debouncedRepositionTooltip();
                    }
                  }).catch(() => {});
                }

              } else {
                wikiContent.innerHTML = `<p>No Wikipedia information found for "${currentWord}".</p>`;
                hideTabButton(tooltipElement, 'wiki');
              }

              debouncedRepositionTooltip();
            }
          }).catch(error => {
            if (isTooltipVisible && currentHoveredElement === event.target) {
              console.error('WikiHover: Error fetching Wikipedia data:', error);
              wikiContent.innerHTML = `<p>Error fetching Wikipedia data: ${error.message}</p>`;
            }
          });
        } else {
          wikiContent.innerHTML = '<p>Wikipedia data source is disabled in settings.</p>';
        }

        // Register lazy fetchers for other tabs (loaded on tab click)
        tabFetchers.tvmaze = () => {
        if (dataSourceSettings.tvmaze) {
          const tvmazeProgress = createBrandedProgressIndicator('tvmaze.com', '#3c948b', 'Loading TVMaze');
          tvMazeContent.innerHTML = '';
          tvMazeContent.appendChild(tvmazeProgress.element);

          deduplicatedFetch(`tvmaze_${nameToFetch}`, () => fetchTVMazeData(nameToFetch)).then(async data => {
            await tvmazeProgress.finishProgress();
            revealTabIconColor(tooltipElement, 'tvmaze');
            if (tooltipDataCache[nameToFetch]) tooltipDataCache[nameToFetch].tvmaze = data;
            if (isTooltipVisible && currentHoveredElement === event.target) {
              updateTVMazeContent(tvMazeContent, data, currentWord);
              if (dataHasContent('tvmaze', data)) showTabButton(tooltipElement, 'tvmaze');
              else hideTabButton(tooltipElement, 'tvmaze');
              debouncedRepositionTooltip();
            }
          }).catch(error => {
            tvmazeProgress.failProgress();
            revealTabIconColor(tooltipElement, 'tvmaze');
            if (isTooltipVisible && currentHoveredElement === event.target) {
              console.error('WikiHover: Error fetching TVMaze data:', error);
              tvMazeContent.innerHTML = `<p>Error fetching TVMaze data: ${error.message}</p>`;
            }
          });
        } else {
          tvMazeContent.innerHTML = '<p>TVMaze data source is disabled in settings.</p>';
          revealTabIconColor(tooltipElement, 'tvmaze');
        }
        };

        tabFetchers.imdb = () => {
        if (dataSourceSettings.imdb) {
          const imdbProgress = createBrandedProgressIndicator('imdb.com', '#F5C518', 'Loading IMDb');
          imdbContent.innerHTML = '';
          imdbContent.appendChild(imdbProgress.element);

          deduplicatedFetch(`imdb_${nameToFetch}`, () => fetchIMDbData(nameToFetch)).then(async data => {
            await imdbProgress.finishProgress();
            revealTabIconColor(tooltipElement, 'imdb');
            if (tooltipDataCache[nameToFetch]) tooltipDataCache[nameToFetch].imdb = data;
            if (isTooltipVisible && currentHoveredElement === event.target) {
              updateIMDbContent(imdbContent, data, currentWord);
              if (dataHasContent('imdb', data)) showTabButton(tooltipElement, 'imdb');
              else hideTabButton(tooltipElement, 'imdb');
              debouncedRepositionTooltip();
            }
          }).catch(error => {
            imdbProgress.failProgress();
            revealTabIconColor(tooltipElement, 'imdb');
            if (isTooltipVisible && currentHoveredElement === event.target) {
              imdbContent.innerHTML = `<p>Error fetching IMDb data: ${error.message}</p>`;
            }
          });
        } else {
          imdbContent.innerHTML = '<p>IMDb data source is disabled in settings.</p>';
          revealTabIconColor(tooltipElement, 'imdb');
        }
        };

        // Books data gated behind settings check
        tabFetchers.books = () => {
        if (dataSourceSettings.books) {
          const booksProgress = createBrandedProgressIndicator('openlibrary.org', '#0074D9', 'Loading Books');
          booksContent.innerHTML = '';
          booksContent.appendChild(booksProgress.element);

          deduplicatedFetch(`books_${nameToFetch}`, () => fetchBooksData(nameToFetch)).then(async data => {
            await booksProgress.finishProgress();
            revealTabIconColor(tooltipElement, 'books');
            if (tooltipDataCache[nameToFetch]) tooltipDataCache[nameToFetch].books = data;
            if (isTooltipVisible && currentHoveredElement === event.target) {
              updateBooksContent(booksContent, data, currentWord);
              if (dataHasContent('books', data)) showTabButton(tooltipElement, 'books');
              else hideTabButton(tooltipElement, 'books');
              debouncedRepositionTooltip();
            }
          }).catch(error => {
            booksProgress.failProgress();
            revealTabIconColor(tooltipElement, 'books');
            if (isTooltipVisible && currentHoveredElement === event.target) {
              console.error('WikiHover: Error fetching book data:', error);
              booksContent.innerHTML = `<p>Error fetching book data: ${error.message}</p>`;
            }
          });
        } else {
          booksContent.innerHTML = '<p>Books data source is disabled in settings.</p>';
          revealTabIconColor(tooltipElement, 'books');
        }
        };

        tabFetchers.instagram = () => {
        if (dataSourceSettings.instagram) {
          // Show branded IG progress indicator while loading
          const igProgress = createIGProgressIndicator('Loading Instagram');
          instagramContent.innerHTML = '';
          instagramContent.appendChild(igProgress.element);

          deduplicatedFetch(`instagram_${nameToFetch}`, () => fetchInstagramData(nameToFetch)).then(async data => {
            await igProgress.finishProgress();
            revealTabIconColor(tooltipElement, 'instagram');
            if (tooltipDataCache[nameToFetch]) tooltipDataCache[nameToFetch].instagram = data;
            if (isTooltipVisible && currentHoveredElement === event.target) {
              updateInstagramContent(instagramContent, data, currentWord);
              if (dataHasContent('instagram', data)) showTabButton(tooltipElement, 'instagram');
              else hideTabButton(tooltipElement, 'instagram');
              debouncedRepositionTooltip();
            }
          }).catch(error => {
            igProgress.failProgress();
            revealTabIconColor(tooltipElement, 'instagram');
            if (isTooltipVisible && currentHoveredElement === event.target) {
              console.error('WikiHover: Error fetching Instagram data:', error);
              instagramContent.innerHTML = `<p>Error fetching Instagram data: ${error.message}</p>`;
            }
          });
        } else {
          instagramContent.innerHTML = '<p>Instagram data source is disabled in settings.</p>';
          revealTabIconColor(tooltipElement, 'instagram');
        }
        };

        tabFetchers.twitter = () => {
        if (dataSourceSettings.twitter) {
          const twitterProgress = createBrandedProgressIndicator('x.com', '#1d9bf0', 'Loading X');
          twitterContent.innerHTML = '';
          twitterContent.appendChild(twitterProgress.element);

          deduplicatedFetch(`twitter_${nameToFetch}`, () => fetchTwitterData(nameToFetch)).then(async data => {
            await twitterProgress.finishProgress();
            revealTabIconColor(tooltipElement, 'twitter');
            if (tooltipDataCache[nameToFetch]) tooltipDataCache[nameToFetch].twitter = data;
            if (isTooltipVisible && currentHoveredElement === event.target) {
              updateTwitterContent(twitterContent, data, currentWord);
              if (dataHasContent('twitter', data)) showTabButton(tooltipElement, 'twitter');
              else hideTabButton(tooltipElement, 'twitter');
              debouncedRepositionTooltip();
            }
          }).catch(error => {
            twitterProgress.failProgress();
            revealTabIconColor(tooltipElement, 'twitter');
            if (isTooltipVisible && currentHoveredElement === event.target) {
              twitterContent.innerHTML = `<p>Error fetching X data: ${error.message}</p>`;
            }
          });
        } else {
          twitterContent.innerHTML = '<p>X data source is disabled in settings.</p>';
          revealTabIconColor(tooltipElement, 'twitter');
        }
        };

        tabFetchers.football = () => {
        const footballCont = tooltipElement ? tooltipElement.querySelector('.wikihover-football-content') : null;
        if (dataSourceSettings.football) {
          if (footballCont) {
            const footballProgress = createBrandedProgressIndicator('api-football.com', '#2E7D32', 'Loading Football');
            footballCont.innerHTML = '';
            footballCont.appendChild(footballProgress.element);

            deduplicatedFetch(`football_${nameToFetch}`, () => fetchFootballData(nameToFetch)).then(async data => {
              await footballProgress.finishProgress();
              revealTabIconColor(tooltipElement, 'football');
              if (tooltipDataCache[nameToFetch]) tooltipDataCache[nameToFetch].football = data;
              const fc = tooltipElement ? tooltipElement.querySelector('.wikihover-football-content') : null;
              if (isTooltipVisible && fc) {
                updateFootballContent(fc, data, currentWord);
                if (dataHasContent('football', data)) showTabButton(tooltipElement, 'football');
                else hideTabButton(tooltipElement, 'football');
                debouncedRepositionTooltip();
              }
            }).catch(error => {
              footballProgress.failProgress();
              revealTabIconColor(tooltipElement, 'football');
              const fc = tooltipElement ? tooltipElement.querySelector('.wikihover-football-content') : null;
              if (isTooltipVisible && fc) {
                fc.innerHTML = `<p>Error fetching football data: ${error.message}</p>`;
              }
            });
          }
        } else if (footballCont) {
          footballCont.innerHTML = '<p>Football data source is disabled in settings.</p>';
          revealTabIconColor(tooltipElement, 'football');
        }
        };

        tabFetchers.tiktok = () => {
        if (dataSourceSettings.tiktok) {
          const tiktokProgress = createBrandedProgressIndicator('tiktok.com', '#fe2c55', 'Loading TikTok');
          tiktokContent.innerHTML = '';
          tiktokContent.appendChild(tiktokProgress.element);

          deduplicatedFetch(`tiktok_${nameToFetch}`, () => fetchTikTokData(nameToFetch)).then(async data => {
            await tiktokProgress.finishProgress();
            revealTabIconColor(tooltipElement, 'tiktok');
            if (tooltipDataCache[nameToFetch]) tooltipDataCache[nameToFetch].tiktok = data;
            if (isTooltipVisible && currentHoveredElement === event.target) {
              updateTikTokContent(tiktokContent, data, currentWord);
              if (dataHasContent('tiktok', data)) showTabButton(tooltipElement, 'tiktok');
              else hideTabButton(tooltipElement, 'tiktok');
              debouncedRepositionTooltip();
            }
          }).catch(error => {
            tiktokProgress.failProgress();
            revealTabIconColor(tooltipElement, 'tiktok');
            if (isTooltipVisible && currentHoveredElement === event.target) {
              tiktokContent.innerHTML = `<p>Error fetching TikTok data: ${error.message}</p>`;
            }
          });
        } else {
          tiktokContent.innerHTML = '<p>TikTok data source is disabled in settings.</p>';
          revealTabIconColor(tooltipElement, 'tiktok');
        }
        };

        tabFetchers.pinterest = () => {
        if (dataSourceSettings.pinterest) {
          const pinterestProgress = createBrandedProgressIndicator('pinterest.com', '#E60023', 'Loading Pinterest');
          pinterestContent.innerHTML = '';
          pinterestContent.appendChild(pinterestProgress.element);

          deduplicatedFetch(`pinterest_${nameToFetch}`, () => fetchPinterestData(nameToFetch)).then(async data => {
            await pinterestProgress.finishProgress();
            revealTabIconColor(tooltipElement, 'pinterest');
            if (tooltipDataCache[nameToFetch]) tooltipDataCache[nameToFetch].pinterest = data;
            if (isTooltipVisible && currentHoveredElement === event.target) {
              updatePinterestContent(pinterestContent, data, currentWord);
              if (dataHasContent('pinterest', data)) showTabButton(tooltipElement, 'pinterest');
              else hideTabButton(tooltipElement, 'pinterest');
              debouncedRepositionTooltip();
            }
          }).catch(error => {
            pinterestProgress.failProgress();
            revealTabIconColor(tooltipElement, 'pinterest');
            if (isTooltipVisible && currentHoveredElement === event.target) {
              pinterestContent.innerHTML = `<p>Error fetching Pinterest data: ${error.message}</p>`;
            }
          });
        } else {
          pinterestContent.innerHTML = '<p>Pinterest data source is disabled in settings.</p>';
          revealTabIconColor(tooltipElement, 'pinterest');
        }
        };

        // Switch to the first enabled tab
        switchTab(firstEnabledTab);

        // Defer firing fetchers by 2 frames so the B&W icon state paints first,
        // then icons fill with color as each feed completes.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            Object.entries(tabFetchers).forEach(([key, fetcher]) => {
              if (!fetchedTabs.has(key)) {
                fetchedTabs.add(key);
                fetcher();
              }
            });
          });
        });

      } catch (error) {
        console.error('WikiHover: Error handling name hover:', error);
      }
    }
  }, TOOLTIP_DELAY);
}

// Track mouse position only when tooltip is visible
let _mouseX = 0;
let _mouseY = 0;
let mouseMoveListenerActive = false;

function onMouseMove(e) {
  _mouseX = e.clientX;
  _mouseY = e.clientY;
}

function startTrackingMouse() {
  if (!mouseMoveListenerActive) {
    document.addEventListener('mousemove', onMouseMove);
    mouseMoveListenerActive = true;
  }
}

function stopTrackingMouse() {
  if (mouseMoveListenerActive) {
    document.removeEventListener('mousemove', onMouseMove);
    mouseMoveListenerActive = false;
  }
}

// Function to check if mouse is over tooltip
function isMouseOverTooltip() {
  if (!tooltipElement) return false;

  const tooltip = tooltipElement.getBoundingClientRect();

  return (
    _mouseX >= tooltip.left &&
    _mouseX <= tooltip.right &&
    _mouseY >= tooltip.top &&
    _mouseY <= tooltip.bottom
  );
}

// Function to check if mouse is over the currently hovered name element
function isMouseOverHoveredName() {
  if (!currentHoveredElement) return false;
  const rect = currentHoveredElement.getBoundingClientRect();
  return (
    _mouseX >= rect.left &&
    _mouseX <= rect.right &&
    _mouseY >= rect.top &&
    _mouseY <= rect.bottom
  );
}

// Function to show tooltip
function showTooltip() {
  if (!tooltipElement) {
    createTooltip();
  }

  if (!currentHoveredElement) return;

  // Track whether the tooltip was already visible so we can re-pop for between-names
  const wasVisible = isTooltipVisible && tooltipElement.classList.contains('visible');

  // Use setProperty with 'important' to override the CSS `!important` rules that
  // keep the element hidden (visibility:hidden). This renders the
  // element in its initial animation state (opacity:0, scale:0.92 from CSS) so the
  // browser has a "before" state to transition FROM.
  tooltipElement.style.setProperty('visibility', 'visible', 'important');
  tooltipElement.style.setProperty('z-index', '9999999', 'important');
  tooltipElement.style.setProperty('position', 'fixed', 'important');
  tooltipElement.style.setProperty('pointer-events', 'auto', 'important');

  isTooltipVisible = true;
  // Position and set the grow-from transform-origin before the animation starts
  if (!tooltipElement.getAttribute('data-dragged')) {
    cachedTooltipWidth = 0;
    cachedTooltipHeight = 0;
    repositionTooltip();
  }

  if (wasVisible) {
    // Moving between names: snap back to scale(0.92)/opacity(0) without transition,
    // then let the spring enter run from that state.
    tooltipElement.classList.remove('visible');
    tooltipElement.style.setProperty('transition', 'none', 'important');
    tooltipElement.style.setProperty('transform', 'scale(0.92)', 'important');
    tooltipElement.style.setProperty('opacity', '0', 'important');
    void tooltipElement.offsetHeight; // commit the collapsed state
    // Remove inline overrides — CSS base values (scale:0.92, opacity:0) take over
    tooltipElement.style.removeProperty('transition');
    tooltipElement.style.removeProperty('transform');
    tooltipElement.style.removeProperty('opacity');
  } else {
    // Force a reflow so the browser commits the initial state (opacity:0, scale:0.92).
    // Without this, the browser batches the display change + .visible together and
    // skips the transition entirely.
    void tooltipElement.offsetHeight;
  }

  // Next frame: add .visible to trigger the CSS spring enter transition
  requestAnimationFrame(() => {
    if (!tooltipElement || !isTooltipVisible) return;
    tooltipElement.classList.add('visible');
    // Constrain content height so scrollbar stays above footer (no overlap)
    requestAnimationFrame(() => {
      if (!tooltipElement || !isTooltipVisible) return;
      const h = tooltipElement.offsetHeight;
      const w = tooltipElement.offsetWidth;
      if (h > 0 && w > 0) applyTooltipSize(tooltipElement, w, h);
    });
  });

  // Start tracking mouse when tooltip is visible
  startTrackingMouse();
}

// Function to reposition tooltip to fit in viewport (never cut off)
function repositionTooltip() {
  if (!tooltipElement || !isTooltipVisible || !currentHoveredElement) return;
  // Don't reposition if user has dragged the tooltip
  if (tooltipElement.getAttribute('data-dragged')) return;

  const margin = 10;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Use cached dimensions if available (tooltip size doesn't change while visible)
  if (!cachedTooltipWidth || !cachedTooltipHeight) {
    cachedTooltipWidth = tooltipElement.offsetWidth;
    cachedTooltipHeight = tooltipElement.offsetHeight;
  }
  const tooltipWidth = cachedTooltipWidth;
  const tooltipHeight = cachedTooltipHeight;

  const rect = currentHoveredElement.getBoundingClientRect();

  // Horizontal: center on element, then clamp so tooltip stays fully in viewport
  const elementCenterX = rect.left + (rect.width / 2);
  let posX = elementCenterX - (tooltipWidth / 2);
  posX = Math.max(margin, Math.min(posX, viewportWidth - tooltipWidth - margin));

  // Vertical: choose above vs below based on which side has more space, then clamp
  const spaceBelow = viewportHeight - (rect.bottom + margin);
  const spaceAbove = rect.top - margin;
  const preferBelow = spaceBelow >= spaceAbove && spaceBelow >= tooltipHeight;
  let posY;
  if (preferBelow) {
    posY = rect.bottom + 5;
    // Clamp so tooltip does not extend past bottom of viewport
    posY = Math.min(posY, viewportHeight - tooltipHeight - margin);
    // If it would still be cut off, show above instead
    if (posY + tooltipHeight > viewportHeight - margin && spaceAbove >= tooltipHeight) {
      posY = Math.max(margin, rect.top - tooltipHeight - 5);
    }
  } else {
    posY = rect.top - tooltipHeight - 5;
    // Clamp so tooltip does not extend past top of viewport
    posY = Math.max(posY, margin);
    // If it would still be cut off, show below instead
    if (posY < margin && spaceBelow >= tooltipHeight) {
      posY = Math.min(viewportHeight - tooltipHeight - margin, rect.bottom + 5);
    }
  }
  // Final clamp to guarantee tooltip is never cut off
  posY = Math.max(margin, Math.min(posY, viewportHeight - tooltipHeight - margin));

  tooltipElement.style.left = `${posX}px`;
  tooltipElement.style.top = `${posY}px`;

  const placement = preferBelow ? 'below' : 'above';
  tooltipElement.setAttribute('data-wh-placement', placement);

  // Pin the grow-from origin to the exact center of the hovered name.
  // X: name center relative to tooltip left edge, clamped to 5–95% so it never
  //    lands outside the tooltip bounds.
  // Y: 0% when growing downward from the name, 100% when growing upward.
  if (tooltipWidth > 0) {
    const nameCenter = rect.left + rect.width / 2;
    const originXPct = Math.max(5, Math.min(95, Math.round((nameCenter - posX) / tooltipWidth * 100)));
    const originY = placement === 'below' ? '0%' : '100%';
    tooltipElement.style.setProperty('transform-origin', `${originXPct}% ${originY}`, 'important');
  }

  lastRepositionTime = Date.now();
}

// Debounced reposition for content-load updates (avoids blinking when multiple tabs load)
const debouncedRepositionTooltip = debounce(function() {
  cachedTooltipWidth = 0;
  cachedTooltipHeight = 0;
  repositionTooltip();
}, 80);

// Function to hide tooltip
function pauseAllTooltipVideos(destroy) {
  if (tooltipElement) {
    tooltipElement.querySelectorAll('video').forEach(v => {
      v.pause();
      if (destroy) {
        v.removeAttribute('src');
        v.load();
      }
    });
  }
}

function unmarkCurrentName() {
  const name = currentWord;
  const el = currentHoveredElement;
  if (!name) return;

  // Add to unmarked set and persist
  unmarkedNames.add(name);
  safeStorageSet({ unmarkedNames: Array.from(unmarkedNames) });

  // Unwrap all matching name spans on the page
  document.querySelectorAll(`.wikihover-name[data-name="${CSS.escape(name)}"]`).forEach(span => {
    const text = document.createTextNode(span.textContent);
    span.parentNode.replaceChild(text, span);
  });

  // Remove from markedNames so it won't be re-scanned
  markedNames.delete(name);
  markedByDocument.delete(name);

  hideTooltip();
}

function hideTooltip() {
  // Suppress hide during family-tree navigation grace period
  if (Date.now() < tooltipHideGraceUntil) return;
  if (tooltipElement) {
    // Destroy all playing videos (remove src to free resources)
    pauseAllTooltipVideos(true);

    // Trigger the CSS exit transition (scale→0.92, opacity→0).
    // Keep display:flex + visibility:visible alive so the element can animate.
    tooltipElement.classList.remove('visible');
    isTooltipVisible = false;
    cachedTooltipWidth = 0;
    cachedTooltipHeight = 0;

    // Block pointer events during exit so user can't re-trigger while animating
    tooltipElement.style.setProperty('pointer-events', 'none', 'important');

    // Reset navigation history and stop tracking immediately
    tooltipNavHistory = [];
    tooltipNavIndex = -1;
    navFromHistory = false;
    updateNavButtons();
    stopTrackingMouse();

    // After exit transition (180ms) + small buffer, do full cleanup
    const el = tooltipElement;
    setTimeout(() => {
      if (isTooltipVisible || !el) return;

      // Remove inline overrides so CSS !important rules restore hidden state.
      el.style.removeProperty('visibility');
      el.style.removeProperty('opacity');
      el.style.removeProperty('transform');
      el.style.removeProperty('transform-origin');
      el.style.removeProperty('z-index');
      el.style.removeProperty('pointer-events');
      el.removeAttribute('data-positioned');
      el.removeAttribute('data-dragged');
      el.style.removeProperty('position');

      // Clear content
      const title = el.querySelector('.wikihover-title');
      if (title) title.textContent = '';
      el.querySelector('.wikihover-wiki-content').innerHTML = '';
      el.querySelector('.wikihover-tvmaze-content').innerHTML = '';
      el.querySelector('.wikihover-imdb-content').innerHTML = '';
      const booksCont = el.querySelector('.wikihover-books-content');
      if (booksCont) booksCont.innerHTML = '';
      const twitterCont = el.querySelector('.wikihover-twitter-content');
      if (twitterCont) twitterCont.innerHTML = '';
      const footballCont = el.querySelector('.wikihover-football-content');
      if (footballCont) footballCont.innerHTML = '';
      el.querySelectorAll('.wikihover-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-tab') === 'wiki');
      });
      el.querySelectorAll('.wikihover-content').forEach(content => {
        content.classList.toggle('active', content.classList.contains('wikihover-wiki-content'));
      });
    }, 220); // slightly after the 180ms exit transition
  }
}

// Helper function to check if an element is part of the tooltip
function isTooltipElement(element) {
  try {
    return (element.classList && (element.classList.contains('wikihover-tooltip') || element.classList.contains('wikihover-pinned-tooltip'))) ||
           (element.closest && (element.closest('.wikihover-tooltip') || element.closest('.wikihover-pinned-tooltip'))) ||
           (element.getAttribute && element.getAttribute('data-wikihover-tooltip') === 'true');
  } catch (err) {
    return false;
  }
}

// Function to fetch Wikipedia data
async function fetchWikipediaData(name) {
  if (!dataSourceSettings.wikipedia) {
    return { notFound: true };
  }

  if (wikiCache[name]) {
    const cached = wikiCache[name];
    if (cached.notFound) unhighlightNonPerson(name);
    return cached;
  }

  try {
    const key = `wiki_${name}`;
    const storageResult = await safeStorageGet([key]);
    const storageData = storageResult[key];

    if (storageData) {
      addToCache(wikiCache, name, storageData);
      if (storageData.notFound) unhighlightNonPerson(name);
      return storageData;
    }
  } catch (error) {
    console.error('WikiHover: Error reading from storage:', error);
  }

  // Use Hebrew Wikipedia for Hebrew names, English Wikipedia otherwise
  const wikiLang = isHebrewText(name) ? 'he' : 'en';
  const wikiBase = `https://${wikiLang}.wikipedia.org`;

  try {
    apiCallCount++;

    const searchName = filterConnectingWords(name);
    debugLog('Searching Wikipedia for:', searchName, `(${wikiLang})`);

    // Fire REST API (exact match) and combined search API in parallel
    // This eliminates sequential 404 → search → fetch round trips
    const restUrl = `${wikiBase}/api/rest_v1/page/summary/${encodeURIComponent(searchName)}`;
    const searchUrl = `${wikiBase}/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(name)}&gsrlimit=5&prop=extracts|pageimages|info|description|pageprops&exchars=4000&exlimit=5&piprop=thumbnail|original&pithumbsize=200&inprop=url&ppprop=wikibase_item&format=json&origin=*`;

    // Try direct fetch first; fall back to background proxy if blocked by page CSP
    async function fetchWithFallback(url) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);
        const resp = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        return resp;
      } catch (e) {
        // Direct fetch failed (CSP block or timeout), proxy through background
        const proxyResp = await safeSendMessage({ action: 'proxyFetch', url });
        if (proxyResp?.success) {
          // Wrap in a Response-like object
          return { ok: true, json: () => Promise.resolve(proxyResp.data) };
        }
        throw e; // re-throw original error if proxy also failed
      }
    }

    const [restResult, searchResult] = await Promise.allSettled([
      fetchWithFallback(restUrl),
      fetchWithFallback(searchUrl)
    ]);

    // Strict name matching: Wikipedia title must contain all parts of the searched name
    const namePartsLower = name.toLowerCase().split(/\s+/);
    function wikiTitleMatchesName(title) {
      const titleLower = title.toLowerCase();
      return namePartsLower.every(part => titleLower.includes(part));
    }

    // Try REST API first (exact match - preferred, has cleaner extract_html)
    if (restResult.status === 'fulfilled' && restResult.value.ok) {
      const data = await restResult.value.json();

      // Strict check: reject if Wikipedia title doesn't match the searched name
      if (!wikiTitleMatchesName(data.title)) {
        debugLog('REST API title mismatch:', data.title, 'vs', name);
      } else {
        const pageUrl = data.content_urls?.desktop?.page || `${wikiBase}/wiki/${encodeURIComponent(data.title)}`;

        // Fetch extended content (more than just intro) in parallel with media
        let extendedExtract = data.extract_html || data.extract;
        try {
          const extendedUrl = `${wikiBase}/w/api.php?action=query&titles=${encodeURIComponent(data.title)}&prop=extracts|pageimages&exchars=4000&piprop=original&pilimit=1&format=json&origin=*`;
          const extendedResp = await fetchWithFallback(extendedUrl);
          if (extendedResp.ok) {
            const extendedData = await extendedResp.json();
            const pages = extendedData.query?.pages;
            if (pages) {
              const page = Object.values(pages)[0];
              if (page?.extract) extendedExtract = page.extract;
            }
          }
        } catch (e) {
          debugLog('Extended extract fetch failed, using summary');
        }

        const result = {
          title: data.title,
          description: data.description || '',
          extract: extendedExtract,
          url: pageUrl,
          thumbnail: data.thumbnail?.source,
          originalimage: data.originalimage?.source || '',
          wikibase_item: data.wikibase_item || '',
          timestamp: Date.now()
        };

        // Wikipedia-based person verification for dual approval
        const personVerdict = isPersonByWikipedia(result);
        if (personVerdict === true) confirmPersonByWikipedia(name);
        else if (personVerdict === false) unhighlightNonPerson(name);

        addToCache(wikiCache, name, result);
        safeStorageSet({ [`wiki_${name}`]: result });
        return result;
      }
    }

    // REST failed (404 or other), use search results (already fetched in parallel)
    if (searchResult.status === 'fulfilled' && searchResult.value.ok) {
      const searchData = await searchResult.value.json();

      if (searchData.query && searchData.query.pages) {
        // Only consider pages whose title matches the searched name strictly
        const matchingPages = Object.values(searchData.query.pages)
          .filter(p => p.pageid && wikiTitleMatchesName(p.title))
          .sort((a, b) => (a.index || 0) - (b.index || 0));

        if (matchingPages.length > 0) {
          let bestPage = matchingPages[0];
          const nameLower = name.toLowerCase();

          // Prefer exact title match
          for (const page of matchingPages) {
            if (page.title.toLowerCase() === nameLower) {
              bestPage = page;
              break;
            }
          }

          // Check for person indicators in extract
          if (bestPage === matchingPages[0] && matchingPages.length > 1) {
            const personIndicators = wikiLang === 'he'
              ? ['ביוגרפיה', 'שחקן', 'שחקנית', 'פוליטיקאי', 'סופר', 'סופרת',
                 'במאי', 'מוזיקאי', 'אמן', 'מדען', 'פרופסור', 'פעיל', 'פילוסוף']
              : ['biography', 'actor', 'actress', 'politician', 'author',
                 'writer', 'director', 'musician', 'artist', 'player',
                 'scientist', 'professor', 'activist', 'philosopher'];

            for (const page of matchingPages) {
              const extractLower = (page.extract || '').toLowerCase();
              if (personIndicators.some(ind => extractLower.includes(ind))) {
                bestPage = page;
                break;
              }
            }
          }

          const result = {
            title: bestPage.title,
            description: bestPage.description || '',
            extract: bestPage.extract || '',
            url: bestPage.fullurl || `${wikiBase}/wiki/${encodeURIComponent(bestPage.title)}`,
            thumbnail: bestPage.thumbnail?.source,
            originalimage: bestPage.original?.source || '',
            wikibase_item: bestPage.pageprops?.wikibase_item || '',
            timestamp: Date.now()
          };

          // Wikipedia-based person verification for dual approval
          const personVerdict = isPersonByWikipedia(result);
          if (personVerdict === true) confirmPersonByWikipedia(name);
          else if (personVerdict === false) unhighlightNonPerson(name);

          addToCache(wikiCache, name, result);
          safeStorageSet({ [`wiki_${name}`]: result });
          return result;
        }
      }
    }

    // Nothing found from either API — unmark so we don't show a highlight for names with no Wikipedia data
    const notFoundResult = {
      notFound: true,
      title: name,
      extract: `No Wikipedia information found for "${name}".`,
      url: `${wikiBase}/wiki/Special:Search?search=${encodeURIComponent(name)}`,
      timestamp: Date.now()
    };
    addToCache(wikiCache, name, notFoundResult);
    unhighlightNonPerson(name);
    return notFoundResult;
  } catch (error) {
    console.error('WikiHover: Error fetching Wikipedia data:', error);

    const errorResult = {
      notFound: true,
      title: name,
      extract: `Error fetching Wikipedia data: ${error.message}`,
      url: `${wikiBase}/wiki/Special:Search?search=${encodeURIComponent(name)}`,
      timestamp: Date.now()
    };

    addToCache(wikiCache, name, errorResult);
    unhighlightNonPerson(name);

    return errorResult;
  }
}

// Determine if a Wikipedia result describes a person based on description and extract.
// Returns true (person), false (not person), or null (uncertain).
function isPersonByWikipedia(wikiData) {
  if (!wikiData || wikiData.notFound) return null;

  const desc = (wikiData.description || '').toLowerCase();
  const extract = (wikiData.extract || '').toLowerCase().substring(0, 500);

  // --- STRONG PERSON SIGNALS (description-based) ---
  if (/\(born\s+\d{4}\)/.test(desc) || /\(born\s+\w+\s+\d{1,2},?\s+\d{4}\)/.test(desc)) {
    return true;
  }
  if (/\(\d{4}\s*[–\-]\s*\d{4}\)/.test(desc) && !NON_PERSON_DESC_WORDS.some(w => desc.includes(w))) {
    return true;
  }

  const hasPersonWord = PERSON_DESC_WORDS.some(w => desc.includes(w));
  const hasNonPersonWord = NON_PERSON_DESC_WORDS.some(w => desc.includes(w));

  if (hasPersonWord) {
    const firstPersonIdx = Math.min(...PERSON_DESC_WORDS.filter(w => desc.includes(w)).map(w => desc.indexOf(w)));
    const firstNonPersonIdx = hasNonPersonWord
      ? Math.min(...NON_PERSON_DESC_WORDS.filter(w => desc.includes(w)).map(w => desc.indexOf(w)))
      : Infinity;
    if (firstPersonIdx < firstNonPersonIdx) return true;
  }

  // --- STRONG NON-PERSON SIGNALS (description-based) ---
  if (hasNonPersonWord) return false;

  // --- EXTRACT-BASED SIGNALS (weaker fallback) ---
  const bornInExtract = /\(born\s/.test(extract) || /was born\s/.test(extract);
  if (bornInExtract) return true;

  const personExtractPatterns = [
    /is (?:a|an) \w+ (?:actor|actress|singer|musician|filmmaker|director|politician|author|writer|player|athlete|entrepreneur|model|comedian|host|chef|designer|journalist|lawyer|physician|engineer|scientist|professor|painter|sculptor|dancer|choreographer|photographer|broadcaster|announcer|executive|general|admiral|soldier|pilot|astronaut|activist|philanthropist|monarch|prince|princess|king|queen|bishop|rabbi|imam|pastor|pope)/,
    /is (?:a|an) \w+ (?:and \w+ )?(?:who|known for|best known|famous|noted|recognized|renowned)/,
  ];
  if (personExtractPatterns.some(p => p.test(extract))) return true;

  const nonPersonExtractPatterns = [
    /is (?:a|an) (?:\d{4} )?\w+ (?:film|movie|series|show|album|song|book|novel|game|franchise|brand|company|organization|city|town|country|state|province|river|mountain|building|monument|stadium|airport|university|school|college|hospital|church|temple|mosque|museum|park|bridge|highway|railroad|ship|aircraft|satellite|planet|constellation)/,
    /is (?:a|an) (?:municipality|district|region|territory|island|lake|ocean|desert|forest|valley)/,
    /is the (?:capital|largest|most populous)/,
    /(?:are|is) (?:people|peoples|an? ethnic|an? ethnicity)/,
    /is a country (?:primarily|located|in|spanning|on|comprising)/,
  ];
  if (nonPersonExtractPatterns.some(p => p.test(extract))) return false;

  return null;
}

// Occupation/role words that strongly indicate a person in Wikipedia description
const PERSON_DESC_WORDS = [
  'actor', 'actress', 'singer', 'songwriter', 'musician', 'rapper', 'composer',
  'filmmaker', 'director', 'producer', 'screenwriter', 'cinematographer',
  'politician', 'president', 'senator', 'governor', 'prime minister', 'mayor',
  'author', 'writer', 'novelist', 'poet', 'playwright', 'journalist', 'editor',
  'athlete', 'player', 'footballer', 'basketball', 'baseball', 'tennis',
  'boxer', 'wrestler', 'swimmer', 'golfer', 'skier', 'sprinter', 'marathon',
  'entrepreneur', 'businessman', 'businesswoman', 'executive', 'ceo', 'founder',
  'model', 'comedian', 'host', 'presenter', 'broadcaster', 'anchor',
  'scientist', 'physicist', 'chemist', 'biologist', 'mathematician', 'astronomer',
  'professor', 'scholar', 'academic', 'researcher', 'historian', 'philosopher',
  'artist', 'painter', 'sculptor', 'photographer', 'architect', 'designer',
  'chef', 'lawyer', 'judge', 'physician', 'surgeon', 'nurse', 'psychologist',
  'engineer', 'inventor', 'astronaut', 'pilot', 'general', 'admiral', 'soldier',
  'activist', 'philanthropist', 'socialite', 'influencer', 'youtuber', 'streamer',
  'monarch', 'prince', 'princess', 'king', 'queen', 'duke', 'duchess',
  'bishop', 'rabbi', 'imam', 'pastor', 'pope', 'cardinal', 'cleric',
  'dancer', 'choreographer', 'magician', 'illusionist',
  'criminal', 'serial killer', 'mobster', 'spy',
];

// Words in Wikipedia description that strongly indicate NOT a person
const NON_PERSON_DESC_WORDS = [
  'film', 'movie', 'series', 'show', 'television', 'tv ',
  'album', 'song', 'single', 'soundtrack', 'ep ',
  'book', 'novel', 'manga', 'comic', 'magazine', 'newspaper',
  'game', 'video game', 'franchise', 'media franchise',
  'band', 'rock band', 'musical group', 'music group', 'ensemble', 'orchestra',
  'choir', 'duo', 'trio', 'quartet', 'supergroup',
  'city', 'town', 'village', 'municipality', 'district', 'county', 'borough',
  'country in', 'country primaril', 'country located', 'country spanning', 'country comprising',
  'sovereign state', 'u.s. state', 'province', 'territory', 'region',
  'people', 'peoples', 'ethnic group', 'ethnic',
  'island', 'river', 'lake', 'mountain', 'ocean', 'desert', 'valley', 'peninsula',
  'painting', 'sculpture', 'artwork', 'mural', 'fresco', 'mosaic',
  'building', 'monument', 'memorial', 'tower', 'palace', 'castle', 'cathedral',
  'stadium', 'arena', 'airport', 'station', 'bridge', 'highway', 'tunnel',
  'university', 'school', 'college', 'academy', 'institute', 'library',
  'hospital', 'church', 'temple', 'mosque', 'synagogue', 'monastery',
  'museum', 'gallery', 'theater', 'theatre', 'park', 'garden', 'zoo',
  'company', 'corporation', 'conglomerate', 'organization', 'organisation', 'foundation',
  'brand', 'product', 'software', 'website', 'app ',
  'award', 'prize', 'medal', 'trophy', 'championship', 'tournament', 'competition',
  'multi-sport event', 'sporting event',
  'team', 'club', 'league', 'conference', 'association', 'federation',
  'ship', 'aircraft', 'satellite', 'spacecraft', 'rocket',
  'planet', 'star system', 'constellation', 'asteroid', 'comet',
  'species', 'genus', 'breed', 'dinosaur',
  'language', 'dialect', 'script', 'alphabet',
  'holiday', 'festival', 'ceremony', 'event',
  'war', 'battle', 'conflict', 'treaty', 'agreement',
  'law', 'act of', 'amendment', 'constitution',
  'food', 'dish', 'beverage', 'wine', 'beer', 'cocktail',
  'car', 'vehicle', 'motorcycle', 'locomotive', 'train',
  'algorithm', 'theorem', 'equation', 'protocol', 'standard',
];

// Create a name span with hover listeners (used by markName and markNameInDocument).
// displayText: what to show in the DOM; dataName: value for data-name (for lookups).
function createNameSpan(displayText, dataName) {
  const name = dataName != null ? dataName : normalizeNameForDedup(displayText);
  const span = document.createElement('span');
  span.className = 'wikihover-name';
  span.textContent = displayText;
  span.setAttribute('data-name', name);
  span.setAttribute('data-wikihover', 'true');
  span.addEventListener('mouseenter', handleNameHover);
  span.addEventListener('mouseleave', function() {
    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(function() {
      if (Date.now() - lastRepositionTime < REPOSITION_GRACE_MS) return;
      if (!isMouseOverTooltip()) hideTooltip();
    }, TOOLTIP_DELAY);
  });
  markedNames.add(name);
  return span;
}

// Mark all occurrences of a name in the document (called only after Wikipedia confirms data).
function markNameInDocument(name) {
  const normalized = normalizeNameForDedup(name);
  if (notPersonNames.has(normalized)) return;
  // Guard: skip if this name was already marked by a previous markNameInDocument call
  if (markedByDocument.has(normalized)) return;
  markedByDocument.add(normalized);
  const cleanName = normalized;

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  const pattern = new RegExp('(\\b' + escapeRegex(cleanName) + '\\b)', 'g');

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function(node) {
      if (!node.parentElement) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (parent.closest && (parent.closest('script, style, noscript') || parent.closest('.wikihover-tooltip, .wikihover-pinned-tooltip, .wikihover-processed, .wikihover-name'))) return NodeFilter.FILTER_REJECT;
      if (node.textContent.indexOf(cleanName) === -1) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodesToReplace = [];
  while (walker.nextNode()) {
    nodesToReplace.push(walker.currentNode);
  }

  nodesToReplace.forEach(textNode => {
    const text = textNode.textContent;
    const parts = text.split(pattern);
    if (parts.length <= 1) return;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 1 && parts[i] !== '') {
        fragment.appendChild(createNameSpan(parts[i], cleanName));
      } else if (parts[i] !== '') {
        fragment.appendChild(document.createTextNode(parts[i]));
      }
    }
    textNode.parentNode.replaceChild(fragment, textNode);
  });
}

// Un-highlight a name that Wikipedia confirmed is not a person.
// Finds all DOM spans for this name, removes the hover behavior and styling,
// and adds the name to notPersonNames so it's skipped on future scans.
function unhighlightNonPerson(name) {
  const normalized = normalizeNameForDedup(name);
  notPersonNames.add(normalized);

  // Find all spans with this name and revert them to plain text
  const spans = document.querySelectorAll(`.wikihover-name[data-name="${CSS.escape(normalized)}"]`);
  spans.forEach(span => {
    const textNode = document.createTextNode(span.textContent);
    span.parentNode.replaceChild(textNode, span);
  });

  // Remove from markedNames tracking
  markedNames.delete(normalized);
  markedByDocument.delete(normalized);
  debugLog('un-highlighted non-person (Wikipedia):', name);
}

// Highlight a name that Wikipedia confirmed IS a person.
// Adds to confirmedPersonNames so future scans always mark it even if NLP rejects.
function confirmPersonByWikipedia(name) {
  const normalized = normalizeNameForDedup(name);
  confirmedPersonNames.add(normalized);
  debugLog('confirmed person (Wikipedia):', name);
}

// Fetch birth/death info from Wikidata
async function fetchWikidataBirthInfo(wikidataId) {
  if (!wikidataId) return null;

  if (wikidataCache[wikidataId]) return wikidataCache[wikidataId];

  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${encodeURIComponent(wikidataId)}&props=claims&format=json&origin=*`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data = await resp.json();

    const entity = data.entities?.[wikidataId];
    if (!entity) return null;

    const claims = entity.claims || {};
    const birthInfo = {};

    // P569 = date of birth
    const dobClaim = claims.P569?.[0]?.mainsnak?.datavalue?.value;
    if (dobClaim?.time) {
      const match = dobClaim.time.match(/\+(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const year = parseInt(match[1]);
        const month = parseInt(match[2]);
        const day = parseInt(match[3]);
        birthInfo.birthDate = `${months[month - 1]} ${day}, ${year}`;
      }
    }

    // P570 = date of death
    const dodClaim = claims.P570?.[0]?.mainsnak?.datavalue?.value;
    if (dodClaim?.time) {
      const match = dodClaim.time.match(/\+(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const year = parseInt(match[1]);
        const month = parseInt(match[2]);
        const day = parseInt(match[3]);
        birthInfo.deathDate = `${months[month - 1]} ${day}, ${year}`;
      }
    }

    // P19 = place of birth, P27 = country of citizenship - collect entity IDs to resolve
    const entityIds = [];
    const pobId = claims.P19?.[0]?.mainsnak?.datavalue?.value?.id;
    const countryId = claims.P27?.[0]?.mainsnak?.datavalue?.value?.id;
    if (pobId) entityIds.push(pobId);
    if (countryId && countryId !== pobId) entityIds.push(countryId);

    // Simple string/URL values — no entity resolution needed
    // P2002 = Twitter/X username
    const twitterClaim = claims.P2002?.[0]?.mainsnak?.datavalue?.value;
    if (twitterClaim) birthInfo.twitterUsername = twitterClaim;

    // P7085 = TikTok username
    const tiktokClaim = claims.P7085?.[0]?.mainsnak?.datavalue?.value;
    if (tiktokClaim) birthInfo.tiktokUsername = tiktokClaim;

    // P3836 = Pinterest username
    const pinterestClaim = claims.P3836?.[0]?.mainsnak?.datavalue?.value;
    if (pinterestClaim) birthInfo.pinterestUsername = pinterestClaim;

    // P856 = official website
    const websiteClaim = claims.P856?.[0]?.mainsnak?.datavalue?.value;
    if (websiteClaim) birthInfo.website = websiteClaim;

    // P2048 = height (quantity → centimetres)
    const heightClaim = claims.P2048?.[0]?.mainsnak?.datavalue?.value;
    if (heightClaim?.amount) {
      const cm = parseFloat(heightClaim.amount);
      if (cm > 0) birthInfo.height = cm;
    }

    // P1971 = number of children
    const childrenClaim = claims.P1971?.[0]?.mainsnak?.datavalue?.value;
    if (childrenClaim?.amount) birthInfo.childrenCount = parseInt(childrenClaim.amount);

    // Entity-ID values — collect IDs for batch resolution
    // P106 = occupation (all values)
    const occupationIds = (claims.P106 || [])
      .map(c => c.mainsnak?.datavalue?.value?.id).filter(Boolean);

    // P69 = educated at (all values)
    const educationIds = (claims.P69 || [])
      .map(c => c.mainsnak?.datavalue?.value?.id).filter(Boolean);

    // P26 = spouse (all values)
    const spouseIds = (claims.P26 || [])
      .map(c => c.mainsnak?.datavalue?.value?.id).filter(Boolean);

    // P39 = position held (top 3)
    const positionIds = (claims.P39 || []).slice(0, 3)
      .map(c => c.mainsnak?.datavalue?.value?.id).filter(Boolean);

    // P166 = award received (top 5)
    const awardIds = (claims.P166 || []).slice(0, 5)
      .map(c => c.mainsnak?.datavalue?.value?.id).filter(Boolean);

    // P509 = cause of death
    const causeOfDeathId = claims.P509?.[0]?.mainsnak?.datavalue?.value?.id;

    // Add all entity IDs to batch resolution
    entityIds.push(...occupationIds, ...educationIds, ...spouseIds, ...positionIds, ...awardIds);
    if (causeOfDeathId) entityIds.push(causeOfDeathId);

    // Resolve all entity labels in one batch call
    const resolvedLabels = {};
    if (entityIds.length > 0) {
      try {
        // Deduplicate IDs
        const uniqueIds = [...new Set(entityIds)];
        const labelsUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${uniqueIds.join('|')}&props=labels&languages=en|he&format=json&origin=*`;
        const labelsResp = await fetch(labelsUrl);
        if (labelsResp.ok) {
          const labelsData = await labelsResp.json();
          const entities = labelsData.entities || {};

          // Build resolved labels map
          for (const id of uniqueIds) {
            if (entities[id]) {
              resolvedLabels[id] = entities[id].labels?.en?.value || entities[id].labels?.he?.value || '';
            }
          }

          if (pobId && resolvedLabels[pobId]) {
            birthInfo.birthPlace = resolvedLabels[pobId];
          }
          if (countryId && resolvedLabels[countryId]) {
            birthInfo.country = resolvedLabels[countryId];
          }
        }
      } catch (e) {
        debugLog('Error resolving Wikidata labels:', e);
      }
    }

    // Map resolved labels back to fields
    const resolved = id => resolvedLabels[id];
    birthInfo.occupations = occupationIds.map(resolved).filter(Boolean);
    birthInfo.education = educationIds.map(resolved).filter(Boolean);
    birthInfo.spouses = spouseIds.map(resolved).filter(Boolean);
    birthInfo.positions = positionIds.map(resolved).filter(Boolean);
    birthInfo.awards = awardIds.map(resolved).filter(Boolean);
    if (causeOfDeathId && resolvedLabels[causeOfDeathId]) {
      birthInfo.causeOfDeath = resolvedLabels[causeOfDeathId];
    }

    // P2003 = Instagram username
    const instagramClaim = claims.P2003?.[0]?.mainsnak?.datavalue?.value;
    if (instagramClaim) {
      birthInfo.instagramUsername = instagramClaim;
    }

    // Only cache if we found something useful
    if (birthInfo.birthDate || birthInfo.birthPlace || birthInfo.country || birthInfo.instagramUsername ||
        birthInfo.occupations?.length || birthInfo.education?.length || birthInfo.spouses?.length ||
        birthInfo.awards?.length || birthInfo.twitterUsername || birthInfo.tiktokUsername || birthInfo.pinterestUsername || birthInfo.website) {
      addToCache(wikidataCache, wikidataId, birthInfo);
      return birthInfo;
    }
    return null;
  } catch (error) {
    debugLog('Error fetching Wikidata birth info:', error);
    return null;
  }
}

// Fetch family tree relationships from Wikidata SPARQL
async function fetchWikidataFamilyTree(wikidataId) {
  if (!wikidataId) return null;

  const cacheKey = `${wikidataId}_family`;
  if (wikidataCache[cacheKey]) return wikidataCache[cacheKey];

  try {
    const query = `SELECT DISTINCT ?relation ?personLabel ?personId ?image ?birthDate ?deathDate WHERE {
  VALUES (?prop ?relation) {
    (wdt:P22 "father")
    (wdt:P25 "mother")
    (wdt:P26 "spouse")
    (wdt:P40 "child")
    (wdt:P3373 "sibling")
  }
  wd:${wikidataId} ?prop ?person .
  OPTIONAL { ?person wdt:P18 ?image . }
  OPTIONAL { ?person wdt:P569 ?birthDate . }
  OPTIONAL { ?person wdt:P570 ?deathDate . }
  BIND(REPLACE(STR(?person), "http://www.wikidata.org/entity/", "") AS ?personId)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,he". }
} LIMIT 100`;

    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}`;
    const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!resp.ok) return null;
    const data = await resp.json();

    const bindings = data.results?.bindings || [];
    if (bindings.length === 0) return null;

    const familyData = { father: null, mother: null, spouses: [], children: [], siblings: [] };

    bindings.forEach(b => {
      const relation = b.relation?.value;
      const imageFile = b.image?.value || '';
      // Convert Commons file URL to a thumbnail URL
      const imageUrl = imageFile ? imageFile.replace('http://commons.wikimedia.org/wiki/Special:FilePath/', 'https://commons.wikimedia.org/wiki/Special:FilePath/') + '?width=80' : '';
      const rawBirth = b.birthDate?.value || '';
      const rawDeath = b.deathDate?.value || '';
      const birthMatch = rawBirth.match(/^(\d{4})-/);
      const deathMatch = rawDeath.match(/^(\d{4})-/);
      const person = {
        name: b.personLabel?.value || '',
        wikidataId: b.personId?.value || '',
        image: imageUrl,
        birthYear: birthMatch ? birthMatch[1] : '',
        deathYear: deathMatch ? deathMatch[1] : ''
      };
      if (!person.name || person.name === person.wikidataId) return; // skip unresolved labels

      if (relation === 'father') familyData.father = person;
      else if (relation === 'mother') familyData.mother = person;
      else if (relation === 'spouse') familyData.spouses.push(person);
      else if (relation === 'child') familyData.children.push(person);
      else if (relation === 'sibling') familyData.siblings.push(person);
    });

    if (familyData.father || familyData.mother || familyData.spouses.length ||
        familyData.children.length || familyData.siblings.length) {
      addToCache(wikidataCache, cacheKey, familyData);
      return familyData;
    }
    return null;
  } catch (error) {
    debugLog('Error fetching Wikidata family tree:', error);
    return null;
  }
}

// Update back/forward button visibility and labels based on history state
function updateNavButtons() {
  if (!tooltipElement?._navBack) return;
  const hasBack = tooltipNavIndex > 0;
  const hasFwd = tooltipNavIndex < tooltipNavHistory.length - 1;
  tooltipElement._navBack.style.display = hasBack ? 'inline-block' : 'none';
  tooltipElement._navFwd.style.display = hasFwd ? 'inline-block' : 'none';
  if (hasBack) {
    const prevName = tooltipNavHistory[tooltipNavIndex - 1];
    tooltipElement._navBack.innerHTML = '&#9664; ' + prevName;
    tooltipElement._navBack.title = prevName;
  }
  if (hasFwd) {
    const nextName = tooltipNavHistory[tooltipNavIndex + 1];
    tooltipElement._navFwd.innerHTML = nextName + ' &#9654;';
    tooltipElement._navFwd.title = nextName;
  }
}

// Navigate to a name from history (used by back/forward buttons)
function navigateToHistoryEntry(name) {
  const tempSpan = document.createElement('span');
  tempSpan.className = 'wikihover-name';
  tempSpan.setAttribute('data-name', name);
  tempSpan.setAttribute('data-wikihover', 'true');
  tempSpan.style.cssText = 'position:fixed;left:0;top:0;opacity:0;pointer-events:none;font-size:0;height:1px;';
  tempSpan.textContent = name;
  document.body.appendChild(tempSpan);

  clearTimeout(tooltipTimer);
  tooltipHideGraceUntil = Date.now() + 3000;
  if (tooltipElement) tooltipElement.setAttribute('data-dragged', 'true');
  handleNameHover({ target: tempSpan });
  setTimeout(() => tempSpan.remove(), 5000);
}

// Navigate to a person within a pinned tooltip (in-place, no new tooltip)
function navigateInPinnedTooltip(pinnedEl, name, fromHistory) {
  resetTabIconsToBw(pinnedEl);
  // Manage per-pinned navigation history
  if (!pinnedEl._navHistory) {
    pinnedEl._navHistory = [name];
    pinnedEl._navIndex = 0;
  } else if (!fromHistory) {
    // Truncate forward history and push new entry
    pinnedEl._navHistory = pinnedEl._navHistory.slice(0, pinnedEl._navIndex + 1);
    pinnedEl._navHistory.push(name);
    pinnedEl._navIndex = pinnedEl._navHistory.length - 1;
  }

  // Update nav button visibility
  const navBtns = pinnedEl.querySelectorAll('[title="Back"], [title="Forward"]');
  navBtns.forEach(btn => {
    if (btn.title === 'Back') {
      btn.style.display = pinnedEl._navIndex > 0 ? 'inline-block' : 'none';
    } else {
      btn.style.display = pinnedEl._navIndex < pinnedEl._navHistory.length - 1 ? 'inline-block' : 'none';
    }
  });

  // Update title
  const titleEl = pinnedEl.querySelector('.wikihover-title');
  if (titleEl) titleEl.textContent = name;
  pinnedEl.setAttribute('data-tooltip-name', name);

  // Show wiki tab and loader
  const wikiContent = pinnedEl.querySelector('.wikihover-wiki-content');
  if (wikiContent) wikiContent.innerHTML = '<div class="wikihover-loader"></div>';

  // Switch to wiki tab
  pinnedEl.querySelectorAll('.wikihover-content').forEach(c => {
    c.style.display = 'none';
    c.style.visibility = 'hidden';
    c.style.opacity = '0';
    c.classList.remove('active');
  });
  pinnedEl.querySelectorAll('.wikihover-tab').forEach(t => t.classList.remove('active'));
  const wikiTab = pinnedEl.querySelector('[data-tab="wiki"]');
  if (wikiTab) wikiTab.classList.add('active');
  if (wikiContent) {
    wikiContent.style.display = 'block';
    wikiContent.style.visibility = 'visible';
    wikiContent.style.opacity = '1';
    wikiContent.classList.add('active');
  }

  // Reset other tabs to show loaders (they'll lazy-fetch on click)
  const pinnedFetchedTabs = new Set();
  pinnedEl.querySelectorAll('.wikihover-content').forEach(c => {
    if (c !== wikiContent) {
      c.innerHTML = '<div class="wikihover-loader"></div>';
    }
  });

  // Re-wire tab clicks to lazy-fetch for the NEW person
  pinnedEl.querySelectorAll('.wikihover-tab').forEach(oldTab => {
    const newTab = oldTab.cloneNode(true);
    newTab.addEventListener('click', () => {
      const tabName = newTab.getAttribute('data-tab');
      pinnedEl.querySelectorAll('video').forEach(v => {
        if (v.src && !v.paused) {
          v.dataset.whSavedSrc = v.src;
          v.dataset.whSavedTime = v.currentTime;
          v.dataset.whSavedMuted = v.muted;
        }
        v.pause();
      });
      pinnedEl.querySelectorAll('.wikihover-content').forEach(c => {
        c.style.display = 'none';
        c.style.visibility = 'hidden';
        c.style.opacity = '0';
        c.classList.remove('active');
      });
      pinnedEl.querySelectorAll('.wikihover-tab').forEach(t => t.classList.remove('active'));
      newTab.classList.add('active');
      const selectedContent = pinnedEl.querySelector(`.wikihover-${tabName}-content`);
      if (selectedContent) {
        selectedContent.style.display = 'block';
        selectedContent.style.visibility = 'visible';
        selectedContent.style.opacity = '1';
        selectedContent.classList.add('active');
        const expandedVideo = selectedContent.querySelector('video[data-wh-saved-src]');
        if (expandedVideo) {
          const savedSrc = expandedVideo.dataset.whSavedSrc;
          const savedTime = parseFloat(expandedVideo.dataset.whSavedTime) || 0;
          const savedMuted = expandedVideo.dataset.whSavedMuted === 'true';
          delete expandedVideo.dataset.whSavedSrc;
          delete expandedVideo.dataset.whSavedTime;
          delete expandedVideo.dataset.whSavedMuted;
          expandedVideo.src = savedSrc;
          expandedVideo.muted = savedMuted;
          expandedVideo.addEventListener('loadeddata', function onLoaded() {
            expandedVideo.removeEventListener('loadeddata', onLoaded);
            expandedVideo.currentTime = savedTime;
            expandedVideo.play().catch(() => {});
          });
          expandedVideo.load();
        }
      }
      if (!pinnedFetchedTabs.has(tabName) && tabName !== 'wiki') {
        pinnedFetchedTabs.add(tabName);
        fetchPinnedTabData(pinnedEl, tabName, name);
      }
    });
    oldTab.parentNode.replaceChild(newTab, oldTab);
  });

  // Fetch Wikipedia data for the new person and render into the pinned tooltip
  pinnedFetchedTabs.add('wiki');
  deduplicatedFetch(`wiki_${name}`, () => fetchWikipediaData(name)).then(data => {
    if (!wikiContent || !document.body.contains(pinnedEl)) return;
    if (!data.notFound) {
      wikiContent.innerHTML = '';

      const headerContainer = document.createElement('div');
      headerContainer.style.display = 'flex';
      headerContainer.style.alignItems = 'flex-start';
      headerContainer.style.marginBottom = '12px';
      headerContainer.style.paddingBottom = '10px';
      headerContainer.style.borderBottom = '1px solid #eee';

      let headerImg = null;
      const imgSrc = data.originalimage || data.thumbnail;
      if (imgSrc) {
        headerImg = document.createElement('img');
        headerImg.src = imgSrc;
        headerImg.alt = data.title;
        headerImg.style.width = '48%';
        headerImg.style.maxWidth = '240px';
        headerImg.style.height = 'auto';
        headerImg.style.borderRadius = '8px';
        headerImg.style.marginRight = '14px';
        headerImg.style.flexShrink = '0';
        headerImg.style.display = 'block';
        headerImg.style.boxShadow = '0 1px 4px rgba(0,0,0,0.15)';
        headerContainer.appendChild(headerImg);
      }

      const titleBlock = document.createElement('div');
      titleBlock.style.flex = '1';

      const titleLink = document.createElement('a');
      titleLink.href = data.url;
      titleLink.target = '_blank';
      titleLink.style.textDecoration = 'none';

      const titleEl2 = document.createElement('h3');
      titleEl2.style.margin = '0 0 4px 0';
      titleEl2.style.fontSize = '16px';
      titleEl2.style.color = 'var(--wh-accent)';
      titleEl2.style.fontWeight = '600';
      titleEl2.textContent = data.title;
      titleLink.appendChild(titleEl2);
      titleBlock.appendChild(titleLink);

      if (data.description) {
        const descEl = document.createElement('div');
        descEl.style.fontSize = '12px';
        descEl.style.color = 'var(--wh-text-secondary)';
        descEl.style.fontStyle = 'italic';
        descEl.style.marginBottom = '4px';
        descEl.textContent = data.description;
        titleBlock.appendChild(descEl);
      }

      // Birth info placeholder
      const birthInfoEl = document.createElement('div');
      birthInfoEl.style.fontSize = '12.5px';
      birthInfoEl.style.color = 'var(--wh-text-secondary)';
      birthInfoEl.style.marginBottom = '4px';
      birthInfoEl.style.lineHeight = '1.5';
      titleBlock.appendChild(birthInfoEl);

      if (data.wikibase_item) {
        fetchWikidataBirthInfo(data.wikibase_item).then(birthData => {
          if (!birthData) return;
          const parts = [];
          if (birthData.birthDate) {
            let bornStr = `<b>Born:</b> ${birthData.birthDate}`;
            if (birthData.birthPlace || birthData.country) {
              const location = [birthData.birthPlace, birthData.country].filter(Boolean).join(', ');
              bornStr += ` — ${location}`;
            }
            parts.push(bornStr);
          }
          if (birthData.deathDate) parts.push(`<b>Died:</b> ${birthData.deathDate}`);
          if (birthData.occupations?.length) parts.push(`<span style="font-style:italic">${birthData.occupations.join(', ')}</span>`);
          if (parts.length > 0) birthInfoEl.innerHTML = parts.map(p => `<span>${p}</span>`).join('<br>');
        }).catch(() => {});
      }

      const wikiIcon = document.createElement('a');
      wikiIcon.href = data.url;
      wikiIcon.target = '_blank';
      wikiIcon.style.fontSize = '11px';
      wikiIcon.style.color = 'var(--wh-accent)';
      wikiIcon.style.textDecoration = 'none';
      wikiIcon.textContent = 'Read full article on Wikipedia →';
      titleBlock.appendChild(wikiIcon);

      // Clamp text column height to match the image height
      if (headerImg) {
        titleBlock.style.overflow = 'hidden';
        const clampToImage = () => {
          requestAnimationFrame(() => {
            if (headerImg.offsetHeight > 0) {
              titleBlock.style.maxHeight = headerImg.offsetHeight + 'px';
            }
          });
        };
        if (headerImg.complete) clampToImage();
        else headerImg.addEventListener('load', clampToImage);
      }

      headerContainer.appendChild(titleBlock);
      wikiContent.appendChild(headerContainer);

      const extractContainer = document.createElement('div');
      extractContainer.style.fontSize = '13px';
      extractContainer.style.lineHeight = '1.5';
      extractContainer.style.color = 'var(--wh-text)';
      if (data.extract) {
        const sanitized = data.extract
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
        extractContainer.innerHTML = sanitized;
      } else {
        extractContainer.textContent = 'No description available.';
      }
      wikiContent.appendChild(extractContainer);

      // Fetch and render family tree
      if (data.wikibase_item) {
        fetchWikidataFamilyTree(data.wikibase_item).then(familyData => {
          if (familyData && document.body.contains(pinnedEl)) {
            wikiContent.appendChild(createFamilyTreeElement(familyData, data.title, data.originalimage || data.thumbnail || ''));
          }
        }).catch(() => {});
      }
    } else {
      wikiContent.innerHTML = `<p>No Wikipedia information found for "${name}".</p>`;
      hideTabButton(pinnedEl, 'wiki');
    }
  }).catch(error => {
    if (wikiContent) wikiContent.innerHTML = `<p>Error fetching Wikipedia data: ${error.message}</p>`;
  });
}

// Create a clickable family member node with photo and name
function createFamilyMemberNode(person, relationLabel, compact) {
  const node = document.createElement('div');
  node.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;width:80px;';

  node.addEventListener('mouseenter', () => { node.style.opacity = '0.85'; });
  node.addEventListener('mouseleave', () => { node.style.opacity = '1'; });

  // Relation label (Father, Mother, Spouse, etc.)
  if (relationLabel) {
    const label = document.createElement('div');
    label.style.cssText = 'font-size:9px;color:var(--wh-text-muted, #999);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:4px;font-weight:500;';
    label.textContent = relationLabel;
    node.appendChild(label);
  }

  // Photo (circular)
  const imgWrap = document.createElement('div');
  imgWrap.style.cssText = 'width:64px;height:64px;border-radius:50%;overflow:hidden;background:var(--wh-border, #ddd);flex-shrink:0;border:2px solid var(--wh-border, #ddd);';
  if (person.image) {
    const img = document.createElement('img');
    img.src = person.image;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    img.alt = person.name;
    img.onerror = () => { img.style.display = 'none'; placeholder.style.display = 'flex'; };
    imgWrap.appendChild(img);
  }
  // Placeholder icon when no image
  const placeholder = document.createElement('div');
  placeholder.style.cssText = `display:${person.image ? 'none' : 'flex'};width:100%;height:100%;align-items:center;justify-content:center;font-size:30px;color:var(--wh-text-muted, #aaa);`;
  placeholder.textContent = '\uD83D\uDC64';
  imgWrap.appendChild(placeholder);
  node.appendChild(imgWrap);

  // Full name
  const nameEl = document.createElement('div');
  nameEl.style.cssText = 'font-size:10px;color:var(--wh-text, #333);font-weight:600;text-align:center;line-height:1.3;word-break:break-word;max-width:78px;margin-top:4px;';
  nameEl.textContent = person.name;
  node.appendChild(nameEl);

  const yearsStr = (() => {
    if (!person.birthYear && !person.deathYear) return '';
    if (person.birthYear && person.deathYear) return `${person.birthYear} – ${person.deathYear}`;
    if (person.birthYear) return `b. ${person.birthYear}`;
    return '';
  })();
  if (yearsStr) {
    const yearsEl = document.createElement('div');
    yearsEl.style.cssText = 'font-size:9px;color:var(--wh-text-muted, #999);text-align:center;line-height:1.2;';
    yearsEl.textContent = yearsStr;
    node.appendChild(yearsEl);
  }

  // Click loads this person's data into the current tooltip (in-place navigation)
  node.addEventListener('click', (e) => {
    e.stopPropagation();

    // Check if this family member node is inside a pinned tooltip
    const pinnedEl = node.closest('.wikihover-pinned-tooltip');
    if (pinnedEl) {
      navigateInPinnedTooltip(pinnedEl, person.name);
      return;
    }

    // Push current person to navigation history before navigating away
    if (!navFromHistory) {
      // Truncate any forward history
      tooltipNavHistory = tooltipNavHistory.slice(0, tooltipNavIndex + 1);
      tooltipNavHistory.push(person.name);
      tooltipNavIndex = tooltipNavHistory.length - 1;
    }
    navFromHistory = false;

    navigateToHistoryEntry(person.name);
  });

  return node;
}

// ── Family tree mathematical layout ─────────────────────────────────────
const TREE_NODE_W = 80;   // fixed node width (px)
const TREE_ROW_GAP = 44;  // vertical gap between rows (px)
const TREE_V_PAD = 12;    // top/bottom padding inside tree container (px)
// Circle bottom Y relative to node top, per row type (for connector geometry)
// Parents: label(~12px) + margin-bottom(4px) + flex-gap(2px) + circle(64px) = 82
const TREE_CIRCLE_BOTTOM = { parents: 82, subject: 70, children: 64 };
// Circle top Y relative to node top, per row type
const TREE_CIRCLE_TOP    = { parents: 18, subject: 0,  children: 0  };
// Node height estimate per row type (for container height and row spacing)
const TREE_NODE_H        = { parents: 114, subject: 88, children: 94 };

// Subject node: accent-ringed circle with actual photo (falls back to person icon)
function createSubjectNode(name, imageUrl) {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:2px;width:' + TREE_NODE_W + 'px;';

  const imgWrap = document.createElement('div');
  imgWrap.style.cssText = 'width:70px;height:70px;border-radius:50%;overflow:hidden;background:var(--wh-border,#ddd);flex-shrink:0;border:2.5px solid var(--wh-accent,#0645AD);display:flex;align-items:center;justify-content:center;';
  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    img.alt = name;
    img.onerror = () => { img.style.display = 'none'; placeholder.style.display = 'flex'; };
    imgWrap.appendChild(img);
  }
  const placeholder = document.createElement('div');
  placeholder.style.cssText = 'display:' + (imageUrl ? 'none' : 'flex') + ';width:100%;height:100%;align-items:center;justify-content:center;font-size:26px;color:var(--wh-accent,#0645AD);';
  placeholder.textContent = '\uD83D\uDC64';
  imgWrap.appendChild(placeholder);
  wrapper.appendChild(imgWrap);

  const nameEl = document.createElement('div');
  nameEl.style.cssText = 'font-size:10px;color:var(--wh-accent,#0645AD);font-weight:700;text-align:center;line-height:1.3;word-break:break-word;max-width:78px;margin-top:4px;';
  nameEl.textContent = name;
  wrapper.appendChild(nameEl);

  return wrapper;
}

/**
 * Render (or re-render) the family tree inside treeEl.
 * All positions computed from treeEl.offsetWidth — no getBoundingClientRect needed.
 */
function renderFamilyTree(treeEl, familyData, subjectName, subjectImage) {
  treeEl.innerHTML = '';
  const W = Math.max(treeEl.offsetWidth || 0, 200);

  // ── Build rows ─────────────────────────────────────────────────────
  const rows = [];

  const parentNodes = [];
  if (familyData.father) parentNodes.push({ person: familyData.father, label: 'Father' });
  if (familyData.mother) parentNodes.push({ person: familyData.mother, label: 'Mother' });
  if (parentNodes.length) rows.push({ type: 'parents', nodes: parentNodes });

  const subjectNodes = [{ person: { name: subjectName, isSubject: true }, label: '' }];
  familyData.spouses.forEach(s => subjectNodes.push({ person: s, label: 'Spouse' }));
  rows.push({ type: 'subject', nodes: subjectNodes });

  if (familyData.children.length) {
    rows.push({ type: 'children', nodes: familyData.children.map(c => ({ person: c, label: '' })) });
  }

  // ── Compute Y positions and centerXs ──────────────────────────────
  let currentY = TREE_V_PAD;
  rows.forEach(row => {
    row.y = currentY;
    const n = row.nodes.length;
    if (row.type === 'subject' && n > 1) {
      // Subject fixed at W/2; spouses extend right with up to 2-node-width spacing
      const rightAvail = W / 2 - TREE_NODE_W / 2;
      const spacing = Math.min(2 * TREE_NODE_W, rightAvail / (n - 1));
      row.centerXs = row.nodes.map((_, i) => W / 2 + i * spacing);
    } else if (n === 1) {
      row.centerXs = [W / 2];
    } else {
      // Spread up to 2-node-width apart, centred at W/2; fall back to edge-to-edge for many nodes
      const nodeSpacing = Math.min(2 * TREE_NODE_W, (W - TREE_NODE_W) / (n - 1));
      const groupWidth = (n - 1) * nodeSpacing;
      const start = W / 2 - groupWidth / 2;
      row.centerXs = row.nodes.map((_, i) => start + i * nodeSpacing);
    }
    currentY += TREE_NODE_H[row.type] + TREE_ROW_GAP;
  });
  const totalH = currentY - TREE_ROW_GAP + TREE_V_PAD * 3; // extra buffer for text-wrap overflow
  treeEl.style.height = totalH + 'px';

  // ── SVG connector lines ────────────────────────────────────────────
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', W);
  svg.setAttribute('height', totalH);
  svg.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;overflow:visible;';

  function svgLine(x1, y1, x2, y2) {
    const l = document.createElementNS(svgNS, 'line');
    l.setAttribute('x1', Math.round(x1)); l.setAttribute('y1', Math.round(y1));
    l.setAttribute('x2', Math.round(x2)); l.setAttribute('y2', Math.round(y2));
    l.setAttribute('stroke', 'var(--wh-text-muted,#aaa)');
    l.setAttribute('stroke-width', '2');
    l.setAttribute('stroke-linecap', 'round');
    svg.appendChild(l);
  }

  // Connect each adjacent pair of rows with right-angle bracket connectors
  for (let i = 0; i < rows.length - 1; i++) {
    const top = rows[i];
    const bot = rows[i + 1];

    // Attach points: circle bottom of top row, circle top of bottom row
    const topAttachY = top.y + TREE_CIRCLE_BOTTOM[top.type];
    const botAttachY = bot.y  + TREE_CIRCLE_TOP[bot.type];
    const jY = (topAttachY + botAttachY) / 2;

    // Only hierarchy participants (spouses are lateral, not hierarchical)
    const topXs = top.type === 'subject' ? [top.centerXs[0]] : top.centerXs;
    const botXs = bot.type === 'subject' ? [bot.centerXs[0]] : bot.centerXs;

    const topMidX = topXs.length === 1 ? topXs[0] : (Math.min(...topXs) + Math.max(...topXs)) / 2;
    const botMidX = botXs.length === 1 ? botXs[0] : (Math.min(...botXs) + Math.max(...botXs)) / 2;

    // (a) Vertical stems from each top-row circle bottom down to jY
    topXs.forEach(x => svgLine(x, topAttachY, x, jY));

    // (b) Horizontal bar at jY connecting all top-row nodes
    if (topXs.length > 1) {
      svgLine(Math.min(...topXs), jY, Math.max(...topXs), jY);
    }

    // (c) Horizontal shift at jY from top midpoint to bottom midpoint (Z-connector in the gap)
    if (Math.abs(topMidX - botMidX) > 1) {
      svgLine(topMidX, jY, botMidX, jY);
    }

    // (d) Bottom group: horizontal bar at jY spanning all nodes, then individual stems down to each circle
    if (botXs.length > 1) {
      svgLine(Math.min(...botXs), jY, Math.max(...botXs), jY);
      botXs.forEach(x => svgLine(x, jY, x, botAttachY));
    } else {
      // Single bottom node: straight vertical from jY to circle top
      svgLine(botMidX, jY, botMidX, botAttachY);
    }
  }

  // Spouse indicator: single horizontal line between subject and each spouse
  const subjectRow = rows.find(r => r.type === 'subject');
  if (subjectRow && subjectRow.nodes.length > 1) {
    const midY = subjectRow.y + TREE_CIRCLE_BOTTOM.subject / 2;
    for (let i = 1; i < subjectRow.nodes.length; i++) {
      const x1 = subjectRow.centerXs[i - 1] + TREE_NODE_W / 2 + 3;
      const x2 = subjectRow.centerXs[i]     - TREE_NODE_W / 2 - 3;
      if (x2 > x1 + 6) {
        svgLine(x1, midY, x2, midY);
      }
    }
  }

  treeEl.appendChild(svg);

  // ── Place node elements ────────────────────────────────────────────
  rows.forEach(row => {
    row.nodes.forEach(({ person, label }, i) => {
      const el = person.isSubject
        ? createSubjectNode(subjectName, subjectImage)
        : createFamilyMemberNode(person, label);
      el.style.position = 'absolute';
      el.style.left = (row.centerXs[i] - TREE_NODE_W / 2) + 'px';
      el.style.top  = row.y + 'px';
      treeEl.appendChild(el);
    });
  });
}
// ── End family tree mathematical layout ─────────────────────────────────

// Build a visual family tree element
function createFamilyTreeElement(familyData, subjectName, subjectImage) {
  const wrapper = document.createElement('div');
  wrapper.className = 'wikihover-family-tree';

  const heading = document.createElement('div');
  heading.style.cssText = 'font-size:16px;font-weight:700;color:var(--wh-text,#333);margin-bottom:12px;letter-spacing:-0.2px;';
  heading.textContent = 'Family Tree';
  wrapper.appendChild(heading);

  const treeContainer = document.createElement('div');
  treeContainer.className = 'wikihover-family-tree-inner';
  treeContainer.style.cssText = 'position:relative;overflow:visible;padding:8px 0;';
  wrapper.appendChild(treeContainer);

  // ResizeObserver: re-render whenever container width changes (handles tooltip resize).
  // Also fires after element is inserted into DOM, giving us the correct first-render width.
  let lastW = 0;
  const ro = new ResizeObserver(entries => {
    if (!document.body.contains(treeContainer)) { ro.disconnect(); return; }
    const newW = Math.round(entries[0].contentRect.width);
    if (newW < 10 || newW === lastW) return;
    lastW = newW;
    renderFamilyTree(treeContainer, familyData, subjectName, subjectImage);
  });
  ro.observe(treeContainer);

  // Siblings section — in normal flow below the tree, no connectors
  if (familyData.siblings.length) {
    const sibSection = document.createElement('div');
    sibSection.style.cssText = 'width:100%;margin-top:12px;';
    const sibLabel = document.createElement('div');
    sibLabel.style.cssText = 'font-size:10px;color:var(--wh-text-muted,#999);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;text-align:center;';
    sibLabel.textContent = 'Siblings';
    sibSection.appendChild(sibLabel);
    const sibRow = document.createElement('div');
    sibRow.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;justify-content:center;';
    familyData.siblings.forEach(s => sibRow.appendChild(createFamilyMemberNode(s)));
    sibSection.appendChild(sibRow);
    wrapper.appendChild(sibSection);
  }

  return wrapper;
}

// Helper: proxy an image URL through background script to get a data URL
async function proxyImage(url) {
  const resp = await safeSendMessage({ action: 'proxyImageFetch', url });
  return (resp && resp.success) ? resp.dataUrl : null;
}

// Fetch Instagram data for a person
async function fetchInstagramData(name) {
  if (!dataSourceSettings.instagram) {
    return { name, notFound: true, info: 'Instagram is disabled in settings.', timestamp: Date.now() };
  }

  if (instagramCache[name]) {
    return instagramCache[name];
  }

  try {
    // Step 1: Get Instagram username from Wikidata P2003
    let username = null;

    try {
      const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&limit=1&format=json&origin=*`;
      const searchResp = await fetch(searchUrl);
      if (searchResp.ok) {
        const searchData = await searchResp.json();
        const entityId = searchData.search?.[0]?.id;
        if (entityId) {
          const entityUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=claims&format=json&origin=*`;
          const entityResp = await fetch(entityUrl);
          if (entityResp.ok) {
            const entityData = await entityResp.json();
            const claims = entityData.entities?.[entityId]?.claims || {};
            username = claims.P2003?.[0]?.mainsnak?.datavalue?.value || null;
          }
        }
      }
    } catch (e) {
      debugLog('Error searching Wikidata for Instagram username:', e);
    }

    // Fallback: search Instagram directly if Wikidata has no P2003
    if (!username) {
      try {
        const searchResult = await safeSendMessage({ action: 'searchInstagramUser', query: name });
        if (searchResult?.username) {
          username = searchResult.username;
        } else if (searchResult?.error === 'no_instagram_tab') {
          // No Instagram tab open — signal needsAuth so UI can prompt login
          console.log('WikiHover IG: searchInstagramUser returned no_instagram_tab for', name);
          return { name, needsAuth: true, info: 'No Instagram tab open. Connect to load data.', timestamp: Date.now() };
        }
      } catch (e) {
        debugLog('Instagram search fallback failed:', e);
      }
    }

    if (!username) {
      const result = { name, notFound: true, info: 'No Instagram account found.', timestamp: Date.now() };
      addToCache(instagramCache, name, result);
      return result;
    }

    // Step 2: Fetch profile data via background script (tries API then HTML fallback)
    const profileResponse = await safeSendMessage({ action: 'fetchInstagramProfile', username });

    // If profile fetch failed due to no Instagram tab, signal needsAuth
    console.log('WikiHover IG: fetchInstagramProfile response for', name, ':', JSON.stringify(profileResponse).substring(0, 200));
    if (profileResponse?.error === 'no_instagram_tab') {
      console.log('WikiHover IG: fetchInstagramProfile returned no_instagram_tab for', name);
      return { name, username, needsAuth: true, profileUrl: `https://www.instagram.com/${username}/`, timestamp: Date.now() };
    }

    const result = {
      name,
      username,
      profileUrl: `https://www.instagram.com/${username}/`,
      profilePicUrl: null,
      mediaItems: [],
      reelItems: [],
      timestamp: Date.now()
    };

    if (profileResponse && profileResponse.success) {
      if (profileResponse.type === 'api' && profileResponse.data) {
        // ---- Parse the structured API JSON response ----
        const user = profileResponse.data;
        result.displayName = user.full_name || username;
        result.bio = user.biography || '';
        result.isVerified = user.is_verified || false;
        result.isPrivate = user.is_private || false;
        result.followers = formatIGCount(user.edge_followed_by?.count);
        result.following = formatIGCount(user.edge_follow?.count);
        result.posts = formatIGCount(user.edge_owner_to_timeline_media?.count);
        result.authenticated = profileResponse.authenticated;
        result.userId = user.id || null;

        // Pagination cursors
        const timelinePageInfo = user.edge_owner_to_timeline_media?.page_info;
        result.postsNextCursor = timelinePageInfo?.end_cursor || null;
        result.postsHasMore = timelinePageInfo?.has_next_page || false;
        const reelsPageInfo = user.edge_felix_video_timeline?.page_info;
        result.reelsNextCursor = reelsPageInfo?.end_cursor || null;
        result.reelsHasMore = reelsPageInfo?.has_next_page || false;

        // Profile picture — proxy through background to avoid CORS
        if (user.profile_pic_url_hd || user.profile_pic_url) {
          result.profilePicUrl = user.profile_pic_url_hd || user.profile_pic_url;
        }

        // Recent posts (timeline media)
        const timelineEdges = user.edge_owner_to_timeline_media?.edges || [];
        result.mediaItems = timelineEdges.slice(0, 12).map(edge => {
          const node = edge.node;
          return {
            shortcode: node.shortcode,
            thumbnailUrl: node.thumbnail_src || node.display_url,
            displayUrl: node.display_url,
            isVideo: node.is_video || false,
            isReel: node.__typename === 'GraphVideo' && node.product_type === 'clips',
            videoUrl: node.video_url || null,
            caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
            likes: node.edge_liked_by?.count || node.edge_media_preview_like?.count || 0,
            comments: node.edge_media_to_comment?.count || 0,
            timestamp: node.taken_at_timestamp || 0
          };
        });

        // Reels (felix video timeline)
        const reelEdges = user.edge_felix_video_timeline?.edges || [];
        result.reelItems = reelEdges.slice(0, 12).map(edge => {
          const node = edge.node;
          return {
            shortcode: node.shortcode,
            thumbnailUrl: node.thumbnail_src || node.display_url,
            displayUrl: node.display_url,
            isVideo: true,
            videoUrl: node.video_url || null,
            caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
            views: node.video_view_count || 0,
            likes: node.edge_liked_by?.count || node.edge_media_preview_like?.count || 0,
            timestamp: node.taken_at_timestamp || 0
          };
        });

      } else if (profileResponse.type === 'html' && profileResponse.html) {
        // ---- Fallback: parse og: meta tags from HTML ----
        const html = profileResponse.html;

        const ogImageMatch = html.match(/<meta\s+(?:property|name)="og:image"\s+content="([^"]+)"/i)
          || html.match(/<meta\s+content="([^"]+)"\s+(?:property|name)="og:image"/i);
        const ogDescMatch = html.match(/<meta\s+(?:property|name)="og:description"\s+content="([^"]+)"/i)
          || html.match(/<meta\s+content="([^"]+)"\s+(?:property|name)="og:description"/i);
        const ogTitleMatch = html.match(/<meta\s+(?:property|name)="og:title"\s+content="([^"]+)"/i)
          || html.match(/<meta\s+content="([^"]+)"\s+(?:property|name)="og:title"/i);

        if (ogImageMatch) result.profilePicUrl = ogImageMatch[1];
        if (ogTitleMatch) result.displayName = ogTitleMatch[1];

        if (ogDescMatch) {
          const desc = ogDescMatch[1];
          const statsMatch = desc.match(/([\d,.]+[KMB]?)\s+Followers?,\s*([\d,.]+[KMB]?)\s+Following,\s*([\d,.]+[KMB]?)\s+Posts?/i);
          if (statsMatch) {
            result.followers = statsMatch[1];
            result.following = statsMatch[2];
            result.posts = statsMatch[3];
          }
          const bioMatch = desc.match(/Posts?\s*-\s*(?:See Instagram photos and videos from\s+)?(.+)/i);
          if (bioMatch) {
            result.bio = bioMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
          }
        }
      }
      // type === 'none': all API tiers failed, but we still have the username — result is usable as-is
    }

    // Only cache if result has meaningful data (media, avatar, or displayName)
    // Prevents caching profile-only/empty results that block retries after idle recovery
    const hasMedia = result.media?.length > 0 || result.reels?.length > 0;
    const hasProfile = result.avatar || result.displayName;
    if (hasMedia || hasProfile) {
      addToCache(instagramCache, name, result);
    }
    return result;
  } catch (error) {
    debugLog('Error fetching Instagram data:', error);
    const fallback = { name, notFound: true, info: 'Error fetching Instagram data.', timestamp: Date.now() };
    // Don't cache error fallbacks — allow retry on next hover
    return fallback;
  }
}

// Format Instagram counts (e.g. 1234567 -> "1.2M")
function formatIGCount(count) {
  if (count == null) return null;
  if (typeof count === 'string') return count;
  if (count >= 1000000) return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (count >= 10000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  if (count >= 1000) return count.toLocaleString();
  return String(count);
}

// Retry Instagram fetch after connecting — clears stale cache and re-renders
async function retryInstagramFetch(container, nameKey) {
  delete instagramCache[nameKey];
  delete pendingFetches['instagram_' + nameKey];
  try {
    const data = await fetchInstagramData(nameKey);
    if (tooltipDataCache[nameKey]) {
      tooltipDataCache[nameKey].instagram = data;
    }
    delete container._pendingInstagramRetry;
    updateInstagramContent(container, data, nameKey);
  } catch (e) {
    debugLog('retryInstagramFetch failed:', e);
    container.innerHTML = '<div style="padding:15px;text-align:center;color:#c00;">Failed to load. Try again.</div>';
  }
}

// Create branded progress indicator (logo fill + percentage) for any data source
// domain: e.g. 'instagram.com', brandColor: e.g. '#E1306C', statusMessage: loading text
// Returns { element, setProgress, finishProgress, failProgress, statusText }
function createBrandedProgressIndicator(domain, brandColor, statusMessage) {
  const authDiv = document.createElement('div');
  authDiv.style.cssText = 'padding:24px 15px;text-align:center;';

  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  const logoWrap = document.createElement('div');
  logoWrap.style.cssText = 'position:relative;width:64px;height:64px;margin:0 auto 10px;';

  const greyImg = document.createElement('img');
  greyImg.src = favicon;
  greyImg.style.cssText = 'width:64px;height:64px;display:block;filter:grayscale(1) opacity(0.35);';
  logoWrap.appendChild(greyImg);

  const colorClip = document.createElement('div');
  colorClip.style.cssText = 'position:absolute;left:0;right:0;bottom:0;height:0%;overflow:hidden;transition:height 0.4s ease;';
  const colorImg = document.createElement('img');
  colorImg.src = favicon;
  colorImg.style.cssText = 'width:64px;height:64px;display:block;position:absolute;bottom:0;left:0;';
  colorClip.appendChild(colorImg);
  logoWrap.appendChild(colorClip);
  authDiv.appendChild(logoWrap);

  const pctLabel = document.createElement('div');
  pctLabel.style.cssText = 'font-size:12px;font-weight:600;color:var(--wh-text-muted);margin-bottom:4px;';
  pctLabel.textContent = '0%';
  authDiv.appendChild(pctLabel);

  const statusText = document.createElement('p');
  statusText.style.cssText = 'color:var(--wh-text-muted);font-size:11px;margin:0;line-height:1.3;';
  statusText.textContent = statusMessage || '';
  authDiv.appendChild(statusText);

  let progress = 0;
  function setProgress(pct) {
    progress = Math.min(pct, 100);
    colorClip.style.height = progress + '%';
    pctLabel.textContent = Math.round(progress) + '%';
    if (progress >= 100) pctLabel.style.color = brandColor;
  }
  const progressTimer = setInterval(() => {
    if (progress < 90) {
      setProgress(progress + (90 - progress) * 0.09);
    }
  }, 660);

  function finishProgress() {
    clearInterval(progressTimer);
    if (progress >= 100) return Promise.resolve();
    setProgress(100);
    // Return a promise that resolves after the CSS transition completes
    return new Promise(resolve => setTimeout(resolve, 450));
  }
  function failProgress() {
    clearInterval(progressTimer);
    colorClip.style.height = '0%';
    pctLabel.style.color = 'var(--wh-text-muted)';
    pctLabel.textContent = '';
  }

  return { element: authDiv, setProgress, finishProgress, failProgress, statusText, progressTimer };
}

// Convenience wrapper for Instagram (backwards compat)
function createIGProgressIndicator(statusMessage) {
  return createBrandedProgressIndicator('instagram.com', '#E1306C', statusMessage);
}

// Update Instagram content in tooltip
function updateInstagramContent(container, data, currentWord) {
  container.innerHTML = '';

  if (data.needsAuth) {
    console.log('WikiHover IG: needsAuth detected, auto-connecting for', currentWord);
    const igProgress = createIGProgressIndicator('Connecting to Instagram');
    container.appendChild(igProgress.element);
    container._pendingInstagramRetry = currentWord;
    const { finishProgress, failProgress, statusText } = igProgress;

    // Auto-connect: open hidden background tab and poll for readiness
    (async () => {
      const resp = await safeSendMessage({ action: 'openInstagramTab' });
      if (!resp?.success) {
        failProgress();
        statusText.textContent = 'Could not open Instagram tab';
        return;
      }

      if (resp.alreadyOpen) {
        await finishProgress();
        statusText.textContent = '';
        retryInstagramFetch(container, currentWord);
        return;
      }

      // Poll until the background tab finishes loading
      const pollInterval = setInterval(async () => {
        const check = await safeSendMessage({ action: 'checkInstagramTabReady' });
        if (check?.ready) {
          clearInterval(pollInterval);
          await finishProgress();
          statusText.textContent = '';
          retryInstagramFetch(container, currentWord);
        } else if (check?.needsLogin) {
          clearInterval(pollInterval);
          await safeSendMessage({ action: 'focusInstagramTab' });
          statusText.textContent = 'Please log in to Instagram in the opened tab';

          const loginPoll = setInterval(async () => {
            const recheck = await safeSendMessage({ action: 'checkInstagramTabReady' });
            if (recheck?.ready) {
              clearInterval(loginPoll);
              await finishProgress();
              statusText.textContent = '';
              retryInstagramFetch(container, currentWord);
            }
          }, 2000);

          setTimeout(() => {
            clearInterval(loginPoll);
            if (statusText.textContent.includes('log in')) {
              failProgress();
              statusText.textContent = 'Timed out — switch to Instagram tab and retry';
            }
          }, 5 * 60 * 1000);
        }
      }, 1500);

      setTimeout(() => { clearInterval(pollInterval); }, 30000);
    })();

    return;
  }

  if (data.notFound) {
    const notFoundDiv = document.createElement('div');
    notFoundDiv.style.padding = '15px';
    notFoundDiv.style.textAlign = 'center';
    notFoundDiv.style.color = 'var(--wh-text-secondary)';

    const msg = document.createElement('p');
    msg.textContent = data.info || 'No Instagram account found for this person.';
    msg.style.marginBottom = '10px';
    notFoundDiv.appendChild(msg);

    const searchLink = document.createElement('a');
    searchLink.href = `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(currentWord)}`;
    searchLink.target = '_blank';
    searchLink.textContent = 'Search on Instagram';
    searchLink.style.color = '#E1306C';
    searchLink.style.textDecoration = 'none';
    searchLink.style.fontWeight = '500';
    notFoundDiv.appendChild(searchLink);

    container.appendChild(notFoundDiv);
    return;
  }

  // Header
  const headerContainer = document.createElement('div');
  headerContainer.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding:0 0 10px 0;border-bottom:1px solid var(--wh-border-light);';

  const personName = document.createElement('h3');
  personName.style.cssText = 'margin:0;font-size:16px;color:var(--wh-text);font-weight:600;';
  personName.textContent = `${currentWord} on Instagram`;
  headerContainer.appendChild(personName);
  container.appendChild(headerContainer);

  // Profile card
  const profileCard = document.createElement('div');
  profileCard.className = 'wikihover-instagram-profile';

  // Profile pic — proxy through background to avoid CORS blocking
  const avatarEl = document.createElement('div');
  avatarEl.className = 'wikihover-instagram-avatar';
  avatarEl.style.backgroundColor = 'var(--wh-card-bg)';
  avatarEl.style.display = 'flex';
  avatarEl.style.alignItems = 'center';
  avatarEl.style.justifyContent = 'center';
  avatarEl.style.fontSize = '24px';
  avatarEl.style.color = 'var(--wh-text-muted)';
  avatarEl.textContent = (data.displayName || data.username || '?')[0].toUpperCase();
  profileCard.appendChild(avatarEl);

  if (data.profilePicUrl) {
    proxyImage(data.profilePicUrl).then(dataUrl => {
      if (dataUrl) {
        const img = document.createElement('img');
        img.src = dataUrl;
        img.alt = data.displayName || data.username;
        img.className = 'wikihover-instagram-avatar';
        avatarEl.replaceWith(img);
      }
    });
  }

  const infoDiv = document.createElement('div');
  infoDiv.className = 'wikihover-instagram-info';

  const displayNameEl = document.createElement('h4');
  displayNameEl.style.cssText = 'margin:0;font-size:15px;color:var(--wh-content-text);';
  const nameText = data.displayName || data.username;
  displayNameEl.textContent = nameText;
  if (data.isVerified) {
    const badge = document.createElement('span');
    badge.textContent = ' \u2713';
    badge.style.cssText = 'color:#3897f0;font-weight:bold;';
    displayNameEl.appendChild(badge);
  }
  infoDiv.appendChild(displayNameEl);

  const usernameEl = document.createElement('span');
  usernameEl.textContent = `@${data.username}`;
  usernameEl.style.cssText = 'color:var(--wh-text-muted);font-size:13px;';
  infoDiv.appendChild(usernameEl);

  profileCard.appendChild(infoDiv);
  container.appendChild(profileCard);

  // Stats row
  if (data.followers || data.following || data.posts) {
    const statsRow = document.createElement('div');
    statsRow.className = 'wikihover-instagram-stats';

    if (data.posts) {
      const span = document.createElement('span');
      span.innerHTML = `<strong>${data.posts}</strong> posts`;
      statsRow.appendChild(span);
    }
    if (data.followers) {
      const span = document.createElement('span');
      span.innerHTML = `<strong>${data.followers}</strong> followers`;
      statsRow.appendChild(span);
    }
    if (data.following) {
      const span = document.createElement('span');
      span.innerHTML = `<strong>${data.following}</strong> following`;
      statsRow.appendChild(span);
    }
    container.appendChild(statsRow);
  }

  // Bio
  if (data.bio) {
    const bioDiv = document.createElement('div');
    bioDiv.className = 'wikihover-instagram-bio';
    bioDiv.textContent = data.bio;
    container.appendChild(bioDiv);
  }

  // ----- Shared expanded video player (used by both posts and reels) -----
  // Instead of absolute overlay, we hide all container children and show the player in-place
  const expandedPlayer = document.createElement('div');
  expandedPlayer.className = 'wikihover-reel-expanded-player';
  expandedPlayer.style.cssText = 'display:none;position:relative;background:#000;border-radius:6px;overflow:hidden;cursor:pointer;';

  const expandedVideo = document.createElement('video');
  const igContentContainer = container.closest('.wikihover-content-container');
  const igVideoH = getExpandedPlayerHeight(igContentContainer);
  expandedVideo.style.cssText = `width:100%;height:${igVideoH}px;object-fit:contain;background:#000;display:block;`;
  expandedVideo.muted = !videoSoundEnabled;
  expandedVideo.loop = false;
  expandedVideo.playsInline = true;
  expandedVideo.preload = 'auto';
  expandedPlayer.appendChild(expandedVideo);

  // Expanded image element (for image posts, hidden by default)
  const expandedImage = document.createElement('img');
  expandedImage.style.cssText = `width:100%;height:${igVideoH}px;object-fit:contain;background:#000;display:none;position:absolute;top:0;left:0;`;
  expandedPlayer.appendChild(expandedImage);

  // Image info overlay (bottom gradient with caption, stats, IG link)
  const imageInfoOverlay = document.createElement('div');
  imageInfoOverlay.style.cssText = 'position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.85));color:white;padding:30px 14px 12px;z-index:10;display:none;';

  const imageCaption = document.createElement('div');
  imageCaption.style.cssText = 'font-size:12px;line-height:1.4;margin-bottom:6px;max-height:60px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;';
  imageInfoOverlay.appendChild(imageCaption);

  const imageStatsRow = document.createElement('div');
  imageStatsRow.style.cssText = 'display:flex;align-items:center;gap:12px;font-size:11px;color:rgba(255,255,255,0.9);margin-bottom:6px;';
  imageInfoOverlay.appendChild(imageStatsRow);

  const imageIGLink = document.createElement('a');
  imageIGLink.style.cssText = 'color:#E1306C;font-size:11px;text-decoration:none;font-weight:600;';
  imageIGLink.textContent = 'Open on Instagram \u2197';
  imageIGLink.target = '_blank';
  imageIGLink.rel = 'noopener';
  imageIGLink.addEventListener('click', (e) => e.stopPropagation());
  imageInfoOverlay.appendChild(imageIGLink);
  expandedPlayer.appendChild(imageInfoOverlay);

  // Circular prev/next nav arrows for image mode
  const createNavArrow = (direction) => {
    const arrow = document.createElement('div');
    arrow.style.cssText = `position:absolute;top:50%;${direction === 'prev' ? 'left:8px' : 'right:8px'};transform:translateY(-50%);width:32px;height:32px;background:rgba(0,0,0,0.6);color:white;border-radius:50%;display:none;align-items:center;justify-content:center;font-size:16px;cursor:pointer;z-index:15;transition:background 0.2s;`;
    arrow.textContent = direction === 'prev' ? '\u276E' : '\u276F';
    arrow.title = direction === 'prev' ? 'Previous' : 'Next';
    arrow.addEventListener('mouseenter', () => { arrow.style.background = 'rgba(0,0,0,0.85)'; });
    arrow.addEventListener('mouseleave', () => { arrow.style.background = 'rgba(0,0,0,0.6)'; });
    return arrow;
  };
  const imgPrevArrow = createNavArrow('prev');
  const imgNextArrow = createNavArrow('next');
  expandedPlayer.appendChild(imgPrevArrow);
  expandedPlayer.appendChild(imgNextArrow);

  imgPrevArrow.addEventListener('click', (e) => {
    e.stopPropagation();
    if (expandedPlaylistIndex > 0) {
      expandedPlaylistIndex--;
      expandItem(expandedPlaylist[expandedPlaylistIndex], expandedIsReel, expandedPlaylist, expandedPlaylistIndex);
    }
  });
  imgNextArrow.addEventListener('click', (e) => {
    e.stopPropagation();
    if (expandedPlaylistIndex + 1 < expandedPlaylist.length) {
      expandedPlaylistIndex++;
      expandItem(expandedPlaylist[expandedPlaylistIndex], expandedIsReel, expandedPlaylist, expandedPlaylistIndex);
    }
  });

  // Close button (top-right corner)
  const igCloseBtn = document.createElement('div');
  igCloseBtn.style.cssText = 'position:absolute;top:8px;right:8px;width:28px;height:28px;background:rgba(0,0,0,0.6);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;z-index:15;line-height:1;transition:background 0.2s;';
  igCloseBtn.textContent = '\u00D7';
  igCloseBtn.title = 'Close player';
  igCloseBtn.addEventListener('mouseenter', () => { igCloseBtn.style.background = 'rgba(0,0,0,0.85)'; });
  igCloseBtn.addEventListener('mouseleave', () => { igCloseBtn.style.background = 'rgba(0,0,0,0.6)'; });
  igCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); collapseVideoPlayer(); });
  expandedPlayer.appendChild(igCloseBtn);

  // Countdown circle (SVG) — appears 5s before video ends
  const countdownContainer = document.createElement('div');
  countdownContainer.style.cssText = 'position:absolute;top:10px;right:10px;width:36px;height:36px;z-index:12;display:none;';
  const countdownSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  countdownSvg.setAttribute('width', '36');
  countdownSvg.setAttribute('height', '36');
  countdownSvg.setAttribute('viewBox', '0 0 36 36');
  // Background circle
  const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  bgCircle.setAttribute('cx', '18');
  bgCircle.setAttribute('cy', '18');
  bgCircle.setAttribute('r', '15');
  bgCircle.setAttribute('fill', 'rgba(0,0,0,0.6)');
  bgCircle.setAttribute('stroke', 'rgba(255,255,255,0.3)');
  bgCircle.setAttribute('stroke-width', '2');
  countdownSvg.appendChild(bgCircle);
  // Progress circle (depletes as countdown progresses)
  const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  progressCircle.setAttribute('cx', '18');
  progressCircle.setAttribute('cy', '18');
  progressCircle.setAttribute('r', '15');
  progressCircle.setAttribute('fill', 'none');
  progressCircle.setAttribute('stroke', '#E1306C');
  progressCircle.setAttribute('stroke-width', '2.5');
  progressCircle.setAttribute('stroke-linecap', 'round');
  const circumference = 2 * Math.PI * 15; // ~94.25
  progressCircle.setAttribute('stroke-dasharray', String(circumference));
  progressCircle.setAttribute('stroke-dashoffset', '0');
  progressCircle.style.transform = 'rotate(-90deg)';
  progressCircle.style.transformOrigin = '50% 50%';
  progressCircle.style.transition = 'stroke-dashoffset 0.25s linear';
  countdownSvg.appendChild(progressCircle);
  // Countdown number text
  const countdownText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  countdownText.setAttribute('x', '18');
  countdownText.setAttribute('y', '22');
  countdownText.setAttribute('text-anchor', 'middle');
  countdownText.setAttribute('fill', 'white');
  countdownText.setAttribute('font-size', '13');
  countdownText.setAttribute('font-weight', '600');
  countdownText.textContent = '5';
  countdownSvg.appendChild(countdownText);
  countdownContainer.appendChild(countdownSvg);
  expandedPlayer.appendChild(countdownContainer);

  // Video controls bar (progress + play/pause + time)
  const controlsBar = document.createElement('div');
  controlsBar.style.cssText = 'position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.85));padding:6px 10px 8px;z-index:10;display:flex;flex-direction:column;gap:4px;';
  controlsBar.addEventListener('click', (e) => e.stopPropagation());

  // Progress bar container (clickable to seek)
  const progressContainer = document.createElement('div');
  progressContainer.style.cssText = 'width:100%;height:4px;background:rgba(255,255,255,0.3);border-radius:2px;cursor:pointer;position:relative;';

  const progressFill = document.createElement('div');
  progressFill.style.cssText = 'height:100%;background:#E1306C;border-radius:2px;width:0%;transition:width 0.1s linear;pointer-events:none;';
  progressContainer.appendChild(progressFill);

  // Seek on click/drag
  let isSeeking = false;
  function seekToPosition(e) {
    const rect = progressContainer.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (expandedVideo.duration) {
      expandedVideo.currentTime = pct * expandedVideo.duration;
      progressFill.style.width = (pct * 100) + '%';
    }
  }
  progressContainer.addEventListener('mousedown', (e) => { isSeeking = true; seekToPosition(e); });
  document.addEventListener('mousemove', (e) => { if (isSeeking) seekToPosition(e); });
  document.addEventListener('mouseup', () => { isSeeking = false; });

  controlsBar.appendChild(progressContainer);

  // Bottom row: play/pause + time
  const controlsRow = document.createElement('div');
  controlsRow.style.cssText = 'display:flex;align-items:center;gap:8px;';

  const playPauseBtn = document.createElement('button');
  playPauseBtn.className = 'wikihover-player-btn';
  playPauseBtn.style.cssText = 'background:none;border:none;color:white;font-size:16px;cursor:pointer;padding:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;';
  playPauseBtn.textContent = '\u275A\u275A'; // pause icon
  playPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (expandedVideo.paused) {
      expandedVideo.play().catch(() => {});
    } else {
      expandedVideo.pause();
    }
  });
  controlsRow.appendChild(playPauseBtn);

  const timeDisplay = document.createElement('span');
  timeDisplay.style.cssText = 'color:rgba(255,255,255,0.9);font-size:11px;font-family:monospace;min-width:70px;flex:1;';
  timeDisplay.textContent = '0:00 / 0:00';
  controlsRow.appendChild(timeDisplay);

  // Prev button (<<)
  const prevBtn = document.createElement('button');
  prevBtn.className = 'wikihover-next-btn';
  prevBtn.style.cssText = 'background:rgba(255,255,255,0.15);border:none;color:white;font-size:22px;cursor:pointer;padding:4px 12px;font-weight:700;letter-spacing:-1px;display:none;border-radius:4px;line-height:1;transform:scaleX(-1);';
  prevBtn.innerHTML = '&#9654;&#9654;';
  prevBtn.title = 'Previous';
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (expandedPlaylist.length === 0 || expandedPlaylistIndex <= 0) return;
    expandedPlaylistIndex--;
    expandItem(expandedPlaylist[expandedPlaylistIndex], expandedIsReel, expandedPlaylist, expandedPlaylistIndex);
  });
  controlsRow.appendChild(prevBtn);

  // Next button (>>)
  const nextBtn = document.createElement('button');
  nextBtn.className = 'wikihover-next-btn';
  nextBtn.style.cssText = 'background:rgba(255,255,255,0.15);border:none;color:white;font-size:22px;cursor:pointer;padding:4px 12px;font-weight:700;letter-spacing:-1px;display:none;border-radius:4px;line-height:1;';
  nextBtn.innerHTML = '&#9654;&#9654;';
  nextBtn.title = 'Next';
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (expandedPlaylist.length === 0 || expandedPlaylistIndex < 0) return;
    const nextIndex = expandedPlaylistIndex + 1;
    if (nextIndex < expandedPlaylist.length) {
      expandedPlaylistIndex = nextIndex;
      expandItem(expandedPlaylist[nextIndex], expandedIsReel, expandedPlaylist, nextIndex);
    }
  });
  controlsRow.appendChild(nextBtn);

  controlsBar.appendChild(controlsRow);
  expandedPlayer.appendChild(controlsBar);

  // Format seconds to m:ss
  function formatTime(sec) {
    if (!sec || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // Update progress bar, time display, and countdown circle
  expandedVideo.addEventListener('timeupdate', () => {
    if (isSeeking) return;
    const dur = expandedVideo.duration;
    const cur = expandedVideo.currentTime;
    const pct = dur ? (cur / dur) * 100 : 0;
    progressFill.style.width = pct + '%';
    timeDisplay.textContent = formatTime(cur) + ' / ' + formatTime(dur);

    // Countdown circle: show when within COUNTDOWN_SECONDS of the end and there's a next video
    const remaining = dur - cur;
    const hasNext = expandedPlaylist.length > 0 && expandedPlaylistIndex + 1 < expandedPlaylist.length;
    if (dur && remaining <= COUNTDOWN_SECONDS && remaining > 0 && hasNext) {
      countdownContainer.style.display = 'block';
      const secsLeft = Math.ceil(remaining);
      countdownText.textContent = String(secsLeft);
      // Circle depletes as countdown progresses (full at 5s, empty at 0s)
      const offset = circumference * (1 - remaining / COUNTDOWN_SECONDS);
      progressCircle.setAttribute('stroke-dashoffset', String(offset));
    } else {
      countdownContainer.style.display = 'none';
      progressCircle.setAttribute('stroke-dashoffset', '0');
    }
  });

  expandedVideo.addEventListener('play', () => { playPauseBtn.textContent = '\u275A\u275A'; });
  expandedVideo.addEventListener('pause', () => { playPauseBtn.textContent = '\u25B6'; });

  const expandedStats = document.createElement('div');
  expandedStats.style.cssText = 'position:absolute;top:0;left:0;right:0;background:linear-gradient(rgba(0,0,0,0.6),transparent);color:white;font-size:11px;padding:8px 12px;display:flex;gap:12px;';
  expandedPlayer.appendChild(expandedStats);

  let expandTimeout = null;
  let currentExpandItem = null;
  let savedScrollTop = 0;
  let savedCCHeight = '';
  let savedCCMaxHeight = '';
  let expandedPlaylist = []; // array of items for auto-advance
  let expandedPlaylistIndex = -1;
  let expandedIsReel = false;
  const COUNTDOWN_SECONDS = 5;

  function expandItem(item, isReel, playlist, index, startTime) {
    // Save scroll position before expanding (only on first expand, not auto-advance)
    if (!currentExpandItem) {
      const contentContainer = container.closest('.wikihover-content-container');
      if (contentContainer) {
        savedScrollTop = contentContainer.scrollTop;
        savedCCHeight = contentContainer.style.getPropertyValue('height');
        savedCCMaxHeight = contentContainer.style.getPropertyValue('max-height');
      }

      // Hide all regular content children
      Array.from(container.children).forEach(child => {
        if (child !== expandedPlayer) {
          child.dataset.savedDisplay = child.style.display;
          child.style.display = 'none';
        }
      });

      // Show expanded player
      if (expandedPlayer.parentNode !== container) {
        container.appendChild(expandedPlayer);
      }
      expandedPlayer.style.display = 'block';

      // Lock content container height so it doesn't push the footer
      const tooltipEl = contentContainer.closest('.wikihover-tooltip, .wikihover-pinned-tooltip');
      if (tooltipEl) {
        const ccH = getContentContainerHeight(tooltipEl, tooltipEl.offsetHeight);
        contentContainer.style.setProperty('height', ccH + 'px', 'important');
        contentContainer.style.setProperty('max-height', ccH + 'px', 'important');
      }

      // Size expanded player to fit content container (minus padding)
      const h = getExpandedPlayerHeight(contentContainer);
      expandedPlayer.style.height = h + 'px';
      expandedPlayer.style.maxHeight = h + 'px';
      expandedVideo.style.height = h + 'px';
      expandedImage.style.height = h + 'px';

      // Scroll to top so expanded player is fully visible
      if (contentContainer) contentContainer.scrollTop = 0;
    }

    // Store playlist context for auto-advance
    if (playlist) {
      expandedPlaylist = playlist;
      expandedPlaylistIndex = index != null ? index : -1;
      expandedIsReel = isReel;
    }

    const hasPrev = expandedPlaylistIndex > 0;
    const hasNext = expandedPlaylist.length > 0 && expandedPlaylistIndex + 1 < expandedPlaylist.length;
    currentExpandItem = { item, isReel };

    if (item.isVideo) {
      // --- VIDEO MODE ---
      expandedImage.style.display = 'none';
      imageInfoOverlay.style.display = 'none';
      imgPrevArrow.style.display = 'none';
      imgNextArrow.style.display = 'none';
      expandedVideo.style.display = 'block';
      controlsBar.style.display = 'flex';

      expandedStats.innerHTML = '';
      if (item.views) {
        const s = document.createElement('span');
        s.textContent = `\u25B6 ${formatIGCount(item.views)}`;
        expandedStats.appendChild(s);
      }
      if (item.likes) {
        const s = document.createElement('span');
        s.textContent = `\u2764 ${formatIGCount(item.likes)}`;
        expandedStats.appendChild(s);
      }
      expandedStats.style.display = 'flex';

      // Reset progress bar, countdown, and nav button visibility
      progressFill.style.width = '0%';
      timeDisplay.textContent = '0:00 / 0:00';
      countdownContainer.style.display = 'none';
      prevBtn.style.display = hasPrev ? 'block' : 'none';
      nextBtn.style.display = hasNext ? 'block' : 'none';

      const seekTime = startTime && startTime > 0 ? startTime : 0;
      // Clear so auto-advance doesn't reuse it
      startTime = 0;

      const playFromPosition = () => {
        if (!currentExpandItem) return;
        if (seekTime > 0) {
          expandedVideo.currentTime = seekTime;
        }
        expandedVideo.play().catch(() => {});
      };
      if (item.videoUrl) {
        const srcChanged = expandedVideo.src !== item.videoUrl;
        if (srcChanged) expandedVideo.src = item.videoUrl;
        if (srcChanged) {
          expandedVideo.addEventListener('loadeddata', function onLoaded() {
            expandedVideo.removeEventListener('loadeddata', onLoaded);
            playFromPosition();
          });
        } else {
          playFromPosition();
        }
      } else {
        safeSendMessage({ action: 'fetchReelVideo', shortcode: item.shortcode }).then((resp) => {
          if (resp && resp.videoUrl) {
            item.videoUrl = resp.videoUrl;
            if (!currentExpandItem) return;
            expandedVideo.src = resp.videoUrl;
            expandedVideo.addEventListener('loadeddata', function onLoaded() {
              expandedVideo.removeEventListener('loadeddata', onLoaded);
              playFromPosition();
            });
          }
        });
      }
    } else {
      // --- IMAGE MODE ---
      expandedVideo.pause();
      expandedVideo.style.display = 'none';
      controlsBar.style.display = 'none';
      expandedStats.style.display = 'none';
      countdownContainer.style.display = 'none';

      expandedImage.style.display = 'block';
      imageInfoOverlay.style.display = 'block';
      imgPrevArrow.style.display = hasPrev ? 'flex' : 'none';
      imgNextArrow.style.display = hasNext ? 'flex' : 'none';

      // Prev/next in controls bar (hidden, but keep state consistent)
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';

      // Ensure image height matches player
      const cc = container.closest('.wikihover-content-container');
      expandedImage.style.height = getExpandedPlayerHeight(cc) + 'px';

      // Load image via proxy
      expandedImage.src = '';
      const imgUrl = item.displayUrl || item.thumbnailUrl;
      if (imgUrl) {
        proxyImage(imgUrl).then(dataUrl => {
          if (dataUrl && currentExpandItem && currentExpandItem.item === item) {
            expandedImage.src = dataUrl;
          }
        });
      }

      // Update image info overlay
      imageCaption.textContent = item.caption || '';
      imageCaption.style.display = item.caption ? '-webkit-box' : 'none';

      imageStatsRow.innerHTML = '';
      if (item.likes) {
        const s = document.createElement('span');
        s.textContent = `\u2764 ${formatIGCount(item.likes)}`;
        imageStatsRow.appendChild(s);
      }
      if (item.comments) {
        const s = document.createElement('span');
        s.textContent = `\uD83D\uDCAC ${formatIGCount(item.comments)}`;
        imageStatsRow.appendChild(s);
      }

      const prefix = item.isReel ? 'reel' : 'p';
      imageIGLink.href = `https://www.instagram.com/${prefix}/${item.shortcode}/`;
    }
  }

  // Alias for backward compat (reels always call expandVideoPlayer)
  function expandVideoPlayer(item, isReel, playlist, index, startTime) {
    expandItem(item, isReel, playlist, index, startTime);
  }

  // Auto-advance to next item when current video ends
  expandedVideo.addEventListener('ended', () => {
    if (!currentExpandItem || expandedPlaylist.length === 0) return;
    const nextIndex = expandedPlaylistIndex + 1;
    if (nextIndex < expandedPlaylist.length) {
      expandedPlaylistIndex = nextIndex;
      expandItem(expandedPlaylist[nextIndex], expandedIsReel, expandedPlaylist, nextIndex);
    } else {
      // No more items — collapse
      collapseVideoPlayer();
    }
  });

  function collapseVideoPlayer() {
    expandedVideo.pause();
    expandedPlayer.style.display = 'none';
    expandedPlayer.style.height = '';
    expandedPlayer.style.maxHeight = '';
    currentExpandItem = null;

    // Reset playlist state
    expandedPlaylist = [];
    expandedPlaylistIndex = -1;
    countdownContainer.style.display = 'none';
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';

    // Reset image elements
    expandedImage.style.display = 'none';
    expandedImage.src = '';
    imageInfoOverlay.style.display = 'none';
    imgPrevArrow.style.display = 'none';
    imgNextArrow.style.display = 'none';

    // Restore all regular content children
    Array.from(container.children).forEach(child => {
      if (child !== expandedPlayer && child.dataset.savedDisplay !== undefined) {
        child.style.display = child.dataset.savedDisplay;
        delete child.dataset.savedDisplay;
      }
    });

    // Restore content container height and scroll position
    const contentContainer = container.closest('.wikihover-content-container');
    if (contentContainer) {
      if (savedCCHeight) {
        contentContainer.style.setProperty('height', savedCCHeight, 'important');
      } else {
        contentContainer.style.removeProperty('height');
      }
      if (savedCCMaxHeight) {
        contentContainer.style.setProperty('max-height', savedCCMaxHeight, 'important');
      } else {
        contentContainer.style.removeProperty('max-height');
      }
      contentContainer.scrollTop = savedScrollTop;
    }
  }

  // Click on video area toggles play/pause
  expandedVideo.style.cursor = 'pointer';
  expandedVideo.addEventListener('click', (e) => {
    e.stopPropagation();
    if (expandedVideo.paused) {
      expandedVideo.play().catch(() => {});
    } else {
      expandedVideo.pause();
    }
  });


  // Helper: set up in-cell video preview (hover) + click-to-expand for a video/reel cell
  function setupVideoCell(cell, item, overlay, iconEl, isReel, playlist) {
    let videoEl = null;
    let hoverTimeout = null;
    let isHovering = false;

    // Helper to load/get video URL, then call callback only if still hovering
    function withVideoUrl(callback) {
      if (item.videoUrl) {
        callback(item.videoUrl);
      } else {
        safeSendMessage({ action: 'fetchReelVideo', shortcode: item.shortcode }).then((resp) => {
          if (resp && resp.videoUrl) {
            item.videoUrl = resp.videoUrl;
            if (isHovering) callback(resp.videoUrl);
          }
        });
      }
    }

    // Hover: play video inline in the grid cell (small preview)
    cell.addEventListener('mouseenter', () => {
      isHovering = true;
      overlay.style.opacity = '1';
      hoverTimeout = setTimeout(() => {
        if (!isHovering) return;
        if (!videoEl) {
          videoEl = document.createElement('video');
          videoEl.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:1;';
          videoEl.muted = !videoSoundEnabled;
          videoEl.loop = true;
          videoEl.playsInline = true;
          videoEl.preload = 'auto';
          cell.appendChild(videoEl);
          withVideoUrl(url => {
            videoEl.src = url;
            videoEl.play().then(() => { if (iconEl) iconEl.style.opacity = '0'; }).catch(() => {});
          });
        } else {
          videoEl.style.display = 'block';
          videoEl.play().then(() => { if (iconEl) iconEl.style.opacity = '0'; }).catch(() => {});
        }
      }, 300);
    });

    cell.addEventListener('mouseleave', () => {
      isHovering = false;
      overlay.style.opacity = '0';
      clearTimeout(hoverTimeout);
      if (videoEl) {
        videoEl.pause();
        videoEl.style.display = 'none';
      }
      if (iconEl) iconEl.style.opacity = '1';
    });

    // Click: expand to full tooltip content area (stop propagation to prevent opening link)
    cell.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      isHovering = false;
      // Capture current position before pausing (works even if already paused on mouseleave)
      const thumbTime = videoEl && videoEl.currentTime ? videoEl.currentTime : 0;
      // Pause in-cell video before expanding
      if (videoEl) {
        videoEl.pause();
        videoEl.style.display = 'none';
      }
      if (iconEl) iconEl.style.opacity = '1';
      const idx = playlist ? playlist.indexOf(item) : -1;
      expandVideoPlayer(item, isReel, playlist || [], idx, thumbTime);
    });
  }

  // Helper: create a post grid cell
  function createPostCell(item, grid, postPlaylist) {
    const cell = document.createElement('div');
    cell.className = 'wikihover-instagram-media-item';
    cell.title = item.caption ? item.caption.substring(0, 100) : '';
    cell.style.cssText = 'cursor:pointer;position:relative;background:var(--wh-card-bg);';

    let videoIcon = null;
    if (item.isVideo) {
      videoIcon = document.createElement('div');
      videoIcon.style.cssText = 'position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.6);color:white;border-radius:3px;padding:1px 4px;font-size:10px;z-index:2;pointer-events:none;transition:opacity 0.2s;';
      videoIcon.textContent = '\u25B6';
      cell.appendChild(videoIcon);
    }

    if (item.thumbnailUrl) {
      proxyImage(item.thumbnailUrl).then(dataUrl => {
        if (dataUrl) {
          const img = document.createElement('img');
          img.src = dataUrl;
          img.alt = item.caption ? item.caption.substring(0, 50) : 'Post';
          img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
          cell.insertBefore(img, cell.firstChild);
        }
      });
    }

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.6));color:white;font-size:10px;padding:3px 5px;opacity:0;transition:opacity 0.2s;z-index:3;';
    overlay.textContent = item.likes ? `\u2764 ${formatIGCount(item.likes)}` : '';
    cell.appendChild(overlay);

    if (item.isVideo) {
      setupVideoCell(cell, item, overlay, videoIcon, item.isReel, postPlaylist);
    } else {
      cell.addEventListener('mouseenter', () => { overlay.style.opacity = '1'; });
      cell.addEventListener('mouseleave', () => { overlay.style.opacity = '0'; });
      cell.addEventListener('click', () => {
        const idx = postPlaylist ? postPlaylist.indexOf(item) : -1;
        expandItem(item, false, postPlaylist || [], idx);
      });
    }

    grid.appendChild(cell);
  }

  // Helper: create a reel grid cell
  function createReelCell(item, grid, reelPlaylist) {
    const cell = document.createElement('div');
    cell.className = 'wikihover-instagram-media-item';
    cell.title = item.caption ? item.caption.substring(0, 100) : '';
    cell.style.cssText = 'cursor:pointer;position:relative;background:var(--wh-card-bg);';

    const playIcon = document.createElement('div');
    playIcon.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.5);color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;z-index:2;pointer-events:none;transition:opacity 0.2s;';
    playIcon.textContent = '\u25B6';
    cell.appendChild(playIcon);

    if (item.thumbnailUrl) {
      proxyImage(item.thumbnailUrl).then(dataUrl => {
        if (dataUrl) {
          const img = document.createElement('img');
          img.src = dataUrl;
          img.alt = 'Reel';
          img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
          cell.insertBefore(img, cell.firstChild);
        }
      });
    }

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.6));color:white;font-size:10px;padding:3px 5px;opacity:0;transition:opacity 0.2s;z-index:3;';
    overlay.textContent = item.views ? `\u25B6 ${formatIGCount(item.views)}` : '';
    cell.appendChild(overlay);

    setupVideoCell(cell, item, overlay, playIcon, true, reelPlaylist);
    grid.appendChild(cell);
  }

  // Helper: map edge nodes to our item format
  function edgeToPostItem(edge) {
    const node = edge.node;
    return {
      shortcode: node.shortcode,
      thumbnailUrl: node.thumbnail_src || node.display_url,
      displayUrl: node.display_url,
      isVideo: node.is_video || false,
      isReel: node.__typename === 'GraphVideo' && node.product_type === 'clips',
      videoUrl: node.video_url || null,
      caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
      likes: node.edge_liked_by?.count || node.edge_media_preview_like?.count || 0,
      comments: node.edge_media_to_comment?.count || 0,
      timestamp: node.taken_at_timestamp || 0
    };
  }

  function edgeToReelItem(edge) {
    const node = edge.node;
    return {
      shortcode: node.shortcode,
      thumbnailUrl: node.thumbnail_src || node.display_url,
      displayUrl: node.display_url,
      isVideo: true,
      videoUrl: node.video_url || null,
      caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
      views: node.video_view_count || 0,
      likes: node.edge_liked_by?.count || node.edge_media_preview_like?.count || 0,
      timestamp: node.taken_at_timestamp || 0
    };
  }

  // Helper: create a "Load More" button
  function createLoadMoreButton(label, onClick) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = 'display:block;width:100%;padding:8px;margin-top:8px;background:var(--wh-card-bg);border:1px solid var(--wh-border);border-radius:6px;color:var(--wh-text);font-size:12px;font-weight:500;cursor:pointer;transition:background 0.2s;';
    btn.addEventListener('mouseenter', () => { btn.style.background = 'var(--wh-tab-hover-bg)'; });
    btn.addEventListener('mouseleave', () => { btn.style.background = 'var(--wh-card-bg)'; });
    btn.addEventListener('click', onClick);
    return btn;
  }

  // ----- Recent Posts grid -----
  if (data.mediaItems && data.mediaItems.length > 0) {
    const postsSection = document.createElement('div');
    postsSection.style.marginTop = '10px';

    const postsLabel = document.createElement('div');
    postsLabel.style.cssText = 'font-size:12px;font-weight:600;color:var(--wh-text-secondary);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;';
    postsLabel.textContent = 'Recent Posts';
    postsSection.appendChild(postsLabel);

    const grid = document.createElement('div');
    grid.className = 'wikihover-instagram-grid';
    const postPlaylist = [...data.mediaItems];
    data.mediaItems.forEach(item => createPostCell(item, grid, postPlaylist));
    postsSection.appendChild(grid);

    // Load More posts button
    if (data.userId && data.postsHasMore) {
      let postsCursor = data.postsNextCursor;
      const loadMorePosts = createLoadMoreButton('Load more posts \u25BC', async () => {
        loadMorePosts.textContent = 'Loading...';
        loadMorePosts.style.pointerEvents = 'none';
        try {
          const resp = await safeSendMessage({ action: 'fetchInstagramNextPage', userId: data.userId, type: 'posts', cursor: postsCursor });
          if (resp?.success && resp.edges?.length > 0) {
            resp.edges.forEach(edge => {
              const item = edgeToPostItem(edge);
              postPlaylist.push(item);
              data.mediaItems.push(item);
              createPostCell(item, grid, postPlaylist);
            });
            postsCursor = resp.nextCursor;
            data.postsNextCursor = postsCursor;
            data.postsHasMore = resp.hasMore && !!postsCursor;
            addToCache(instagramCache, currentWord, data);
            if (!resp.hasMore || !postsCursor) {
              loadMorePosts.remove();
            } else {
              loadMorePosts.textContent = 'Load more posts \u25BC';
              loadMorePosts.style.pointerEvents = 'auto';
            }
          } else {
            if (resp?.error === 'no_instagram_tab') {
              loadMorePosts.textContent = 'Instagram disconnected';
            } else {
              loadMorePosts.textContent = 'No more posts';
            }
            loadMorePosts.style.pointerEvents = 'none';
          }
        } catch (e) {
          loadMorePosts.textContent = 'Load more posts \u25BC';
          loadMorePosts.style.pointerEvents = 'auto';
        }
      });
      postsSection.appendChild(loadMorePosts);
    }

    container.appendChild(postsSection);
  }

  // ----- Reels section -----
  if (data.reelItems && data.reelItems.length > 0) {
    const reelsSection = document.createElement('div');
    reelsSection.style.marginTop = '10px';

    const reelsLabel = document.createElement('div');
    reelsLabel.style.cssText = 'font-size:12px;font-weight:600;color:var(--wh-text-secondary);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;';
    reelsLabel.textContent = 'Reels';
    reelsSection.appendChild(reelsLabel);

    const grid = document.createElement('div');
    grid.className = 'wikihover-instagram-grid';
    const reelPlaylist = [...data.reelItems];
    data.reelItems.forEach(item => createReelCell(item, grid, reelPlaylist));
    reelsSection.appendChild(grid);

    // Load More reels button
    if (data.userId && data.reelsHasMore) {
      let reelsCursor = data.reelsNextCursor;
      const loadMoreReels = createLoadMoreButton('Load more reels \u25BC', async () => {
        loadMoreReels.textContent = 'Loading...';
        loadMoreReels.style.pointerEvents = 'none';
        try {
          const resp = await safeSendMessage({ action: 'fetchInstagramNextPage', userId: data.userId, type: 'reels', cursor: reelsCursor });
          if (resp?.success && resp.edges?.length > 0) {
            resp.edges.forEach(edge => {
              const item = edgeToReelItem(edge);
              reelPlaylist.push(item);
              data.reelItems.push(item);
              createReelCell(item, grid, reelPlaylist);
            });
            reelsCursor = resp.nextCursor;
            data.reelsNextCursor = reelsCursor;
            data.reelsHasMore = resp.hasMore && !!reelsCursor;
            addToCache(instagramCache, currentWord, data);
            if (!resp.hasMore || !reelsCursor) {
              loadMoreReels.remove();
            } else {
              loadMoreReels.textContent = 'Load more reels \u25BC';
              loadMoreReels.style.pointerEvents = 'auto';
            }
          } else {
            if (resp?.error === 'no_instagram_tab') {
              loadMoreReels.textContent = 'Instagram disconnected';
            } else {
              loadMoreReels.textContent = 'No more reels';
            }
            loadMoreReels.style.pointerEvents = 'none';
          }
        } catch (e) {
          loadMoreReels.textContent = 'Load more reels \u25BC';
          loadMoreReels.style.pointerEvents = 'auto';
        }
      });
      reelsSection.appendChild(loadMoreReels);
    }

    container.appendChild(reelsSection);
  }

  // No media — show helpful message and direct section links
  if ((!data.mediaItems || data.mediaItems.length === 0) && (!data.reelItems || data.reelItems.length === 0)) {
    const noMediaBox = document.createElement('div');
    noMediaBox.style.cssText = 'margin:10px 0;padding:12px;background:var(--wh-card-bg);border-radius:8px;text-align:center;';

    // Explanation message
    const msg = document.createElement('div');
    msg.style.cssText = 'color:var(--wh-text-secondary);font-size:12px;margin-bottom:10px;';
    if (data.isPrivate) {
      msg.textContent = 'This account is private.';
    } else if (!data.followers && !data.bio) {
      msg.textContent = 'Sign in to Instagram in your browser for full profile data, posts, and reels.';
    } else {
      msg.textContent = 'Posts and reels could not be loaded. Visit Instagram to see their content.';
    }
    noMediaBox.appendChild(msg);

    // Direct section buttons
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:8px;justify-content:center;flex-wrap:wrap;';

    const sections = [
      ['\uD83D\uDDBC Posts', data.profileUrl],
      ['\uD83C\uDFAC Reels', `${data.profileUrl}reels/`],
      ['\uD83C\uDFF7 Tagged', `${data.profileUrl}tagged/`]
    ];

    sections.forEach(([label, url]) => {
      const btn = document.createElement('a');
      btn.href = url;
      btn.target = '_blank';
      btn.textContent = label;
      btn.className = 'wikihover-action-btn';
      btn.style.cssText = 'display:inline-block;padding:6px 12px;background:#E1306C;text-decoration:none;border-radius:6px;font-size:12px;font-weight:500;transition:background 0.2s;';
      btn.addEventListener('mouseenter', () => { btn.style.background = '#c1105c'; });
      btn.addEventListener('mouseleave', () => { btn.style.background = '#E1306C'; });
      btnRow.appendChild(btn);
    });

    noMediaBox.appendChild(btnRow);
    container.appendChild(noMediaBox);
  }

  // View on Instagram link
  const viewLink = document.createElement('div');
  viewLink.style.cssText = 'text-align:center;margin-top:12px;padding-top:10px;border-top:1px solid var(--wh-border-light);';

  const link = document.createElement('a');
  link.href = data.profileUrl;
  link.target = '_blank';
  link.textContent = 'View on Instagram';
  link.style.cssText = 'color:#E1306C;text-decoration:none;font-weight:500;font-size:13px;';
  viewLink.appendChild(link);

  // Add quick links for posts/reels sections on Instagram
  const quickLinks = document.createElement('div');
  quickLinks.style.cssText = 'display:flex;justify-content:center;gap:12px;margin-top:6px;';
  [['Posts', `${data.profileUrl}`], ['Reels', `${data.profileUrl}reels/`], ['Tagged', `${data.profileUrl}tagged/`]].forEach(([label, url]) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.textContent = label;
    a.style.cssText = 'color:var(--wh-text-muted);text-decoration:none;font-size:11px;';
    a.addEventListener('mouseenter', () => { a.style.color = '#E1306C'; });
    a.addEventListener('mouseleave', () => { a.style.color = 'var(--wh-text-muted)'; });
    quickLinks.appendChild(a);
  });
  viewLink.appendChild(quickLinks);

  container.appendChild(viewLink);
}

// Format TikTok counts (e.g. 1234567 -> "1.2M")
function formatTikTokCount(count) {
  if (count == null) return null;
  if (typeof count === 'string') return count;
  if (count >= 1000000) return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (count >= 10000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  if (count >= 1000) return count.toLocaleString();
  return String(count);
}

// Fetch TikTok data for a person
async function fetchTikTokData(name) {
  if (!dataSourceSettings.tiktok) {
    return { name, notFound: true, info: 'TikTok is disabled in settings.', timestamp: Date.now() };
  }

  if (tiktokCache[name]) {
    // If cached result has videos, use it. If it only has stats (no videos),
    // treat as stale and re-fetch — tikwm sometimes returns profile info without
    // videos on first try but succeeds on retry.
    if (tiktokCache[name].videos?.length > 0 || tiktokCache[name].notFound) {
      return tiktokCache[name];
    }
    debugLog('TikTok: cached result has no videos, re-fetching for', name);
  }

  try {
    // Step 1: Get TikTok username from Wikidata P7085
    let username = null;

    try {
      const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&limit=1&format=json&origin=*`;
      const searchResp = await fetch(searchUrl);
      if (searchResp.ok) {
        const searchData = await searchResp.json();
        const entityId = searchData.search?.[0]?.id;
        if (entityId) {
          const entityUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=claims&format=json&origin=*`;
          const entityResp = await fetch(entityUrl);
          if (entityResp.ok) {
            const entityData = await entityResp.json();
            const claims = entityData.entities?.[entityId]?.claims || {};
            username = claims.P7085?.[0]?.mainsnak?.datavalue?.value || null;
          }
        }
      }
    } catch (e) {
      debugLog('Error searching Wikidata for TikTok username:', e);
    }

    // Fallback: search TikTok directly if Wikidata has no P7085
    if (!username) {
      try {
        const searchResult = await safeSendMessage({ action: 'searchTikTokUser', query: name });
        if (searchResult?.username) {
          username = searchResult.username;
        }
      } catch (e) {
        debugLog('TikTok search fallback failed:', e);
      }
    }

    if (!username) {
      // Don't cache notFound — allow retries on next hover (TikTok APIs are flaky)
      return { name, notFound: true, info: 'No TikTok account found.', timestamp: Date.now() };
    }

    // Step 2: Fetch profile data via background script
    const profileResponse = await safeSendMessage({ action: 'fetchTikTokProfile', username });
    debugLog('TikTok profile response:', profileResponse?.type, 'videos:', profileResponse?.videos?.length || 0);
    if (profileResponse?.videos?.length > 0) {
      const firstVid = profileResponse.videos[0];
      debugLog('TikTok first video keys:', Object.keys(firstVid).join(', '));
      debugLog('TikTok first video cover:', firstVid?.video?.cover || firstVid?.coverUrl || 'none');
    } else {
      debugLog('TikTok: no videos in profile response, type:', profileResponse?.type);
    }

    const result = {
      name,
      username,
      profileUrl: `https://www.tiktok.com/@${username}`,
      avatarUrl: null,
      videos: [],
      timestamp: Date.now()
    };

    if (profileResponse && profileResponse.success) {
      if ((profileResponse.type === 'api' || profileResponse.type === 'html_json') && profileResponse.data) {
        const user = profileResponse.data.user || profileResponse.data;
        const stats = profileResponse.data.stats || {};
        debugLog('TikTok user data keys:', Object.keys(user).join(', '));
        debugLog('TikTok stats data:', JSON.stringify(stats));

        result.displayName = user.nickname || username;
        result.bio = user.signature || '';
        result.isVerified = user.verified || false;
        result.followers = formatTikTokCount(stats.followerCount);
        result.following = formatTikTokCount(stats.followingCount);
        result.likes = formatTikTokCount(stats.heartCount || stats.heart || stats.diggCount);
        result.videoCount = formatTikTokCount(stats.videoCount);

        if (user.avatarLarger || user.avatarMedium || user.avatarThumb) {
          result.avatarUrl = user.avatarLarger || user.avatarMedium || user.avatarThumb;
        }

        // Parse videos — handle different TikTok data shapes
        const videoList = profileResponse.videos || [];
        result.videos = videoList.slice(0, 12).map(v => {
          // Different sources return different formats:
          // - API/rehydration: v.video.cover, v.stats.playCount
          // - SIGI_STATE: flat keys like v.originCover, v.playCount
          // - Tab DOM scraping: v.coverUrl directly
          // - oEmbed enriched: v.video.cover = thumbnail_url
          const video = v.video || {};
          const stats = v.stats || {};
          return {
            id: v.id || '',
            desc: v.desc || '',
            coverUrl: v.coverUrl || video.cover || video.originCover || video.dynamicCover || v.originCover || v.dynamicCover || v.cover || '',
            playUrl: video.playAddr || video.downloadAddr || v.playAddr || v.play || '',
            duration: video.duration || v.duration || 0,
            playCount: stats.playCount || v.playCount || v.play_count || 0,
            likeCount: stats.diggCount || v.diggCount || v.digg_count || 0,
            commentCount: stats.commentCount || v.commentCount || v.comment_count || 0,
            shareCount: stats.shareCount || v.shareCount || v.share_count || 0
          };
        });
      } else if (profileResponse.type === 'oembed' && profileResponse.data) {
        const oembed = profileResponse.data;
        result.displayName = oembed.author_name || username;
        result.avatarUrl = oembed.thumbnail_url || null;
      } else if (profileResponse.type === 'html' && profileResponse.html) {
        const html = profileResponse.html;
        const ogImageMatch = html.match(/<meta\s+(?:property|name)="og:image"\s+content="([^"]+)"/i)
          || html.match(/<meta\s+content="([^"]+)"\s+(?:property|name)="og:image"/i);
        const ogDescMatch = html.match(/<meta\s+(?:property|name)="og:description"\s+content="([^"]+)"/i)
          || html.match(/<meta\s+content="([^"]+)"\s+(?:property|name)="og:description"/i);
        const ogTitleMatch = html.match(/<meta\s+(?:property|name)="og:title"\s+content="([^"]+)"/i)
          || html.match(/<meta\s+content="([^"]+)"\s+(?:property|name)="og:title"/i);

        if (ogImageMatch) result.avatarUrl = ogImageMatch[1];
        if (ogTitleMatch) result.displayName = ogTitleMatch[1];
        if (ogDescMatch) {
          const desc = ogDescMatch[1];
          const statsMatch = desc.match(/([\d,.]+[KMB]?)\s+Followers?,\s*([\d,.]+[KMB]?)\s+Following,\s*([\d,.]+[KMB]?)\s+Likes?/i);
          if (statsMatch) {
            result.followers = statsMatch[1];
            result.following = statsMatch[2];
            result.likes = statsMatch[3];
          }
        }
      }
    }

    // Only cache if we got videos. Stats-only results (no videos) are treated as
    // incomplete — tikwm is flaky and often returns profile info without videos on
    // the first request but succeeds on retry.
    if (result.videos.length > 0) {
      addToCache(tiktokCache, name, result);
    }
    return result;
  } catch (error) {
    debugLog('Error fetching TikTok data:', error);
    return { name, notFound: true, info: 'Error fetching TikTok data.', timestamp: Date.now() };
  }
}

// Update TikTok content in tooltip
function updateTikTokContent(container, data, currentWord) {
  container.innerHTML = '';

  if (data.notFound) {
    const notFoundDiv = document.createElement('div');
    notFoundDiv.style.padding = '15px';
    notFoundDiv.style.textAlign = 'center';
    notFoundDiv.style.color = 'var(--wh-text-secondary)';

    const msg = document.createElement('p');
    msg.textContent = data.info || 'No TikTok account found for this person.';
    msg.style.marginBottom = '10px';
    notFoundDiv.appendChild(msg);

    const searchLink = document.createElement('a');
    searchLink.href = `https://www.tiktok.com/search?q=${encodeURIComponent(currentWord)}`;
    searchLink.target = '_blank';
    searchLink.textContent = 'Search on TikTok';
    searchLink.style.color = '#fe2c55';
    searchLink.style.textDecoration = 'none';
    searchLink.style.fontWeight = '500';
    notFoundDiv.appendChild(searchLink);

    container.appendChild(notFoundDiv);
    return;
  }

  // Header
  const headerContainer = document.createElement('div');
  headerContainer.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding:0 0 10px 0;border-bottom:1px solid var(--wh-border-light);';

  const personName = document.createElement('h3');
  personName.style.cssText = 'margin:0;font-size:16px;color:var(--wh-text);font-weight:600;';
  personName.textContent = `${currentWord} on TikTok`;
  headerContainer.appendChild(personName);
  container.appendChild(headerContainer);

  // Profile card
  const profileCard = document.createElement('div');
  profileCard.className = 'wikihover-tiktok-profile';

  // Avatar — proxy through background to avoid CORS
  const avatarEl = document.createElement('div');
  avatarEl.className = 'wikihover-tiktok-avatar';
  avatarEl.style.backgroundColor = 'var(--wh-card-bg)';
  avatarEl.style.display = 'flex';
  avatarEl.style.alignItems = 'center';
  avatarEl.style.justifyContent = 'center';
  avatarEl.style.fontSize = '24px';
  avatarEl.style.color = 'var(--wh-text-muted)';
  avatarEl.textContent = (data.displayName || data.username || '?')[0].toUpperCase();
  profileCard.appendChild(avatarEl);

  if (data.avatarUrl) {
    proxyImage(data.avatarUrl).then(dataUrl => {
      if (dataUrl) {
        const img = document.createElement('img');
        img.src = dataUrl;
        img.alt = data.displayName || data.username;
        img.className = 'wikihover-tiktok-avatar';
        avatarEl.replaceWith(img);
      }
    });
  }

  const infoDiv = document.createElement('div');
  infoDiv.className = 'wikihover-tiktok-info';

  const displayNameEl = document.createElement('h4');
  displayNameEl.style.cssText = 'margin:0;font-size:15px;color:var(--wh-content-text);';
  displayNameEl.textContent = data.displayName || data.username;
  if (data.isVerified) {
    const badge = document.createElement('span');
    badge.textContent = ' \u2713';
    badge.style.cssText = 'color:#20d5ec;font-weight:bold;';
    displayNameEl.appendChild(badge);
  }
  infoDiv.appendChild(displayNameEl);

  const usernameEl = document.createElement('span');
  usernameEl.textContent = `@${data.username}`;
  usernameEl.style.cssText = 'color:var(--wh-text-muted);font-size:13px;';
  infoDiv.appendChild(usernameEl);

  profileCard.appendChild(infoDiv);
  container.appendChild(profileCard);

  // Stats row
  if (data.followers || data.following || data.likes) {
    const statsRow = document.createElement('div');
    statsRow.className = 'wikihover-tiktok-stats';

    if (data.following) {
      const span = document.createElement('span');
      span.innerHTML = `<strong>${data.following}</strong> following`;
      statsRow.appendChild(span);
    }
    if (data.followers) {
      const span = document.createElement('span');
      span.innerHTML = `<strong>${data.followers}</strong> followers`;
      statsRow.appendChild(span);
    }
    if (data.likes) {
      const span = document.createElement('span');
      span.innerHTML = `<strong>${data.likes}</strong> likes`;
      statsRow.appendChild(span);
    }
    container.appendChild(statsRow);
  }

  // Bio
  if (data.bio) {
    const bioDiv = document.createElement('div');
    bioDiv.className = 'wikihover-tiktok-bio';
    bioDiv.textContent = data.bio;
    container.appendChild(bioDiv);
  }

  // ----- Expanded video player (replicates Instagram pattern) -----
  const expandedPlayer = document.createElement('div');
  expandedPlayer.className = 'wikihover-tiktok-expanded-player';
  expandedPlayer.style.cssText = 'display:none;position:relative;background:#000;border-radius:6px;overflow:hidden;cursor:pointer;';

  const expandedVideo = document.createElement('video');
  const ttContentContainer = container.closest('.wikihover-content-container');
  const ttVideoH = getExpandedPlayerHeight(ttContentContainer);
  expandedVideo.style.cssText = `width:100%;height:${ttVideoH}px;object-fit:contain;background:#000;display:block;`;
  expandedVideo.muted = !videoSoundEnabled;
  expandedVideo.loop = false;
  expandedVideo.playsInline = true;
  expandedVideo.preload = 'auto';
  expandedPlayer.appendChild(expandedVideo);

  // Close button (top-left corner)
  const ttCloseBtn = document.createElement('div');
  ttCloseBtn.style.cssText = 'position:absolute;top:8px;right:8px;width:28px;height:28px;background:rgba(0,0,0,0.6);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;z-index:15;line-height:1;transition:background 0.2s;';
  ttCloseBtn.textContent = '\u00D7';
  ttCloseBtn.title = 'Close player';
  ttCloseBtn.addEventListener('mouseenter', () => { ttCloseBtn.style.background = 'rgba(0,0,0,0.85)'; });
  ttCloseBtn.addEventListener('mouseleave', () => { ttCloseBtn.style.background = 'rgba(0,0,0,0.6)'; });
  ttCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); ttCollapseVideoPlayer(); });
  expandedPlayer.appendChild(ttCloseBtn);

  // Countdown circle SVG — appears 5s before video ends
  const ttCountdownContainer = document.createElement('div');
  ttCountdownContainer.style.cssText = 'position:absolute;top:10px;right:10px;width:36px;height:36px;z-index:12;display:none;';
  const ttCountdownSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  ttCountdownSvg.setAttribute('width', '36'); ttCountdownSvg.setAttribute('height', '36'); ttCountdownSvg.setAttribute('viewBox', '0 0 36 36');
  const ttBgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  ttBgCircle.setAttribute('cx','18'); ttBgCircle.setAttribute('cy','18'); ttBgCircle.setAttribute('r','15');
  ttBgCircle.setAttribute('fill','rgba(0,0,0,0.6)'); ttBgCircle.setAttribute('stroke','rgba(255,255,255,0.3)'); ttBgCircle.setAttribute('stroke-width','2');
  ttCountdownSvg.appendChild(ttBgCircle);
  const ttProgressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  ttProgressCircle.setAttribute('cx','18'); ttProgressCircle.setAttribute('cy','18'); ttProgressCircle.setAttribute('r','15');
  ttProgressCircle.setAttribute('fill','none'); ttProgressCircle.setAttribute('stroke','#fe2c55'); ttProgressCircle.setAttribute('stroke-width','2.5'); ttProgressCircle.setAttribute('stroke-linecap','round');
  const ttCircumference = 2 * Math.PI * 15;
  ttProgressCircle.setAttribute('stroke-dasharray', String(ttCircumference)); ttProgressCircle.setAttribute('stroke-dashoffset', '0');
  ttProgressCircle.style.transform = 'rotate(-90deg)'; ttProgressCircle.style.transformOrigin = '50% 50%'; ttProgressCircle.style.transition = 'stroke-dashoffset 0.25s linear';
  ttCountdownSvg.appendChild(ttProgressCircle);
  const ttCountdownText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  ttCountdownText.setAttribute('x','18'); ttCountdownText.setAttribute('y','22'); ttCountdownText.setAttribute('text-anchor','middle');
  ttCountdownText.setAttribute('fill','white'); ttCountdownText.setAttribute('font-size','13'); ttCountdownText.setAttribute('font-weight','600');
  ttCountdownText.textContent = '5';
  ttCountdownSvg.appendChild(ttCountdownText);
  ttCountdownContainer.appendChild(ttCountdownSvg);
  expandedPlayer.appendChild(ttCountdownContainer);

  // Controls bar
  const ttControlsBar = document.createElement('div');
  ttControlsBar.style.cssText = 'position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.85));padding:6px 10px 8px;z-index:10;display:flex;flex-direction:column;gap:4px;';
  ttControlsBar.addEventListener('click', (e) => e.stopPropagation());

  // Progress bar
  const ttProgressContainer = document.createElement('div');
  ttProgressContainer.style.cssText = 'width:100%;height:4px;background:rgba(255,255,255,0.3);border-radius:2px;cursor:pointer;position:relative;';
  const ttProgressFill = document.createElement('div');
  ttProgressFill.style.cssText = 'height:100%;background:#fe2c55;border-radius:2px;width:0%;transition:width 0.1s linear;pointer-events:none;';
  ttProgressContainer.appendChild(ttProgressFill);

  let ttIsSeeking = false;
  function ttSeekToPosition(e) {
    const rect = ttProgressContainer.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (expandedVideo.duration) {
      expandedVideo.currentTime = pct * expandedVideo.duration;
      ttProgressFill.style.width = (pct * 100) + '%';
    }
  }
  ttProgressContainer.addEventListener('mousedown', (e) => { ttIsSeeking = true; ttSeekToPosition(e); });
  document.addEventListener('mousemove', (e) => { if (ttIsSeeking) ttSeekToPosition(e); });
  document.addEventListener('mouseup', () => { ttIsSeeking = false; });
  ttControlsBar.appendChild(ttProgressContainer);

  // Buttons row
  const ttButtonRow = document.createElement('div');
  ttButtonRow.style.cssText = 'display:flex;align-items:center;gap:8px;';

  const ttPlayBtn = document.createElement('span');
  ttPlayBtn.className = 'wikihover-tiktok-player-btn';
  ttPlayBtn.style.cssText = 'color:white;cursor:pointer;font-size:14px;user-select:none;padding:2px 4px;';
  ttPlayBtn.textContent = '\u275A\u275A';
  ttPlayBtn.addEventListener('click', () => { expandedVideo.paused ? expandedVideo.play() : expandedVideo.pause(); });
  ttButtonRow.appendChild(ttPlayBtn);

  const ttTimeDisplay = document.createElement('span');
  ttTimeDisplay.style.cssText = 'color:rgba(255,255,255,0.8);font-size:11px;font-family:monospace;flex:1;';
  ttTimeDisplay.textContent = '0:00 / 0:00';
  ttButtonRow.appendChild(ttTimeDisplay);

  const ttNextBtn = document.createElement('span');
  ttNextBtn.className = 'wikihover-tiktok-next-btn';
  ttNextBtn.style.cssText = 'color:white;cursor:pointer;font-size:12px;user-select:none;padding:2px 6px;border-radius:3px;background:rgba(255,255,255,0.15);display:none;';
  ttNextBtn.textContent = '\u25B6\u25B6';
  ttButtonRow.appendChild(ttNextBtn);
  ttControlsBar.appendChild(ttButtonRow);
  expandedPlayer.appendChild(ttControlsBar);

  // Caption
  const ttExpandedCaption = document.createElement('div');
  ttExpandedCaption.style.cssText = 'position:absolute;bottom:50px;left:0;right:0;color:white;font-size:11px;padding:4px 12px;background:rgba(0,0,0,0.4);max-height:40px;overflow:hidden;text-overflow:ellipsis;z-index:9;';
  expandedPlayer.appendChild(ttExpandedCaption);

  // Stats overlay at top
  const ttExpandedStats = document.createElement('div');
  ttExpandedStats.style.cssText = 'position:absolute;top:0;left:0;right:0;background:linear-gradient(rgba(0,0,0,0.6),transparent);color:white;font-size:11px;padding:8px 12px;display:flex;gap:12px;z-index:9;';
  expandedPlayer.appendChild(ttExpandedStats);

  // State
  let ttExpandedPlaylist = [];
  let ttExpandedPlaylistIndex = -1;
  let ttCurrentExpandItem = null;
  let ttSavedScrollTop = 0;
  let ttSavedCCHeight = '';
  let ttSavedCCMaxHeight = '';
  const TT_COUNTDOWN_SECONDS = 5;

  function ttFormatTime(sec) {
    if (!sec || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function ttExpandVideoPlayer(video, playlist, index, startTime) {
    if (!ttCurrentExpandItem) {
      const contentContainer = container.closest('.wikihover-content-container');
      if (contentContainer) {
        ttSavedScrollTop = contentContainer.scrollTop;
        ttSavedCCHeight = contentContainer.style.getPropertyValue('height');
        ttSavedCCMaxHeight = contentContainer.style.getPropertyValue('max-height');
      }
      Array.from(container.children).forEach(child => {
        if (child !== expandedPlayer) {
          child.dataset.savedDisplay = child.style.display;
          child.style.display = 'none';
        }
      });
      if (expandedPlayer.parentNode !== container) container.appendChild(expandedPlayer);
      expandedPlayer.style.display = 'block';

      // Lock content container height so it doesn't push the footer
      const tooltipEl = contentContainer && contentContainer.closest('.wikihover-tooltip, .wikihover-pinned-tooltip');
      if (tooltipEl && contentContainer) {
        const ccH = getContentContainerHeight(tooltipEl, tooltipEl.offsetHeight);
        contentContainer.style.setProperty('height', ccH + 'px', 'important');
        contentContainer.style.setProperty('max-height', ccH + 'px', 'important');
      }

      // Size video to fit content container (minus padding)
      expandedVideo.style.height = getExpandedPlayerHeight(contentContainer) + 'px';

      if (contentContainer) contentContainer.scrollTop = 0;
    }

    if (playlist) {
      ttExpandedPlaylist = playlist;
      ttExpandedPlaylistIndex = index != null ? index : -1;
    }

    ttExpandedCaption.textContent = video.desc ? video.desc.substring(0, 150) : '';
    ttExpandedStats.innerHTML = '';
    if (video.playCount) {
      const s = document.createElement('span'); s.textContent = `\u25B6 ${formatTikTokCount(video.playCount)}`; ttExpandedStats.appendChild(s);
    }
    if (video.likeCount) {
      const s = document.createElement('span'); s.textContent = `\u2764 ${formatTikTokCount(video.likeCount)}`; ttExpandedStats.appendChild(s);
    }
    ttCurrentExpandItem = video;

    ttProgressFill.style.width = '0%';
    ttTimeDisplay.textContent = '0:00 / 0:00';
    ttCountdownContainer.style.display = 'none';
    const hasNext = ttExpandedPlaylist.length > 0 && ttExpandedPlaylistIndex + 1 < ttExpandedPlaylist.length;
    ttNextBtn.style.display = hasNext ? 'block' : 'none';

    const seekTime = startTime && startTime > 0 ? startTime : 0;
    startTime = 0;

    const playFromPosition = () => {
      if (!ttCurrentExpandItem) return;
      if (seekTime > 0) {
        expandedVideo.currentTime = seekTime;
      }
      expandedVideo.play().catch(() => {});
    };

    // Set video source — try direct URL, fallback to proxy
    const videoUrl = video.playUrl;
    if (videoUrl) {
      expandedVideo.src = videoUrl;
      expandedVideo.addEventListener('loadeddata', function onLoaded() {
        expandedVideo.removeEventListener('loadeddata', onLoaded);
        playFromPosition();
      });
      expandedVideo.play().catch(async () => {
        try {
          const proxied = await proxyImage(videoUrl);
          if (proxied && ttCurrentExpandItem) {
            expandedVideo.src = proxied;
            expandedVideo.addEventListener('loadeddata', function onLoaded2() {
              expandedVideo.removeEventListener('loadeddata', onLoaded2);
              playFromPosition();
            });
          }
        } catch (_) {}
      });
    }
  }

  function ttCollapseVideoPlayer() {
    expandedVideo.pause();
    expandedVideo.removeAttribute('src');
    expandedVideo.load();
    expandedPlayer.style.display = 'none';
    Array.from(container.children).forEach(child => {
      if (child !== expandedPlayer && child.dataset.savedDisplay !== undefined) {
        child.style.display = child.dataset.savedDisplay;
        delete child.dataset.savedDisplay;
      }
    });
    ttCurrentExpandItem = null;
    ttCountdownContainer.style.display = 'none';
    const contentContainer = container.closest('.wikihover-content-container');
    if (contentContainer) {
      if (ttSavedCCHeight) {
        contentContainer.style.setProperty('height', ttSavedCCHeight, 'important');
      } else {
        contentContainer.style.removeProperty('height');
      }
      if (ttSavedCCMaxHeight) {
        contentContainer.style.setProperty('max-height', ttSavedCCMaxHeight, 'important');
      } else {
        contentContainer.style.removeProperty('max-height');
      }
      contentContainer.scrollTop = ttSavedScrollTop;
    }
  }

  // Auto-advance on video end
  expandedVideo.addEventListener('ended', () => {
    if (!ttCurrentExpandItem || ttExpandedPlaylist.length === 0) return;
    const nextIndex = ttExpandedPlaylistIndex + 1;
    if (nextIndex < ttExpandedPlaylist.length) {
      ttExpandedPlaylistIndex = nextIndex;
      ttExpandVideoPlayer(ttExpandedPlaylist[nextIndex], ttExpandedPlaylist, nextIndex);
    } else {
      ttCollapseVideoPlayer();
    }
  });

  // Time/progress/countdown updates
  expandedVideo.addEventListener('timeupdate', () => {
    if (ttIsSeeking) return;
    const dur = expandedVideo.duration;
    const cur = expandedVideo.currentTime;
    if (dur) {
      ttProgressFill.style.width = ((cur / dur) * 100) + '%';
      ttTimeDisplay.textContent = ttFormatTime(cur) + ' / ' + ttFormatTime(dur);
    }
    const remaining = dur - cur;
    const hasNext = ttExpandedPlaylist.length > 0 && ttExpandedPlaylistIndex + 1 < ttExpandedPlaylist.length;
    if (dur && remaining <= TT_COUNTDOWN_SECONDS && remaining > 0 && hasNext) {
      ttCountdownContainer.style.display = 'block';
      ttCountdownText.textContent = String(Math.ceil(remaining));
      const offset = ttCircumference * (1 - remaining / TT_COUNTDOWN_SECONDS);
      ttProgressCircle.setAttribute('stroke-dashoffset', String(offset));
    } else {
      ttCountdownContainer.style.display = 'none';
      ttProgressCircle.setAttribute('stroke-dashoffset', '0');
    }
  });

  expandedVideo.addEventListener('play', () => { ttPlayBtn.textContent = '\u275A\u275A'; });
  expandedVideo.addEventListener('pause', () => { ttPlayBtn.textContent = '\u25B6'; });

  // Click player to toggle play/pause
  expandedPlayer.addEventListener('click', () => {
    expandedVideo.paused ? expandedVideo.play().catch(() => {}) : expandedVideo.pause();
  });

  // Next button
  ttNextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (ttExpandedPlaylist.length === 0 || ttExpandedPlaylistIndex < 0) return;
    const nextIndex = ttExpandedPlaylistIndex + 1;
    if (nextIndex < ttExpandedPlaylist.length) {
      ttExpandedPlaylistIndex = nextIndex;
      ttExpandVideoPlayer(ttExpandedPlaylist[nextIndex], ttExpandedPlaylist, nextIndex);
    }
  });

  // ----- Video grid + Load More -----
  const allVideos = data.videos ? [...data.videos] : [];
  let tiktokCursor = 12; // tikwm cursor for pagination (starts after first batch)

  function createTikTokVideoCell(video) {
    const cell = document.createElement('div');
    cell.className = 'wikihover-tiktok-video-item';
    cell.title = video.desc ? video.desc.substring(0, 100) : '';
    cell.style.cursor = 'pointer';

    // Play icon overlay
    const playIcon = document.createElement('div');
    playIcon.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.5);color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;z-index:2;pointer-events:none;transition:opacity 0.2s;';
    playIcon.textContent = '\u25B6';
    cell.appendChild(playIcon);

    // Cover image
    if (video.coverUrl) {
      proxyImage(video.coverUrl).then(dataUrl => {
        if (dataUrl) {
          const img = document.createElement('img');
          img.src = dataUrl;
          img.alt = video.desc ? video.desc.substring(0, 50) : 'Video';
          img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
          cell.insertBefore(img, cell.firstChild);
        }
      });
    }

    // Views overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.6));color:white;font-size:10px;padding:3px 5px;opacity:0;transition:opacity 0.2s;z-index:3;';
    overlay.textContent = video.playCount ? `\u25B6 ${formatTikTokCount(video.playCount)}` : '';
    cell.appendChild(overlay);

    // Video preview on hover
    let videoEl = null;
    let hoverTimeout = null;
    let videoBlobUrl = null;
    cell.addEventListener('mouseenter', () => {
      overlay.style.opacity = '1';
      if (video.playUrl) {
        hoverTimeout = setTimeout(async () => {
          if (!videoEl) {
            videoEl = document.createElement('video');
            videoEl.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:1;';
            videoEl.muted = !videoSoundEnabled;
            videoEl.loop = true;
            videoEl.playsInline = true;
            videoEl.preload = 'auto';
            videoEl.src = video.playUrl;
            cell.appendChild(videoEl);
            try {
              await videoEl.play();
              playIcon.style.opacity = '0';
            } catch (e) {
              if (!videoBlobUrl) {
                try {
                  const dataUrl = await proxyImage(video.playUrl);
                  if (dataUrl) { videoBlobUrl = dataUrl; videoEl.src = dataUrl; await videoEl.play(); playIcon.style.opacity = '0'; }
                } catch (_) {}
              }
            }
          } else {
            videoEl.style.display = 'block';
            videoEl.play().then(() => { playIcon.style.opacity = '0'; }).catch(() => {});
          }
        }, 300);
      }
    });
    cell.addEventListener('mouseleave', () => {
      overlay.style.opacity = '0';
      clearTimeout(hoverTimeout);
      if (videoEl) { videoEl.pause(); videoEl.style.display = 'none'; }
      playIcon.style.opacity = '1';
    });

    // Click: expand video player (continue from thumbnail position)
    cell.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const thumbTime = videoEl && videoEl.currentTime ? videoEl.currentTime : 0;
      if (videoEl) { videoEl.pause(); videoEl.style.display = 'none'; }
      playIcon.style.opacity = '1';
      const idx = allVideos.indexOf(video);
      ttExpandVideoPlayer(video, allVideos, idx, thumbTime);
    });

    return cell;
  }

  if (allVideos.length > 0) {
    const videosSection = document.createElement('div');
    videosSection.style.marginTop = '10px';

    const videosLabel = document.createElement('div');
    videosLabel.style.cssText = 'font-size:12px;font-weight:600;color:var(--wh-text-secondary);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;';
    videosLabel.textContent = 'Recent Videos';
    videosSection.appendChild(videosLabel);

    const grid = document.createElement('div');
    grid.className = 'wikihover-tiktok-grid';

    allVideos.forEach(video => {
      grid.appendChild(createTikTokVideoCell(video));
    });

    videosSection.appendChild(grid);

    // Load more button
    const loadMoreBtn = document.createElement('div');
    loadMoreBtn.style.cssText = 'text-align:center;margin-top:8px;padding:8px;cursor:pointer;color:#fe2c55;font-size:12px;font-weight:600;border-radius:6px;transition:background 0.2s;';
    loadMoreBtn.textContent = 'Load more videos \u25BC';
    loadMoreBtn.addEventListener('mouseenter', () => { loadMoreBtn.style.background = 'rgba(254,44,85,0.08)'; });
    loadMoreBtn.addEventListener('mouseleave', () => { loadMoreBtn.style.background = 'transparent'; });
    loadMoreBtn.addEventListener('click', async () => {
      loadMoreBtn.textContent = 'Loading...';
      loadMoreBtn.style.pointerEvents = 'none';
      loadMoreBtn.style.opacity = '0.6';
      try {
        const resp = await safeSendMessage({ action: 'fetchTikTokNextVideos', username: data.username, cursor: tiktokCursor });
        if (resp && resp.videos && resp.videos.length > 0) {
          resp.videos.forEach(v => {
            allVideos.push(v);
            grid.appendChild(createTikTokVideoCell(v));
          });
          tiktokCursor = resp.cursor || (tiktokCursor + resp.videos.length);
          // Update cache with new videos
          data.videos = allVideos;
          addToCache(tiktokCache, currentWord, data);
          if (!resp.hasMore) {
            loadMoreBtn.textContent = 'No more videos';
            loadMoreBtn.style.cursor = 'default';
            loadMoreBtn.style.color = 'var(--wh-text-muted)';
            loadMoreBtn.style.pointerEvents = 'none';
          } else {
            loadMoreBtn.textContent = 'Load more videos \u25BC';
            loadMoreBtn.style.pointerEvents = 'auto';
            loadMoreBtn.style.opacity = '1';
          }
        } else {
          loadMoreBtn.textContent = 'No more videos';
          loadMoreBtn.style.cursor = 'default';
          loadMoreBtn.style.color = 'var(--wh-text-muted)';
          loadMoreBtn.style.pointerEvents = 'none';
        }
      } catch (e) {
        loadMoreBtn.textContent = 'Load more videos \u25BC';
        loadMoreBtn.style.pointerEvents = 'auto';
        loadMoreBtn.style.opacity = '1';
      }
    });
    videosSection.appendChild(loadMoreBtn);
    container.appendChild(videosSection);
  }

  // No videos — show helpful message
  if (allVideos.length === 0) {
    const noMediaBox = document.createElement('div');
    noMediaBox.style.cssText = 'margin:10px 0;padding:12px;background:var(--wh-card-bg);border-radius:8px;text-align:center;';

    const msg = document.createElement('div');
    msg.style.cssText = 'color:var(--wh-text-secondary);font-size:12px;margin-bottom:10px;';
    msg.textContent = 'No video previews available. Visit TikTok to see their content.';
    noMediaBox.appendChild(msg);
    container.appendChild(noMediaBox);
  }

  // View on TikTok footer
  const viewLink = document.createElement('div');
  viewLink.style.cssText = 'text-align:center;margin-top:12px;padding-top:10px;border-top:1px solid var(--wh-border-light);';

  const link = document.createElement('a');
  link.href = data.profileUrl;
  link.target = '_blank';
  link.textContent = 'View on TikTok';
  link.style.cssText = 'color:#fe2c55;text-decoration:none;font-weight:500;font-size:13px;';
  viewLink.appendChild(link);
  container.appendChild(viewLink);
}

// Fetch Pinterest data for a person
async function fetchPinterestData(name) {
  if (!dataSourceSettings.pinterest) {
    return { name, notFound: true, info: 'Pinterest is disabled in settings.', timestamp: Date.now() };
  }

  if (pinterestCache[name]) {
    return pinterestCache[name];
  }

  try {
    // Step 1: Get Pinterest username from Wikidata P3836
    let username = null;

    try {
      const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&limit=1&format=json&origin=*`;
      const searchResp = await fetch(searchUrl);
      if (searchResp.ok) {
        const searchData = await searchResp.json();
        const entityId = searchData.search?.[0]?.id;
        if (entityId) {
          const entityUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=claims&format=json&origin=*`;
          const entityResp = await fetch(entityUrl);
          if (entityResp.ok) {
            const entityData = await entityResp.json();
            const claims = entityData.entities?.[entityId]?.claims || {};
            username = claims.P3836?.[0]?.mainsnak?.datavalue?.value || null;
          }
        }
      }
    } catch (e) {
      debugLog('Error searching Wikidata for Pinterest username:', e);
    }

    // Fallback: try name as username via oEmbed validation
    if (!username) {
      try {
        const guess = name.toLowerCase().replace(/\s+/g, '');
        const validation = await safeSendMessage({ action: 'validatePinterestUser', username: guess });
        if (validation?.valid) {
          username = guess;
        }
      } catch (e) {
        debugLog('Pinterest username validation fallback failed:', e);
      }
    }

    if (!username) {
      const result = { name, notFound: true, info: 'No Pinterest account found.', timestamp: Date.now() };
      addToCache(pinterestCache, name, result);
      return result;
    }

    // Step 2: Fetch RSS feed via background script
    const feedResponse = await safeSendMessage({ action: 'fetchPinterestFeed', username });
    debugLog('Pinterest feed response:', feedResponse?.success, 'pins:', feedResponse?.pins?.length || 0);

    const result = {
      name,
      username,
      profileUrl: `https://www.pinterest.com/${username}/`,
      pins: [],
      timestamp: Date.now()
    };

    if (feedResponse && feedResponse.success) {
      result.displayName = feedResponse.displayName || username;
      result.bio = feedResponse.bio || '';
      result.pins = (feedResponse.pins || []).slice(0, 25);
    }

    addToCache(pinterestCache, name, result);
    return result;
  } catch (error) {
    debugLog('Error fetching Pinterest data:', error);
    const fallback = { name, notFound: true, info: 'Error fetching Pinterest data.', timestamp: Date.now() };
    addToCache(pinterestCache, name, fallback);
    return fallback;
  }
}

// Update Pinterest content in tooltip
function updatePinterestContent(container, data, currentWord) {
  container.innerHTML = '';

  if (data.notFound) {
    const notFoundDiv = document.createElement('div');
    notFoundDiv.style.padding = '15px';
    notFoundDiv.style.textAlign = 'center';

    const message = document.createElement('p');
    message.textContent = data.info || 'No Pinterest account found.';
    message.style.cssText = 'color:var(--wh-text-secondary);margin-bottom:10px;';
    notFoundDiv.appendChild(message);

    const searchLink = document.createElement('a');
    searchLink.href = `https://www.pinterest.com/search/users/?q=${encodeURIComponent(currentWord)}`;
    searchLink.target = '_blank';
    searchLink.textContent = 'Search on Pinterest';
    searchLink.style.cssText = 'color:#E60023;text-decoration:none;font-weight:500;';
    notFoundDiv.appendChild(searchLink);

    container.appendChild(notFoundDiv);
    return;
  }

  // Profile header
  const profileDiv = document.createElement('div');
  profileDiv.className = 'wikihover-pinterest-profile';

  const infoDiv = document.createElement('div');
  const nameEl = document.createElement('h4');
  nameEl.textContent = data.displayName || data.username;
  nameEl.style.cssText = 'margin:0;font-size:15px;color:var(--wh-content-text);';
  infoDiv.appendChild(nameEl);

  const usernameEl = document.createElement('span');
  usernameEl.textContent = `@${data.username}`;
  usernameEl.style.cssText = 'color:var(--wh-content-secondary);font-size:13px;';
  infoDiv.appendChild(usernameEl);

  profileDiv.appendChild(infoDiv);
  container.appendChild(profileDiv);

  // Bio
  if (data.bio) {
    const bioDiv = document.createElement('div');
    bioDiv.className = 'wikihover-pinterest-bio';
    bioDiv.textContent = data.bio;
    container.appendChild(bioDiv);
  }

  // Pin grid with load-more pagination
  const allPins = data.pins ? [...data.pins] : [];
  let pinterestBoardIndex = 0; // tracks which board to fetch next
  let pinterestBoards = null;  // discovered boards (lazy-loaded)
  const seenPinUrls = new Set(allPins.map(p => p.url)); // deduplicate

  // --- Expanded image viewer (hides grid, shows full image in-place) ---
  const expandedViewer = document.createElement('div');
  expandedViewer.className = 'wikihover-pinterest-expanded';
  expandedViewer.style.display = 'none';

  const expandedImg = document.createElement('img');
  expandedImg.className = 'wikihover-pinterest-expanded-img';
  expandedViewer.appendChild(expandedImg);

  // Close button
  const pinCloseBtn = document.createElement('div');
  pinCloseBtn.className = 'wikihover-pinterest-expanded-close';
  pinCloseBtn.textContent = '\u00D7';
  pinCloseBtn.title = 'Close';
  expandedViewer.appendChild(pinCloseBtn);

  // Prev / Next arrows
  const pinPrevBtn = document.createElement('div');
  pinPrevBtn.className = 'wikihover-pinterest-expanded-nav wikihover-pinterest-nav-prev';
  pinPrevBtn.innerHTML = '\u276E';
  expandedViewer.appendChild(pinPrevBtn);

  const pinNextBtn = document.createElement('div');
  pinNextBtn.className = 'wikihover-pinterest-expanded-nav wikihover-pinterest-nav-next';
  pinNextBtn.innerHTML = '\u276F';
  expandedViewer.appendChild(pinNextBtn);

  // Caption + "Open on Pinterest" bar
  const expandedCaption = document.createElement('div');
  expandedCaption.className = 'wikihover-pinterest-expanded-caption';
  expandedViewer.appendChild(expandedCaption);

  let expandedPinIndex = -1;
  let savedScrollTop = 0;

  function getDisplayedPins() {
    // Collect all pins currently in the grid (may grow via load-more)
    return allPins;
  }

  function showExpandedPin(index) {
    const pins = getDisplayedPins();
    if (index < 0 || index >= pins.length) return;
    expandedPinIndex = index;
    const pin = pins[index];

    // Use 736x (large) version of the image for expanded view
    const fullUrl = pin.thumbnailUrl ? pin.thumbnailUrl.replace('/474x/', '/736x/').replace('/236x/', '/736x/') : '';
    expandedImg.src = fullUrl;
    expandedImg.alt = pin.title || '';

    // Caption bar
    const titleText = pin.title || '';
    const pinUrl = pin.url || '#';
    expandedCaption.innerHTML = '';
    if (titleText) {
      const captionText = document.createElement('span');
      captionText.textContent = titleText;
      captionText.style.cssText = 'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
      expandedCaption.appendChild(captionText);
    }
    const openLink = document.createElement('a');
    openLink.href = pinUrl;
    openLink.target = '_blank';
    openLink.textContent = 'Open \u2197';
    openLink.style.cssText = 'color:#E60023;text-decoration:none;font-weight:600;font-size:12px;flex-shrink:0;margin-left:8px;';
    openLink.addEventListener('click', (e) => e.stopPropagation());
    expandedCaption.appendChild(openLink);

    // Nav button visibility
    pinPrevBtn.style.display = index > 0 ? 'flex' : 'none';
    pinNextBtn.style.display = index < pins.length - 1 ? 'flex' : 'none';
  }

  function expandPin(index) {
    const contentContainer = container.closest('.wikihover-content-container');
    if (contentContainer) savedScrollTop = contentContainer.scrollTop;

    // Hide all regular children
    Array.from(container.children).forEach(child => {
      if (child !== expandedViewer) {
        child.dataset.savedDisplay = child.style.display;
        child.style.display = 'none';
      }
    });

    if (expandedViewer.parentNode !== container) {
      container.appendChild(expandedViewer);
    }
    expandedViewer.style.display = 'block';
    if (contentContainer) contentContainer.scrollTop = 0;

    showExpandedPin(index);
  }

  function collapsePin() {
    expandedViewer.style.display = 'none';
    expandedImg.src = '';
    expandedPinIndex = -1;

    Array.from(container.children).forEach(child => {
      if (child !== expandedViewer && child.dataset.savedDisplay !== undefined) {
        child.style.display = child.dataset.savedDisplay;
        delete child.dataset.savedDisplay;
      }
    });

    const contentContainer = container.closest('.wikihover-content-container');
    if (contentContainer) contentContainer.scrollTop = savedScrollTop;
  }

  pinCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); collapsePin(); });
  pinPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); showExpandedPin(expandedPinIndex - 1); });
  pinNextBtn.addEventListener('click', (e) => { e.stopPropagation(); showExpandedPin(expandedPinIndex + 1); });
  expandedImg.addEventListener('click', (e) => { e.stopPropagation(); }); // prevent bubbling

  function createPinCell(pin, index) {
    const pinItem = document.createElement('div');
    pinItem.className = 'wikihover-pinterest-pin';
    pinItem.title = pin.title || '';
    pinItem.style.cursor = 'pointer';

    if (pin.thumbnailUrl) {
      const img = document.createElement('img');
      img.src = pin.thumbnailUrl;
      img.alt = pin.title || '';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
      img.loading = 'lazy';
      img.onerror = function() { this.style.display = 'none'; };
      pinItem.appendChild(img);
    }

    if (pin.title) {
      const titleOverlay = document.createElement('div');
      titleOverlay.className = 'wikihover-pinterest-pin-title';
      titleOverlay.textContent = pin.title;
      pinItem.appendChild(titleOverlay);
    }

    pinItem.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      expandPin(index);
    });

    return pinItem;
  }

  if (allPins.length > 0) {
    const pinsSection = document.createElement('div');
    const grid = document.createElement('div');
    grid.className = 'wikihover-pinterest-grid';

    // Show first 12 pins
    allPins.slice(0, 12).forEach((pin, i) => {
      grid.appendChild(createPinCell(pin, i));
    });
    pinsSection.appendChild(grid);

    // Load more button (only if there are more than 12 pins or boards to fetch)
    if (allPins.length > 12 || data.username) {
      const loadMoreBtn = document.createElement('div');
      loadMoreBtn.style.cssText = 'text-align:center;margin-top:8px;padding:8px;cursor:pointer;color:#E60023;font-size:12px;font-weight:600;border-radius:6px;transition:background 0.2s;';
      loadMoreBtn.textContent = 'Load more pins \u25BC';
      loadMoreBtn.addEventListener('mouseenter', () => { loadMoreBtn.style.background = 'rgba(230,0,35,0.08)'; });
      loadMoreBtn.addEventListener('mouseleave', () => { loadMoreBtn.style.background = 'transparent'; });

      let displayedCount = 12;

      loadMoreBtn.addEventListener('click', async () => {
        // Phase 1: reveal more from already-fetched pins
        if (displayedCount < allPins.length) {
          const nextBatch = allPins.slice(displayedCount, displayedCount + 12);
          nextBatch.forEach((pin, i) => {
            grid.appendChild(createPinCell(pin, displayedCount + i));
          });
          displayedCount += nextBatch.length;

          // Update cache
          if (pinterestCache[currentWord]) {
            pinterestCache[currentWord].pins = allPins;
          }

          if (displayedCount < allPins.length) return; // still more cached pins

          // If we haven't discovered boards yet, don't show "no more" yet
          if (pinterestBoards === null && data.username) {
            // Fall through to Phase 2
          } else if (pinterestBoards && pinterestBoardIndex < pinterestBoards.length) {
            // Fall through to Phase 2
          } else {
            loadMoreBtn.textContent = 'No more pins';
            loadMoreBtn.style.cursor = 'default';
            loadMoreBtn.style.color = 'var(--wh-text-muted)';
            loadMoreBtn.style.pointerEvents = 'none';
            return;
          }
        }

        // Phase 2: fetch pins from user's boards
        loadMoreBtn.textContent = 'Loading...';
        loadMoreBtn.style.pointerEvents = 'none';
        loadMoreBtn.style.opacity = '0.6';

        try {
          // Discover boards on first load-more past initial pins
          if (pinterestBoards === null) {
            const boardsResp = await safeSendMessage({ action: 'fetchPinterestBoards', username: data.username });
            pinterestBoards = (boardsResp?.success && boardsResp.boards) ? boardsResp.boards : [];
            pinterestBoardIndex = 0;
          }

          // Fetch next board's RSS until we get new pins or run out of boards
          let newPins = [];
          while (pinterestBoardIndex < pinterestBoards.length && newPins.length === 0) {
            const board = pinterestBoards[pinterestBoardIndex];
            pinterestBoardIndex++;
            const resp = await safeSendMessage({ action: 'fetchPinterestBoardFeed', username: data.username, board });
            if (resp?.success && resp.pins?.length > 0) {
              // Deduplicate against already-seen pins
              for (const pin of resp.pins) {
                if (pin.url && !seenPinUrls.has(pin.url)) {
                  seenPinUrls.add(pin.url);
                  newPins.push(pin);
                }
              }
            }
          }

          if (newPins.length > 0) {
            allPins.push(...newPins);
            // Show up to 12 new pins
            const toShow = newPins.slice(0, 12);
            const startIdx = allPins.length - newPins.length; // index in allPins where newPins start
            toShow.forEach((pin, i) => {
              grid.appendChild(createPinCell(pin, startIdx + i));
            });
            displayedCount += toShow.length;

            // Update cache
            if (pinterestCache[currentWord]) {
              pinterestCache[currentWord].pins = allPins;
            }

            if (pinterestBoardIndex < pinterestBoards.length || displayedCount < allPins.length) {
              loadMoreBtn.textContent = 'Load more pins \u25BC';
              loadMoreBtn.style.pointerEvents = 'auto';
              loadMoreBtn.style.opacity = '1';
            } else {
              loadMoreBtn.textContent = 'No more pins';
              loadMoreBtn.style.cursor = 'default';
              loadMoreBtn.style.color = 'var(--wh-text-muted)';
              loadMoreBtn.style.pointerEvents = 'none';
            }
          } else {
            loadMoreBtn.textContent = 'No more pins';
            loadMoreBtn.style.cursor = 'default';
            loadMoreBtn.style.color = 'var(--wh-text-muted)';
            loadMoreBtn.style.pointerEvents = 'none';
          }
        } catch (e) {
          loadMoreBtn.textContent = 'Load more pins \u25BC';
          loadMoreBtn.style.pointerEvents = 'auto';
          loadMoreBtn.style.opacity = '1';
        }
      });
      pinsSection.appendChild(loadMoreBtn);
    }

    container.appendChild(pinsSection);
  }

  // View on Pinterest link
  const viewLink = document.createElement('div');
  viewLink.style.cssText = 'text-align:center;margin-top:10px;padding-top:8px;border-top:1px solid var(--wh-border-light);';
  const link = document.createElement('a');
  link.href = data.profileUrl;
  link.target = '_blank';
  link.textContent = 'View on Pinterest';
  link.style.cssText = 'color:#E60023;text-decoration:none;font-weight:500;font-size:13px;';
  viewLink.appendChild(link);
  container.appendChild(viewLink);
}

// Resolve X/Twitter username via Wikidata P2002
async function resolveTwitterUsername(name) {
  try {
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&limit=1&format=json&origin=*`;
    const searchResp = await fetch(searchUrl);
    if (searchResp.ok) {
      const searchData = await searchResp.json();
      const entityId = searchData.search?.[0]?.id;
      if (entityId) {
        const entityUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=claims&format=json&origin=*`;
        const entityResp = await fetch(entityUrl);
        if (entityResp.ok) {
          const entityData = await entityResp.json();
          const claims = entityData.entities?.[entityId]?.claims || {};
          return claims.P2002?.[0]?.mainsnak?.datavalue?.value || null;
        }
      }
    }
  } catch (e) {
    debugLog('Error searching Wikidata for Twitter username:', e);
  }
  return null;
}

// Fetch X/Twitter data via tab injection (Tier 1 — no token needed)
async function fetchTwitterDataViaTab(name) {
  // Step 1: Resolve username
  let username = await resolveTwitterUsername(name);

  // Step 2: If no Wikidata username, search via tab injection
  if (!username) {
    try {
      const searchResult = await safeSendMessage({ action: 'searchTwitterUserViaTab', query: name });
      if (searchResult?.success && searchResult.data?.username) {
        username = searchResult.data.username;
      }
    } catch (e) {
      debugLog('Tab search for X user failed:', e);
    }
  }

  // Step 3: If still no username, try common patterns via profile lookup
  if (!username) {
    const nameParts = name.toLowerCase().split(/\s+/);
    const guesses = [nameParts.join(''), nameParts.join('_')];
    for (const guess of guesses) {
      try {
        const profileResult = await safeSendMessage({ action: 'fetchTwitterProfileViaTab', username: guess });
        if (profileResult?.success) {
          const dispName = profileResult.data.name.toLowerCase();
          const queryLower = name.toLowerCase();
          if (dispName.includes(queryLower) || queryLower.includes(dispName) ||
              nameParts.some(p => dispName.includes(p))) {
            username = profileResult.data.screenName;
            break;
          }
        }
      } catch (e) {
        // Guess didn't work
      }
    }
  }

  if (!username) return null;

  // Step 4: Fetch profile
  const profileResult = await safeSendMessage({ action: 'fetchTwitterProfileViaTab', username });

  if (!profileResult?.success) return null;
  const p = profileResult.data;

  // Step 5: Fetch tweets
  let tweets = [];
  if (p.restId) {
    try {
      const tweetsResult = await safeSendMessage({ action: 'fetchTwitterTweetsViaTab', userId: p.restId, count: 30 });
      if (tweetsResult?.success && tweetsResult.data) {
        tweets = tweetsResult.data;
      }
    } catch (e) {
      debugLog('Error fetching tweets via tab:', e);
    }
  }

  // Step 6: Normalize into standard data structure
  return {
    name,
    username: p.screenName,
    displayName: p.name,
    bio: p.description || '',
    profilePicUrl: p.profileImageUrl || null,
    verified: p.isBlueVerified || false,
    followers: p.followersCount || 0,
    following: p.friendsCount || 0,
    tweetCount: p.statusesCount || 0,
    createdAt: p.createdAt || null,
    profileUrl: `https://x.com/${p.screenName}`,
    tweets: tweets.map(t => ({
      id: t.id,
      text: t.text,
      createdAt: t.createdAt,
      likes: t.likes || 0,
      retweets: t.retweets || 0,
      replies: t.replies || 0,
      media: (t.media || []).map(m => ({
        type: m.type,
        url: m.url || null,
        previewUrl: m.previewUrl || null,
        videoUrl: m.videoUrl || null
      }))
    })),
    timestamp: Date.now()
  };
}

// Fetch X/Twitter data via bearer token API (Tier 2 — fallback)
async function fetchTwitterDataViaApi(name) {
  const bearerToken = await ensureTwitterBearerToken();
  if (!bearerToken) return null;

  // Step 1: Resolve username
  let username = await resolveTwitterUsername(name);

  // Step 2: Try common username patterns via API
  if (!username) {
    const nameParts = name.toLowerCase().split(/\s+/);
    const guesses = [nameParts.join(''), nameParts.join('_')];
    for (const guess of guesses) {
      try {
        const data = await makeTwitterApiRequest(
          `${TWITTER_API_CONFIG.baseUrl}/users/by?usernames=${encodeURIComponent(guess)}&user.fields=profile_image_url,description,public_metrics,verified,name,username`
        );
        if (data?.data && data.data.length > 0) {
          const user = data.data[0];
          const userNameLower = user.name.toLowerCase();
          const queryLower = name.toLowerCase();
          if (userNameLower.includes(queryLower) || queryLower.includes(userNameLower) ||
              nameParts.some(p => userNameLower.includes(p))) {
            username = user.username;
            break;
          }
        }
      } catch (e) {
        // Guess didn't work
      }
    }
  }

  if (!username) return null;

  // Step 3: Fetch user profile
  let userData = null;
  try {
    const userResp = await makeTwitterApiRequest(
      `${TWITTER_API_CONFIG.baseUrl}/users/by?usernames=${encodeURIComponent(username)}&user.fields=profile_image_url,description,public_metrics,verified,name,username,created_at`
    );
    if (userResp?.data && userResp.data.length > 0) {
      userData = userResp.data[0];
    }
  } catch (e) {
    debugLog('Error fetching Twitter user:', e);
  }

  if (!userData) return null;

  // Step 4: Fetch last 30 tweets
  let tweets = [];
  try {
    const tweetsResp = await makeTwitterApiRequest(
      `${TWITTER_API_CONFIG.baseUrl}/users/${userData.id}/tweets?max_results=30&tweet.fields=created_at,public_metrics,text,attachments&expansions=attachments.media_keys&media.fields=url,preview_image_url,type,variants`
    );
    if (tweetsResp?.data) {
      const mediaMap = {};
      if (tweetsResp.includes?.media) {
        tweetsResp.includes.media.forEach(m => { mediaMap[m.media_key] = m; });
      }
      tweets = tweetsResp.data.map(t => {
        const mediaKeys = t.attachments?.media_keys || [];
        t._media = mediaKeys.map(k => mediaMap[k]).filter(Boolean);
        return t;
      });
    }
  } catch (e) {
    debugLog('Error fetching tweets:', e);
  }

  return {
    name,
    username: userData.username,
    displayName: userData.name,
    bio: userData.description || '',
    profilePicUrl: userData.profile_image_url ? userData.profile_image_url.replace('_normal', '_bigger') : null,
    verified: userData.verified || false,
    followers: userData.public_metrics?.followers_count || 0,
    following: userData.public_metrics?.following_count || 0,
    tweetCount: userData.public_metrics?.tweet_count || 0,
    createdAt: userData.created_at || null,
    profileUrl: `https://x.com/${userData.username}`,
    tweets: tweets.map(t => ({
      id: t.id,
      text: t.text,
      createdAt: t.created_at,
      likes: t.public_metrics?.like_count || 0,
      retweets: t.public_metrics?.retweet_count || 0,
      replies: t.public_metrics?.reply_count || 0,
      media: (t._media || []).map(m => ({
        type: m.type,
        url: m.url || null,
        previewUrl: m.preview_image_url || null,
        videoUrl: m.variants ? (m.variants.filter(v => v.content_type === 'video/mp4').sort((a, b) => (b.bit_rate || 0) - (a.bit_rate || 0))[0]?.url || null) : null
      }))
    })),
    timestamp: Date.now()
  };
}

// Fetch X/Twitter data for a person (tiered: tab injection → bearer token API)
async function fetchTwitterData(name) {
  if (!dataSourceSettings.twitter) {
    return { name, notFound: true, info: 'X data source is disabled in settings.', timestamp: Date.now() };
  }

  if (twitterCache[name]) {
    return twitterCache[name];
  }

  try {
    // Tier 1: Tab injection (no token needed, primary)
    const tabResult = await fetchTwitterDataViaTab(name);
    if (tabResult) {
      addToCache(twitterCache, name, tabResult);
      return tabResult;
    }
  } catch (e) {
    debugLog('Tier 1 (tab injection) failed for X data:', e);
  }

  try {
    // Tier 2: Bearer token API (fallback)
    const apiResult = await fetchTwitterDataViaApi(name);
    if (apiResult) {
      addToCache(twitterCache, name, apiResult);
      return apiResult;
    }
  } catch (e) {
    debugLog('Tier 2 (bearer token API) failed for X data:', e);
  }

  // Neither tier produced a result.
  // If bearer token is available, Tier 2 ran but found no account.
  // If not, neither method was available (no x.com tab and no token).
  if (!TWITTER_API_CONFIG.bearerToken) {
    const result = { name, noToken: true, timestamp: Date.now() };
    addToCache(twitterCache, name, result);
    return result;
  }

  const result = { name, notFound: true, info: 'No X account found.', timestamp: Date.now() };
  addToCache(twitterCache, name, result);
  return result;
}

// Format large numbers for X display
function formatXCount(count) {
  if (count >= 1000000) return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (count >= 10000) return Math.round(count / 1000) + 'K';
  if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return count.toString();
}

// Render X/Twitter content in tooltip
function updateTwitterContent(container, data, currentWord) {
  container.innerHTML = '';

  // No token configured
  if (data.noToken) {
    container.innerHTML = `
      <div style="text-align:center;padding:20px 10px;color:var(--wh-text-secondary);">
        <div style="font-size:24px;margin-bottom:8px;">𝕏</div>
        <p style="margin:0 0 8px;font-size:13px;">Open x.com in any tab, or configure a Bearer Token in settings to see profile data and tweets.</p>
        <a href="https://x.com/search?q=${encodeURIComponent(currentWord)}&src=typed_query&f=user" target="_blank"
           style="color:#1d9bf0;text-decoration:none;font-size:13px;">Search "${currentWord}" on X →</a>
      </div>`;
    return;
  }

  // Not found
  if (data.notFound) {
    container.innerHTML = `
      <div style="text-align:center;padding:20px 10px;color:var(--wh-text-secondary);">
        <p style="margin:0 0 8px;font-size:13px;">${data.info || 'No X account found.'}</p>
        <a href="https://x.com/search?q=${encodeURIComponent(currentWord)}&src=typed_query&f=user" target="_blank"
           style="color:#1d9bf0;text-decoration:none;font-size:13px;">Search "${currentWord}" on X →</a>
      </div>`;
    return;
  }

  // Profile card
  const profileSection = document.createElement('div');
  profileSection.className = 'wikihover-twitter-header';

  const profileRow = document.createElement('div');
  profileRow.className = 'wikihover-twitter-profile';

  if (data.profilePicUrl) {
    const avatar = document.createElement('img');
    avatar.className = 'wikihover-twitter-avatar';
    avatar.src = data.profilePicUrl;
    avatar.alt = data.displayName;
    proxyImage(data.profilePicUrl).then(dataUrl => { if (dataUrl) avatar.src = dataUrl; });
    profileRow.appendChild(avatar);
  }

  const infoDiv = document.createElement('div');
  infoDiv.className = 'wikihover-twitter-info';

  const nameEl = document.createElement('h4');
  nameEl.textContent = data.displayName;
  if (data.verified) {
    const badge = document.createElement('span');
    badge.className = 'wikihover-verified-badge';
    badge.textContent = ' ✓';
    nameEl.appendChild(badge);
  }
  infoDiv.appendChild(nameEl);

  const usernameEl = document.createElement('div');
  usernameEl.className = 'wikihover-twitter-username';
  usernameEl.textContent = `@${data.username}`;
  infoDiv.appendChild(usernameEl);

  profileRow.appendChild(infoDiv);
  profileSection.appendChild(profileRow);

  // Stats
  const stats = document.createElement('div');
  stats.className = 'wikihover-twitter-stats';
  stats.innerHTML = `<span><strong>${formatXCount(data.followers)}</strong> Followers</span>` +
    `<span><strong>${formatXCount(data.following)}</strong> Following</span>` +
    `<span><strong>${formatXCount(data.tweetCount)}</strong> Posts</span>`;
  profileSection.appendChild(stats);

  // Bio
  if (data.bio) {
    const bio = document.createElement('div');
    bio.className = 'wikihover-twitter-bio';
    bio.textContent = data.bio;
    profileSection.appendChild(bio);
  }

  container.appendChild(profileSection);

  // Recent tweets
  if (data.tweets && data.tweets.length > 0) {
    const tweetsSection = document.createElement('div');
    tweetsSection.className = 'wikihover-tweets';
    tweetsSection.style.marginTop = '10px';

    const tweetsLabel = document.createElement('div');
    tweetsLabel.style.cssText = 'font-size:12px;font-weight:600;color:var(--wh-text-secondary);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;';
    tweetsLabel.textContent = 'Recent Posts';
    tweetsSection.appendChild(tweetsLabel);

    data.tweets.forEach(tweet => {
      const tweetLink = document.createElement('a');
      tweetLink.href = tweet.id ? `https://x.com/${data.username}/status/${tweet.id}` : data.profileUrl;
      tweetLink.target = '_blank';
      tweetLink.style.cssText = 'text-decoration:none;color:inherit;display:block;';

      const tweetEl = document.createElement('div');
      tweetEl.className = 'wikihover-tweet';
      tweetEl.style.cursor = 'pointer';

      const text = document.createElement('p');
      text.className = 'wikihover-tweet-text';
      text.textContent = tweet.text;
      tweetEl.appendChild(text);

      // Render media (images/videos)
      if (tweet.media && tweet.media.length > 0) {
        const mediaGrid = document.createElement('div');
        mediaGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:4px;margin:8px 0;border-radius:8px;overflow:hidden;';

        tweet.media.forEach(m => {
          if (m.type === 'photo' && m.url) {
            const img = document.createElement('img');
            img.style.cssText = 'width:100%;height:auto;max-height:200px;object-fit:cover;border-radius:4px;';
            img.loading = 'lazy';
            // Proxy image through background to bypass CORS/Referer restrictions
            img.src = m.url;
            proxyImage(m.url).then(dataUrl => { if (dataUrl) img.src = dataUrl; });
            mediaGrid.appendChild(img);
          } else if ((m.type === 'video' || m.type === 'animated_gif') && (m.videoUrl || m.previewUrl)) {
            const mediaContainer = document.createElement('div');
            mediaContainer.style.cssText = 'position:relative;border-radius:4px;overflow:hidden;';

            // Show preview image immediately, proxy through background
            const previewImg = document.createElement('img');
            previewImg.src = m.previewUrl || '';
            previewImg.style.cssText = 'width:100%;max-height:200px;object-fit:cover;display:block;';
            previewImg.loading = 'lazy';
            if (m.previewUrl) proxyImage(m.previewUrl).then(dataUrl => { if (dataUrl) previewImg.src = dataUrl; });
            mediaContainer.appendChild(previewImg);

            // Play icon overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:white;font-size:24px;pointer-events:none;text-shadow:0 0 6px rgba(0,0,0,0.5);';
            overlay.textContent = '▶';
            mediaContainer.appendChild(overlay);

            if (m.videoUrl) {
              let videoEl = null;
              let proxiedUrl = null;

              mediaContainer.addEventListener('mouseenter', () => {
                if (!videoEl) {
                  videoEl = document.createElement('video');
                  videoEl.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:1;';
                  videoEl.muted = !videoSoundEnabled;
                  videoEl.loop = m.type === 'animated_gif';
                  videoEl.playsInline = true;
                  videoEl.preload = 'auto';
                  mediaContainer.appendChild(videoEl);

                  if (proxiedUrl) {
                    videoEl.src = proxiedUrl;
                    videoEl.play().then(() => { overlay.style.display = 'none'; }).catch(() => {});
                  } else {
                    // Proxy video through background to bypass CORS/Referer restrictions
                    proxyImage(m.videoUrl).then(dataUrl => {
                      if (dataUrl) {
                        proxiedUrl = dataUrl;
                        videoEl.src = dataUrl;
                        videoEl.play().then(() => { overlay.style.display = 'none'; }).catch(() => {});
                      }
                    });
                  }
                } else {
                  videoEl.style.display = 'block';
                  videoEl.play().then(() => { overlay.style.display = 'none'; }).catch(() => {});
                }
              });

              mediaContainer.addEventListener('mouseleave', () => {
                if (videoEl) {
                  videoEl.pause();
                  videoEl.style.display = 'none';
                }
                overlay.style.display = '';
              });
            }

            mediaGrid.appendChild(mediaContainer);
          }
        });

        if (mediaGrid.children.length > 0) {
          tweetEl.appendChild(mediaGrid);
        }
      }

      const metrics = document.createElement('div');
      metrics.className = 'wikihover-tweet-metrics';
      const date = tweet.createdAt ? new Date(tweet.createdAt).toLocaleDateString() : '';
      metrics.innerHTML = `<span>♥ ${formatXCount(tweet.likes)}</span>` +
        `<span>⟲ ${formatXCount(tweet.retweets)}</span>` +
        `<span>💬 ${formatXCount(tweet.replies)}</span>` +
        (date ? `<span>${date}</span>` : '');
      tweetEl.appendChild(metrics);

      tweetLink.appendChild(tweetEl);
      tweetsSection.appendChild(tweetLink);
    });

    container.appendChild(tweetsSection);
  }

  // View on X link
  const viewLink = document.createElement('div');
  viewLink.style.cssText = 'text-align:center;margin-top:12px;padding-top:10px;border-top:1px solid var(--wh-border-light);';
  const link = document.createElement('a');
  link.href = data.profileUrl;
  link.target = '_blank';
  link.textContent = 'View on X';
  link.style.cssText = 'color:#1d9bf0;text-decoration:none;font-weight:500;font-size:13px;';
  viewLink.appendChild(link);
  container.appendChild(viewLink);
}

// Fetch TVMaze data for a person
async function fetchTVMazeData(name) {
  if (!dataSourceSettings.tvmaze) {
    return {
      name: name,
      info: 'TVMaze information is disabled in settings.',
      shows: [],
      personUrl: '',
      timestamp: Date.now()
    };
  }

  if (tvMazeCache[name]) {
    return tvMazeCache[name];
  }

  try {
    const key = `tvmaze_${name}`;
    const storageResult = await safeStorageGet([key]);
    const storageData = storageResult[key];

    if (storageData) {
      addToCache(tvMazeCache, name, storageData);
      return storageData;
    }
  } catch (error) {
    console.error('WikiHover: Error reading from storage:', error);
  }

  try {
    const url = `https://api.tvmaze.com/search/people?q=${encodeURIComponent(name)}`;
    let response;
    let lastStatus;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await fetch(url);
        lastStatus = response.status;
        if (response.ok || (lastStatus !== 429 && lastStatus !== 503 && lastStatus !== 500)) break;
      } catch (fetchError) {
        if (attempt === 2) throw fetchError;
      }
      if (attempt < 2) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }

    if (!response || !response.ok) {
      throw new Error(`TVMaze API returned status ${lastStatus || 'unknown'}`);
    }

    const peopleData = await response.json();

    if (!peopleData || peopleData.length === 0) {
      const notFoundResult = {
        name: name,
        info: `No information found for ${name} on TVMaze.`,
        shows: [],
        personUrl: `https://www.tvmaze.com/search?q=${encodeURIComponent(name)}`,
        timestamp: Date.now()
      };

      addToCache(tvMazeCache, name, notFoundResult);

      try {
        safeStorageSet({ [`tvmaze_${name}`]: notFoundResult });
      } catch (error) {
        debugLog('Error saving to storage:', error);
      }

      return notFoundResult;
    }

    const personData = peopleData[0].person;

    const castCreditsUrl = `https://api.tvmaze.com/people/${personData.id}/castcredits?embed=show`;
    let creditsResponse;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        creditsResponse = await fetch(castCreditsUrl);
        if (creditsResponse.ok || (creditsResponse.status !== 429 && creditsResponse.status !== 503)) break;
      } catch (fetchError) {
        if (attempt === 2) throw fetchError;
      }
      if (attempt < 2) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }

    if (!creditsResponse || !creditsResponse.ok) {
      throw new Error(`TVMaze API returned status ${creditsResponse?.status || 'unknown'}`);
    }

    const creditsData = await creditsResponse.json();

    // Limit to top 10 credits to avoid excessive API calls
    const limitedCredits = creditsData.slice(0, 10);

    const shows = await Promise.all(limitedCredits.map(async credit => {
      try {
        let character = '';
        if (credit._embedded && credit._embedded.show) {
          if (credit._links && credit._links.character && credit._links.character.name) {
            character = credit._links.character.name;
          } else if (credit.character && credit.character.name) {
            character = credit.character.name;
          } else if (typeof credit.character === 'string') {
            character = credit.character;
          } else if (credit._links && credit._links.character && credit._links.character.href) {
            // Extract character name from URL instead of making an extra API call
            const characterUrlMatch = credit._links.character.href.match(/\/characters\/(\d+)\/([^"]+)$/);
            if (characterUrlMatch && characterUrlMatch[2]) {
              character = decodeURIComponent(characterUrlMatch[2]).replace(/-/g, ' ');
              character = character.replace(/\b\w/g, l => l.toUpperCase());
            }
          } else if (credit.voice) {
            character = 'Voice Actor';
          }

          const show = credit._embedded.show;

          return {
            name: show.name,
            character: character,
            url: show.url,
            image: show.image?.medium || show.image?.original || null,
            premiered: show.premiered || null,
            ended: show.ended || null,
            status: show.status || null,
            type: show.type || null,
            network: show.network?.name || show.webChannel?.name || null,
            genres: show.genres?.join(', ') || ''
          };
        }
        return null;
      } catch (error) {
        return null;
      }
    }));

    const validShows = shows.filter(show => show !== null);
    validShows.sort((a, b) => {
      if (!a.premiered && !b.premiered) return 0;
      if (!a.premiered) return 1;
      if (!b.premiered) return -1;
      return new Date(b.premiered) - new Date(a.premiered);
    });

    const result = {
      name: personData.name,
      info: personData.url || '',
      image: personData.image?.medium || personData.image?.original || null,
      personUrl: personData.url || `https://www.tvmaze.com/people/${personData.id}/${personData.name.replace(/\s+/g, '-').toLowerCase()}`,
      shows: validShows,
      timestamp: Date.now()
    };

    addToCache(tvMazeCache, name, result);

    safeStorageSet({ [`tvmaze_${name}`]: result });

    return result;
  } catch (error) {
    debugLog('Error fetching TVMaze data:', error.message);

    return {
      name: name,
      info: '',
      shows: [],
      personUrl: `https://www.tvmaze.com/search?q=${encodeURIComponent(name)}`,
      timestamp: Date.now()
    };
  }
}

// OMDb API key for fetching movie details (plot, rating)
const OMDB_API_KEY = '69248bb2';

// Function to fetch additional movie details from OMDb API
async function fetchOMDbDetails(imdbId) {
  try {
    const url = `https://www.omdbapi.com/?i=${encodeURIComponent(imdbId)}&apikey=${OMDB_API_KEY}&plot=short`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.Response === 'False') return null;
    return data;
  } catch (error) {
    debugLog('Error fetching OMDb details:', error);
    return null;
  }
}

// In-memory cache for trailer URLs
const trailerUrlCache = {};
const trailerRetryCount = {};
const MAX_TRAILER_RETRIES = 2;

// Fetch trailer embed URL for a movie via background.js
async function fetchTrailerForMovie(imdbId) {
  if (trailerUrlCache[imdbId]) return trailerUrlCache[imdbId];
  const retries = trailerRetryCount[imdbId] || 0;
  trailerRetryCount[imdbId] = retries + 1;
  try {
    // 35s timeout: trailer fetch makes two sequential HTTP requests (title page + embed page)
    const result = await safeSendMessage({ action: 'fetchIMDbTrailer', imdbId }, 35000);
    if (result) {
      // Cache actual responses (success or definitive failure from background)
      trailerUrlCache[imdbId] = result;
      delete trailerRetryCount[imdbId];
      return result;
    }
  } catch (e) {
    debugLog('Error fetching trailer:', e);
  }
  // Transient failure (timeout/exception) — cache after MAX_TRAILER_RETRIES attempts
  if (trailerRetryCount[imdbId] >= MAX_TRAILER_RETRIES) {
    const fail = { success: false };
    trailerUrlCache[imdbId] = fail;
    return fail;
  }
  return { success: false };
}

// Function to fetch IMDb data for a person or title
async function fetchIMDbData(name) {
  if (!dataSourceSettings.imdb) {
    return {
      name: name,
      info: 'IMDb information is disabled in settings.',
      movies: [],
      timestamp: Date.now()
    };
  }

  if (imdbCache[name]) {
    return imdbCache[name];
  }

  try {
    const key = `imdb_${name}`;
    const storageResult = await safeStorageGet([key]);
    const storageData = storageResult[key];

    if (storageData) {
      addToCache(imdbCache, name, storageData);
      return storageData;
    }
  } catch (error) {
    console.error('WikiHover: Error reading from storage:', error);
  }

  try {
    // Get Wikidata entity ID - check cache first, then fetch from Wikipedia REST API
    let wikidataId = wikiCache[name]?.wikibase_item || '';
    if (!wikidataId) {
      try {
        const wikiLang = isHebrewText(name) ? 'he' : 'en';
        const restUrl = `https://${wikiLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;
        const wikiResp = await fetch(restUrl);
        if (wikiResp.ok) {
          const wikiJson = await wikiResp.json();
          wikidataId = wikiJson.wikibase_item || '';
        }
      } catch (e) {
        debugLog('Failed to fetch wikibase_item for IMDb:', e);
      }
    }

    // Fetch proxy API search and Wikidata filmography in parallel
    const nameLower = name.toLowerCase();
    const proxyPromise = fetch(`https://imdb.iamidiotareyoutoo.com/search?q=${encodeURIComponent(name)}`)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null);

    const sparqlPromise = wikidataId ? fetchWikidataFilmography(wikidataId) : Promise.resolve([]);

    const [proxyData, sparqlMovies] = await Promise.all([proxyPromise, sparqlPromise]);

    // Parse proxy results (name-filtered)
    let proxyMovies = [];
    if (proxyData?.ok && proxyData.description) {
      proxyMovies = proxyData.description
        .filter(movie => {
          const actors = (movie['#ACTORS'] || '').toLowerCase();
          const title = (movie['#TITLE'] || '').toLowerCase();
          return actors.includes(nameLower) || title.includes(nameLower);
        })
        .map(movie => ({
          title: movie['#TITLE'] || '',
          year: movie['#YEAR'] || '',
          id: movie['#IMDB_ID'] || '',
          actors: movie['#ACTORS'] || '',
          aka: movie['#AKA'] || '',
          url: movie['#IMDB_URL'] || '',
          poster: movie['#IMG_POSTER'] || '',
          rank: movie['#RANK'] || 0
        }));
    }

    // Merge: proxy results first, then SPARQL results (deduplicated by IMDb ID)
    const seenIds = new Set(proxyMovies.map(m => m.id).filter(Boolean));
    const mergedMovies = [...proxyMovies];
    for (const sm of sparqlMovies) {
      if (sm.id && !seenIds.has(sm.id)) {
        seenIds.add(sm.id);
        mergedMovies.push(sm);
      }
    }

    // Sort by year, latest to oldest
    mergedMovies.sort((a, b) => (b.year || 0) - (a.year || 0));

    if (mergedMovies.length === 0) {
      const notFoundResult = {
        name: name,
        info: `No information found for ${name} on IMDb.`,
        movies: [],
        timestamp: Date.now()
      };
      addToCache(imdbCache, name, notFoundResult);
      safeStorageSet({ [`imdb_${name}`]: notFoundResult });
      return notFoundResult;
    }

    // Enrich all movies with OMDb details (plot, rating, genre, poster)
    const moviesToEnrich = mergedMovies.filter(m => m.id);
    const enrichResults = await Promise.allSettled(
      moviesToEnrich.map(movie => fetchOMDbDetails(movie.id))
    );
    enrichResults.forEach((result, i) => {
      if (result.status === 'fulfilled' && result.value) {
        moviesToEnrich[i].plot = result.value.Plot || '';
        moviesToEnrich[i].rating = result.value.imdbRating || '';
        moviesToEnrich[i].genre = result.value.Genre || '';
        if (!moviesToEnrich[i].poster && result.value.Poster && result.value.Poster !== 'N/A') {
          moviesToEnrich[i].poster = result.value.Poster;
        }
        if (!moviesToEnrich[i].year && result.value.Year) {
          moviesToEnrich[i].year = parseInt(result.value.Year);
        }
      }
    });

    const result = {
      name: name,
      movies: mergedMovies,
      timestamp: Date.now()
    };

    addToCache(imdbCache, name, result);
    safeStorageSet({ [`imdb_${name}`]: result });

    return result;
  } catch (error) {
    debugLog('Error fetching IMDb data:', error);

    return {
      name: name,
      info: `Error fetching IMDb data: ${error.message}`,
      movies: [],
      timestamp: Date.now()
    };
  }
}

// Fetch filmography from Wikidata SPARQL (returns movies with IMDb IDs)
async function fetchWikidataFilmography(wikidataId) {
  try {
    const query = `SELECT DISTINCT ?filmLabel ?imdbId (MIN(?date) AS ?releaseDate) WHERE {
  ?film wdt:P161 wd:${wikidataId} .
  ?film wdt:P31/wdt:P279* wd:Q11424 .
  OPTIONAL { ?film wdt:P345 ?imdbId . }
  OPTIONAL { ?film wdt:P577 ?date . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} GROUP BY ?filmLabel ?imdbId ORDER BY DESC(?releaseDate) LIMIT 50`;

    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}`;
    const resp = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    if (!resp.ok) return [];
    const data = await resp.json();

    return (data.results?.bindings || []).map(r => {
      const year = (r.releaseDate?.value || '').substring(0, 4);
      const imdbId = r.imdbId?.value || '';
      return {
        title: r.filmLabel?.value || '',
        year: year ? parseInt(year) : '',
        id: imdbId,
        actors: '',
        aka: '',
        url: imdbId ? `https://imdb.com/title/${imdbId}` : '',
        poster: '',
        rank: 0
      };
    });
  } catch (error) {
    debugLog('Error fetching Wikidata filmography:', error);
    return [];
  }
}

// Function to fetch book data from Open Library API
async function fetchBooksData(name) {
  if (booksCache[name]) {
    return booksCache[name];
  }

  try {
    const key = `books_${name}`;
    const storageResult = await safeStorageGet([key]);
    const storageData = storageResult[key];

    if (storageData) {
      addToCache(booksCache, name, storageData);
      return storageData;
    }
  } catch (error) {
    debugLog('Error reading from storage:', error);
  }

  try {
    const url = `https://openlibrary.org/search.json?author=${encodeURIComponent(name)}&limit=10&fields=title,author_name,first_publish_year,cover_i,key,edition_count,first_sentence,subject,number_of_pages_median`;
    let response;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await fetch(url);
        if (response.ok || (response.status !== 429 && response.status !== 503 && response.status !== 500)) break;
      } catch (fetchError) {
        if (attempt === 2) throw fetchError;
      }
      if (attempt < 2) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }

    if (!response || !response.ok) {
      debugLog(`Open Library API returned ${response?.status} for "${name}"`);
      return { name, books: [], temporaryError: true, timestamp: Date.now() };
    }

    const data = await response.json();

    if (!data.docs || data.docs.length === 0) {
      const notFoundResult = { name, books: [], timestamp: Date.now() };
      addToCache(booksCache, name, notFoundResult);
      safeStorageSet({ [`books_${name}`]: notFoundResult });
      return notFoundResult;
    }

    const books = data.docs
      .map(doc => {
        // Get first English sentence as description, or fall back to first available
        let description = '';
        if (doc.first_sentence && doc.first_sentence.length > 0) {
          const englishSentence = doc.first_sentence.find(s => /^[A-Za-z]/.test(s));
          description = englishSentence || doc.first_sentence[0];
        }

        // Get top 3 subjects as genres
        const genres = (doc.subject || [])
          .filter(s => s.length < 30 && !/^[A-Z]{2,}/.test(s) && !s.includes('fiction'))
          .slice(0, 3)
          .join(', ');

        return {
          title: doc.title,
          year: doc.first_publish_year || '',
          cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : '',
          editions: doc.edition_count || 0,
          pages: doc.number_of_pages_median || '',
          description: description,
          genres: genres,
          url: `https://openlibrary.org${doc.key}`
        };
      });

    const authorEntry = {
      name: name,
      key: name.replace(/\s+/g, '_').toLowerCase(),
      work_count: books.length,
      top_work: books.length > 0 ? books[0].title : '',
      books: books,
      url: `https://openlibrary.org/search?author=${encodeURIComponent(name)}`
    };

    const result = {
      name: name,
      books: books.length > 0 ? [authorEntry] : [],
      timestamp: Date.now()
    };

    addToCache(booksCache, name, result);
    safeStorageSet({ [`books_${name}`]: result });
    return result;
  } catch (error) {
    debugLog('Error fetching book data:', error.message);
    return { name, books: [], timestamp: Date.now() };
  }
}

// Function to dynamically load the Compromise library
function loadCompromiseLibrary() {
  return new Promise((resolve, reject) => {
    // Already loaded (e.g. from a previous call or manual injection)
    if (typeof window.nlp !== 'undefined') {
      resolve(window.nlp);
      return;
    }

    // Dynamically inject the compromise library
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('compromise.min.js');
    script.onload = () => {
      if (typeof window.nlp !== 'undefined') {
        resolve(window.nlp);
      } else {
        // Script loaded but nlp not on window yet — poll briefly
        let attempts = 0;
        const check = () => {
          attempts++;
          if (typeof window.nlp !== 'undefined') {
            resolve(window.nlp);
          } else if (attempts >= 10) {
            handleCompromiseFailure();
            reject(new Error('Compromise loaded but window.nlp not available'));
          } else {
            setTimeout(check, 50);
          }
        };
        check();
      }
    };
    script.onerror = () => {
      handleCompromiseFailure();
      reject(new Error('Failed to load compromise.min.js'));
    };
    (document.head || document.documentElement).appendChild(script);
  });
}

// Check POS tags on a candidate name phrase within a parsed Compromise document.
// Returns true if the phrase has non-person POS tags AND lacks person-specific tags.
// Two-layer: (1) phrase-level context tags, (2) per-word standalone tags (catches tag masking).
function hasNonPersonPOSTags(doc, candidateName) {
  try {
    // Layer 1: Check phrase-level tags in document context
    const matchDoc = doc.match(candidateName);
    if (matchDoc.found) {
      // If Compromise tagged any word as a person/first/last name, trust that signal
      if (matchDoc.has('#Person') || matchDoc.has('#FirstName') || matchDoc.has('#LastName') ||
          matchDoc.has('#Honorific') || matchDoc.has('#NickName')) {
        return false;
      }

      for (const tag of NON_PERSON_POS_TAGS) {
        if (matchDoc.has(tag)) return true;
      }
    }

    // Layer 2: Check each word's standalone tags (catches tag masking by phrase promotion).
    // When Compromise sees "Super Bowl" as a phrase it tags it as ProperNoun,
    // but "Super" alone → #Adjective. Check individual words to catch this.
    const words = candidateName.split(/\s+/);
    for (const word of words) {
      if (word.length < 2) continue;
      const wordDoc = window.nlp(word);

      // If this word is a known name, the phrase is likely a person
      if (wordDoc.has('#Person') || wordDoc.has('#FirstName') || wordDoc.has('#LastName') ||
          wordDoc.has('#Honorific') || wordDoc.has('#NickName')) {
        return false;
      }

      for (const tag of NON_PERSON_POS_TAGS) {
        if (wordDoc.has(tag)) {
          debugLog('rejected word "' + word + '" has tag ' + tag + ' in "' + candidateName + '"');
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}

// Process full text through Compromise NLP once and return a Set of approved person names.
// Using full sentence context gives Compromise much better accuracy than isolated 2-word strings.
// Also checks negative entities (places, organizations) and POS tags to reject non-person matches.
function getNlpApprovedNames(fullText) {
  const approved = new Set();
  if (!window.compromiseAvailable || !fullText) return approved;

  try {
    const doc = window.nlp(fullText);

    const people = doc.people().out('array');

    // Negative entity checks — collect places and organizations to reject
    const places = doc.places().out('array');
    const orgs = doc.organizations().out('array');

    const rejected = new Set();
    for (const p of places) rejected.add(p.toLowerCase().trim());
    for (const o of orgs) rejected.add(o.toLowerCase().trim());

    for (const person of people) {
      const clean = person.replace(/'s$/i, '').trim();
      if (!clean || rejected.has(clean.toLowerCase())) continue;

      // POS tag validation: reject "people" with non-person grammar tags
      if (hasNonPersonPOSTags(doc, clean)) {
        debugLog('rejected (POS tags):', clean);
        continue;
      }

      approved.add(clean);
    }

    if (approved.size > 0) debugLog('batch NLP approved:', Array.from(approved));
    return approved;
  } catch (error) {
    console.error(LOG_PREFIX, 'Error in getNlpApprovedNames:', error);
    return approved;
  }
}

// Check if a specific regex-matched name is approved by the batch NLP result set.
// Handles partial/fuzzy matches (e.g., NLP returns "Dr. John Smith" but regex found "John Smith").
function isNameNlpApproved(name, approvedNames) {
  const cleanName = name.replace(/'s$/i, '').trim();
  const lowerName = cleanName.toLowerCase();

  // Direct match
  for (const approved of approvedNames) {
    if (approved === cleanName) return true;
  }

  // Fuzzy: check if any approved name contains this name or vice versa
  for (const approved of approvedNames) {
    const lowerApproved = approved.toLowerCase();
    if (lowerApproved.includes(lowerName) || lowerName.includes(lowerApproved)) {
      return true;
    }
  }

  return false;
}

// Extract the actual person name from a multi-word capitalized sequence (3+ words).
// For "President Donald Trump" → finds "Donald Trump" by using NLP to identify the person
// and stripping honorific/title words. Returns { name, startOffset, endOffset } or null.
function extractPersonFromSequence(sequence, nlpApproved) {
  if (!window.compromiseAvailable) return null;

  try {
    const words = sequence.split(/\s+/);
    if (words.length < 3) return null;

    // Strategy 1: Run NLP on the full sequence to identify person names.
    // Use in-context tags from the full phrase document for accurate honorific stripping.
    const doc = window.nlp(sequence);
    const people = doc.people().out('array');

    if (people.length > 0) {
      let personName = people[0].replace(/'s$/i, '').trim();

      // Get in-context tags for the person substring within the full sequence
      const personMatch = doc.match(personName);
      if (personMatch.found) {
        const personTerms = personMatch.terms().out('tags');
        const personWords = personName.split(/\s+/);

        // Strip words tagged as #Honorific in context (President, General, Queen, etc.)
        const cleanedWords = [];
        for (let i = 0; i < personWords.length; i++) {
          const wordTags = personTerms[i] ? Object.values(personTerms[i])[0] || [] : [];
          if (wordTags.includes('Honorific')) {
            debugLog('stripping honorific "' + personWords[i] + '" from "' + personName + '"');
            continue;
          }
          cleanedWords.push(personWords[i]);
        }

        if (cleanedWords.length >= 2) {
          personName = cleanedWords.join(' ');
        }
      }

      // Find the position of the person name within the original sequence
      const nameIdx = sequence.indexOf(personName);
      if (nameIdx !== -1) {
        return {
          name: personName,
          startOffset: nameIdx,
          endOffset: nameIdx + personName.length
        };
      }
    }

    // Strategy 2: Fall back to trying all consecutive 2-word pairs
    // Check each pair against the batch NLP approved set from the full text node
    if (nlpApproved && nlpApproved.size > 0) {
      for (let i = words.length - 2; i >= 0; i--) {
        const pair = words[i] + ' ' + words[i + 1];
        if (isNameNlpApproved(pair, nlpApproved)) {
          const pairIdx = sequence.indexOf(pair);
          if (pairIdx !== -1) {
            return {
              name: pair,
              startOffset: pairIdx,
              endOffset: pairIdx + pair.length
            };
          }
        }
      }
    }

    // Strategy 3: No batch approved set — try each pair through standalone NLP
    for (let i = words.length - 2; i >= 0; i--) {
      const pair = words[i] + ' ' + words[i + 1];
      const pairDoc = window.nlp(pair);
      if (pairDoc.people().out('array').length > 0 && !hasNonPersonPOSTags(pairDoc, pair)) {
        const pairIdx = sequence.indexOf(pair);
        if (pairIdx !== -1) {
          return {
            name: pair,
            startOffset: pairIdx,
            endOffset: pairIdx + pair.length
          };
        }
      }
    }

    return null;
  } catch (error) {
    debugLog('Error in extractPersonFromSequence:', error);
    return null;
  }
}

// Function to enhance name detection using Compromise NLP.
// Accepts optional contextText for better accuracy — when provided, Compromise analyses the full sentence.
// Strict: only approves when Compromise explicitly recognizes a person (avoids "Metal Gear", "God Of War", etc.).
function enhanceNameDetection(name, contextText) {
  try {
    // Strip trailing possessive before NLP processing
    const cleanName = name.replace(/'s$/i, '').trim();

    // Use surrounding context if available for much better NLP accuracy
    const textToAnalyze = contextText && contextText.length > cleanName.length
      ? contextText : cleanName;
    const doc = window.nlp(textToAnalyze);

    const people = doc.people().out('array');

    // Negative entity checks — reject if Compromise tags this as a place or organization
    const places = doc.places().out('array');
    const orgs = doc.organizations().out('array');
    const rejectedLower = new Set();
    for (const p of places) rejectedLower.add(p.toLowerCase().trim());
    for (const o of orgs) rejectedLower.add(o.toLowerCase().trim());

    if (rejectedLower.has(cleanName.toLowerCase())) {
      debugLog('rejected (place/org):', cleanName);
      return null;
    }

    // POS tag validation: reject if candidate has non-person grammar tags
    if (hasNonPersonPOSTags(doc, cleanName)) {
      debugLog('rejected (POS tags):', cleanName);
      return null;
    }

    if (people.length > 0) {
      // Find the person match that relates to our candidate name
      for (const person of people) {
        const cleanPerson = person.replace(/'s$/i, '').trim();
        const lowerPerson = cleanPerson.toLowerCase();
        const lowerName = cleanName.toLowerCase();
        if (lowerPerson.includes(lowerName) || lowerName.includes(lowerPerson)) {
          // If NLP returned a single word but input had multiple words,
          // prefer the full cleaned name (regex already validated First Last pattern)
          const result = !cleanPerson.includes(' ') && cleanName.includes(' ') ? cleanName : cleanPerson;
          debugLog('approved (NLP):', result);
          return result;
        }
      }
    }

    // No permissive fallback: only approve when Compromise says person. Rejects game titles, headlines, etc.
    debugLog('rejected:', cleanName);
    return null;
  } catch (error) {
    console.error('WikiHover: Error in enhanceNameDetection:', error);
    return null;
  }
}

// Function to handle Compromise failure
function handleCompromiseFailure() {
  window.compromiseAvailable = false;

  if (typeof window.nlp === 'undefined') {
    window.nlp = function() {
      return {
        people: function() {
          return { out: function() { return []; } };
        },
        match: function() {
          return { out: function() { return []; } };
        }
      };
    };
  }
}

// Helper function to update IMDb content
function updateIMDbContent(imdbContent, data, currentWord) {
  if (data.movies && data.movies.length > 0) {
    imdbContent.innerHTML = '';

    const headerContainer = document.createElement('div');
    headerContainer.style.display = 'flex';
    headerContainer.style.alignItems = 'center';
    headerContainer.style.justifyContent = 'space-between';
    headerContainer.style.marginBottom = '10px';
    headerContainer.style.padding = '0 0 10px 0';
    headerContainer.style.borderBottom = '1px solid #eee';

    const personName = document.createElement('h3');
    personName.style.margin = '0';
    personName.style.fontSize = '16px';
    personName.style.color = 'var(--wh-text)';
    personName.style.fontWeight = '600';
    personName.textContent = `${currentWord} on IMDb`;
    headerContainer.appendChild(personName);
    imdbContent.appendChild(headerContainer);

    // Collect all unique genres from the movies
    const allGenres = new Set();
    data.movies.forEach(m => {
      if (m.genre) m.genre.split(',').forEach(g => { const t = g.trim(); if (t && t !== 'N/A') allGenres.add(t); });
    });
    const genreList = Array.from(allGenres).sort();

    // Controls bar: sort dropdown + genre filter
    const controlsBar = document.createElement('div');
    controlsBar.style.display = 'flex';
    controlsBar.style.gap = '8px';
    controlsBar.style.marginBottom = '10px';
    controlsBar.style.alignItems = 'center';

    const controlItemStyle = (el) => {
      el.style.cssText = 'font-size:11px;padding:3px 6px;border-radius:4px;border:1px solid var(--wh-border);background-color:var(--wh-bg);color:var(--wh-text);cursor:pointer;outline:none;height:24px;box-sizing:border-box;line-height:16px;margin:0;vertical-align:middle;font-family:inherit;flex:1;min-width:0;';
    };

    // Sort dropdown
    const sortSelect = document.createElement('select');
    controlItemStyle(sortSelect);
    [['year-desc', 'Year (Newest)'], ['year-asc', 'Year (Oldest)'], ['rating-desc', 'Rating (Highest)'], ['rating-asc', 'Rating (Lowest)']].forEach(([val, label]) => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = label;
      sortSelect.appendChild(opt);
    });

    // Genre filter dropdown
    const genreSelect = document.createElement('select');
    controlItemStyle(genreSelect);
    const allOpt = document.createElement('option');
    allOpt.value = '';
    allOpt.textContent = 'All Genres';
    genreSelect.appendChild(allOpt);
    genreList.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g;
      genreSelect.appendChild(opt);
    });

    // Search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search movies...';
    controlItemStyle(searchInput);
    searchInput.style.cursor = 'text';

    controlsBar.appendChild(sortSelect);
    if (genreList.length > 1) controlsBar.appendChild(genreSelect);
    controlsBar.appendChild(searchInput);
    imdbContent.appendChild(controlsBar);

    // Movies list container (flex-fills remaining height)
    const moviesContainer = document.createElement('div');
    moviesContainer.style.cssText = 'flex:1 1 0;min-height:0;overflow-y:auto;padding-right:5px;display:flex;flex-wrap:wrap;gap:10px;align-content:flex-start;';
    imdbContent.appendChild(moviesContainer);

    // --- Shared expanded trailer player (fills tooltip content area, IG-style) ---
    const imdbExpandedPlayer = document.createElement('div');
    imdbExpandedPlayer.className = 'wikihover-imdb-expanded-player';
    imdbExpandedPlayer.style.cssText = 'display:none;position:relative;background:#000;border-radius:6px;overflow:hidden;cursor:pointer;';

    const imdbExpandedVideo = document.createElement('video');
    const imdbCC = imdbContent.closest('.wikihover-content-container');
    const imdbVideoH = getExpandedPlayerHeight(imdbCC);
    imdbExpandedVideo.style.cssText = `width:100%;height:${imdbVideoH}px;object-fit:contain;background:#000;display:block;cursor:pointer;`;
    imdbExpandedVideo.muted = !videoSoundEnabled;
    imdbExpandedVideo.playsInline = true;
    imdbExpandedVideo.preload = 'auto';
    imdbExpandedPlayer.appendChild(imdbExpandedVideo);

    // Close button (top-right)
    const imdbCloseBtn = document.createElement('div');
    imdbCloseBtn.style.cssText = 'position:absolute;top:8px;right:8px;width:28px;height:28px;background:rgba(0,0,0,0.6);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;z-index:15;line-height:1;transition:background 0.2s;';
    imdbCloseBtn.textContent = '\u00D7';
    imdbCloseBtn.title = 'Close trailer';
    imdbCloseBtn.addEventListener('mouseenter', () => { imdbCloseBtn.style.background = 'rgba(0,0,0,0.85)'; });
    imdbCloseBtn.addEventListener('mouseleave', () => { imdbCloseBtn.style.background = 'rgba(0,0,0,0.6)'; });
    imdbExpandedPlayer.appendChild(imdbCloseBtn);

    // Countdown circle (SVG) — appears 5s before video ends when there's a next movie
    const IMDB_COUNTDOWN_SECONDS = 5;
    const imdbCountdownContainer = document.createElement('div');
    imdbCountdownContainer.style.cssText = 'position:absolute;top:10px;right:10px;width:36px;height:36px;z-index:12;display:none;';
    const imdbCountdownSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    imdbCountdownSvg.setAttribute('width', '36');
    imdbCountdownSvg.setAttribute('height', '36');
    imdbCountdownSvg.setAttribute('viewBox', '0 0 36 36');
    const imdbBgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    imdbBgCircle.setAttribute('cx', '18'); imdbBgCircle.setAttribute('cy', '18'); imdbBgCircle.setAttribute('r', '15');
    imdbBgCircle.setAttribute('fill', 'rgba(0,0,0,0.6)'); imdbBgCircle.setAttribute('stroke', 'rgba(255,255,255,0.3)'); imdbBgCircle.setAttribute('stroke-width', '2');
    imdbCountdownSvg.appendChild(imdbBgCircle);
    const imdbProgressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    imdbProgressCircle.setAttribute('cx', '18'); imdbProgressCircle.setAttribute('cy', '18'); imdbProgressCircle.setAttribute('r', '15');
    imdbProgressCircle.setAttribute('fill', 'none'); imdbProgressCircle.setAttribute('stroke', '#f5c518'); imdbProgressCircle.setAttribute('stroke-width', '2.5');
    imdbProgressCircle.setAttribute('stroke-linecap', 'round');
    const imdbCircumference = 2 * Math.PI * 15;
    imdbProgressCircle.setAttribute('stroke-dasharray', String(imdbCircumference));
    imdbProgressCircle.setAttribute('stroke-dashoffset', '0');
    imdbProgressCircle.style.transform = 'rotate(-90deg)'; imdbProgressCircle.style.transformOrigin = '50% 50%';
    imdbProgressCircle.style.transition = 'stroke-dashoffset 0.25s linear';
    imdbCountdownSvg.appendChild(imdbProgressCircle);
    const imdbCountdownText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    imdbCountdownText.setAttribute('x', '18'); imdbCountdownText.setAttribute('y', '22'); imdbCountdownText.setAttribute('text-anchor', 'middle');
    imdbCountdownText.setAttribute('fill', 'white'); imdbCountdownText.setAttribute('font-size', '13'); imdbCountdownText.setAttribute('font-weight', '600');
    imdbCountdownText.textContent = '5';
    imdbCountdownSvg.appendChild(imdbCountdownText);
    imdbCountdownContainer.appendChild(imdbCountdownSvg);
    imdbExpandedPlayer.appendChild(imdbCountdownContainer);

    // Movie title overlay (top-left)
    const imdbExpandedTitle = document.createElement('div');
    imdbExpandedTitle.style.cssText = 'position:absolute;top:0;left:0;right:0;background:linear-gradient(rgba(0,0,0,0.6),transparent);color:white;font-size:13px;font-weight:600;padding:8px 44px 16px 12px;z-index:12;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
    imdbExpandedPlayer.appendChild(imdbExpandedTitle);

    // Controls bar (progress + play/pause + time + next)
    const imdbControlsBar = document.createElement('div');
    imdbControlsBar.style.cssText = 'position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.85));padding:6px 10px 8px;z-index:10;display:flex;flex-direction:column;gap:4px;';
    imdbControlsBar.addEventListener('click', (e) => e.stopPropagation());

    // Progress bar (seekable)
    const imdbProgressContainer = document.createElement('div');
    imdbProgressContainer.style.cssText = 'width:100%;height:4px;background:rgba(255,255,255,0.3);border-radius:2px;cursor:pointer;position:relative;';
    const imdbProgressFill = document.createElement('div');
    imdbProgressFill.style.cssText = 'height:100%;background:#f5c518;border-radius:2px;width:0%;transition:width 0.1s linear;pointer-events:none;';
    imdbProgressContainer.appendChild(imdbProgressFill);

    let imdbSeeking = false;
    function imdbSeekTo(e) {
      const rect = imdbProgressContainer.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      if (imdbExpandedVideo.duration) {
        imdbExpandedVideo.currentTime = pct * imdbExpandedVideo.duration;
        imdbProgressFill.style.width = (pct * 100) + '%';
      }
    }
    imdbProgressContainer.addEventListener('mousedown', (e) => { imdbSeeking = true; imdbSeekTo(e); });
    document.addEventListener('mousemove', (e) => { if (imdbSeeking) imdbSeekTo(e); });
    document.addEventListener('mouseup', () => { imdbSeeking = false; });
    imdbControlsBar.appendChild(imdbProgressContainer);

    // Bottom row: play/pause + time + next
    const imdbControlsRow = document.createElement('div');
    imdbControlsRow.style.cssText = 'display:flex;align-items:center;gap:8px;';

    const imdbPlayPauseBtn = document.createElement('button');
    imdbPlayPauseBtn.style.cssText = 'background:none;border:none;color:white;font-size:16px;cursor:pointer;padding:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;';
    imdbPlayPauseBtn.textContent = '\u275A\u275A';
    imdbPlayPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (imdbExpandedVideo.paused) imdbExpandedVideo.play().catch(() => {});
      else imdbExpandedVideo.pause();
    });
    imdbControlsRow.appendChild(imdbPlayPauseBtn);

    const imdbTimeDisplay = document.createElement('span');
    imdbTimeDisplay.style.cssText = 'color:rgba(255,255,255,0.9);font-size:11px;font-family:monospace;min-width:70px;flex:1;';
    imdbTimeDisplay.textContent = '0:00 / 0:00';
    imdbControlsRow.appendChild(imdbTimeDisplay);

    // Next button (>>)
    const imdbNextBtn = document.createElement('button');
    imdbNextBtn.style.cssText = 'background:rgba(255,255,255,0.15);border:none;color:white;font-size:22px;cursor:pointer;padding:4px 12px;font-weight:700;letter-spacing:-1px;display:none;border-radius:4px;line-height:1;';
    imdbNextBtn.innerHTML = '&#9654;&#9654;';
    imdbNextBtn.title = 'Next trailer';
    imdbNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (imdbPlaylist.length === 0 || imdbPlaylistIndex < 0) return;
      const nextIdx = imdbPlaylistIndex + 1;
      if (nextIdx < imdbPlaylist.length) {
        playImdbAtIndex(nextIdx);
      }
    });
    imdbControlsRow.appendChild(imdbNextBtn);

    imdbControlsBar.appendChild(imdbControlsRow);
    imdbExpandedPlayer.appendChild(imdbControlsBar);

    // Format time helper
    function fmtTime(s) { if (!s || !isFinite(s)) return '0:00'; const m = Math.floor(s / 60); return m + ':' + String(Math.floor(s % 60)).padStart(2, '0'); }

    // Time/progress update + countdown circle
    imdbExpandedVideo.addEventListener('timeupdate', () => {
      if (imdbSeeking) return;
      const dur = imdbExpandedVideo.duration;
      const cur = imdbExpandedVideo.currentTime;
      const pct = dur ? (cur / dur) * 100 : 0;
      imdbProgressFill.style.width = pct + '%';
      imdbTimeDisplay.textContent = fmtTime(cur) + ' / ' + fmtTime(dur);

      // Countdown circle: show within last 5s when there's a next movie
      const remaining = dur - cur;
      const hasNext = imdbPlaylist.length > 0 && imdbPlaylistIndex + 1 < imdbPlaylist.length;
      if (dur && remaining <= IMDB_COUNTDOWN_SECONDS && remaining > 0 && hasNext) {
        imdbCountdownContainer.style.display = 'block';
        imdbCloseBtn.style.display = 'none';
        const secsLeft = Math.ceil(remaining);
        imdbCountdownText.textContent = String(secsLeft);
        const offset = imdbCircumference * (1 - remaining / IMDB_COUNTDOWN_SECONDS);
        imdbProgressCircle.setAttribute('stroke-dashoffset', String(offset));
      } else {
        imdbCountdownContainer.style.display = 'none';
        imdbCloseBtn.style.display = 'flex';
        imdbProgressCircle.setAttribute('stroke-dashoffset', '0');
      }
    });

    imdbExpandedVideo.addEventListener('play', () => { imdbPlayPauseBtn.textContent = '\u275A\u275A'; });
    imdbExpandedVideo.addEventListener('pause', () => { imdbPlayPauseBtn.textContent = '\u25B6'; });

    // Click on video toggles play/pause
    imdbExpandedVideo.addEventListener('click', (e) => {
      e.stopPropagation();
      if (imdbExpandedVideo.paused) imdbExpandedVideo.play().catch(() => {});
      else imdbExpandedVideo.pause();
    });

    // Playlist state — includes ALL movies with IMDb IDs, trailers fetched on demand
    let imdbPlaylist = [];       // array of movie objects from data.movies (with .id)
    let imdbPlaylistIndex = -1;
    let imdbSavedScrollTop = 0;
    let imdbSavedCCHeight = '';
    let imdbSavedCCMaxHeight = '';
    let imdbCurrentExpanded = false;

    async function playImdbAtIndex(index, startTime) {
      if (index < 0 || index >= imdbPlaylist.length) { collapseImdbTrailer(); return; }

      const movie = imdbPlaylist[index];
      imdbPlaylistIndex = index;

      // Show title + loading state
      imdbExpandedTitle.textContent = movie.title || '';
      imdbProgressFill.style.width = '0%';
      imdbTimeDisplay.textContent = '0:00 / 0:00';
      imdbCountdownContainer.style.display = 'none';
      imdbProgressCircle.setAttribute('stroke-dashoffset', '0');
      const hasNext = index + 1 < imdbPlaylist.length;
      imdbNextBtn.style.display = hasNext ? 'block' : 'none';

      // Fetch trailer on demand if not cached
      let trailer = trailerUrlCache[movie.id];
      if (!trailer) {
        trailer = await fetchTrailerForMovie(movie.id);
      }

      // If no trailer found, skip to next movie
      if (!trailer || !trailer.success) {
        if (hasNext) {
          playImdbAtIndex(index + 1);
        } else {
          collapseImdbTrailer();
        }
        return;
      }

      imdbExpandedVideo.src = trailer.videoUrl;
      imdbExpandedVideo.muted = true; // must start muted for programmatic autoplay
      // Continue from thumbnail position if provided
      if (startTime && startTime > 0) {
        imdbExpandedVideo.addEventListener('loadeddata', function onLoaded() {
          imdbExpandedVideo.removeEventListener('loadeddata', onLoaded);
          imdbExpandedVideo.currentTime = startTime;
          imdbExpandedVideo.play().then(() => {
            imdbExpandedVideo.muted = !videoSoundEnabled;
          }).catch(() => {});
        });
      } else {
        imdbExpandedVideo.play().then(() => {
          imdbExpandedVideo.muted = !videoSoundEnabled;
        }).catch(() => {});
      }
    }

    function expandImdbTrailer(videoUrl, title, movie, startTime) {
      const contentContainer = imdbContent.closest('.wikihover-content-container');

      // Build playlist from ALL movies that have an IMDb ID
      imdbPlaylist = data.movies.filter(m => m.id);
      imdbPlaylistIndex = movie ? imdbPlaylist.findIndex(m => m.id === movie.id) : 0;
      if (imdbPlaylistIndex < 0) imdbPlaylistIndex = 0;

      if (!imdbCurrentExpanded) {
        if (contentContainer) {
          imdbSavedScrollTop = contentContainer.scrollTop;
          imdbSavedCCHeight = contentContainer.style.getPropertyValue('height');
          imdbSavedCCMaxHeight = contentContainer.style.getPropertyValue('max-height');
        }

        // Hide all regular content children
        Array.from(imdbContent.children).forEach(child => {
          if (child !== imdbExpandedPlayer) {
            child.dataset.savedDisplay = child.style.display;
            child.style.display = 'none';
          }
        });

        if (imdbExpandedPlayer.parentNode !== imdbContent) {
          imdbContent.appendChild(imdbExpandedPlayer);
        }
        imdbExpandedPlayer.style.display = 'block';

        // Lock content container height so it doesn't push the footer
        const tooltipEl = contentContainer && contentContainer.closest('.wikihover-tooltip, .wikihover-pinned-tooltip');
        if (tooltipEl && contentContainer) {
          const ccH = getContentContainerHeight(tooltipEl, tooltipEl.offsetHeight);
          contentContainer.style.setProperty('height', ccH + 'px', 'important');
          contentContainer.style.setProperty('max-height', ccH + 'px', 'important');
        }

        imdbExpandedVideo.style.height = getExpandedPlayerHeight(contentContainer) + 'px';
        if (contentContainer) contentContainer.scrollTop = 0;
        imdbCurrentExpanded = true;
      }

      playImdbAtIndex(imdbPlaylistIndex, startTime);
    }

    // Auto-advance to next movie trailer when current one ends
    imdbExpandedVideo.addEventListener('ended', () => {
      if (imdbPlaylist.length === 0) return;
      const nextIdx = imdbPlaylistIndex + 1;
      if (nextIdx < imdbPlaylist.length) {
        playImdbAtIndex(nextIdx);
      } else {
        collapseImdbTrailer();
      }
    });

    function collapseImdbTrailer() {
      imdbExpandedVideo.pause();
      imdbExpandedVideo.removeAttribute('src');
      imdbExpandedPlayer.style.display = 'none';
      imdbCurrentExpanded = false;
      imdbPlaylist = [];
      imdbPlaylistIndex = -1;
      imdbCountdownContainer.style.display = 'none';
      imdbNextBtn.style.display = 'none';

      // Restore all regular content children
      Array.from(imdbContent.children).forEach(child => {
        if (child !== imdbExpandedPlayer && child.dataset.savedDisplay !== undefined) {
          child.style.display = child.dataset.savedDisplay;
          delete child.dataset.savedDisplay;
        }
      });

      const contentContainer = imdbContent.closest('.wikihover-content-container');
      if (contentContainer) {
        // Restore saved height/max-height (set by applyTooltipSize) instead of removing
        if (imdbSavedCCHeight) {
          contentContainer.style.setProperty('height', imdbSavedCCHeight, 'important');
        } else {
          contentContainer.style.removeProperty('height');
        }
        if (imdbSavedCCMaxHeight) {
          contentContainer.style.setProperty('max-height', imdbSavedCCMaxHeight, 'important');
        } else {
          contentContainer.style.removeProperty('max-height');
        }
        contentContainer.scrollTop = imdbSavedScrollTop;
      }
    }

    imdbCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); collapseImdbTrailer(); });
    imdbContent.appendChild(imdbExpandedPlayer);

    // Render function that sorts and filters
    function renderMovies() {
      moviesContainer.innerHTML = '';
      const sortVal = sortSelect.value;
      const genreVal = genreSelect.value;
      const searchTerm = searchInput.value.trim().toLowerCase();

      let filtered = data.movies;
      if (genreVal) {
        filtered = filtered.filter(m => m.genre && m.genre.toLowerCase().includes(genreVal.toLowerCase()));
      }
      if (searchTerm) {
        filtered = filtered.filter(m =>
          (m.title && m.title.toLowerCase().includes(searchTerm)) ||
          (m.genre && m.genre.toLowerCase().includes(searchTerm)) ||
          (m.plot && m.plot.toLowerCase().includes(searchTerm)) ||
          (m.year && String(m.year).includes(searchTerm))
        );
      }

      const sorted = [...filtered].sort((a, b) => {
        if (sortVal === 'year-desc') return (b.year || 0) - (a.year || 0);
        if (sortVal === 'year-asc') return (a.year || 0) - (b.year || 0);
        if (sortVal === 'rating-desc') return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
        if (sortVal === 'rating-asc') return (parseFloat(a.rating) || 0) - (parseFloat(b.rating) || 0);
        return 0;
      });

      if (sorted.length === 0) {
        const noResults = document.createElement('div');
        noResults.style.padding = '15px';
        noResults.style.textAlign = 'center';
        noResults.style.color = 'var(--wh-text-muted)';
        noResults.style.fontSize = '13px';
        noResults.textContent = searchTerm ? 'No movies match your search.' : 'No movies match the selected genre.';
        moviesContainer.appendChild(noResults);
      } else {
        sorted.forEach(movie => createMovieItem(movie, moviesContainer, expandImdbTrailer));
      }
    }

    sortSelect.addEventListener('change', renderMovies);
    genreSelect.addEventListener('change', renderMovies);
    searchInput.addEventListener('input', renderMovies);

    // Initial render
    renderMovies();

    addIMDbSearchLink(imdbContent, currentWord);
  } else {
    showIMDbNotFound(imdbContent, currentWord);
  }
}

// Helper function to create a movie item
function createMovieItem(movie, container, onExpandTrailer) {
  // --- Grid card layout: poster box with info underneath ---
  // Card width stays fixed — expansion uses absolute overlay, no flex reflow.
  const CARD_WIDTH = 140;
  const POSTER_HEIGHT = 200;
  const EXPANDED_HEIGHT = 158; // 16:9 aspect for video preview
  const CARD_GAP = 10; // matches container gap

  const movieItem = document.createElement('div');
  movieItem.dataset.movieCard = '1';
  movieItem.style.cssText = `width:${CARD_WIDTH}px;flex-shrink:0;border-radius:6px;overflow:hidden;background:var(--wh-card-bg);box-shadow:0 1px 3px rgba(0,0,0,0.1);position:relative;transition:transform 0.3s ease,opacity 0.3s ease;`;

  // --- Poster area ---
  const posterContainer = document.createElement('div');
  posterContainer.style.cssText = `position:relative;width:100%;height:${POSTER_HEIGHT}px;overflow:hidden;cursor:pointer;`;

  // --- Poster image or placeholder ---
  const posterLink = document.createElement('a');
  posterLink.href = movie.url;
  posterLink.target = '_blank';
  posterLink.style.cssText = 'display:block;width:100%;height:100%;';

  const poster = document.createElement('img');
  if (movie.poster) {
    poster.src = movie.poster;
  }
  poster.style.cssText = `width:100%;height:100%;object-fit:cover;display:block;transition:opacity 0.2s;${movie.poster ? '' : 'visibility:hidden;'}`;

  // Placeholder text shown when no poster
  if (!movie.poster) {
    const placeholder = document.createElement('div');
    placeholder.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--wh-text-muted);background:var(--wh-border);';
    placeholder.textContent = 'No poster';
    posterContainer.appendChild(placeholder);
  }

  // Play icon overlay
  const playIcon = document.createElement('div');
  playIcon.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:32px;height:32px;background:rgba(0,0,0,0.7);border-radius:50%;display:none;align-items:center;justify-content:center;pointer-events:none;z-index:2;';
  playIcon.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="8,5 20,12 8,19"/></svg>';

  // Trailer video overlay — positioned absolute, expands to fill row on hover
  const videoOverlay = document.createElement('div');
  videoOverlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:#000;border-radius:6px;z-index:10;display:none;overflow:hidden;cursor:pointer;transition:width 0.3s ease,height 0.3s ease,left 0.3s ease;';

  // Loading progress bar (IMDb gold) — inside videoOverlay
  const progressBar = document.createElement('div');
  progressBar.style.cssText = 'position:absolute;bottom:0;left:0;height:3px;width:0%;background:#f5c518;z-index:13;border-radius:0 0 4px 4px;transition:width 0.3s ease;';
  let progressValue = 0;
  let progressTimer = null;

  function startProgress() {
    progressValue = 0;
    progressBar.style.width = '0%';
    progressBar.style.opacity = '1';
    progressTimer = setInterval(() => {
      if (progressValue < 90) {
        progressValue += (90 - progressValue) * 0.12;
        progressBar.style.width = progressValue + '%';
      }
    }, 200);
  }
  function finishProgress() {
    if (progressTimer) { clearInterval(progressTimer); progressTimer = null; }
    progressValue = 100;
    progressBar.style.width = '100%';
    setTimeout(() => { progressBar.style.opacity = '0'; }, 400);
  }
  function cancelProgress() {
    if (progressTimer) { clearInterval(progressTimer); progressTimer = null; }
    progressValue = 0;
    progressBar.style.width = '0%';
    progressBar.style.opacity = '0';
  }

  videoOverlay.appendChild(progressBar);

  // Trailer state
  let trailerVideo = null;
  let hoverTimer = null;
  let trailerFetched = false;
  let trailerData = null;
  let isExpanded = false;

  function preventClick(e) { e.preventDefault(); e.stopPropagation(); }

  // Find cards in the same row (same vertical position)
  function getRowSiblings() {
    const allCards = container.querySelectorAll('[data-movie-card]');
    const myTop = movieItem.offsetTop;
    return Array.from(allCards).filter(c => Math.abs(c.offsetTop - myTop) < 5);
  }

  function expandToRow() {
    if (isExpanded) return;
    isExpanded = true;
    const rowCards = getRowSiblings();
    const myIndex = rowCards.indexOf(movieItem);
    const containerW = container.clientWidth;

    // 1) Slide row siblings away and fade out
    const slideDistance = CARD_WIDTH + CARD_GAP;
    rowCards.forEach((c, idx) => {
      if (c === movieItem) return;
      if (idx < myIndex) {
        c.style.transform = `translateX(-${slideDistance}px)`;
      } else {
        c.style.transform = `translateX(${slideDistance}px)`;
      }
      c.style.opacity = '0';
      c.style.pointerEvents = 'none';
    });

    // 2) Expand video overlay to fill the full row via absolute positioning
    //    Card stays at 140px (no reflow). Overlay extends beyond card bounds.
    movieItem.style.overflow = 'visible';
    movieItem.style.zIndex = '10';
    posterContainer.style.overflow = 'visible';

    const cardRect = movieItem.getBoundingClientRect();
    const gridRect = container.getBoundingClientRect();
    const leftOffset = cardRect.left - gridRect.left;

    videoOverlay.style.left = -leftOffset + 'px';
    videoOverlay.style.width = containerW + 'px';
    // Use full card height (poster + info) so the video fills the entire row
    videoOverlay.style.height = movieItem.offsetHeight + 'px';

    poster.style.opacity = '0';
    posterLink.addEventListener('click', preventClick);
  }

  function collapseFromRow() {
    if (!isExpanded) return;
    isExpanded = false;

    // Reset row siblings
    const rowCards = getRowSiblings();
    rowCards.forEach(c => {
      if (c === movieItem) return;
      c.style.transform = '';
      c.style.opacity = '';
      c.style.pointerEvents = '';
    });

    // Reset card
    movieItem.style.overflow = 'hidden';
    movieItem.style.zIndex = '';
    posterContainer.style.overflow = 'hidden';

    // Reset overlay back to card-sized
    videoOverlay.style.left = '0';
    videoOverlay.style.width = '100%';
    videoOverlay.style.height = '100%';

    poster.style.opacity = '1';
    posterLink.removeEventListener('click', preventClick);
  }

  movieItem.addEventListener('mouseenter', () => {
    if (movie.poster) poster.style.opacity = '0.8';
    hoverTimer = setTimeout(async () => {
      if (!trailerFetched && movie.id) {
        trailerFetched = true;
        startProgress();
        videoOverlay.style.display = 'block';
        trailerData = await fetchTrailerForMovie(movie.id);
        if (trailerData && trailerData.success) {
          playIcon.style.display = 'flex';
        } else {
          cancelProgress();
          videoOverlay.style.display = 'none';
          if (!trailerUrlCache[movie.id]) {
            trailerFetched = false;
          }
        }
      }

      if (!trailerData || !trailerData.success) return;

      // Show overlay and expand to full row
      videoOverlay.style.display = 'block';
      expandToRow();

      if (!trailerVideo) {
        trailerVideo = document.createElement('video');
        trailerVideo.src = trailerData.videoUrl;
        trailerVideo.autoplay = true;
        trailerVideo.muted = true;
        trailerVideo.loop = true;
        trailerVideo.playsInline = true;
        trailerVideo.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:11;cursor:pointer;';
        videoOverlay.appendChild(trailerVideo);
        trailerVideo.addEventListener('playing', () => {
          finishProgress();
          trailerVideo.muted = !videoSoundEnabled;
        }, { once: true });
        trailerVideo.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onExpandTrailer) onExpandTrailer(trailerData.videoUrl, movie.title, movie, trailerVideo.currentTime);
        });
      } else {
        finishProgress();
        trailerVideo.muted = true;
        trailerVideo.style.display = 'block';
        trailerVideo.play().then(() => {
          trailerVideo.muted = !videoSoundEnabled;
        }).catch(() => {});
      }
      playIcon.style.display = 'none';
    }, 300);
  });

  movieItem.addEventListener('mouseleave', () => {
    poster.style.opacity = '1';
    if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
    cancelProgress();
    collapseFromRow();
    if (trailerVideo) {
      trailerVideo.pause();
      trailerVideo.style.display = 'none';
    }
    videoOverlay.style.display = 'none';
    if (trailerData && trailerData.success) {
      playIcon.style.display = 'flex';
    }
  });

  posterLink.appendChild(poster);
  posterContainer.appendChild(posterLink);
  posterContainer.appendChild(playIcon);
  posterContainer.appendChild(videoOverlay);
  movieItem.appendChild(posterContainer);

  // --- Info area below poster ---
  const infoContainer = document.createElement('div');
  infoContainer.style.cssText = 'padding:6px 8px 8px;';

  const titleLink = document.createElement('a');
  titleLink.href = movie.url;
  titleLink.target = '_blank';
  titleLink.style.textDecoration = 'none';

  const movieTitle = document.createElement('div');
  movieTitle.style.cssText = 'font-weight:bold;color:var(--wh-accent);font-size:12px;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
  movieTitle.textContent = movie.title;
  movieTitle.title = movie.title;

  titleLink.appendChild(movieTitle);
  infoContainer.appendChild(titleLink);

  if (movie.year || movie.genre) {
    const yearGenre = document.createElement('div');
    yearGenre.style.cssText = 'font-size:10px;color:var(--wh-text-secondary);margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
    const parts = [];
    if (movie.year) parts.push(movie.year);
    if (movie.genre) parts.push(movie.genre);
    yearGenre.textContent = parts.join(' \u00b7 ');
    infoContainer.appendChild(yearGenre);
  }

  if (movie.rating && movie.rating !== 'N/A') {
    const ratingContainer = document.createElement('div');
    ratingContainer.style.cssText = 'display:flex;align-items:center;gap:3px;';

    const ratingNum = parseFloat(movie.rating);
    const fullStars = Math.floor(ratingNum / 2);
    const halfStar = (ratingNum / 2) - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    const starsSpan = document.createElement('span');
    starsSpan.style.cssText = 'color:#f5c518;font-size:10px;letter-spacing:0.5px;';
    starsSpan.textContent = '\u2605'.repeat(fullStars) + (halfStar ? '\u2605' : '') + '\u2606'.repeat(emptyStars);

    const ratingText = document.createElement('span');
    ratingText.style.cssText = 'font-size:10px;color:var(--wh-text-secondary);font-weight:600;';
    ratingText.textContent = `${movie.rating}`;

    ratingContainer.appendChild(starsSpan);
    ratingContainer.appendChild(ratingText);
    infoContainer.appendChild(ratingContainer);
  }

  movieItem.appendChild(infoContainer);
  container.appendChild(movieItem);
}

// Helper function to add IMDb search link
function addIMDbSearchLink(imdbContent, currentWord) {
  const searchContainer = document.createElement('div');
  searchContainer.style.marginTop = '15px';
  searchContainer.style.textAlign = 'center';

  const searchLink = document.createElement('a');
  searchLink.href = `https://www.imdb.com/find?q=${encodeURIComponent(currentWord)}&s=nm`;
  searchLink.target = '_blank';
  searchLink.className = 'wikihover-action-btn';
  searchLink.style.display = 'inline-block';
  searchLink.style.padding = '5px 10px';
  searchLink.style.backgroundColor = 'var(--wh-accent)';
  searchLink.style.borderRadius = '4px';
  searchLink.style.textDecoration = 'none';
  searchLink.textContent = 'Search on IMDb';

  searchContainer.appendChild(searchLink);
  imdbContent.appendChild(searchContainer);
}

// Helper function to show IMDb not found message
function showIMDbNotFound(imdbContent, currentWord) {
  imdbContent.innerHTML = '';

  const notFoundContainer = document.createElement('div');
  notFoundContainer.style.padding = '20px';
  notFoundContainer.style.textAlign = 'center';

  const notFoundName = document.createElement('h3');
  notFoundName.style.marginTop = '0';
  notFoundName.style.marginBottom = '15px';
  notFoundName.style.color = 'var(--wh-text)';
  notFoundName.textContent = currentWord;
  notFoundContainer.appendChild(notFoundName);

  const notFoundMessage = document.createElement('p');
  notFoundMessage.style.color = 'var(--wh-text-secondary)';
  notFoundMessage.style.fontSize = '14px';
  notFoundMessage.textContent = 'No results found on IMDb.';
  notFoundContainer.appendChild(notFoundMessage);

  const searchLink = document.createElement('a');
  searchLink.href = `https://www.imdb.com/find?q=${encodeURIComponent(currentWord)}&s=nm`;
  searchLink.target = '_blank';
  searchLink.className = 'wikihover-action-btn';
  searchLink.style.display = 'inline-block';
  searchLink.style.marginTop = '15px';
  searchLink.style.padding = '5px 10px';
  searchLink.style.backgroundColor = 'var(--wh-accent)';
  searchLink.style.borderRadius = '4px';
  searchLink.style.textDecoration = 'none';
  searchLink.textContent = 'Search on IMDb';
  notFoundContainer.appendChild(searchLink);

  imdbContent.appendChild(notFoundContainer);
}

// TVMaze content rendering with sort/filter controls
function updateTVMazeContent(tvMazeContent, data, currentWord) {
  tvMazeContent.innerHTML = '';

  if (data.shows && data.shows.length > 0) {
    const headerContainer = document.createElement('div');
    headerContainer.style.display = 'flex';
    headerContainer.style.alignItems = 'center';
    headerContainer.style.marginBottom = '12px';
    headerContainer.style.padding = '0 0 8px 0';
    headerContainer.style.borderBottom = '1px solid #eee';

    if (data.image) {
      const personImageLink = document.createElement('a');
      personImageLink.href = data.personUrl || `https://www.tvmaze.com/search?q=${encodeURIComponent(currentWord)}`;
      personImageLink.target = '_blank';
      const personImage = document.createElement('img');
      personImage.src = data.image;
      personImage.style.width = '50px';
      personImage.style.height = '50px';
      personImage.style.objectFit = 'cover';
      personImage.style.borderRadius = '50%';
      personImage.style.marginRight = '12px';
      personImage.style.border = '2px solid var(--wh-border-light)';
      personImage.style.cursor = 'pointer';
      personImageLink.appendChild(personImage);
      headerContainer.appendChild(personImageLink);
    }

    const personName = document.createElement('h3');
    personName.style.margin = '0';
    personName.style.fontSize = '16px';
    personName.style.color = 'var(--wh-text)';
    personName.style.fontWeight = '600';
    personName.textContent = data.name;
    headerContainer.appendChild(personName);
    tvMazeContent.appendChild(headerContainer);

    // Collect all unique genres from shows
    const allGenres = new Set();
    data.shows.forEach(s => {
      if (s.genres) s.genres.split(',').forEach(g => { const t = g.trim(); if (t) allGenres.add(t); });
    });
    const genreList = Array.from(allGenres).sort();

    // Controls bar: sort dropdown + genre filter
    const controlsBar = document.createElement('div');
    controlsBar.style.display = 'flex';
    controlsBar.style.gap = '8px';
    controlsBar.style.marginBottom = '10px';
    controlsBar.style.alignItems = 'center';

    const controlItemStyle = (el) => {
      el.style.cssText = 'font-size:11px;padding:3px 6px;border-radius:4px;border:1px solid var(--wh-border);background-color:var(--wh-bg);color:var(--wh-text);cursor:pointer;outline:none;height:24px;box-sizing:border-box;line-height:16px;margin:0;vertical-align:middle;font-family:inherit;flex:1;min-width:0;';
    };

    // Sort dropdown
    const sortSelect = document.createElement('select');
    controlItemStyle(sortSelect);
    [['year-desc', 'Year (Newest)'], ['year-asc', 'Year (Oldest)'], ['name-asc', 'Name (A-Z)']].forEach(([val, label]) => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = label;
      sortSelect.appendChild(opt);
    });

    // Genre filter dropdown
    const genreSelect = document.createElement('select');
    controlItemStyle(genreSelect);
    const allOpt = document.createElement('option');
    allOpt.value = '';
    allOpt.textContent = 'All Genres';
    genreSelect.appendChild(allOpt);
    genreList.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g;
      genreSelect.appendChild(opt);
    });

    // Search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search shows...';
    controlItemStyle(searchInput);
    searchInput.style.cursor = 'text';

    controlsBar.appendChild(sortSelect);
    if (genreList.length > 1) controlsBar.appendChild(genreSelect);
    controlsBar.appendChild(searchInput);
    tvMazeContent.appendChild(controlsBar);

    // Shows list container
    const feedContainer = document.createElement('div');
    feedContainer.style.maxHeight = '250px';
    feedContainer.style.overflowY = 'auto';
    tvMazeContent.appendChild(feedContainer);

    function renderShows() {
      feedContainer.innerHTML = '';
      const sortVal = sortSelect.value;
      const genreVal = genreSelect.value;
      const searchTerm = searchInput.value.trim().toLowerCase();

      let filtered = data.shows;
      if (genreVal) {
        filtered = filtered.filter(s => s.genres && s.genres.toLowerCase().includes(genreVal.toLowerCase()));
      }
      if (searchTerm) {
        filtered = filtered.filter(s =>
          (s.name && s.name.toLowerCase().includes(searchTerm)) ||
          (s.character && s.character.toLowerCase().includes(searchTerm)) ||
          (s.genres && s.genres.toLowerCase().includes(searchTerm)) ||
          (s.network && s.network.toLowerCase().includes(searchTerm)) ||
          (s.premiered && s.premiered.includes(searchTerm))
        );
      }

      const sorted = [...filtered].sort((a, b) => {
        if (sortVal === 'year-desc') {
          const ya = a.premiered ? new Date(a.premiered).getTime() : 0;
          const yb = b.premiered ? new Date(b.premiered).getTime() : 0;
          return yb - ya;
        }
        if (sortVal === 'year-asc') {
          const ya = a.premiered ? new Date(a.premiered).getTime() : 0;
          const yb = b.premiered ? new Date(b.premiered).getTime() : 0;
          return ya - yb;
        }
        if (sortVal === 'name-asc') return (a.name || '').localeCompare(b.name || '');
        return 0;
      });

      if (sorted.length === 0) {
        const noResults = document.createElement('div');
        noResults.style.padding = '15px';
        noResults.style.textAlign = 'center';
        noResults.style.color = 'var(--wh-text-muted)';
        noResults.style.fontSize = '13px';
        noResults.textContent = searchTerm ? 'No shows match your search.' : 'No shows match the selected genre.';
        feedContainer.appendChild(noResults);
      } else {
        sorted.forEach(show => createShowItem(show, feedContainer));
      }
    }

    sortSelect.addEventListener('change', renderShows);
    genreSelect.addEventListener('change', renderShows);
    searchInput.addEventListener('input', renderShows);
    renderShows();

    const searchContainer = document.createElement('div');
    searchContainer.style.marginTop = '15px';
    searchContainer.style.textAlign = 'center';

    const searchLink = document.createElement('a');
    searchLink.href = data.personUrl || `https://www.tvmaze.com/search?q=${encodeURIComponent(currentWord)}`;
    searchLink.target = '_blank';
    searchLink.className = 'wikihover-action-btn';
    searchLink.style.display = 'inline-block';
    searchLink.style.padding = '5px 10px';
    searchLink.style.backgroundColor = '#2c3e50';
    searchLink.style.borderRadius = '4px';
    searchLink.style.textDecoration = 'none';
    searchLink.textContent = 'Search on TVMaze';

    searchContainer.appendChild(searchLink);
    tvMazeContent.appendChild(searchContainer);
  } else {
    const notFoundContainer = document.createElement('div');
    notFoundContainer.style.padding = '20px';
    notFoundContainer.style.textAlign = 'center';

    const notFoundName = document.createElement('h3');
    notFoundName.style.marginTop = '0';
    notFoundName.style.marginBottom = '15px';
    notFoundName.style.color = 'var(--wh-text)';
    notFoundName.textContent = currentWord;
    notFoundContainer.appendChild(notFoundName);

    const notFoundMessage = document.createElement('p');
    notFoundMessage.style.color = 'var(--wh-text-secondary)';
    notFoundMessage.style.fontSize = '14px';
    notFoundMessage.textContent = 'No known TV shows found for this person.';
    notFoundContainer.appendChild(notFoundMessage);

    const searchLink = document.createElement('a');
    searchLink.href = `https://www.tvmaze.com/search?q=${encodeURIComponent(currentWord)}`;
    searchLink.target = '_blank';
    searchLink.className = 'wikihover-action-btn';
    searchLink.style.display = 'inline-block';
    searchLink.style.marginTop = '15px';
    searchLink.style.padding = '5px 10px';
    searchLink.style.backgroundColor = '#2c3e50';
    searchLink.style.borderRadius = '4px';
    searchLink.style.textDecoration = 'none';
    searchLink.textContent = 'Search on TVMaze';
    notFoundContainer.appendChild(searchLink);

    tvMazeContent.appendChild(notFoundContainer);
  }
}

// Helper function to create a TV show item
function createShowItem(show, container) {
  const feedItem = document.createElement('div');
  feedItem.style.display = 'flex';
  feedItem.style.marginBottom = '15px';
  feedItem.style.padding = '10px';
  feedItem.style.backgroundColor = 'var(--wh-card-bg)';
  feedItem.style.borderRadius = '6px';
  feedItem.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';

  const imageContainer = document.createElement('div');
  imageContainer.style.flexShrink = '0';
  imageContainer.style.width = '70px';
  imageContainer.style.marginRight = '10px';

  if (show.image) {
    const imageLink = document.createElement('a');
    imageLink.href = show.url || '#';
    imageLink.target = '_blank';
    imageLink.style.display = 'block';
    const showImage = document.createElement('img');
    showImage.src = show.image;
    showImage.style.width = '100%';
    showImage.style.borderRadius = '4px';
    showImage.style.objectFit = 'cover';
    showImage.style.height = '100px';
    showImage.style.cursor = 'pointer';
    imageLink.appendChild(showImage);
    imageContainer.appendChild(imageLink);
  } else {
    const placeholder = document.createElement('div');
    placeholder.style.width = '100%';
    placeholder.style.height = '100px';
    placeholder.style.backgroundColor = 'var(--wh-border)';
    placeholder.style.borderRadius = '4px';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.textContent = 'No Image';
    placeholder.style.color = 'var(--wh-text-muted)';
    placeholder.style.fontSize = '12px';
    imageContainer.appendChild(placeholder);
  }

  feedItem.appendChild(imageContainer);

  const detailsContainer = document.createElement('div');
  detailsContainer.style.flex = '1';

  const titleLink = document.createElement('a');
  titleLink.href = show.url || '#';
  titleLink.target = '_blank';
  titleLink.style.textDecoration = 'none';

  const showTitle = document.createElement('div');
  showTitle.style.fontWeight = 'bold';
  showTitle.style.color = 'var(--wh-accent)';
  showTitle.style.fontSize = '14px';
  showTitle.style.marginBottom = '5px';
  showTitle.textContent = show.name;

  titleLink.appendChild(showTitle);
  detailsContainer.appendChild(titleLink);

  if (show.character) {
    const character = document.createElement('div');
    character.style.fontSize = '13px';
    character.style.color = 'var(--wh-text-secondary)';
    character.style.marginBottom = '5px';
    character.textContent = `Role: ${show.character}`;
    detailsContainer.appendChild(character);
  }

  const metaParts = [];
  if (show.premiered) metaParts.push(show.premiered.substring(0, 4));
  if (show.type) metaParts.push(show.type);
  if (show.network) metaParts.push(show.network);
  if (metaParts.length > 0) {
    const metaLine = document.createElement('div');
    metaLine.style.fontSize = '12px';
    metaLine.style.color = 'var(--wh-text-secondary)';
    metaLine.style.marginBottom = '3px';
    metaLine.textContent = metaParts.join(' \u00B7 ');
    detailsContainer.appendChild(metaLine);
  }

  if (show.genres) {
    const genresEl = document.createElement('div');
    genresEl.style.fontSize = '11px';
    genresEl.style.color = 'var(--wh-text-muted)';
    genresEl.textContent = show.genres;
    detailsContainer.appendChild(genresEl);
  }

  feedItem.appendChild(detailsContainer);
  container.appendChild(feedItem);
}

// Books content rendering with sort controls
function updateBooksContent(booksContent, data, currentWord) {
  booksContent.innerHTML = '';

  if (data.books && data.books.length > 0) {
    const headerContainer = document.createElement('div');
    headerContainer.style.display = 'flex';
    headerContainer.style.alignItems = 'center';
    headerContainer.style.marginBottom = '15px';
    headerContainer.style.padding = '0 0 10px 0';
    headerContainer.style.borderBottom = '1px solid #eee';

    const authorTitle = document.createElement('h3');
    authorTitle.style.margin = '0';
    authorTitle.style.fontSize = '16px';
    authorTitle.style.color = 'var(--wh-text)';
    authorTitle.style.fontWeight = '600';
    authorTitle.textContent = `${currentWord} - Author Info`;
    headerContainer.appendChild(authorTitle);
    booksContent.appendChild(headerContainer);

    // Controls bar: sort dropdown
    const controlsBar = document.createElement('div');
    controlsBar.style.display = 'flex';
    controlsBar.style.gap = '8px';
    controlsBar.style.marginBottom = '10px';
    controlsBar.style.alignItems = 'center';

    const controlItemStyle = (el) => {
      el.style.cssText = 'font-size:11px;padding:3px 6px;border-radius:4px;border:1px solid var(--wh-border);background-color:var(--wh-bg);color:var(--wh-text);cursor:pointer;outline:none;height:24px;box-sizing:border-box;line-height:16px;margin:0;vertical-align:middle;font-family:inherit;flex:1;min-width:0;';
    };

    // Sort dropdown
    const sortSelect = document.createElement('select');
    controlItemStyle(sortSelect);
    [['year-desc', 'Year (Newest)'], ['year-asc', 'Year (Oldest)'], ['title-asc', 'Title (A-Z)'], ['editions-desc', 'Editions (Most)']].forEach(([val, label]) => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = label;
      sortSelect.appendChild(opt);
    });

    // Search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search books...';
    controlItemStyle(searchInput);
    searchInput.style.cursor = 'text';

    controlsBar.appendChild(sortSelect);
    controlsBar.appendChild(searchInput);
    booksContent.appendChild(controlsBar);

    const authorsContainer = document.createElement('div');
    authorsContainer.style.maxHeight = '250px';
    authorsContainer.style.overflowY = 'auto';
    authorsContainer.style.paddingRight = '5px';
    booksContent.appendChild(authorsContainer);

    function renderBooks() {
      authorsContainer.innerHTML = '';
      const sortVal = sortSelect.value;
      const searchTerm = searchInput.value.trim().toLowerCase();

      data.books.forEach(author => {
        let booksToShow = author.books || [];
        if (searchTerm) {
          booksToShow = booksToShow.filter(b =>
            (b.title && b.title.toLowerCase().includes(searchTerm)) ||
            (b.genres && b.genres.toLowerCase().includes(searchTerm)) ||
            (b.description && b.description.toLowerCase().includes(searchTerm)) ||
            (b.year && String(b.year).includes(searchTerm))
          );
          if (booksToShow.length === 0) return;
        }

        const authorItem = document.createElement('div');
        authorItem.style.marginBottom = '15px';
        authorItem.style.padding = '10px';
        authorItem.style.backgroundColor = 'var(--wh-card-bg)';
        authorItem.style.borderRadius = '6px';
        authorItem.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';

        const nameLink = document.createElement('a');
        nameLink.href = author.url;
        nameLink.target = '_blank';
        nameLink.style.textDecoration = 'none';

        const authorName = document.createElement('div');
        authorName.style.fontWeight = 'bold';
        authorName.style.color = 'var(--wh-accent)';
        authorName.style.fontSize = '16px';
        authorName.style.marginBottom = '8px';
        authorName.textContent = author.name;

        nameLink.appendChild(authorName);
        authorItem.appendChild(nameLink);

        if (author.work_count) {
          const worksCount = document.createElement('div');
          worksCount.style.fontSize = '13px';
          worksCount.style.color = 'var(--wh-text-secondary)';
          worksCount.style.marginBottom = '5px';
          worksCount.textContent = `Works: ${author.work_count}`;
          authorItem.appendChild(worksCount);
        }

        if (author.top_work) {
          const topWork = document.createElement('div');
          topWork.style.fontSize = '13px';
          topWork.style.color = 'var(--wh-text-secondary)';
          topWork.style.marginBottom = '8px';
          topWork.textContent = `Notable work: ${author.top_work}`;
          authorItem.appendChild(topWork);
        }

        if (booksToShow.length > 0) {
          const sortedBooks = [...booksToShow].sort((a, b) => {
            if (sortVal === 'year-desc') return (b.year || 0) - (a.year || 0);
            if (sortVal === 'year-asc') return (a.year || 0) - (b.year || 0);
            if (sortVal === 'title-asc') return (a.title || '').localeCompare(b.title || '');
            if (sortVal === 'editions-desc') return (b.editions || 0) - (a.editions || 0);
            return 0;
          });

          const booksList = document.createElement('div');
          booksList.style.marginTop = '8px';

          sortedBooks.forEach(book => createBookItem(book, booksList));

          authorItem.appendChild(booksList);
        }

        authorsContainer.appendChild(authorItem);
      });

      if (authorsContainer.children.length === 0 && searchTerm) {
        const noResults = document.createElement('div');
        noResults.style.padding = '15px';
        noResults.style.textAlign = 'center';
        noResults.style.color = 'var(--wh-text-muted)';
        noResults.style.fontSize = '13px';
        noResults.textContent = 'No books match your search.';
        authorsContainer.appendChild(noResults);
      }
    }

    sortSelect.addEventListener('change', renderBooks);
    searchInput.addEventListener('input', renderBooks);
    renderBooks();

    const searchContainer = document.createElement('div');
    searchContainer.style.marginTop = '15px';
    searchContainer.style.textAlign = 'center';

    const searchLink = document.createElement('a');
    searchLink.href = `https://openlibrary.org/search?author=${encodeURIComponent(currentWord)}`;
    searchLink.target = '_blank';
    searchLink.className = 'wikihover-action-btn';
    searchLink.style.display = 'inline-block';
    searchLink.style.padding = '5px 10px';
    searchLink.style.backgroundColor = 'var(--wh-accent)';
    searchLink.style.borderRadius = '4px';
    searchLink.style.textDecoration = 'none';
    searchLink.textContent = 'Search on Open Library';

    searchContainer.appendChild(searchLink);
    booksContent.appendChild(searchContainer);
  } else {
    const notFoundContainer = document.createElement('div');
    notFoundContainer.style.padding = '20px';
    notFoundContainer.style.textAlign = 'center';

    const notFoundName = document.createElement('h3');
    notFoundName.style.marginTop = '0';
    notFoundName.style.marginBottom = '15px';
    notFoundName.style.color = 'var(--wh-text)';
    notFoundName.textContent = currentWord;
    notFoundContainer.appendChild(notFoundName);

    const notFoundMessage = document.createElement('p');
    notFoundMessage.style.color = 'var(--wh-text-secondary)';
    notFoundMessage.style.fontSize = '14px';
    notFoundMessage.textContent = 'No author information found.';
    notFoundContainer.appendChild(notFoundMessage);

    const searchLink = document.createElement('a');
    searchLink.href = `https://openlibrary.org/search?author=${encodeURIComponent(currentWord)}`;
    searchLink.target = '_blank';
    searchLink.className = 'wikihover-action-btn';
    searchLink.style.display = 'inline-block';
    searchLink.style.marginTop = '15px';
    searchLink.style.padding = '5px 10px';
    searchLink.style.backgroundColor = 'var(--wh-accent)';
    searchLink.style.borderRadius = '4px';
    searchLink.style.textDecoration = 'none';
    searchLink.textContent = 'Search on Open Library';
    notFoundContainer.appendChild(searchLink);

    booksContent.appendChild(notFoundContainer);
  }
}

// Helper function to create a book item
function createBookItem(book, container) {
  const bookItem = document.createElement('div');
  bookItem.style.display = 'flex';
  bookItem.style.marginBottom = '12px';
  bookItem.style.padding = '8px';
  bookItem.style.backgroundColor = 'var(--wh-bg)';
  bookItem.style.borderRadius = '4px';
  bookItem.style.border = '1px solid var(--wh-border)';

  if (book.cover) {
    const coverContainer = document.createElement('div');
    coverContainer.style.marginRight = '10px';
    coverContainer.style.flexShrink = '0';

    const coverImg = document.createElement('img');
    coverImg.src = book.cover;
    coverImg.style.width = '50px';
    coverImg.style.height = '75px';
    coverImg.style.objectFit = 'cover';
    coverImg.style.borderRadius = '3px';
    coverImg.style.boxShadow = '0 1px 3px rgba(0,0,0,0.15)';
    coverContainer.appendChild(coverImg);
    bookItem.appendChild(coverContainer);
  }

  const bookDetails = document.createElement('div');
  bookDetails.style.flex = '1';
  bookDetails.style.minWidth = '0';

  const titleLink = document.createElement('a');
  titleLink.href = book.url || `https://openlibrary.org/search?q=${encodeURIComponent(book.title)}`;
  titleLink.target = '_blank';
  titleLink.style.textDecoration = 'none';

  const titleEl = document.createElement('div');
  titleEl.style.fontWeight = 'bold';
  titleEl.style.color = 'var(--wh-accent)';
  titleEl.style.fontSize = '13px';
  titleEl.style.marginBottom = '3px';
  titleEl.textContent = book.title;
  titleLink.appendChild(titleEl);
  bookDetails.appendChild(titleLink);

  const metaLine = document.createElement('div');
  metaLine.style.fontSize = '11px';
  metaLine.style.color = 'var(--wh-text-secondary)';
  metaLine.style.marginBottom = '3px';
  const metaParts = [];
  if (book.year) metaParts.push(book.year);
  if (book.pages) metaParts.push(`${book.pages} pages`);
  if (book.editions) metaParts.push(`${book.editions} editions`);
  metaLine.textContent = metaParts.join(' \u00B7 ');
  bookDetails.appendChild(metaLine);

  if (book.genres) {
    const genresEl = document.createElement('div');
    genresEl.style.fontSize = '11px';
    genresEl.style.color = 'var(--wh-text-muted)';
    genresEl.style.marginBottom = '3px';
    genresEl.textContent = book.genres;
    bookDetails.appendChild(genresEl);
  }

  if (book.description) {
    const descEl = document.createElement('div');
    descEl.style.fontSize = '11px';
    descEl.style.color = 'var(--wh-text-secondary)';
    descEl.style.lineHeight = '1.4';
    descEl.style.marginTop = '2px';
    const maxLen = 120;
    descEl.textContent = book.description.length > maxLen
      ? book.description.substring(0, maxLen) + '...'
      : book.description;
    bookDetails.appendChild(descEl);
  }

  bookItem.appendChild(bookDetails);
  container.appendChild(bookItem);
}

// Score how well an API name matches the searched name
function footballNameScore(apiName, apiFirstName, apiLastName, searchName, searchLastName) {
  const full = (apiName || '').toLowerCase();
  const first = (apiFirstName || '').toLowerCase();
  const last = (apiLastName || '').toLowerCase();
  const combined = `${first} ${last}`;
  const search = searchName.toLowerCase();
  const searchLast = searchLastName.toLowerCase();
  const searchParts = search.split(/\s+/);
  const searchFirst = searchParts[0] || '';

  if (full === search || combined === search) return 100;
  if (full.includes(search) || search.includes(full)) return 80;
  if (combined.includes(search) || search.includes(combined)) return 70;
  // Partial: both first and last initial+name present
  if (searchParts.length >= 2 && last === searchParts[searchParts.length - 1] &&
      first.startsWith(searchParts[0][0])) return 65;
  // Last name matches — only count if search has no first name, or first name overlaps
  if (last === searchLast) {
    if (searchParts.length < 2) return 50; // single-word search, allow last-name match
    // Multi-word search: require first name overlap to avoid wrong-person matches
    if (first.startsWith(searchFirst) || searchFirst.startsWith(first) ||
        first.includes(searchFirst) || searchFirst.includes(first)) return 50;
    return 10; // too low to match — first names don't overlap at all
  }
  return 0;
}

// Try player search with a given season; returns { players, resp } or null
async function searchFootballPlayers(searchTerm, season) {
  const resp = await safeSendMessage({
    action: 'fetchFootballApi',
    endpoint: '/players',
    params: { search: searchTerm, season: String(season) }
  });
  if (!resp) return null;
  if (!resp.success) return resp; // pass error through
  if (resp.data?.response?.length > 0) return resp;
  return null;
}

// Fetch football/soccer data from API-Football + ScoreBat highlights
async function fetchFootballData(name) {
  if (!dataSourceSettings.football) return { notFound: true };
  if (footballCache[name]) return footballCache[name];

  try {
    const nameParts = name.trim().split(/\s+/);
    const lastName = nameParts[nameParts.length - 1];
    const currentYear = new Date().getFullYear();

    // --- Player search: try full name first, then last name; try current year then previous ---
    let playerResp = null;
    const searchTerms = [name, lastName];
    const seasons = [currentYear, currentYear - 1];

    for (const term of searchTerms) {
      for (const season of seasons) {
        playerResp = await searchFootballPlayers(term, season);
        if (playerResp && !playerResp.success && playerResp.error?.includes('No Football API key')) {
          return { noApiKey: true };
        }
        if (!playerResp) { continue; }
        if (playerResp.success && playerResp.data?.response?.length > 0) break;
        playerResp = null;
      }
      if (playerResp?.success && playerResp.data?.response?.length > 0) break;
    }

    let result = null;

    if (playerResp?.success && playerResp.data?.response?.length > 0) {
      const players = playerResp.data.response;
      let bestMatch = players[0];
      let bestScore = 0;

      for (const p of players) {
        const score = footballNameScore(
          p.player?.name, p.player?.firstname, p.player?.lastname,
          name, lastName
        );
        if (score > bestScore) {
          bestScore = score;
          bestMatch = p;
        }
      }

      if (bestScore >= 50) {
        const player = bestMatch.player;
        const stats = bestMatch.statistics?.[0] || {};
        result = {
          type: 'player',
          name: player.name,
          firstname: player.firstname,
          lastname: player.lastname,
          age: player.age,
          nationality: player.nationality,
          height: player.height,
          weight: player.weight,
          photo: player.photo,
          injured: player.injured || false,
          birth: player.birth || null,
          position: stats.games?.position || null,
          team: stats.team ? { name: stats.team.name, logo: stats.team.logo } : null,
          league: stats.league ? { name: stats.league.name, logo: stats.league.logo, season: stats.league.season, country: stats.league.country } : null,
          stats: {
            appearances: stats.games?.appearences ?? '-',
            goals: stats.goals?.total ?? '-',
            assists: stats.goals?.assists ?? '-',
            shots: stats.shots?.total ?? '-',
            shotsOn: stats.shots?.on ?? '-',
            passes: stats.passes?.total ?? '-',
            passAccuracy: stats.passes?.accuracy ?? '-',
            keyPasses: stats.passes?.key ?? '-',
            tackles: stats.tackles?.total ?? '-',
            interceptions: stats.tackles?.interceptions ?? '-',
            duelsWon: stats.duels?.won ?? '-',
            duelsTotal: stats.duels?.total ?? '-',
            dribblesAttempted: stats.dribbles?.attempts ?? '-',
            dribblesSucceeded: stats.dribbles?.success ?? '-',
            foulsDrawn: stats.fouls?.drawn ?? '-',
            foulsCommitted: stats.fouls?.committed ?? '-',
            yellowCards: stats.cards?.yellow ?? '-',
            redCards: stats.cards?.red ?? '-',
            penaltyScored: stats.penalty?.scored ?? '-',
            penaltyMissed: stats.penalty?.missed ?? '-',
            rating: stats.games?.rating ? parseFloat(stats.games.rating).toFixed(1) : '-',
            minutes: stats.games?.minutes ?? '-',
            lineups: stats.games?.lineups ?? '-',
          },
          // Aggregate stats from ALL statistics entries (all leagues/cups)
          allStats: (bestMatch.statistics || []).map(s => ({
            team: s.team?.name, league: s.league?.name, season: s.league?.season,
            appearances: s.games?.appearences, goals: s.goals?.total, assists: s.goals?.assists,
            rating: s.games?.rating
          })),
          highlights: []
        };
      }
    }

    // --- Coach search: full name first, then last name ---
    if (!result) {
      let coachResp = null;
      for (const term of searchTerms) {
        coachResp = await safeSendMessage({
          action: 'fetchFootballApi',
          endpoint: '/coachs',
          params: { search: term }
        });
        if (coachResp?.success && coachResp.data?.response?.length > 0) break;
        coachResp = null;
      }

      if (coachResp?.success && coachResp.data?.response?.length > 0) {
        const coaches = coachResp.data.response;
        let bestMatch = coaches[0];
        let bestScore = 0;

        for (const c of coaches) {
          const score = footballNameScore(c.name, c.firstname, c.lastname, name, lastName);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = c;
          }
        }

        if (bestScore >= 50) {
          const career = (bestMatch.career || []).map(c => ({
            team: c.team?.name,
            teamLogo: c.team?.logo,
            start: c.start,
            end: c.end
          }));
          result = {
            type: 'coach',
            name: bestMatch.name,
            firstname: bestMatch.firstname,
            lastname: bestMatch.lastname,
            age: bestMatch.age,
            nationality: bestMatch.nationality,
            photo: bestMatch.photo,
            birth: bestMatch.birth || null,
            team: bestMatch.team ? { name: bestMatch.team.name, logo: bestMatch.team.logo } : (career[0] ? { name: career[0].team, logo: career[0].teamLogo } : null),
            career,
            highlights: []
          };
        }
      }
    }

    if (!result) {
      result = { notFound: true };
      addToCache(footballCache, name, result);
      return result;
    }

    // --- Fetch ScoreBat highlights filtered by team name ---
    if (result.team?.name) {
      try {
        const highlightsResp = await safeSendMessage({ action: 'fetchScoreBatHighlights' });
        if (highlightsResp?.success && highlightsResp.data) {
          const highlights = Array.isArray(highlightsResp.data) ? highlightsResp.data : (highlightsResp.data.response || []);
          const teamNameLower = result.team.name.toLowerCase();
          const teamWords = teamNameLower.split(/\s+/);
          const filtered = highlights.filter(h => {
            const title = (h.title || '').toLowerCase();
            const side1 = (h.side1?.name || '').toLowerCase();
            const side2 = (h.side2?.name || '').toLowerCase();
            const searchText = `${title} ${side1} ${side2}`;
            return teamWords.some(w => w.length > 2 && searchText.includes(w));
          }).slice(0, 4);

          result.highlights = filtered.map(h => ({
            title: h.title || `${h.side1?.name || '?'} vs ${h.side2?.name || '?'}`,
            embed: h.videos?.[0]?.embed || h.embed || null,
            thumbnail: h.thumbnail,
            matchviewUrl: h.matchviewUrl || h.url,
            date: h.date
          }));
        }
      } catch (e) {
        // ScoreBat fetch failed, continue without highlights
      }
    }

    addToCache(footballCache, name, result);
    return result;
  } catch (error) {
    if (error.message?.includes('No Football API key')) return { noApiKey: true };
    return { notFound: true };
  }
}

// Render football data into a content container
function updateFootballContent(container, data, name) {
  if (!container) return;
  container.innerHTML = '';

  if (!dataSourceSettings.football) {
    container.innerHTML = '<p>Football data source is disabled in settings.</p>';
    return;
  }

  if (data?.noApiKey) {
    container.innerHTML = '<p style="color:var(--wh-text-muted);text-align:center;padding:20px;">Please configure your Football API key in the WikiHover extension settings.</p>';
    return;
  }

  if (!data || data.notFound) {
    container.innerHTML = `<p>No football data found for "${name}".</p>`;
    return;
  }

  // Profile section
  const profile = document.createElement('div');
  profile.className = 'wikihover-football-profile';

  if (data.photo) {
    const photo = document.createElement('img');
    photo.className = 'wikihover-football-photo';
    photo.src = data.photo;
    photo.alt = data.name;
    profile.appendChild(photo);
  }

  const info = document.createElement('div');
  info.className = 'wikihover-football-info';

  const nameEl = document.createElement('h4');
  nameEl.textContent = data.name || name;
  info.appendChild(nameEl);

  const meta = document.createElement('div');
  meta.className = 'wikihover-football-meta';
  const metaParts = [];
  if (data.nationality) metaParts.push(data.nationality);
  if (data.position) metaParts.push(data.position);
  if (data.age) metaParts.push(`Age ${data.age}`);
  meta.textContent = metaParts.join(' \u00B7 ');
  info.appendChild(meta);

  if (data.height || data.weight) {
    const physMeta = document.createElement('div');
    physMeta.className = 'wikihover-football-meta';
    const physParts = [];
    if (data.height) physParts.push(data.height);
    if (data.weight) physParts.push(data.weight);
    physMeta.textContent = physParts.join(' \u00B7 ');
    info.appendChild(physMeta);
  }

  profile.appendChild(info);
  container.appendChild(profile);

  // Current team section
  if (data.team) {
    const teamSection = document.createElement('div');
    teamSection.className = 'wikihover-football-team';

    if (data.team.logo) {
      const teamLogo = document.createElement('img');
      teamLogo.src = data.team.logo;
      teamLogo.alt = data.team.name;
      teamSection.appendChild(teamLogo);
    }

    const teamInfo = document.createElement('div');
    teamInfo.className = 'wikihover-football-team-info';
    const teamName = document.createElement('span');
    teamName.className = 'wikihover-football-team-name';
    teamName.textContent = data.team.name;
    teamInfo.appendChild(teamName);

    if (data.league) {
      const leagueName = document.createElement('span');
      leagueName.className = 'wikihover-football-league-name';
      leagueName.textContent = data.league.name + (data.league.season ? ` (${data.league.season})` : '');
      teamInfo.appendChild(leagueName);
    }

    teamSection.appendChild(teamInfo);

    if (data.league?.logo) {
      const leagueLogo = document.createElement('img');
      leagueLogo.src = data.league.logo;
      leagueLogo.alt = data.league.name;
      leagueLogo.style.marginLeft = 'auto';
      teamSection.appendChild(leagueLogo);
    }

    container.appendChild(teamSection);
  }

  // Season stats (player only)
  if (data.type === 'player' && data.stats) {
    const seasonTitle = document.createElement('div');
    seasonTitle.className = 'wikihover-football-section-title';
    seasonTitle.textContent = data.league?.season ? `${data.league.season} Season` : 'Season Stats';
    container.appendChild(seasonTitle);

    const statsGrid = document.createElement('div');
    statsGrid.className = 'wikihover-football-stats';

    const statItems = [
      { value: data.stats.appearances, label: 'Apps' },
      { value: data.stats.goals, label: 'Goals' },
      { value: data.stats.assists, label: 'Assists' },
      { value: data.stats.rating, label: 'Rating' },
    ];

    statItems.forEach(item => {
      const statEl = document.createElement('div');
      statEl.className = 'wikihover-football-stat';
      const val = document.createElement('span');
      val.className = 'wikihover-football-stat-value';
      val.textContent = item.value;
      statEl.appendChild(val);
      const label = document.createElement('span');
      label.className = 'wikihover-football-stat-label';
      label.textContent = item.label;
      statEl.appendChild(label);
      statsGrid.appendChild(statEl);
    });

    container.appendChild(statsGrid);

    // Second row of stats
    const statsGrid2 = document.createElement('div');
    statsGrid2.className = 'wikihover-football-stats';

    const statItems2 = [
      { value: data.stats.shots, label: 'Shots' },
      { value: data.stats.passes, label: 'Passes' },
      { value: data.stats.yellowCards, label: 'Yellows' },
      { value: data.stats.redCards, label: 'Reds' },
    ];

    statItems2.forEach(item => {
      const statEl = document.createElement('div');
      statEl.className = 'wikihover-football-stat';
      const val = document.createElement('span');
      val.className = 'wikihover-football-stat-value';
      val.textContent = item.value;
      statEl.appendChild(val);
      const label = document.createElement('span');
      label.className = 'wikihover-football-stat-label';
      label.textContent = item.label;
      statEl.appendChild(label);
      statsGrid2.appendChild(statEl);
    });

    container.appendChild(statsGrid2);
  }

  // Coach career section
  if (data.type === 'coach' && data.career?.length > 0) {
    const careerTitle = document.createElement('div');
    careerTitle.className = 'wikihover-football-section-title';
    careerTitle.textContent = 'Career';
    container.appendChild(careerTitle);

    const careerList = document.createElement('div');
    careerList.className = 'wikihover-football-career';

    data.career.slice(0, 8).forEach(c => {
      const item = document.createElement('div');
      item.className = 'wikihover-football-career-item';
      if (c.teamLogo) {
        const logo = document.createElement('img');
        logo.src = c.teamLogo;
        logo.alt = c.team || '';
        item.appendChild(logo);
      }
      const text = document.createElement('span');
      const period = [c.start, c.end || 'Present'].filter(Boolean).join(' - ');
      text.textContent = `${c.team || 'Unknown'} (${period})`;
      item.appendChild(text);
      careerList.appendChild(item);
    });

    container.appendChild(careerList);
  }

  // Video highlights section
  if (data.highlights?.length > 0) {
    const highlightsTitle = document.createElement('div');
    highlightsTitle.className = 'wikihover-football-section-title';
    highlightsTitle.textContent = 'Recent Highlights';
    container.appendChild(highlightsTitle);

    const highlightsGrid = document.createElement('div');
    highlightsGrid.className = 'wikihover-football-highlights';

    data.highlights.forEach(h => {
      const card = document.createElement('div');
      card.className = 'wikihover-football-highlight';

      if (h.embed) {
        // Show thumbnail with play overlay; load iframe on click
        const thumbContainer = document.createElement('div');
        thumbContainer.style.position = 'relative';
        thumbContainer.style.cursor = 'pointer';

        if (h.thumbnail) {
          const thumb = document.createElement('img');
          thumb.className = 'wikihover-football-highlight-thumb';
          thumb.src = h.thumbnail;
          thumb.alt = h.title || '';
          thumbContainer.appendChild(thumb);
        } else {
          const placeholder = document.createElement('div');
          placeholder.className = 'wikihover-football-highlight-thumb';
          placeholder.style.background = 'var(--wh-border)';
          thumbContainer.appendChild(placeholder);
        }

        const playBtn = document.createElement('div');
        playBtn.className = 'wikihover-football-highlight-play';
        playBtn.textContent = '\u25B6';
        thumbContainer.appendChild(playBtn);

        thumbContainer.addEventListener('click', () => {
          // Replace thumbnail with iframe embed
          card.innerHTML = '';
          const embedHtml = h.embed;
          // Extract iframe src from embed HTML
          const srcMatch = embedHtml.match(/src=["']([^"']+)["']/);
          if (srcMatch) {
            const iframe = document.createElement('iframe');
            iframe.src = srcMatch[1];
            iframe.allow = 'autoplay; fullscreen';
            card.appendChild(iframe);
          } else {
            card.innerHTML = embedHtml;
          }
          const title = document.createElement('div');
          title.className = 'wikihover-football-highlight-title';
          title.textContent = h.title || '';
          title.title = h.title || '';
          card.appendChild(title);
        });

        card.appendChild(thumbContainer);
      }

      const titleEl = document.createElement('div');
      titleEl.className = 'wikihover-football-highlight-title';
      titleEl.textContent = h.title || '';
      titleEl.title = h.title || '';
      card.appendChild(titleEl);

      highlightsGrid.appendChild(card);
    });

    container.appendChild(highlightsGrid);
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getStats') {
    sendResponse({
      success: true,
      nameCount: markedNames.size,
      apiCallCount: apiCallCount,
      maxApiCalls: MAX_API_CALLS
    });
  } else if (message.action === 'toggleExtension') {
    extensionEnabled = message.enabled;
    if (!extensionEnabled) {
      // Hide tooltip and remove all pinned tooltips
      hideTooltip();
      pinnedTooltips.forEach(p => p.remove());
      pinnedTooltips = [];
      if (observer) observer.disconnect();

      // Unwrap wikihover-processed wrappers first
      document.querySelectorAll('.wikihover-processed').forEach(wrapper => {
        const parent = wrapper.parentNode;
        if (!parent) return;
        while (wrapper.firstChild) {
          parent.insertBefore(wrapper.firstChild, wrapper);
        }
        parent.removeChild(wrapper);
      });

      // Unwrap wikihover-name spans back to text nodes
      document.querySelectorAll('.wikihover-name').forEach(span => {
        const parent = span.parentNode;
        if (!parent) return;
        const textNode = document.createTextNode(span.textContent);
        parent.replaceChild(textNode, span);
      });

      // Normalize to merge adjacent text nodes
      document.body.normalize();

      // Reset tracking state
      markedNames.clear();
      markedByDocument.clear();
      notPersonNames.clear();
      confirmedPersonNames.clear();
      preloadedNames.clear();
      processedNamesCount = 0;

      // Remove data-wikihover-processed attributes
      document.querySelectorAll('[data-wikihover-processed]').forEach(el => {
        el.removeAttribute('data-wikihover-processed');
      });
    } else {
      // Re-enable: reconnect observer and rescan
      if (observer) observer.observe(document.body, { childList: true, subtree: true });
      scanForNames();
    }
    sendResponse({ success: true });
  } else if (message.action === 'updateDataSourceSettings') {
    const oldSettings = { ...dataSourceSettings };
    if (message.settings) {
      dataSourceSettings = { ...dataSourceSettings, ...message.settings };
    }
    // Update tab visibility on main tooltip and all pinned tooltips
    if (tooltipElement) updateTabVisibility(tooltipElement);
    pinnedTooltips.forEach(p => updateTabVisibility(p));

    // For re-enabled sources: fetch missing data if tooltip is showing
    if (isTooltipVisible && currentWord && tooltipElement) {
      Object.entries(TAB_TO_SETTING).forEach(([tabKey, settingKey]) => {
        const wasDisabled = oldSettings[settingKey] === false;
        const nowEnabled = dataSourceSettings[settingKey] !== false;
        if (wasDisabled && nowEnabled) {
          // Check if data is missing from cache
          const cached = tooltipDataCache[currentWord] && tooltipDataCache[currentWord][tabKey];
          if (!cached && tabFetchers[tabKey]) {
            fetchedTabs.delete(tabKey);
            fetchedTabs.add(tabKey);
            tabFetchers[tabKey]();
          }
        }
      });
    }
    sendResponse({ success: true });
  } else if (message.action === 'updateTabOrder') {
    tabOrder = message.tabOrder;
    if (tooltipElement) reorderTooltipTabs(tooltipElement);
    pinnedTooltips.forEach(p => reorderTooltipTabs(p));
    sendResponse({ success: true });
  } else if (message.action === 'updateTheme') {
    const theme = message.theme || 'light';
    const applyTheme = (el) => {
      if (theme === 'light') {
        el.removeAttribute('data-wikihover-theme');
      } else {
        el.setAttribute('data-wikihover-theme', theme);
      }
    };
    // Apply to document for name highlight theming
    applyTheme(document.documentElement);
    if (tooltipElement) applyTheme(tooltipElement);
    pinnedTooltips.forEach(p => applyTheme(p));
    sendResponse({ success: true });
  } else if (message.action === 'updateVideoSound') {
    videoSoundEnabled = message.videoSound;
    // Apply to all currently playing/loaded videos in tooltips
    const allTooltips = [tooltipElement, ...pinnedTooltips].filter(Boolean);
    allTooltips.forEach(tt => {
      tt.querySelectorAll('video').forEach(v => { v.muted = !videoSoundEnabled; });
    });
    sendResponse({ success: true });
  } else if (message.action === 'clearCache') {
    wikiCache = {};
    tvMazeCache = {};
    imdbCache = {};
    booksCache = {};
    wikidataCache = {};
    instagramCache = {};
    twitterCache = {};
    footballCache = {};
    tiktokCache = {};
    pinterestCache = {};
    tooltipDataCache = {};
    notPersonNames.clear();
    confirmedPersonNames.clear();
    sendResponse({ success: true });
  } else if (message.action === 'checkTwitterConfig') {
    sendResponse({
      hardcodedTokenActive: !!TWITTER_API_CONFIG.bearerToken
    });
  } else if (message.action === 'updateTwitterBearerToken') {
    if (message.bearerToken) {
      TWITTER_API_CONFIG.bearerToken = message.bearerToken;
      // Clear cached noToken results so they get re-fetched with the new token
      for (const key in twitterCache) {
        if (twitterCache[key].noToken) {
          delete twitterCache[key];
        }
      }
    }
    sendResponse({ success: true });
  } else if (message.action === 'refreshTwitterToken') {
    safeStorageGet(['twitterBearerToken']).then(result => {
      if (result.twitterBearerToken) {
        TWITTER_API_CONFIG.bearerToken = result.twitterBearerToken;
      }
    });
    sendResponse({ success: true });
  } else if (message.action === 'instagramReady') {
    // Backup to polling: triggered by background when Instagram tab becomes ready
    // Find any containers waiting for Instagram retry
    if (tooltipElement) {
      const containers = tooltipElement.querySelectorAll('[class*="wikihover-tab-content"]');
      containers.forEach(c => {
        if (c._pendingInstagramRetry) {
          retryInstagramFetch(c, c._pendingInstagramRetry);
        }
      });
    }
    pinnedTooltips.forEach(tooltip => {
      const containers = tooltip.querySelectorAll('[class*="wikihover-tab-content"]');
      containers.forEach(c => {
        if (c._pendingInstagramRetry) {
          retryInstagramFetch(c, c._pendingInstagramRetry);
        }
      });
    });
    sendResponse({ success: true });
  }
  return true;
});
