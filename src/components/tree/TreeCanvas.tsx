import { useEffect, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
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
  snapNode,
  CARD_W,
  CARD_H,
  LEFT_MARGIN,
  TOP_MARGIN,
} from "@/data/resolve";
import type { TreeData } from "@/schema";
import { TechNodeCard, type TechNodeCardData } from "@/components/nodes/TechNodeCard";
import {
  BandNode,
  AxisLabelNode,
  AxisLineNode,
  type BandNodeData,
  type AxisLabelData,
} from "./AuxNodes";
import { TechEdge, type TechEdgeData } from "./TechEdge";
import { EditToolbar } from "./EditToolbar";

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
  /** 编辑模式:卡片可拖动、连线可增删改 */
  editMode: boolean;
  /** 编辑动作写回整棵树(拖卡片写 pos、增删连线) */
  onTreeChange: (tree: TreeData) => void;
  onSelectNode: (id: string) => void;
}

export function TreeCanvas(props: Props) {
  return (
    <ReactFlowProvider>
      <CanvasInner key={props.tab.id} {...props} />
    </ReactFlowProvider>
  );
}

function CanvasInner({ tab, accent, selectedNodeId, editMode, onTreeChange, onSelectNode }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const tree = tab.tree;
  const resolved = useMemo(() => resolveTree(tree), [tree]);

  // 编辑模式:当前选中(待调整/删除)的连线
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  useEffect(() => {
    if (!editMode) setSelectedEdgeId(null);
  }, [editMode]);

  const nodes = useMemo<Node[]>(() => {
    const out: Node[] = [];

    // 背景色带
    for (const b of resolved.bands) {
      out.push({
        id: `band:${b.band.id}`,
        type: "band",
        position: { x: LEFT_MARGIN - 6 + b.x, y: TOP_MARGIN + b.y },
        width: b.width + 12,
        height: b.height,
        data: { band: b.band, lang } satisfies BandNodeData,
        selectable: false,
        draggable: false,
        deletable: false,
        zIndex: -3,
      });
    }

    // 轴线
    out.push({
      id: "axis:v",
      type: "axisLine",
      position: { x: LEFT_MARGIN - 1, y: 0 },
      width: 1,
      height: resolved.contentHeight + TOP_MARGIN,
      data: { dir: "v" },
      selectable: false,
      draggable: false,
      deletable: false,
      zIndex: -2,
    });
    out.push({
      id: "axis:h",
      type: "axisLine",
      position: { x: 0, y: TOP_MARGIN - 1 },
      width: resolved.contentWidth + LEFT_MARGIN,
      height: 1,
      data: { dir: "h" },
      selectable: false,
      draggable: false,
      deletable: false,
      zIndex: -2,
    });

    // 年份刻度
    for (const tick of resolved.ticks) {
      out.push({
        id: `tick:${tick.year}`,
        type: "axisLabel",
        position: { x: 0, y: TOP_MARGIN + tick.y },
        width: LEFT_MARGIN - 10,
        height: 16,
        data: { text: String(tick.year), align: "right", kind: "tick" } satisfies AxisLabelData,
        selectable: false,
        draggable: false,
        deletable: false,
        zIndex: -2,
      });
    }

    // 列标题
    for (const c of resolved.columns) {
      out.push({
        id: `col:${c.id}`,
        type: "axisLabel",
        position: { x: LEFT_MARGIN + c.x, y: 0 },
        // 显式尺寸:节点不会按内容回缩,text-center 才能真跨整列居中
        width: c.width,
        height: TOP_MARGIN - 14,
        data: { text: pickLocale(c.label, lang), align: "center", kind: "column" } satisfies AxisLabelData,
        selectable: false,
        draggable: false,
        deletable: false,
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
        // 显式尺寸:与 resolve.ts 的 (spacing - CARD_W) / 2 居中偏移对齐
        width: CARD_W,
        height: CARD_H,
        data: {
          node: n,
          imageUrl: resolveAssetUrl(tab.file, n.image),
          selected: n.id === selectedNodeId,
          editable: editMode,
        } satisfies TechNodeCardData,
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        selectable: true,
        // draggable 缺省,跟随全局 nodesDraggable(仅编辑模式可拖)
        connectable: editMode,
        deletable: false,
        zIndex: n.id === selectedNodeId ? 10 : 0,
      });
    }
    return out;
  }, [resolved, tree.nodes, tab.file, selectedNodeId, lang, editMode]);

  const edges = useMemo<Edge[]>(() => {
    // 每个源节点的出边序号,用于肘部下探错开,避免多边重叠
    const outCount = new Map<string, number>();
    for (const l of tree.links) {
      outCount.set(l.from, (outCount.get(l.from) ?? 0) + 1);
    }
    const outIndex = new Map<string, number>();
    return tree.links.map((l) => {
      const i = outIndex.get(l.from) ?? 0;
      outIndex.set(l.from, i + 1);
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
        data: { drop: 14 + i * 14, editable: editMode } satisfies TechEdgeData,
        style: {
          stroke: color,
          strokeWidth: 1,
          opacity: active ? 0.5 : 0.1,
          strokeDasharray:
            l.style === "dashed" ? "7 5" : l.style === "dotted" ? "2 5" : undefined,
        },
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
    });
  }, [tree.links, selectedNodeId, accent, lang, editMode]);

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
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={editMode ? ["Delete", "Backspace"] : null}
        nodesDraggable={editMode}
        nodesConnectable={editMode}
        elementsSelectable={editMode}
        onNodeClick={(_, node) => {
          if (node.type === "techNode" && !editMode) onSelectNode(node.id);
        }}
        onNodeDragStop={(_, node) => {
          if (node.type !== "techNode") return;
          // 流坐标 → 内容区像素坐标,优先吸附语义坐标;列间隙/无轴才写 pos
          const snap = snapNode(tree, node.id, {
            x: Math.round(node.position.x - LEFT_MARGIN),
            y: Math.round(node.position.y - TOP_MARGIN),
          });
          onTreeChange({
            ...tree,
            nodes: tree.nodes.map((n) =>
              n.id === node.id
                ? snap.pos
                  ? { ...n, pos: snap.pos }
                  : { ...n, x: snap.x, y: snap.y, pos: undefined }
                : n,
            ),
          });
        }}
        onConnect={(conn) => {
          if (!conn.source || !conn.target || conn.source === conn.target) return;
          if (tree.links.some((l) => l.from === conn.source && l.to === conn.target)) return;
          onTreeChange({
            ...tree,
            links: [
              ...tree.links,
              {
                from: conn.source,
                to: conn.target,
                style: tree.defaultEdge.style,
                bidirectional: false,
              },
            ],
          });
        }}
        onEdgeClick={(_, edge) => {
          if (editMode) setSelectedEdgeId(edge.id);
        }}
        onPaneClick={() => setSelectedEdgeId(null)}
        onDelete={({ edges }) => {
          // v12 的 onDelete 无 preventDefault:RF 内部删除后立即写回数据,
          // 否则下次受控重建时被删的连线会复活
          if (!edges.length) return;
          const ids = new Set(edges.map((e) => e.id));
          onTreeChange({
            ...tree,
            links: tree.links.filter((l) => !ids.has(`${l.from}->${l.to}`)),
          });
          setSelectedEdgeId(null);
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
      <EditToolbar
        tab={tab}
        selectedEdgeId={selectedEdgeId}
        onTreeChange={onTreeChange}
        onClearEdgeSelection={() => setSelectedEdgeId(null)}
      />
      <ZoomControls />
      <span className="pointer-events-none absolute bottom-2 left-3 text-[9px] uppercase tracking-[0.3em] text-hud-dim/60">
        {t("tree.year")}
      </span>
    </div>
  );
}

function ZoomControls() {
  const { zoomIn, zoomOut, setViewport } = useReactFlow();
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
        onClick={() => setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 300 })}
      >
        ⌂
      </button>
    </div>
  );
}
