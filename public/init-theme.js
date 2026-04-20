/* Pre-hydration theme bootstrap. Runs blocking in <head> before first paint.
 * Reads the stored choice or system preference and sets html[data-mode], so
 * dark-preference users don't see a light-mode flash before ThemeToggle's
 * effect reconciles. Key + fallback must match components/site/ThemeToggle.tsx. */
(function () {
  try {
    var k = 'abhishek.portfolio.mode';
    var v = localStorage.getItem(k);
    if (v !== 'light' && v !== 'dark') {
      v = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-mode', v);
  } catch (e) {}
})();
