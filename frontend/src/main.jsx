import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppRoutes from "./routes/AppRoutes";
import { AnnouncementsProvider } from "./quality/context/AnnouncementsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AnnouncementsProvider>
        <AppRoutes />
      </AnnouncementsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
