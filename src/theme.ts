export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const THEME_STORAGE_KEY = "rinemi.theme";
const SYSTEM_COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

/** Resolve a preference into the effective theme shown by the document. */
export function resolveThemePreference(
  preference: ThemePreference,
  prefersDark = typeof window !== "undefined"
    && window.matchMedia(SYSTEM_COLOR_SCHEME_QUERY).matches
): ResolvedTheme {
  if (preference === "system") return prefersDark ? "dark" : "light";
  return preference;
}

/**
 * Read the canonical preference, falling back to the older v1 app-store field.
 * Keeping the fallback makes pre-token builds' saved light/dark settings survive.
 */
export function readThemePreference(legacyPreference?: unknown): ThemePreference {
  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "light" || stored === "dark" || stored === "system") return stored;
    } catch {
      // A blocked storage API must not prevent the application from starting.
    }
  }
  if (legacyPreference === "light" || legacyPreference === "dark" || legacyPreference === "system") {
    return legacyPreference;
  }
  return "system";
}

/**
 * Apply the effective theme and keep the browser chrome color aligned with the
 * active canvas token. Returns a cleanup function for the system-theme listener.
 */
export function applyThemePreference(preference: ThemePreference): () => void {
  const root = document.documentElement;
  const media = window.matchMedia(SYSTEM_COLOR_SCHEME_QUERY);
  const themeColorMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

  const apply = () => {
    const resolved = preference === "system" ? (media.matches ? "dark" : "light") : preference;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;

    const canvasColor = getComputedStyle(root).getPropertyValue("--rinemi-color-bg-canvas").trim();
    if (themeColorMeta && /^#[\da-f]{6}$/i.test(canvasColor)) {
      themeColorMeta.content = canvasColor;
    }
  };

  apply();
  if (preference !== "system") return () => undefined;

  media.addEventListener("change", apply);
  return () => media.removeEventListener("change", apply);
}

/** Cycle from system to the opposite effective theme, light to dark, dark to system. */
export function nextThemePreference(current: ThemePreference): ThemePreference {
  if (current === "system") return resolveThemePreference("system") === "dark" ? "light" : "dark";
  if (current === "light") return "dark";
  return "system";
}
