import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import StatusPage from "./pages/Status";
import "./index.css";

const container = document.getElementById("root")!;
createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/status/404" element={<StatusPage code={404} />} />
        <Route path="/status/410" element={<StatusPage code={410} />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


