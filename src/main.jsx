import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#18181B",
          color: "#FAFAFA",
          fontSize: "13px",
          fontFamily: "Inter, sans-serif",
          borderRadius: "8px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: {
            primary: "#22C55E",
            secondary: "#18181B",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "#18181B",
          },
        },
      }}
    />
  </StrictMode>
);