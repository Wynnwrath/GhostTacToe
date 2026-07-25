import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set) => ({
      mode: "dark",
      accent: "#22d3ee",
      fontFamily: "inter",
      glassIntensity: "medium",

      setMode: (mode) => set({ mode }),
      setAccent: (color) => set({ accent: color }),
      setFontFamily: (font) => set({ fontFamily: font }),
      setGlassIntensity: (intensity) => set({ glassIntensity: intensity }),
      resetDefaults: () =>
        set({
          mode: "dark",
          accent: "#22d3ee",
          fontFamily: "inter",
          glassIntensity: "medium",
        }),
    }),
    { name: "theme-prefs" }
  )
);
