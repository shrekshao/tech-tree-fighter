import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import type { CSSProperties } from "react";
import { useUIStore } from "@/state/store";
import { useEditStore } from "@/state/editStore";
import { useDataset } from "@/data/loader";
import { Header } from "@/components/layout/Header";
import { TabBar } from "@/components/layout/TabBar";
import { Footer } from "@/components/layout/Footer";
import { ErrorPanel } from "@/components/layout/ErrorPanel";
import { TreeCanvas } from "@/components/tree/TreeCanvas";
import { NodeModal } from "@/components/nodes/NodeModal";

const DEFAULT_ACCENT = "#4dd6ff";

export default function App() {
  const locale = useUIStore((s) => s.locale);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [locale, i18n]);

  const [params, setParams] = useSearchParams();
  const { data: dataset, error } = useDataset();
  const editMode = useEditStore((s) => s.mode);
  const editedTrees = useEditStore((s) => s.trees);
  const setTree = useEditStore((s) => s.setTree);

  const tabs = dataset?.tabs ?? [];
  const requestedTab = params.get("tab");
  const tabId = tabs.some((t) => t.id === requestedTab)
    ? (requestedTab as string)
    : tabs[0]?.id;
  const tab = tabs.find((t) => t.id === tabId);
  // 编辑中树覆盖原始数据(拖卡片/改连线都写进这里)
  const treeOverride = tabId ? editedTrees[tabId] : undefined;
  const tabWithTree = tab && treeOverride ? { ...tab, tree: treeOverride } : tab;
  const nodeId = params.get("node");
  const node =
    tabWithTree && nodeId ? tabWithTree.tree.nodes.find((n) => n.id === nodeId) : undefined;
  const accent = tab?.accent ?? dataset?.meta.accent ?? DEFAULT_ACCENT;

  const openNode = (id: string) => {
    setParams(
      (p) => {
        p.set("tab", tabId as string);
        p.set("node", id);
        return p;
      },
      { replace: true },
    );
  };
  const closeNode = () => {
    setParams(
      (p) => {
        p.delete("node");
        return p;
      },
      { replace: true },
    );
  };
  const selectTab = (id: string) => {
    setParams(
      (p) => {
        p.set("tab", id);
        p.delete("node");
        return p;
      },
      { replace: true },
    );
  };

  return (
    <div
      className="scanlines flex h-screen flex-col"
      style={{ "--color-accent": accent } as CSSProperties}
    >
      <Header dataset={dataset} />
      {dataset && <TabBar tabs={tabs} activeId={tabId} onSelect={selectTab} />}
      <main className="relative min-h-0 flex-1">
        {error ? (
          <ErrorPanel message={error} />
        ) : !tabWithTree ? (
          <div className="p-8 text-xs tracking-[0.3em] text-hud-dim">
            {t("app.loading")}
          </div>
        ) : (
          <TreeCanvas
            key={tabWithTree.id}
            tab={tabWithTree}
            accent={accent}
            selectedNodeId={node?.id}
            editMode={editMode}
            onTreeChange={(tree) => setTree(tabWithTree.id, tree)}
            onSelectNode={openNode}
          />
        )}
      </main>
      {node && tabWithTree && (
        <NodeModal node={node} tab={tabWithTree} accent={accent} onSelect={openNode} onClose={closeNode} />
      )}
      <Footer />
    </div>
  );
}
