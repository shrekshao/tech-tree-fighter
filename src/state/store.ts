import { create } from "zustand";
import { persist } from "zustand/middleware";

function detectLocale(): string {
  if (
    typeof navigator !== "undefined" &&
    navigator.language?.toLowerCase().startsWith("zh")
  ) {
    return "zh";
  }
  return "en";
}

interface UIState {
  locale: string;
  setLocale: (locale: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      locale: detectLocale(),
      setLocale: (locale) => set({ locale }),
    }),
    { name: "techtree-ui" },
  ),
);
