import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { pickLocale } from "@/i18n";
import { resolveAssetUrl, type LoadedTab } from "@/data/loader";
import { CornerFrame } from "@/components/ui/CornerFrame";
import type { NodeData } from "@/schema";

interface Props {
  node: NodeData;
  tab: LoadedTab;
  accent: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

function statusClass(status: NodeData["status"]): string {
  switch (status) {
    case "active":
      return "status-active";
    case "prototype":
      return "status-prototype";
    case "cancelled":
      return "status-cancelled";
    default:
      return "status-retired";
  }
}

function RelatedChips({
  label,
  nodes,
  onSelect,
  lang,
}: {
  label: string;
  nodes: NodeData[];
  onSelect: (id: string) => void;
  lang: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[9px] uppercase tracking-[0.25em] text-hud-dim">{label}</span>
      {nodes.map((n) => (
        <button
          key={n.id}
          onClick={() => onSelect(n.id)}
          className="border border-hud-line bg-hud-bg/60 px-2 py-0.5 text-[11px] text-hud-text transition-colors hover:border-accent hover:text-accent"
        >
          <span className="mr-1.5 text-hud-dim">
            {n.year ?? (typeof n.y === "number" ? n.y : "")}
          </span>
          {pickLocale(n.label, lang)}
        </button>
      ))}
    </div>
  );
}

export function NodeModal({ node, tab, accent, onSelect, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const imageUrl = resolveAssetUrl(tab.file, node.image);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { prev, next } = useMemo(() => {
    const find = (id: string) => tab.tree.nodes.find((n) => n.id === id);
    return {
      prev: tab.tree.links.filter((l) => l.to === node.id).map((l) => find(l.from)).filter((n): n is NodeData => Boolean(n)),
      next: tab.tree.links.filter((l) => l.from === node.id).map((l) => find(l.to)).filter((n): n is NodeData => Boolean(n)),
    };
  }, [tab, node.id]);

  const body = node.details?.body ? pickLocale(node.details.body, lang) : "";
  const displayYear = node.year ?? (typeof node.y === "number" ? node.y : null);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ "--color-accent": accent } as CSSProperties}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={onClose} />
      <div className="hud-panel relative flex max-h-[88vh] w-full max-w-3xl flex-col">
        <CornerFrame className="z-10" />
        <header className="flex items-start justify-between gap-4 border-b border-hud-line px-5 py-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-hud-dim">{node.id}</div>
            <h2 className="font-display text-2xl font-bold tracking-widest text-accent">
              {pickLocale(node.label, lang)}
            </h2>
            <div className="mt-1 flex items-center gap-2 text-xs text-hud-dim">
              {displayYear !== null && <span>{displayYear}</span>}
              {node.role && <span>· {pickLocale(node.role, lang)}</span>}
              {node.status && (
                <span className={cn("status-chip", statusClass(node.status))}>
                  {t(`status.${node.status}`)}
                </span>
              )}
            </div>
          </div>
          <button className="hud-btn" onClick={onClose} title={t("modal.close")}>
            ✕
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="grid gap-5 md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
            <div>
              {imageUrl ? (
                <figure>
                  <img
                    src={imageUrl}
                    alt={pickLocale(node.label, lang)}
                    className="w-full border border-hud-line bg-black/40 object-contain"
                  />
                  {node.imageCredit && (
                    <figcaption className="mt-1 text-[10px] text-hud-dim">
                      {pickLocale(node.imageCredit, lang)}
                    </figcaption>
                  )}
                </figure>
              ) : (
                <div className="flex aspect-video items-center justify-center border border-dashed border-hud-line text-[10px] tracking-[0.3em] text-hud-dim">
                  {t("modal.noImage")}
                </div>
              )}
              {node.summary && (
                <p className="mt-3 text-sm leading-relaxed text-hud-text/90">
                  {pickLocale(node.summary, lang)}
                </p>
              )}
            </div>

            <div className="space-y-5">
              {node.details?.specs?.length ? (
                <section>
                  <h3 className="modal-heading">{t("modal.specs")}</h3>
                  <table className="w-full text-xs">
                    <tbody>
                      {node.details.specs.map((s, i) => (
                        <tr key={i} className="border-b border-hud-line/60">
                          <td className="whitespace-nowrap py-1.5 pr-3 text-hud-dim">
                            {pickLocale(s.label, lang)}
                          </td>
                          <td className="py-1.5 text-right text-hud-text">{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              ) : null}

              {node.wiki || node.details?.links?.length ? (
                <section>
                  <h3 className="modal-heading">{t("modal.sources")}</h3>
                  <ul className="space-y-1 text-xs">
                    {node.wiki && (
                      <li>
                        <a
                          className="text-accent hover:underline"
                          target="_blank"
                          rel="noreferrer"
                          href={`https://en.wikipedia.org/wiki/${encodeURIComponent(node.wiki)}`}
                        >
                          {t("modal.wikipedia")}
                        </a>
                      </li>
                    )}
                    {node.details?.links?.map((l, i) => (
                      <li key={i}>
                        <a className="text-accent hover:underline" target="_blank" rel="noreferrer" href={l.url}>
                          {pickLocale(l.label, lang)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {prev.length > 0 || next.length > 0 ? (
                <section className="space-y-2">
                  <h3 className="modal-heading">{t("modal.related")}</h3>
                  {prev.length > 0 && (
                    <RelatedChips label={t("modal.predecessors")} nodes={prev} onSelect={onSelect} lang={lang} />
                  )}
                  {next.length > 0 && (
                    <RelatedChips label={t("modal.successors")} nodes={next} onSelect={onSelect} lang={lang} />
                  )}
                </section>
              ) : null}
            </div>
          </div>

          {body && (
            <div className="hud-markdown mt-5 border-t border-hud-line/60 pt-4">
              <ReactMarkdown>{body}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
