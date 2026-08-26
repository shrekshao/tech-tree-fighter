import { memo } from "react";
import type { Node, NodeProps } from "@xyflow/react";
import { cn } from "@/lib/cn";
import { pickLocale } from "@/i18n";
import type { Band } from "@/schema";

/* ---------- 背景色带(年代/分代) ---------- */

export interface BandNodeData extends Record<string, unknown> {
  band: Band;
  lang: string;
}
export type BandNodeType = Node<BandNodeData, "band">;

function BandNodeInner({ data }: NodeProps<BandNodeType>) {
  const { band, lang } = data;
  return (
    <div
      className="relative h-full w-full"
      style={{
        backgroundColor: band.color ?? "var(--color-accent)",
        borderColor: band.color ?? "var(--color-accent)",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 border-t border-dashed"
        style={{ borderColor: band.color ?? "var(--color-accent)" }}
      />
      {band.label && (
        <div className="absolute left-2 top-1.5 text-[9px] uppercase tracking-[0.3em] text-hud-dim">
          {pickLocale(band.label, lang)}
        </div>
      )}
    </div>
  );
}
export const BandNode = memo(BandNodeInner);

/* ---------- 轴刻度/列标题 ---------- */

export interface AxisLabelData extends Record<string, unknown> {
  text: string;
  align?: "left" | "center" | "right";
  kind?: "tick" | "column";
}
export type AxisLabelNodeType = Node<AxisLabelData, "axisLabel">;

function AxisLabelNodeInner({ data }: NodeProps<AxisLabelNodeType>) {
  return (
    <div
      className={cn(
        "h-full w-full text-[10px] uppercase tracking-[0.25em] text-hud-dim",
        data.kind === "column" &&
          "border-l border-accent/25 px-2 pt-2 font-semibold tracking-[0.2em]",
        data.align === "center" && "text-center",
        data.align === "right" && "text-right",
      )}
    >
      {data.text}
    </div>
  );
}
export const AxisLabelNode = memo(AxisLabelNodeInner);

/* ---------- 轴线 ---------- */

export type AxisLineNodeType = Node<Record<string, unknown>, "axisLine">;

function AxisLineNodeInner({ data }: NodeProps<AxisLineNodeType>) {
  return (
    <div
      className={cn("h-full w-full", data.dir === "v" ? "border-l" : "border-t")}
      style={{ borderColor: "rgba(109,165,210,0.3)" }}
    />
  );
}
export const AxisLineNode = memo(AxisLineNodeInner);
