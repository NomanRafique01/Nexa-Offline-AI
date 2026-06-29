/**
 * splash.js — Nexa splash screen animation controller
 *
 * Drives the progress bar and fade-out on the Electron loading screen.
 * Loaded by loading.html in the Electron shell before the main window is ready.
 */

const SPLASH_DURATION_MS = 5200;

/**
 * Eases a linear progress value using an ease-in-out curve.
 * @param {number} t - Linear progress from 0 to 1
 * @returns {number} Eased value from 0 to 1
 */
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Animates the loading bar and fades out the splash screen when done.
 */
function initSplash() {
  const bar = document.getElementById("bar");
  const screen = document.querySelector(".ls-screen");

  if (!bar || !screen) {
    console.warn("[splash] Required DOM elements not found.");
    return;
  }

  const startTime = Date.now();

  function tick() {
    const elapsed = Date.now() - startTime;
    const raw = Math.min(1, elapsed / SPLASH_DURATION_MS);
    const eased = easeInOut(raw);

    bar.style.width = (eased * 100) + "%";

    if (raw < 1) {
      requestAnimationFrame(tick);
    } else {
      // Brief pause then fade out
      setTimeout(() => {
        screen.style.transition = "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        screen.style.opacity = "0";
      }, 300);
    }
  }

  requestAnimationFrame(tick);
}

window.addEventListener("DOMContentLoaded", initSplash);
