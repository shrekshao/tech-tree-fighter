import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { useUIStore } from "@/state/store";
import App from "@/App";
import "@/index.css";

// 持久化的语言选择同步到 i18next
void i18n.changeLanguage(useUIStore.getState().locale);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </BrowserRouter>
  </StrictMode>,
);
