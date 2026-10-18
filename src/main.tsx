import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "@fontsource-variable/plus-jakarta-sans";
import "vazirmatn/Vazirmatn-Variable-font-face.css";

const root = document.getElementById("root");
if (!root) throw new Error("RINEMI2_ROOT_REQUIRED");
createRoot(root).render(<StrictMode><App /></StrictMode>);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
      scope: import.meta.env.BASE_URL
    }).catch(() => {
      // Offline enhancement is optional: registration failure must not block study.
    });
  });
}