import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import zh from "./locales/zh.json";

export const SUPPORTED_LOCALES = ["zh", "en"];

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  lng: "zh",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;

/**
 * 解析数据内的 locale map。
 * 回退链:当前语言 → en → 第一个可用值。
 */
export function pickLocale(
  obj: Record<string, string> | null | undefined,
  lang: string,
): string {
  if (!obj) return "";
  return obj[lang] ?? obj.en ?? Object.values(obj)[0] ?? "";
}
