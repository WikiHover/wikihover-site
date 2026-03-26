/* =====================================================
   WikiHover Auth Gate
   Client-side password overlay for dev/staging access.
   Loads before the page renders; all styles are inline.
   ===================================================== */
(function () {
  'use strict';

  // Password hash — update this line to change the gate password
  var HASH = '1c8bfe8f801d79745c4631d09fff36c82aa37fc4cce4fc946683d7b336b63032';

  // Skip gate if already authenticated this session
  if (sessionStorage.getItem('wh_auth') === 'true') return;

  // --- Hide all body children immediately ---
  var hiddenChildren = [];
  function hideBodyChildren() {
    Array.from(document.body.children).forEach(function (child) {
      if (child.id === 'wh-auth-overlay') return;
      hiddenChildren.push({ el: child, prev: child.style.display });
      child.style.display = 'none';
    });
  }

  // --- SHA-256 helper ---
  function sha256(message) {
    var encoder = new TextEncoder();
    var data = encoder.encode(message);
    return crypto.subtle.digest('SHA-256', data).then(function (buffer) {
      var bytes = new Uint8Array(buffer);
      var hex = '';
      for (var i = 0; i < bytes.length; i++) {
        hex += bytes[i].toString(16).padStart(2, '0');
      }
      return hex;
    });
  }

  // --- Build the overlay ---
  function createOverlay() {
    var overlay = document.createElement('div');
    overlay.id = 'wh-auth-overlay';
    overlay.setAttribute('style', [
      'position: fixed',
      'inset: 0',
      'z-index: 2147483647',
      'display: flex',
      'align-items: center',
      'justify-content: center',
      'background: #FFFFFF',
      'opacity: 1',
      'transition: opacity 0.35s ease',
      'font-family: "Inter", sans-serif'
    ].join(';'));

    // Card
    var card = document.createElement('div');
    card.setAttribute('style', [
      'width: 100%',
      'max-width: 380px',
      'padding: 40px 36px 36px',
      'background: #FFFFFF',
      'border-radius: 1rem',
      'border: 1px solid #E2E8F0',
      'box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08)',
      'text-align: center'
    ].join(';'));

    // Logo row
    var logoRow = document.createElement('div');
    logoRow.setAttribute('style', [
      'display: flex',
      'align-items: center',
      'justify-content: center',
      'gap: 10px',
      'margin-bottom: 32px'
    ].join(';'));

    var logoSquare = document.createElement('div');
    logoSquare.setAttribute('style', [
      'width: 36px',
      'height: 36px',
      'background: #2563EB',
      'border-radius: 0.75rem',
      'display: flex',
      'align-items: center',
      'justify-content: center',
      'color: #FFFFFF',
      'font-weight: 900',
      'font-size: 18px',
      'letter-spacing: -0.05em',
      'font-family: "Inter", sans-serif'
    ].join(';'));
    logoSquare.textContent = 'W';

    var logoText = document.createElement('span');
    logoText.setAttribute('style', [
      'font-size: 20px',
      'font-weight: 700',
      'letter-spacing: -0.025em',
      'color: #0F172A',
      'font-family: "Inter", sans-serif'
    ].join(';'));
    logoText.textContent = 'wikiHover';

    logoRow.appendChild(logoSquare);
    logoRow.appendChild(logoText);

    // Password input
    var input = document.createElement('input');
    input.type = 'password';
    input.placeholder = 'Enter password';
    input.setAttribute('style', [
      'display: block',
      'width: 100%',
      'box-sizing: border-box',
      'padding: 12px 16px',
      'border: 1px solid #E2E8F0',
      'border-radius: 0.75rem',
      'font-size: 14px',
      'font-family: "Inter", sans-serif',
      'color: #0F172A',
      'outline: none',
      'transition: border-color 0.2s ease',
      'margin-bottom: 16px'
    ].join(';'));
    input.addEventListener('focus', function () {
      input.style.borderColor = '#2563EB';
    });
    input.addEventListener('blur', function () {
      input.style.borderColor = '#E2E8F0';
    });

    // Continue button
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Continue';
    btn.setAttribute('style', [
      'display: block',
      'width: 100%',
      'padding: 12px 16px',
      'background: #2563EB',
      'color: #FFFFFF',
      'font-size: 14px',
      'font-weight: 600',
      'font-family: "Inter", sans-serif',
      'border: none',
      'border-radius: 0.75rem',
      'cursor: pointer',
      'transition: background 0.2s ease',
      'margin-bottom: 12px'
    ].join(';'));
    btn.addEventListener('mouseenter', function () { btn.style.background = '#1D4ED8'; });
    btn.addEventListener('mouseleave', function () { btn.style.background = '#2563EB'; });

    // Error message
    var errorMsg = document.createElement('div');
    errorMsg.setAttribute('style', [
      'color: #EF4444',
      'font-size: 13px',
      'font-weight: 500',
      'font-family: "Inter", sans-serif',
      'min-height: 20px',
      'visibility: hidden'
    ].join(';'));
    errorMsg.textContent = 'Incorrect password';

    // Inject shake keyframes
    var styleTag = document.createElement('style');
    styleTag.textContent =
      '@keyframes wh-shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-6px)}30%{transform:translateX(6px)}45%{transform:translateX(-4px)}60%{transform:translateX(4px)}75%{transform:translateX(-2px)}90%{transform:translateX(2px)}}';
    overlay.appendChild(styleTag);

    // Assemble
    card.appendChild(logoRow);
    card.appendChild(input);
    card.appendChild(btn);
    card.appendChild(errorMsg);
    overlay.appendChild(card);

    var submitting = false;

    function submit() {
      if (submitting) return;
      var value = input.value;
      if (!value) {
        showError();
        return;
      }
      submitting = true;
      sha256(value).then(function (hex) {
        if (hex === HASH) {
          // Authenticated
          sessionStorage.setItem('wh_auth', 'true');
          overlay.style.opacity = '0';
          setTimeout(function () {
            overlay.remove();
            // Reveal body children
            hiddenChildren.forEach(function (item) {
              item.el.style.display = item.prev;
            });
          }, 350);
        } else {
          showError();
          submitting = false;
        }
      }).catch(function () {
        showError();
        submitting = false;
      });
    }

    function showError() {
      errorMsg.style.visibility = 'visible';
      // Shake animation on card
      card.style.animation = 'none';
      // Force reflow to restart animation
      void card.offsetWidth;
      card.style.animation = 'wh-shake 0.5s ease';
      input.value = '';
      input.focus();
    }

    btn.addEventListener('click', submit);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
    });

    return { overlay: overlay, input: input };
  }

  // --- Mount ---
  function mount() {
    hideBodyChildren();
    var gate = createOverlay();
    document.body.appendChild(gate.overlay);
    // Autofocus after paint
    requestAnimationFrame(function () {
      gate.input.focus();
    });
  }

  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }
})();
