import { cn } from "@/lib/cn";
import { SUPPORTED_LOCALES } from "@/i18n";
import { useUIStore } from "@/state/store";

/** 各语言的本族名称(按钮显示用)。 */
const LOCALE_LABELS: Record<string, string> = { zh: "中文", en: "EN" };

export function LocaleSwitch() {
  const locale = useUIStore((s) => s.locale);
  const setLocale = useUIStore((s) => s.setLocale);
  return (
    <div className="flex items-center gap-1">
      {SUPPORTED_LOCALES.map((code) => {
        const label = LOCALE_LABELS[code] ?? code;
        const active = code === locale;
        return (
          <button
            key={code}
            className={cn(
              "hud-btn locale-btn !h-7 !w-auto px-2 text-[10px] tracking-widest",
              active && "locale-btn-active",
            )}
            onClick={() => setLocale(code)}
            title={label}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
