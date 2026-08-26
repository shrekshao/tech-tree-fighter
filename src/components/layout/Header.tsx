import { useTranslation } from "react-i18next";
import { pickLocale } from "@/i18n";
import type { LoadedDataset } from "@/data/loader";
import { LocaleSwitch } from "./LocaleSwitch";

export function Header({ dataset }: { dataset?: LoadedDataset }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  return (
    <header className="flex items-center justify-between gap-4 border-b border-hud-line bg-hud-panel/60 px-4 py-2.5 backdrop-blur">
      <div className="flex min-w-0 items-baseline gap-3">
        <h1 className="animate-flicker font-display text-lg font-bold tracking-[0.3em] text-accent">
          {t("app.title").toUpperCase()}
        </h1>
        {dataset && (
          <span className="truncate text-xs tracking-widest text-hud-dim">
            // {pickLocale(dataset.meta.title, lang)}
          </span>
        )}
      </div>
      <LocaleSwitch />
    </header>
  );
}
