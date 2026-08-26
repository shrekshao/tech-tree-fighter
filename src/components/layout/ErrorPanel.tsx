import { useTranslation } from "react-i18next";
import { CornerFrame } from "@/components/ui/CornerFrame";

export function ErrorPanel({ message }: { message: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="hud-panel relative w-full max-w-2xl p-6">
        <CornerFrame />
        <h2 className="font-display text-lg font-bold tracking-widest text-hud-red">
          ⚠ {t("app.errorTitle")}
        </h2>
        <pre className="mt-4 whitespace-pre-wrap text-xs leading-relaxed text-hud-text/85">
          {message}
        </pre>
      </div>
    </div>
  );
}
