import { useTranslation } from "react-i18next";
import { useUIStore } from "@/state/store";

export function LocaleSwitch() {
  const { t } = useTranslation();
  const locale = useUIStore((s) => s.locale);
  const setLocale = useUIStore((s) => s.setLocale);
  return (
    <button
      className="hud-btn !h-7 !w-auto px-2 text-[10px] tracking-widest"
      onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
      title={t("app.localeSwitch")}
    >
      {t("app.localeSwitch")}
    </button>
  );
}
