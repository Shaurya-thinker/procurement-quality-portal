import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";

import Login from "../auth/Login";

// procurement pages
import POList from "../procurement/pages/POList";
import CreatePO from "../procurement/pages/CreatePO";
import PODetails from "../procurement/pages/PODetails";

// quality pages
import MaterialReceipt from "../quality/pages/MaterialReceipt";
import Inspection from "../quality/pages/Inspection";
import QualityReport from "../quality/pages/QualityReport";

// store pages
import Inventory from "../store/pages/Inventory";
import Dispatch from "../store/pages/Dispatch";
import DispatchList from "../store/pages/DispatchList";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
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
        path="/procurement/create"
        element={
          <ProtectedRoute allow={["procurement"]}>
            <CreatePO />
          </ProtectedRoute>
        }
      />

      <Route
        path="/procurement/:id"
        element={
          <ProtectedRoute allow={["procurement"]}>
            <PODetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/procurement/:id/edit"
        element={
          <ProtectedRoute allow={["procurement"]}>
            <CreatePO />
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
        path="/quality/inspection/:mrNumber"
        element={
          <ProtectedRoute allow={["quality"]}>
            <Inspection />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quality/report/:inspectionId"
        element={
          <ProtectedRoute allow={["quality"]}>
            <QualityReport />
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

      <Route
        path="/store/dispatch"
        element={
          <ProtectedRoute allow={["store"]}>
            <Dispatch />
          </ProtectedRoute>
        }
      />

      <Route
        path="/store/dispatches"
        element={
          <ProtectedRoute allow={["store"]}>
            <DispatchList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/store/dispatches/:dispatchId"
        element={
          <ProtectedRoute allow={["store"]}>
            <DispatchList />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
