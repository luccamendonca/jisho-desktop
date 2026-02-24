const { contextBridge } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const isMac = navigator.platform.toUpperCase().includes("MAC");

  // Add top padding so content doesn't sit behind the hidden title bar / traffic lights
  // Only needed on macOS where we use titleBarStyle: "hiddenInset"
  if (isMac) {
    const style = document.createElement("style");
    style.textContent = `
      body {
        padding-top: 28px !important;
        -webkit-app-region: drag;
      }

      /* Make interactive elements non-draggable so they remain clickable */
      a, button, input, select, textarea, label,
      .search, .input_methods, #main_results,
      #search_main, #result_area, .radical_area,
      .concept_light, .sentences, .names {
        -webkit-app-region: no-drag;
      }
    `;
    document.head.appendChild(style);
  }

  // Focus the search bar on initial load
  const focusSearchBar = () => {
    const input = document.getElementById("keyword");
    if (input) {
      input.focus();
      input.select();
    }
  };

  // Auto-focus after a short delay to let the page settle
  focusSearchBar();
  setTimeout(focusSearchBar, 300);

  // Also focus when navigating to a new page within the SPA / after page transitions
  const observer = new MutationObserver(() => {
    // Only auto-focus if nothing else is focused (or body is focused)
    if (!document.activeElement || document.activeElement === document.body) {
      focusSearchBar();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // "/" hotkey brings focus to the search bar (like GitHub, YouTube, etc.)
  document.addEventListener("keydown", (e) => {
    const active = document.activeElement;
    const isTyping =
      active &&
      (active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.isContentEditable);

    if (e.key === "/" && !isTyping) {
      e.preventDefault();
      focusSearchBar();
    }

    // Escape blurs the search bar
    if (e.key === "Escape" && active) {
      active.blur();
    }
  });
});
