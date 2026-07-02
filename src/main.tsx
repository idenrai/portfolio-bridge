import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "./providers/QueryProvider";
import App from "./App";
import "./index.css";
// @ts-ignore
import "@fontsource/inter";
// @ts-ignore
import "@fontsource/fira-code";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
);
