import { memo } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { pickLocale } from "@/i18n";
import { CornerFrame } from "@/components/ui/CornerFrame";
import type { NodeData } from "@/schema";

export interface TechNodeCardData extends Record<string, unknown> {
  node: NodeData;
  imageUrl?: string;
  selected: boolean;
  /** 编辑模式:显示上下连接把手 */
  editable: boolean;
}

export type TechNodeType = Node<TechNodeCardData, "techNode">;

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

function TechNodeCardInner({ data }: NodeProps<TechNodeType>) {
  const { t, i18n } = useTranslation();
  const { node, imageUrl, selected, editable } = data;
  const lang = i18n.language;
  const displayYear = node.year ?? (typeof node.y === "number" ? node.y : null);

  return (
    <div className="hud-card group relative h-full w-full" data-selected={selected}>
      <div className="relative h-[110px] overflow-hidden border-b border-hud-line">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={pickLocale(node.label, lang)}
            loading="lazy"
            className="h-full w-full object-cover opacity-75 saturate-[.55] transition duration-200 group-hover:opacity-95 group-hover:saturate-100"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-hud-panel">
            <span className="px-2 text-center text-lg font-bold tracking-widest text-hud-dim">
              {node.id.toUpperCase()}
            </span>
            <span className="text-[8px] tracking-[0.3em] text-hud-dim/60">
              {t("modal.noImage")}
            </span>
          </div>
        )}
        {node.status && (
          <span
            className={cn(
              "status-chip absolute left-1 top-1",
              statusClass(node.status),
            )}
          >
            {t(`status.${node.status}`)}
          </span>
        )}
        {displayYear !== null && (
          <span className="absolute bottom-1 right-1 bg-hud-bg/85 px-1 text-[10px] text-hud-text">
            {displayYear}
          </span>
        )}
      </div>
      <div className="px-2 py-1">
        <div className="truncate text-[12px] font-semibold leading-4 text-hud-text">
          {pickLocale(node.label, lang)}
        </div>
        {node.role && (
          <div className="truncate text-[9px] uppercase tracking-wider text-hud-dim">
            {pickLocale(node.role, lang)}
          </div>
        )}
      </div>
      <CornerFrame className="opacity-0 transition-opacity group-hover:opacity-100" />
      <Handle
        type="source"
        position={Position.Bottom}
        className={cn(
          "!h-2 !w-2 !rounded-none !border !border-accent !bg-hud-bg",
          !editable && "!pointer-events-none !opacity-0",
        )}
      />
      <Handle
        type="target"
        position={Position.Top}
        className={cn(
          "!h-2 !w-2 !rounded-none !border !border-accent !bg-hud-bg",
          !editable && "!pointer-events-none !opacity-0",
        )}
      />
    </div>
  );
}

export const TechNodeCard = memo(TechNodeCardInner);
