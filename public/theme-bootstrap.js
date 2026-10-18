(() => {
  const root = document.documentElement;
  try {
    const stored = window.localStorage.getItem("rinemi2:local:v2");
    if (!stored) return;
    const state = JSON.parse(stored);
    if (!state || state.version !== 2) return;
    if (state.theme === "dark" || state.theme === "light") {
      root.dataset.theme = state.theme;
    }
    if (state.language === "en" || state.language === "fa") {
      root.lang = state.language;
      root.dir = state.language === "fa" ? "rtl" : "ltr";
    }
  } catch {
    // Startup must continue with safe document defaults when storage is unavailable or invalid.
  }
})();
