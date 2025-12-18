import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../auth/Login";
import ProtectedRoute from "../auth/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Attendance from "../pages/Attendance";
import Profile from "../pages/Profile";
import POList from "../procurement/pages/POList";
import CreatePO from "../procurement/pages/CreatePO";
import PODetails from "../procurement/pages/PODetails";
import MaterialReceipt from "../quality/pages/MaterialReceipt";
import Inspection from "../quality/pages/Inspection";
import QualityReport from "../quality/pages/QualityReport";
import Stores from "../store/pages/Stores";
import StoreDetail from "../store/pages/StoreDetail";
import Inventory from "../store/pages/Inventory";
import Dispatch from "../store/pages/Dispatch";
import DispatchList from "../store/pages/DispatchList";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Main Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Procurement Routes */}
      <Route path="/procurement" element={<ProtectedRoute><POList /></ProtectedRoute>} />
      <Route path="/procurement/create" element={<ProtectedRoute><CreatePO /></ProtectedRoute>} />
      <Route path="/procurement/:id" element={<ProtectedRoute><PODetails /></ProtectedRoute>} />

      {/* Quality Routes */}
      <Route path="/quality" element={<ProtectedRoute><MaterialReceipt /></ProtectedRoute>} />
      <Route path="/quality/inspection" element={<ProtectedRoute><Inspection /></ProtectedRoute>} />
      <Route path="/quality/report" element={<ProtectedRoute><QualityReport /></ProtectedRoute>} />

      {/* Store Routes */}
      <Route path="/store" element={<ProtectedRoute><Stores /></ProtectedRoute>} />
      <Route path="/store/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/store/dispatch" element={<ProtectedRoute><Dispatch /></ProtectedRoute>} />
      <Route path="/store/dispatch-list" element={<ProtectedRoute><DispatchList /></ProtectedRoute>} />
      <Route path="/store/:storeId" element={<ProtectedRoute><StoreDetail /></ProtectedRoute>} />
    </Routes>
  );
}
