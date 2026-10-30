// Keep the splash (static markup in index.html) up at least this long after
// navigation start, so a fast load doesn't just flash the logo.
const MIN_VISIBLE_MS = 1200;

export function hideSplash() {
  const splash = document.getElementById("splash");
  if (!splash) return;

  const wait = Math.max(0, MIN_VISIBLE_MS - performance.now());
  window.setTimeout(() => {
    splash.classList.add("splash-hidden");
    // Fallback removal in case transitionend never fires (reduced motion, hidden tab).
    const remove = () => splash.remove();
    splash.addEventListener("transitionend", remove, { once: true });
    window.setTimeout(remove, 500);
  }, wait);
}
