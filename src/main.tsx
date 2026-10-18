import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource-variable/plus-jakarta-sans";
import "vazirmatn/Vazirmatn-Variable-font-face.css";

const root = document.getElementById("root");
if (!root) throw new Error("RINEMI2_ROOT_REQUIRED");
createRoot(root).render(<StrictMode><App /></StrictMode>);