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

// ─── Per-feed parallel fetch caches ──────────────────────────────────────────
// feedPrefetchCache[name][feedKey] = Promise<SourceResult|null>
// Persists for the page lifetime — resolved Promises fire .then() immediately.
const feedPrefetchCache = {};
// feedResultCache[name][feedKey] = SourceResult|null  (written when Promise resolves)
// Provides synchronous access for pinned tooltip re-render.
const feedResultCache = {};
const MAX_PREFETCH_CACHE_NAMES = 100;

/** Maps a feed key to its CSS class suffix used in the tooltip DOM */
function _feedKeyToClass(key) {
  const map = { wiki: 'wiki', wikipedia: 'wiki', tvmaze: 'tvmaze', imdb: 'imdb',
                instagram: 'instagram', twitter: 'twitter', tiktok: 'tiktok',
                pinterest: 'pinterest', football: 'football', books: 'books' };
  return map[key] || key;
}

/** Maps sidebar tab `data-tab` value to registry / server feed key */
function _tabNameToFeedKey(tabName) {
  if (tabName === 'wiki') return 'wikipedia';
  return tabName;
}

/** Resolves a feed ID to its module key using the feeds config map. Returns null if not found. */
function _feedIdToKey(feedId) {
  if (feedId == null || !window.WikiHover?.isReady()) return null;
  const feedsMap = window.WikiHover.getConfig()?.feeds;
  if (!feedsMap) return null;
  for (const [key, entry] of Object.entries(feedsMap)) {
    const entryId = (entry && typeof entry === 'object') ? entry.id : entry;
    if (entryId === feedId) return key;
  }
  return null;
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
  window._whVideoSoundEnabled = videoSoundEnabled;  // expose for agent modules
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

function handleCompromiseFailure() {
  window.compromiseAvailable = false;
}

/**
 * Compromise (`window.nlp`) must exist in the same JS realm as this script.
 *
 * - Embed player: build.js prepends compromise.min.js to wikihover-player.js (fully self-contained).
 * - Chrome extension: manifest lists compromise.min.js before content.js (isolated world; never
 *   inject <script src=…> into the page — that runs in the page realm and won’t expose nlp here).
 */
function loadCompromiseLibrary() {
  if (typeof window !== 'undefined' && typeof window.nlp === 'function') {
    return Promise.resolve(window.nlp);
  }
  handleCompromiseFailure();
  return Promise.reject(
    new Error(
      window.__WIKIHOVER_EMBED__
        ? 'WikiHover embed: window.nlp missing — rebuild player (compromise.min.js must be prepended)'
        : 'Compromise not loaded — ensure compromise.min.js is listed before content.js in manifest.json'
    )
  );
}

// Check POS tags on a candidate name phrase within a parsed Compromise document.
function hasNonPersonPOSTags(doc, candidateName) {
  try {
    const matchDoc = doc.match(candidateName);
    if (matchDoc.found) {
      if (matchDoc.has('#Person') || matchDoc.has('#FirstName') || matchDoc.has('#LastName') ||
          matchDoc.has('#Honorific') || matchDoc.has('#NickName')) {
        return false;
      }
      for (const tag of NON_PERSON_POS_TAGS) {
        if (matchDoc.has(tag)) return true;
      }
    }
    const words = candidateName.split(/\s+/);
    for (const word of words) {
      if (word.length < 2) continue;
      const wordDoc = window.nlp(word);
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

function getNlpApprovedNames(fullText) {
  const approved = new Set();
  if (!window.compromiseAvailable || !fullText) return approved;
  try {
    const doc = window.nlp(fullText);
    const people = doc.people().out('array');
    const places = doc.places().out('array');
    const orgs = doc.organizations().out('array');
    const rejected = new Set();
    for (const p of places) rejected.add(p.toLowerCase().trim());
    for (const o of orgs) rejected.add(o.toLowerCase().trim());
    for (const person of people) {
      const clean = person.replace(/'s$/i, '').trim();
      if (!clean || rejected.has(clean.toLowerCase())) continue;
      if (hasNonPersonPOSTags(doc, clean)) {
        debugLog('rejected (POS tags):', clean);
        continue;
      }
      approved.add(clean);
    }
    if (approved.size > 0) debugLog('batch NLP approved:', Array.from(approved));
    return approved;
  } catch (error) {
    console.error('WikiHover: Error in getNlpApprovedNames:', error);
    return approved;
  }
}

function isNameNlpApproved(name, approvedNames) {
  const cleanName = name.replace(/'s$/i, '').trim();
  const lowerName = cleanName.toLowerCase();
  for (const approved of approvedNames) {
    if (approved === cleanName) return true;
  }
  for (const approved of approvedNames) {
    const lowerApproved = approved.toLowerCase();
    if (lowerApproved.includes(lowerName) || lowerName.includes(lowerApproved)) {
      return true;
    }
  }
  return false;
}

function extractPersonFromSequence(sequence, nlpApproved) {
  if (!window.compromiseAvailable) return null;
  try {
    const words = sequence.split(/\s+/);
    if (words.length < 3) return null;
    const doc = window.nlp(sequence);
    const people = doc.people().out('array');
    if (people.length > 0) {
      let personName = people[0].replace(/'s$/i, '').trim();
      const personMatch = doc.match(personName);
      if (personMatch.found) {
        const personTerms = personMatch.terms().out('tags');
        const personWords = personName.split(/\s+/);
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
      const nameIdx = sequence.indexOf(personName);
      if (nameIdx !== -1) {
        return {
          name: personName,
          startOffset: nameIdx,
          endOffset: nameIdx + personName.length
        };
      }
    }
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

function enhanceNameDetection(name, contextText) {
  try {
    const cleanName = name.replace(/'s$/i, '').trim();
    const textToAnalyze = contextText && contextText.length > cleanName.length
      ? contextText : cleanName;
    const doc = window.nlp(textToAnalyze);
    const people = doc.people().out('array');
    const places = doc.places().out('array');
    const orgs = doc.organizations().out('array');
    const rejectedLower = new Set();
    for (const p of places) rejectedLower.add(p.toLowerCase().trim());
    for (const o of orgs) rejectedLower.add(o.toLowerCase().trim());
    if (rejectedLower.has(cleanName.toLowerCase())) {
      debugLog('rejected (place/org):', cleanName);
      return null;
    }
    if (hasNonPersonPOSTags(doc, cleanName)) {
      debugLog('rejected (POS tags):', cleanName);
      return null;
    }
    if (people.length > 0) {
      for (const person of people) {
        const cleanPerson = person.replace(/'s$/i, '').trim();
        const lowerPerson = cleanPerson.toLowerCase();
        const lowerName = cleanName.toLowerCase();
        if (lowerPerson.includes(lowerName) || lowerName.includes(lowerPerson)) {
          const result = !cleanPerson.includes(' ') && cleanName.includes(' ') ? cleanName : cleanPerson;
          debugLog('approved (NLP):', result);
          return result;
        }
      }
    }
    debugLog('rejected:', cleanName);
    return null;
  } catch (error) {
    console.error('WikiHover: Error in enhanceNameDetection:', error);
    return null;
  }
}

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
      if (typeof window.nlp === 'function') {
        debugLog('Compromise loaded successfully');
        window.compromiseAvailable = true;
      } else {
        handleCompromiseFailure();
      }
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
    { key: 'polymarket', label: 'Polymarket', favicon: 'https://www.google.com/s2/favicons?domain=polymarket.com&sz=128' },
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

  const polymarketContent = document.createElement('div');
  polymarketContent.className = 'wikihover-content wikihover-polymarket-content';
  contentContainer.appendChild(polymarketContent);

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

  // Switch to default feed if configured, else first enabled tab in user's order
  const defaultFeedId = window.WikiHover?.isReady() && window.WikiHover.getConfig()?.defaultFeed;
  const defaultModuleKey = defaultFeedId != null ? _feedIdToKey(defaultFeedId) : null;
  const defaultTabKey = defaultModuleKey ? _feedKeyToClass(defaultModuleKey) : null;
  const firstEnabledInit = defaultTabKey
    ? tabDefs.find(d => d.key === defaultTabKey && dataSourceSettings[TAB_TO_SETTING[d.key]] !== false)
    : null;
  const fallbackInit = tabDefs.find(d => dataSourceSettings[TAB_TO_SETTING[d.key]] !== false);
  switchTab((firstEnabledInit || fallbackInit)?.key || 'wiki');

  // Single click handler for closing tooltip
  document.addEventListener('click', function(e) {
    if (isTooltipVisible && !isTooltipElement(e.target) && !currentHoveredElement?.contains(e.target)) {
      hideTooltip();
    }
  });

  // Navigate when a feed module dispatches wikihover:navigate (e.g. family tree click)
  document.addEventListener('wikihover:navigate', function(e) {
    const name = e.detail?.name;
    if (!name) return;
    const pinned = e.target.closest('.wikihover-pinned-tooltip');
    if (pinned) {
      navigateInPinnedTooltip(pinned, name, false);
    } else {
      navigateToHistoryEntry(name);
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

  // Attach per-feed .then() handlers so any in-flight promises render into the pinned element.
  // (Feeds already rendered are already in the moved DOM; this catches anything still loading.)
  if (window.WikiHover?.isReady()) {
    window.WikiHover.getRegistry().keys().forEach(key => {
      const promise = feedPrefetchCache[pinnedName] && feedPrefetchCache[pinnedName][key];
      if (!promise) return;
      promise.then(sourceResult => {
        if (!document.body.contains(pinned)) return; // stale guard
        renderSingleFeedIntoTooltip(pinned, key, sourceResult);
      });
    });
  }

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

  document.body.appendChild(pinned);
  pinnedTooltips.push(pinned);

  // Re-attach per-feed promises so any in-flight feeds render into the pinned clone.
  if (window.WikiHover?.isReady()) {
    window.WikiHover.getRegistry().keys().forEach(key => {
      const promise = feedPrefetchCache[pinnedName] && feedPrefetchCache[pinnedName][key];
      if (!promise) return;
      promise.then(sourceResult => {
        if (!document.body.contains(pinned)) return; // stale guard
        renderSingleFeedIntoTooltip(pinned, key, sourceResult);
      });
    });
  }

  // Enforce max pinned limit
  while (pinnedTooltips.length > MAX_PINNED_TOOLTIPS) {
    const oldest = pinnedTooltips.shift();
    oldest.remove();
  }

  const pinnedSidebar = pinned.querySelector('.wikihover-sidebar');

  tooltipHideGraceUntil = Date.now() + 2000;
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
  pinterest: 'pinterest',
  polymarket: 'polymarket'
};

// Get the first enabled tab key based on user's tab order
function getFirstEnabledTabKey() {
  // If a default feed ID is configured, resolve it to a tab key
  if (window.WikiHover?.isReady()) {
    const cfg = window.WikiHover.getConfig();
    if (cfg && cfg.defaultFeed != null) {
      const moduleKey = _feedIdToKey(cfg.defaultFeed);
      if (moduleKey) {
        const defaultTabKey = _feedKeyToClass(moduleKey);
        const settingKey = TAB_TO_SETTING[defaultTabKey];
        if (settingKey && dataSourceSettings[settingKey] !== false) {
          return defaultTabKey;
        }
      }
    }
  }
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

    // Use NLP to verify it's a person name (if available), with parent context for accuracy
    if (window.compromiseAvailable && !isHebrewText(text)) {
      const parentText = el.parentElement ? el.parentElement.textContent : '';
      const contextText = parentText.length > text.length && parentText.length < 500 ? parentText : null;
      const enhanced = enhanceNameDetection(text, contextText);
      if (enhanced === null) continue;
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
          if (matchStart > lastIndex) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchStart)));
          }
          if (extracted.startOffset > 0) {
            fragment.appendChild(document.createTextNode(matchText.substring(0, extracted.startOffset)));
          }
          fragment.appendChild(markName(extracted.name, true));
          markedCount++;
          if (extracted.endOffset < matchText.length) {
            fragment.appendChild(document.createTextNode(matchText.substring(extracted.endOffset)));
          }
          lastIndex = matchStart + matchText.length;
          continue;
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

      // NLP-only when Compromise ran; otherwise allow regex match (Hebrew / no NLP).
      let approved = true;
      if (!isHebrew && nlpApproved !== null) {
        approved = isNameNlpApproved(matchText, nlpApproved);
        if (!approved) {
          debugLog('rejected (batch NLP):', matchText);
        }
      }

      if (approved) {
        fragment.appendChild(markName(matchText, nlpApproved !== null));
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

function createNameSpan(displayText, dataNameAttr) {
  const key = normalizeNameForDedup(dataNameAttr);
  const nameSpan = document.createElement('span');
  nameSpan.className = 'wikihover-name';
  nameSpan.setAttribute('data-name', key);
  nameSpan.textContent = displayText;
  nameSpan.addEventListener('mouseenter', handleNameHover);
  nameSpan.addEventListener('mouseleave', function () {
    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(function () {
      if (Date.now() - lastRepositionTime < REPOSITION_GRACE_MS) return;
      if (!isMouseOverTooltip()) {
        hideTooltip();
      }
    }, TOOLTIP_DELAY);
  });
  markedNames.add(key);
  return nameSpan;
}

// Function to mark a name with hover capability.
// When nlpPreApproved is true, skips the per-name NLP check (already batch-validated by processTextNode).
function markName(name, nlpPreApproved) {
  // Skip names the user has unmarked
  if (unmarkedNames.has(name) || unmarkedNames.has(normalizeNameForDedup(name))) {
    return document.createTextNode(name);
  }

  debugLog('Marking name:', name);

  let enhancedName = name;
  if (!nlpPreApproved && window.compromiseAvailable && !isHebrewText(name)) {
    enhancedName = enhanceNameDetection(name);

    if (enhancedName === null) {
      return document.createTextNode(name);
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

  let enhancedName = text;
  if (window.compromiseAvailable && enableEnhancedNameDetection && !isHebrewText(text)) {
    // Try to get parent context for better NLP accuracy
    const parentText = element.parentElement ? element.parentElement.textContent : '';
    const contextText = parentText.length > text.length && parentText.length < 500 ? parentText : null;
    enhancedName = enhanceNameDetection(text, contextText);

    if (enhancedName === null) {
      element.setAttribute('data-wikihover-processed', 'true');
      return;
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

  // Fire per-feed prefetch immediately — head start before the tooltip delay
  prefetchFeedsForName(currentWord);

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

        // Agent mode: immediately hide tabs that have no registered module.
        // Without this, every tab (Wikipedia, TVMaze, etc.) shows a spinner that never resolves
        // because the legacy per-tab fetchers are not used when WikiHover agent is active.
        if (window.WikiHover?.isReady()) {
          const registeredKeys = new Set(window.WikiHover.getRegistry().keys());
          tooltipElement.querySelectorAll('.wikihover-tab[data-tab]').forEach(tab => {
            const tabKey = tab.getAttribute('data-tab');
            if (!registeredKeys.has(_tabNameToFeedKey(tabKey))) hideTabButton(tooltipElement, tabKey);
          });
        }

        // All tabs are shown immediately in B&W; each fades to color when its feed loads.
        // Tabs with no data are hidden by hideTabButton() after the fetch completes.
        const firstEnabledTab = getFirstEnabledTabKey();

        showTooltip();

        resetTabIconsToBw(tooltipElement);
        const nameToFetch = currentWord;

        // Attach per-feed .then() handlers — data may already be in cache (instant render)
        // or still in flight (renders when the Promise resolves).
        // NOTE: prefetchFeedsForName() was already called on mouseenter (before this timer fired).
        if (window.WikiHover?.isReady()) {
          const keys = window.WikiHover.getRegistry().keys();

          // firstOkSwitched: only the first feed with ok data triggers switchTab.
          // switchTab() takes the CSS key (e.g. 'wiki', 'imdb') — use _feedKeyToClass(key).
          // If defaultFeed is configured, wait for that feed specifically instead of switching
          // to whichever feed responds first.
          let firstOkSwitched = false;
          const cfgDefaultKey = _feedIdToKey(window.WikiHover.getConfig()?.defaultFeed);

          keys.forEach(key => {
            const promise = feedPrefetchCache[nameToFetch] && feedPrefetchCache[nameToFetch][key];
            if (!promise) return;
            promise.then(sourceResult => {
              if (currentWord !== nameToFetch || !isTooltipVisible) return; // stale guard
              renderSingleFeedIntoTooltip(tooltipElement, key, sourceResult);
              if (!firstOkSwitched && sourceResult && sourceResult.status === 'ok') {
                // If defaultFeed is set, only auto-switch when that specific feed arrives
                if (cfgDefaultKey && key !== cfgDefaultKey) return;
                firstOkSwitched = true;
                switchTab(_feedKeyToClass(key));
              }
              debouncedRepositionTooltip();
            });
          });
        }
        // No else branch — if WikiHover not ready, tabs stay showing loaders


        // Switch to the first enabled tab
        switchTab(firstEnabledTab);


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

// ─── Per-feed parallel prefetch ───────────────────────────────────────────────

/**
 * Fire one fetch per registered feed key for the given entity name.
 * Called immediately on mouseenter — before the tooltip delay fires.
 * Results are stored in feedPrefetchCache (Promise) and feedResultCache (resolved value).
 * Idempotent: if a Promise already exists for name+key, it is reused.
 */
function prefetchFeedsForName(name) {
  if (!window.WikiHover?.isReady()) return;
  const client = window.WikiHover.getClient();
  const keys = window.WikiHover.getRegistry().keys();
  if (!keys.length) return;

  // LRU eviction: drop oldest name entry when over limit (Object.keys preserves insertion order)
  const cacheNames = Object.keys(feedPrefetchCache);
  if (cacheNames.length >= MAX_PREFETCH_CACHE_NAMES) {
    const oldest = cacheNames[0];
    delete feedPrefetchCache[oldest];
    delete feedResultCache[oldest];
  }

  if (!feedPrefetchCache[name]) feedPrefetchCache[name] = {};
  if (!feedResultCache[name]) feedResultCache[name] = {};

  keys.forEach(key => {
    if (feedPrefetchCache[name][key]) return; // already in flight or resolved
    feedPrefetchCache[name][key] = client.fetch(name, [key])
      .then(resp => {
        const result = (resp.feeds && resp.feeds[key]) || null;
        feedResultCache[name][key] = result;
        return result;
      })
      .catch(() => {
        feedResultCache[name][key] = null;
        return null;
      });
  });
}

/**
 * Render one feed's SourceResult into its tab container inside tooltipEl.
 * Reveals the tab icon in color on ok, hides the tab button on error/null.
 * @param {HTMLElement} tooltipEl
 * @param {string} key  Feed module key, e.g. 'wikipedia', 'imdb'
 * @param {Object|null} sourceResult  { status, items, ... } or null
 */
function renderSingleFeedIntoTooltip(tooltipEl, key, sourceResult) {
  if (!tooltipEl || !window.WikiHover?.isReady()) return;
  const registry = window.WikiHover.getRegistry();
  const cssKey = _feedKeyToClass(key);
  const container = tooltipEl.querySelector(`.wikihover-${key}-content`)
                 || tooltipEl.querySelector(`.wikihover-${cssKey}-content`);
  if (!container) return;
  const module = registry.get(key);
  if (!module) return;
  try {
    module.render(sourceResult || { status: 'error' }, container);
    if (sourceResult && sourceResult.status === 'ok') {
      revealTabIconColor(tooltipEl, cssKey);
    } else {
      hideTabButton(tooltipEl, cssKey);
    }
  } catch (e) {
    console.warn(`[WikiHover] ${key} render error:`, e);
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

  // Reset all tab content to loaders
  pinnedEl.querySelectorAll('.wikihover-content').forEach(c => {
    if (c !== wikiContent) {
      c.innerHTML = '<div class="wikihover-loader"></div>';
    }
  });

  // Fire prefetch for the new name, then attach per-feed .then() handlers.
  // STALE GUARD: data-tooltip-name is set to `name` earlier in this function
  // (pinnedEl.setAttribute('data-tooltip-name', name) at ~line 3025 in original).
  // If user navigates again, that attribute changes, making in-flight .then() callbacks discard.
  prefetchFeedsForName(name);

  if (window.WikiHover?.isReady()) {
    const keys = window.WikiHover.getRegistry().keys();
    // Hide all registered tabs until their feed resolves
    keys.forEach(key => hideTabButton(pinnedEl, _feedKeyToClass(key)));
    let firstOkPinned = false;
    keys.forEach(key => {
      const promise = feedPrefetchCache[name] && feedPrefetchCache[name][key];
      if (!promise) return;
      promise.then(sourceResult => {
        // Stale guard: if pinnedEl has navigated to a different name, discard
        if (pinnedEl.getAttribute('data-tooltip-name') !== name) return;
        if (!document.body.contains(pinnedEl)) return;
        renderSingleFeedIntoTooltip(pinnedEl, key, sourceResult);
        if (!firstOkPinned && sourceResult && sourceResult.status === 'ok') {
          firstOkPinned = true;
          // Switch pinned tooltip to first ok tab
          const cssKey = _feedKeyToClass(key);
          pinnedEl.querySelectorAll('.wikihover-content').forEach(c => {
            c.style.display = 'none';
            c.style.visibility = 'hidden';
            c.style.opacity = '0';
            c.classList.remove('active');
          });
          pinnedEl.querySelectorAll('.wikihover-tab').forEach(t => t.classList.remove('active'));
          const tab = pinnedEl.querySelector(`[data-tab="${cssKey}"]`);
          const content = pinnedEl.querySelector(`.wikihover-${cssKey}-content`);
          if (tab) tab.classList.add('active');
          if (content) {
            content.style.display = 'block';
            content.style.visibility = 'visible';
            content.style.opacity = '1';
            content.classList.add('active');
          }
        }
      });
    });
  }

}

// Listen for messages from extension popup (MV3). Embedded player sets __WIKIHOVER_EMBED__ — no popup.
// Optional chain: `typeof x.addListener` still evaluates `x.addListener` and throws if `x` is undefined.
if (!window.__WIKIHOVER_EMBED__ && chrome.runtime && typeof chrome.runtime.onMessage?.addListener === 'function') {
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
    window._whVideoSoundEnabled = message.videoSound;  // keep module in sync
    // Apply to all currently playing/loaded videos in tooltips
    const allTooltips = [tooltipElement, ...pinnedTooltips].filter(Boolean);
    allTooltips.forEach(tt => {
      tt.querySelectorAll('video').forEach(v => { v.muted = !videoSoundEnabled; });
    });
    sendResponse({ success: true });
  } else if (message.action === 'clearCache') {
    Object.keys(feedPrefetchCache).forEach(k => delete feedPrefetchCache[k]);
    Object.keys(feedResultCache).forEach(k => delete feedResultCache[k]);
    sendResponse({ success: true });
  }
  return true;
});
}
