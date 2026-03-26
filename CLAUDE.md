# WikiHover Site

Marketing/landing page for WikiHover — a standalone static project separated from the Chrome extension.

## Structure

```
wikihover-site/
├── index.html          # Landing page (hero, demo, marketplace, publishers sections)
├── auth-gate.js        # Password overlay for dev/staging access
├── styles.css          # Tooltip styles — required by content.js for the live demo
├── demo-shim.js        # Chrome API shim so content.js runs without the extension
├── compromise.min.js   # Bundled NLP library (used by content.js for name detection)
├── hebrew_names.js     # Hebrew names list (used by content.js)
└── content.js          # Extension core — runs the live demo on the landing page
```

## How to run

```bash
npx serve .
# Open http://localhost:3000
```

Or open `index.html` directly in a browser (Wikipedia demo works; TVMaze/IMDb may be CORS-blocked).

## Auth gate

The page is password-protected for dev/staging. The password hash is in `auth-gate.js` (`HASH`).
To bypass: `sessionStorage.setItem('wh_auth', 'true')` in the browser console.

## Keeping content.js in sync

`content.js` is the Chrome extension core, also used here for the live demo section.
When the extension logic changes, copy the updated file from the `wikihover` (extension) project.

## Related projects

| Project | Path |
|---------|------|
| Chrome Extension + JS SDK | `../wikihover` |
| Portal (Next.js) | `../WiKiHover_Portal` |
| FeedAPI (Spring Boot) | `../WikiHover-FeedAPI` |
