import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";

import Login from "../auth/Login";

// layout pages
import POList from "../procurement/pages/POList";
import MaterialReceipt from "../quality/pages/MaterialReceipt";
import Inventory from "../store/pages/Inventory";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/procurement"
        element={
          <ProtectedRoute allow={["procurement"]}>
            <POList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quality"
        element={
          <ProtectedRoute allow={["quality"]}>
            <MaterialReceipt />
          </ProtectedRoute>
        }
      />

      <Route
        path="/store"
        element={
          <ProtectedRoute allow={["store"]}>
            <Inventory />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
