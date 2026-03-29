import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";
import { CookiesProvider } from "react-cookie";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <AppRouter />
      <Toaster richColors />
    </CookiesProvider>
  </StrictMode>,
);
