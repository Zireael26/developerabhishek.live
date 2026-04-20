(function () {
  'use strict';

  const TWEAK_KEYS = ['tagline', 'accent', 'mode', 'density', 'motion'];
  const panel = document.getElementById('tweaks');
  const body = document.body;
  let active = false;

  // ------------------------ apply ------------------------
  function apply(key, value) {
    if (!TWEAK_KEYS.includes(key)) return;
    if (key === 'tagline') {
      body.setAttribute('data-tagline', value);
      document.querySelectorAll('[data-slot="tagline"] > span').forEach((span) => {
        const which = span.dataset.taglineA !== undefined ? 'a'
                    : span.dataset.taglineB !== undefined ? 'b'
                    : span.dataset.taglineC !== undefined ? 'c' : null;
        if (which === value) span.removeAttribute('hidden');
        else span.setAttribute('hidden', '');
      });
      return;
    }
    body.setAttribute(`data-${key}`, value);
  }

  function applyAll(obj) {
    TWEAK_KEYS.forEach((k) => { if (obj[k] != null) apply(k, obj[k]); });
    // sync UI
    panel.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.checked = obj[input.name] === input.value;
    });
  }

  // ------------------------ init ------------------------
  const defaults = (typeof window.TWEAK_DEFAULTS === 'object' && window.TWEAK_DEFAULTS)
    || (typeof TWEAK_DEFAULTS !== 'undefined' ? TWEAK_DEFAULTS : {});
  applyAll(Object.assign({ tagline: 'a', accent: 'forest', mode: 'light', density: 'airy', motion: 'on' }, defaults));

  // respect reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    body.setAttribute('data-motion', 'off');
  }

  // ------------------------ host protocol ------------------------
  window.addEventListener('message', (ev) => {
    const d = ev.data || {};
    if (d.type === '__activate_edit_mode') {
      panel.hidden = false;
      active = true;
    } else if (d.type === '__deactivate_edit_mode') {
      panel.hidden = true;
      active = false;
    }
  });

  try {
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  } catch (e) { /* standalone */ }

  // ------------------------ inputs ------------------------
  panel.addEventListener('change', (e) => {
    const input = e.target;
    if (input.type !== 'radio') return;
    apply(input.name, input.value);
    const edits = {};
    edits[input.name] = input.value;
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    } catch (err) { /* standalone */ }
  });

  const closeBtn = panel.querySelector('.tweaks-close');
  if (closeBtn) closeBtn.addEventListener('click', () => {
    panel.hidden = true;
    try { window.parent.postMessage({ type: '__edit_mode_close' }, '*'); } catch (e) {}
  });

  // local dev: toggle with ` key
  window.addEventListener('keydown', (e) => {
    if (e.key === '`') {
      panel.hidden = !panel.hidden;
    }
  });
})();
