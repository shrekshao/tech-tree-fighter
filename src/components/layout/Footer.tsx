import { useTranslation } from "react-i18next";
import { DATA_SOURCES, REPO_URL } from "@/config";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="flex items-center justify-between gap-3 border-t border-hud-line bg-hud-panel/60 px-4 py-1.5 text-[10px] tracking-wider text-hud-dim">
      <span className="truncate">
        {t("footer.dataSource")}: {DATA_SOURCES}
      </span>
      <a
        href={REPO_URL}
        target="_blank"
        rel="noreferrer"
        className="whitespace-nowrap text-accent hover:underline"
      >
        {t("footer.editData")} ↗
      </a>
    </footer>
  );
}
