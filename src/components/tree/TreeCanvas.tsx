import { useMemo } from "react";
import {
  Background,
  BackgroundVariant,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTranslation } from "react-i18next";
import { pickLocale } from "@/i18n";
import { resolveAssetUrl, type LoadedTab } from "@/data/loader";
import {
  resolveTree,
  CARD_W,
  CARD_H,
  LEFT_MARGIN,
  TOP_MARGIN,
} from "@/data/resolve";
import { TechNodeCard, type TechNodeCardData } from "@/components/nodes/TechNodeCard";
import {
  BandNode,
  AxisLabelNode,
  AxisLineNode,
  type BandNodeData,
  type AxisLabelData,
} from "./AuxNodes";
import { TechEdge, type TechEdgeData } from "./TechEdge";

const nodeTypes = {
  techNode: TechNodeCard,
  band: BandNode,
  axisLabel: AxisLabelNode,
  axisLine: AxisLineNode,
};
const edgeTypes = { tech: TechEdge };

interface Props {
  tab: LoadedTab;
  accent: string;
  selectedNodeId?: string;
  onSelectNode: (id: string) => void;
}

export function TreeCanvas(props: Props) {
  return (
    <ReactFlowProvider>
      <CanvasInner key={props.tab.id} {...props} />
    </ReactFlowProvider>
  );
}

function CanvasInner({ tab, accent, selectedNodeId, onSelectNode }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const tree = tab.tree;
  const resolved = useMemo(() => resolveTree(tree), [tree]);

  const nodes = useMemo<Node[]>(() => {
    const out: Node[] = [];

    // 背景色带
    for (const b of resolved.bands) {
      out.push({
        id: `band:${b.band.id}`,
        type: "band",
        position: { x: LEFT_MARGIN - 6 + b.x, y: TOP_MARGIN + b.y },
        initialWidth: b.width + 12,
        initialHeight: b.height,
        data: { band: b.band, lang } satisfies BandNodeData,
        selectable: false,
        draggable: false,
        zIndex: -3,
      });
    }

    // 轴线
    out.push({
      id: "axis:v",
      type: "axisLine",
      position: { x: LEFT_MARGIN - 1, y: 0 },
      initialWidth: 1,
      initialHeight: resolved.contentHeight + TOP_MARGIN,
      data: { dir: "v" },
      selectable: false,
      draggable: false,
      zIndex: -2,
    });
    out.push({
      id: "axis:h",
      type: "axisLine",
      position: { x: 0, y: TOP_MARGIN - 1 },
      initialWidth: resolved.contentWidth + LEFT_MARGIN,
      initialHeight: 1,
      data: { dir: "h" },
      selectable: false,
      draggable: false,
      zIndex: -2,
    });

    // 年份刻度
    for (const tick of resolved.ticks) {
      out.push({
        id: `tick:${tick.year}`,
        type: "axisLabel",
        position: { x: 0, y: TOP_MARGIN + tick.y },
        initialWidth: LEFT_MARGIN - 10,
        initialHeight: 16,
        data: { text: String(tick.year), align: "right", kind: "tick" } satisfies AxisLabelData,
        selectable: false,
        draggable: false,
        zIndex: -2,
      });
    }

    // 列标题
    for (const c of resolved.columns) {
      out.push({
        id: `col:${c.id}`,
        type: "axisLabel",
        position: { x: LEFT_MARGIN + c.x, y: 0 },
        initialWidth: c.width,
        initialHeight: TOP_MARGIN - 14,
        data: { text: pickLocale(c.label, lang), align: "center", kind: "column" } satisfies AxisLabelData,
        selectable: false,
        draggable: false,
        zIndex: -2,
      });
    }

    // 数据卡片
    for (const n of tree.nodes) {
      const pos = resolved.nodePositions.get(n.id);
      if (!pos) continue;
      out.push({
        id: n.id,
        type: "techNode",
        position: { x: LEFT_MARGIN + pos.x, y: TOP_MARGIN + pos.y },
        initialWidth: CARD_W,
        initialHeight: CARD_H,
        data: {
          node: n,
          imageUrl: resolveAssetUrl(tab.file, n.image),
          selected: n.id === selectedNodeId,
        } satisfies TechNodeCardData,
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        selectable: true,
        draggable: false,
        connectable: false,
        zIndex: n.id === selectedNodeId ? 10 : 0,
      });
    }
    return out;
  }, [resolved, tree.nodes, tab.file, selectedNodeId, lang]);

  const edges = useMemo<Edge[]>(
    () =>
      tree.links.map((l) => {
        const active = selectedNodeId
          ? l.from === selectedNodeId || l.to === selectedNodeId
          : true;
        const color = l.color ?? accent;
        const labelText = l.label ? pickLocale(l.label, lang) : undefined;
        return {
          id: `${l.from}->${l.to}`,
          source: l.from,
          target: l.to,
          type: "tech",
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
          data: { link: l } satisfies TechEdgeData,
          style: {
            stroke: color,
            strokeWidth: active ? 1.6 : 1,
            opacity: active ? 0.85 : 0.12,
            strokeDasharray:
              l.style === "dashed" ? "7 5" : l.style === "dotted" ? "2 5" : undefined,
          },
          markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15, color },
          markerStart: l.bidirectional
            ? { type: MarkerType.ArrowClosed, width: 15, height: 15, color }
            : undefined,
          zIndex: active ? 5 : 0,
          label: labelText,
          labelShowBg: Boolean(labelText),
          labelStyle: {
            fill: "#6b7f94",
            fontSize: 9,
            fontFamily: '"Share Tech Mono", monospace',
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          },
          labelBgStyle: {
            fill: "#05080d",
            fillOpacity: 0.92,
            stroke: "#1b2a3a",
            strokeWidth: 1,
          },
          labelBgPadding: [6, 2] as [number, number],
          labelBgBorderRadius: 0,
        };
      }),
    [tree.links, selectedNodeId, accent, lang],
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        zoomOnScroll={false}
        panOnScroll
        zoomOnPinch
        panOnDrag
        minZoom={0.15}
        maxZoom={4}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={null}
        nodesDraggable={false}
        nodesConnectable={false}
        onNodeClick={(_, node) => {
          if (node.type === "techNode") onSelectNode(node.id);
        }}
      >
        <Background
          variant={BackgroundVariant.Lines}
          gap={48}
          size={1}
          color="rgba(77,214,255,0.07)"
        />
        <MiniMap
          position="bottom-right"
          pannable
          zoomable
          maskColor="rgba(4,7,12,0.78)"
          nodeStrokeWidth={1}
          nodeClassName="hud-minimap-node"
          nodeColor={(n) =>
            n.type === "techNode"
              ? accent
              : n.type === "band"
                ? "rgba(77,214,255,0.10)"
                : "transparent"
          }
          className="!border !border-hud-line !bg-hud-panel/95"
          style={{ borderRadius: 0 }}
        />
      </ReactFlow>
      <ZoomControls />
      <span className="pointer-events-none absolute bottom-2 left-3 text-[9px] uppercase tracking-[0.3em] text-hud-dim/60">
        {t("tree.year")}
      </span>
    </div>
  );
}

function ZoomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { t } = useTranslation();
  return (
    <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
      <button className="hud-btn" title={t("tree.zoomIn")} onClick={() => zoomIn({ duration: 200 })}>
        +
      </button>
      <button className="hud-btn" title={t("tree.zoomOut")} onClick={() => zoomOut({ duration: 200 })}>
        −
      </button>
      <button
        className="hud-btn"
        title={t("tree.fit")}
        onClick={() => fitView({ padding: 0.18, duration: 300 })}
      >
        ⌂
      </button>
    </div>
  );
}
