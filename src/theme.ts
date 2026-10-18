export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const THEME_STORAGE_KEY = "rinemi.theme";
const SYSTEM_COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export function resolveThemePreference(
  preference: ThemePreference,
  prefersDark = typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia(SYSTEM_COLOR_SCHEME_QUERY).matches
): ResolvedTheme {
  if (preference === "system") return prefersDark ? "dark" : "light";
  return preference;
}

/** Read the canonical preference, preserving an older stored light/dark choice when migrating. */
export function readThemePreference(legacyPreference?: unknown): ThemePreference {
  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "light" || stored === "dark" || stored === "system") return stored;
    } catch {
      // A blocked storage API must not prevent startup.
    }
  }
  if (legacyPreference === "light" || legacyPreference === "dark" || legacyPreference === "system") {
    return legacyPreference;
  }
  return "system";
}

export function applyThemePreference(preference: ThemePreference): () => void {
  const root = document.documentElement;
  const media = window.matchMedia(SYSTEM_COLOR_SCHEME_QUERY);
  const themeColorMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

  const apply = () => {
    const resolved = preference === "system" ? (media.matches ? "dark" : "light") : preference;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
    const canvasColor = getComputedStyle(root).getPropertyValue("--rinemi-color-bg-canvas").trim();
    if (themeColorMeta && /^#[\da-f]{6}$/i.test(canvasColor)) themeColorMeta.content = canvasColor;
  };

  apply();
  if (preference !== "system") return () => undefined;
  media.addEventListener("change", apply);
  return () => media.removeEventListener("change", apply);
}

export function nextThemePreference(current: ThemePreference): ThemePreference {
  if (current === "system") return resolveThemePreference("system") === "dark" ? "light" : "dark";
  if (current === "light") return "dark";
  return "system";
}
