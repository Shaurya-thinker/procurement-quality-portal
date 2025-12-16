import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";

import Login from "../pages/Login";

// layout pages
import ProcurementHome from "../pages/procurement/ProcurementHome";
import QualityHome from "../pages/quality/QualityHome";
import StoreHome from "../pages/store/StoreHome";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/procurement/*"
        element={
          <ProtectedRoute allow={["procurement"]}>
            <ProcurementHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quality/*"
        element={
          <ProtectedRoute allow={["quality"]}>
            <QualityHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/store/*"
        element={
          <ProtectedRoute allow={["store"]}>
            <StoreHome />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
