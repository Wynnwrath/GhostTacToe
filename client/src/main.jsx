import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { useThemeStore } from "./stores/theme.store";
import { useAuthStore } from "./stores/auth.store";

function Root() {
  const mode = useThemeStore((s) => s.mode);
  const accent = useThemeStore((s) => s.accent);
  const fontFamily = useThemeStore((s) => s.fontFamily);
  const glassIntensity = useThemeStore((s) => s.glassIntensity);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", mode);
    root.style.setProperty("--color-accent", accent);
    root.style.setProperty(
      "--font-family-body",
      fontFamily === "inter" ? "Inter, system-ui, sans-serif" : "Georgia, serif"
    );
    root.dataset.glassIntensity = glassIntensity;
  }, [mode, accent, fontFamily, glassIntensity]);

  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
