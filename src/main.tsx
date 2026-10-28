import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { AppRouter } from "./app/router/index.tsx";
import App from "./app/App.tsx";
import { GlobalStyles } from "./app/global.ts";

const root = document.getElementById("root")

if (!root) {
    throw new Error("Root element not found!");
    
}



ReactDOM.createRoot(root).render(
    <React.StrictMode>
    <BrowserRouter>
      <GlobalStyles/>
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>
)