import type { ThemePreference } from "./study";

const LIGHT_THEME_COLOR = "#F7F4EE";
const DARK_THEME_COLOR = "#1D2022";

export function applyThemePreference(preference: ThemePreference): () => void {
  const root = document.documentElement;
  const colorMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const apply = () => {
    const isDark = preference === "system" ? media.matches : preference === "dark";
    root.dataset.theme = isDark ? "dark" : "light";
    colorMeta?.setAttribute("content", isDark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
  };

  apply();
  if (preference !== "system") return () => undefined;

  media.addEventListener("change", apply);
  return () => media.removeEventListener("change", apply);
}
