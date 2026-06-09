// Loading animation
const bar = document.getElementById("bar");
const DURATION = 5200;
const startTime = Date.now();

function animate() {
  const elapsed = Date.now() - startTime;
  const progress = Math.min(1, elapsed / DURATION);
  
  // Apply ease-in-out easing function
  const eased = progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

  // Update progress bar width
  bar.style.width = (eased * 100) + "%";

  if (progress < 1) {
    // Continue animation if not complete
    requestAnimationFrame(animate);
  } else {
    // Animation complete; trigger fade out after a brief delay
    setTimeout(() => {
      const screen = document.querySelector(".ls-screen");
      screen.style.transition = "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      screen.style.opacity = "0";
    }, 300);
  }
}

// Start animation as soon as the DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(animate);
});