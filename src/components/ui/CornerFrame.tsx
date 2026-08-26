import { cn } from "@/lib/cn";

/** HUD 四角括号边框 */
export function CornerFrame({ className }: { className?: string }) {
  const c = "absolute h-2.5 w-2.5 border-accent/80";
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      <span className={cn(c, "left-0 top-0 border-l border-t")} />
      <span className={cn(c, "right-0 top-0 border-r border-t")} />
      <span className={cn(c, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(c, "bottom-0 right-0 border-b border-r")} />
    </div>
  );
}
