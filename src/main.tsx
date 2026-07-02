import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "./providers/QueryProvider";
import App from "./App";
import "./style.css";
// @ts-expect-error - no types for fontsource
import "@fontsource/inter";
// @ts-expect-error - no types for fontsource
import "@fontsource/fira-code";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
);
