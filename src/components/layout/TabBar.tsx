import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { pickLocale } from "@/i18n";
import type { LoadedTab } from "@/data/loader";

interface Props {
  tabs: LoadedTab[];
  activeId?: string;
  onSelect: (id: string) => void;
}

export function TabBar({ tabs, activeId, onSelect }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  return (
    <nav className="flex border-b border-hud-line bg-hud-bg/80 px-2">
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={cn(
              "relative px-5 py-2 text-xs uppercase tracking-[0.25em] transition-colors",
              active ? "text-accent" : "text-hud-dim hover:text-hud-text",
            )}
            style={
              active
                ? { boxShadow: "inset 0 -2px 0 var(--color-accent)" }
                : undefined
            }
          >
            {pickLocale(tab.title, lang)}
          </button>
        );
      })}
    </nav>
  );
}
