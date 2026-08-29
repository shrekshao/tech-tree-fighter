import { useRef, useState } from "react";
import { stringify } from "yaml";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { useEditStore } from "@/state/editStore";
import { parseTreeFileText, type LoadedTab } from "@/data/loader";
import type { EdgeStyle, TreeData } from "@/schema";

/**
 * 编辑模式浮动工具条(测试版):
 * - EDIT:切换编辑模式
 * - SERIALIZE:当前 tab 的编辑中树序列化为 YAML 下载
 * - LOAD YAML:从本地文件加载单棵树文件(与内置数据同一校验管线)
 * - 选中连线后:切换样式(solid/dashed/dotted)/ 删除
 */

interface Props {
  tab: LoadedTab;
  selectedEdgeId: string | null;
  onTreeChange: (tree: TreeData) => void;
  onClearEdgeSelection: () => void;
}

const EDGE_STYLES = ["solid", "dashed", "dotted"] as const;

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/yaml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function EditToolbar({
  tab,
  selectedEdgeId,
  onTreeChange,
  onClearEdgeSelection,
}: Props) {
  const { t } = useTranslation();
  const mode = useEditStore((s) => s.mode);
  const setMode = useEditStore((s) => s.setMode);
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);

  const selectedEdge = selectedEdgeId
    ? tab.tree.links.find((l) => `${l.from}->${l.to}` === selectedEdgeId)
    : undefined;

  const serialize = () => {
    const text = stringify({ tree: tab.tree }, { lineWidth: 0 });
    downloadText(`${tab.id}.edited.yaml`, text);
    setStatus(t("edit.serialized"));
  };

  const onLoadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // 允许连续选择同一文件
    if (!file) return;
    try {
      const text = await file.text();
      const tree = parseTreeFileText(text, file.name);
      onTreeChange(tree);
      setStatus(t("edit.loaded"));
    } catch (err) {
      setStatus(
        `${t("edit.loadFailed")}\n${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const setEdgeStyle = (style: EdgeStyle) => {
    if (!selectedEdge) return;
    onTreeChange({
      ...tab.tree,
      links: tab.tree.links.map((l) => (l === selectedEdge ? { ...l, style } : l)),
    });
  };

  const removeEdge = () => {
    if (!selectedEdge) return;
    onTreeChange({
      ...tab.tree,
      links: tab.tree.links.filter((l) => l !== selectedEdge),
    });
    onClearEdgeSelection();
  };

  return (
    <div className="pointer-events-none absolute right-3 top-3 z-10 flex flex-col items-end gap-1">
      <div className="pointer-events-auto flex gap-1">
        <button
          className={cn(
            "hud-btn h-8 w-auto px-3 text-[10px] tracking-[0.25em]",
            mode && "locale-btn-active",
          )}
          onClick={() => setMode(!mode)}
        >
          {mode ? t("edit.exit") : t("edit.toggle")}
        </button>
        {mode && (
          <>
            <button
              className="hud-btn h-8 w-auto px-3 text-[10px] tracking-[0.25em]"
              onClick={serialize}
            >
              {t("edit.serialize")}
            </button>
            <button
              className="hud-btn h-8 w-auto px-3 text-[10px] tracking-[0.25em]"
              onClick={() => fileRef.current?.click()}
            >
              {t("edit.load")}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".yaml,.yml,.json"
              className="hidden"
              onChange={onLoadFile}
            />
          </>
        )}
      </div>
      {mode && selectedEdge && (
        <div className="pointer-events-auto flex items-center gap-1 border border-hud-line bg-hud-panel/95 px-2 py-1">
          <span className="text-[9px] uppercase tracking-[0.3em] text-hud-dim">
            {t("edit.edge")}
          </span>
          {EDGE_STYLES.map((s) => (
            <button
              key={s}
              className={cn(
                "hud-btn h-6 w-auto px-2 text-[9px] tracking-widest",
                selectedEdge.style === s && "locale-btn-active",
              )}
              onClick={() => setEdgeStyle(s)}
            >
              {t(`edit.style.${s}`)}
            </button>
          ))}
          <button
            className="hud-btn h-6 w-auto px-2 text-[9px] tracking-widest text-hud-red"
            onClick={removeEdge}
          >
            {t("edit.remove")}
          </button>
        </div>
      )}
      {mode && (
        <div className="pointer-events-auto max-w-xs whitespace-pre-wrap border border-hud-line bg-hud-panel/95 px-2 py-1 text-[9px] tracking-[0.2em] text-hud-dim">
          {status ?? t("edit.hint")}
        </div>
      )}
    </div>
  );
}
