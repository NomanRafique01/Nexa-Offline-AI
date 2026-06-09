// Entry point
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Global Error Handler
window.addEventListener("error", (e) => {
  if (
    e.message?.includes("BodyStreamBuffer") ||
    e.message?.includes("AbortError")
  ) {
    e.stopImmediatePropagation();
    e.preventDefault();
    return true;
  }
});

// Global Promise Rejection Handler
window.addEventListener("unhandledrejection", (e) => {
  if (
    e.reason?.name === "AbortError" ||
    e.reason?.message?.includes("BodyStreamBuffer") ||
    e.reason?.message?.includes("AbortError")
  ) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
});

// Mount the React application
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance measurement (optional)
reportWebVitals();