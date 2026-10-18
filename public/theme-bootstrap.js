(() => {
  const root = document.documentElement;
  const THEME_KEY = "rinemi.theme";
  const STORE_KEYS = ["rinemi2:local:v2", "rinemi2:local:v1"];
  let preference = null;
  let state = null;

  try {
    const savedPreference = window.localStorage.getItem(THEME_KEY);
    if (savedPreference === "light" || savedPreference === "dark" || savedPreference === "system") {
      preference = savedPreference;
    }
  } catch {
    // Keep booting with the system preference when storage is unavailable.
  }

  try {
    for (const key of STORE_KEYS) {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        state = parsed;
        if (preference === null && (parsed.theme === "light" || parsed.theme === "dark" || parsed.theme === "system")) {
          preference = parsed.theme;
        }
        break;
      }
    }
  } catch {
    // Invalid or unavailable saved state must not block first paint.
  }

  if (state && (state.language === "en" || state.language === "fa")) {
    root.lang = state.language;
    root.dir = state.language === "fa" ? "rtl" : "ltr";
  }

  const resolvedPreference = preference ?? "system";
  const systemDark = typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = resolvedPreference === "system" ? systemDark : resolvedPreference === "dark";
  root.dataset.theme = isDark ? "dark" : "light";

  const colorMeta = document.querySelector('meta[name="theme-color"]');
  if (colorMeta) colorMeta.setAttribute("content", isDark ? "#1D2022" : "#F7F4EE");
})();