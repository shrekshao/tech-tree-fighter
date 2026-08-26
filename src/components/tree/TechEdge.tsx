import { BaseEdge, type EdgeProps } from "@xyflow/react";
import { CARD_H } from "@/data/resolve";

export interface TechEdgeData extends Record<string, unknown> {
  /** 水平段相对源节点底部的下探距离(TreeCanvas 按出边序号错开) */
  drop: number;
}

/**
 * 自定义连线:仅直角折线(orthogonal)。
 *
 * - 同列:源底 → 目标顶的垂直直线
 * - 跨列且目标顶低于肘部:源底 → 下探 → 水平 → 下探进入目标顶
 * - 跨列且目标过高:绕过目标下缘,从下方进入目标底(箭头朝上指入)
 *
 * 所有线段都位于卡片行外的间隙中,不会压过卡片本体。
 */
export function TechEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  style,
  markerStart,
  markerEnd,
}: EdgeProps) {
  const drop = (data as TechEdgeData | undefined)?.drop ?? 14;
  const elbowY = sourceY + drop;

  let d: string;
  if (Math.abs(sourceX - targetX) < 1) {
    // 同列:垂直直线(防重叠布局保证目标顶在源底之下)
    d = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
  } else if (targetY >= elbowY) {
    // 目标在肘部之下:进入目标上缘
    d = `M ${sourceX},${sourceY} L ${sourceX},${elbowY} L ${targetX},${elbowY} L ${targetX},${targetY}`;
  } else {
    // 目标过高(年份接近且跨列):绕到目标下方,从底部进入
    const bottomY = Math.max(elbowY, targetY + CARD_H + 12);
    d = `M ${sourceX},${sourceY} L ${sourceX},${bottomY} L ${targetX},${bottomY} L ${targetX},${targetY + CARD_H}`;
  }

  return (
    <BaseEdge id={id} path={d} style={style} markerStart={markerStart} markerEnd={markerEnd} />
  );
}
