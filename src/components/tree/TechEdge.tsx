import {
  BaseEdge,
  getBezierPath,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";
import type { LinkData } from "@/schema";

export interface TechEdgeData extends Record<string, unknown> {
  link: LinkData;
}

/** 自定义连线:HUD 风格,直连为默认。标签由内置 EdgeLabel 渲染(见 TreeCanvas)。 */
export function TechEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
  markerStart,
  markerEnd,
}: EdgeProps) {
  const link = (data as TechEdgeData | undefined)?.link;
  let d: string;
  if (!link?.path || link.path === "straight") {
    d = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
  } else if (link.path === "smoothstep") {
    [d] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  } else {
    [d] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  }

  return (
    <BaseEdge id={id} path={d} style={style} markerStart={markerStart} markerEnd={markerEnd} />
  );
}
