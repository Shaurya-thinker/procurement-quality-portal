import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../auth/Login";
import ProtectedRoute from "../auth/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Attendance from "../pages/Attendance";
import Profile from "../pages/Profile";
import ApplyLeave from "../pages/ApplyLeave";
import LeaveHistory from "../pages/LeaveHistory";;
import QualityGatePass from "../quality/pages/QualityGatePass";
import Resignation from "../pages/Resignation";
import POList from "../procurement/pages/POList";
import CreatePO from "../procurement/pages/CreatePO";
import PODetails from "../procurement/pages/PODetails";
import MaterialReceipt from "../quality/pages/MaterialReceipt";
import Inspection from "../quality/pages/Inspection";
import QualityReport from "../quality/pages/QualityReport";
import Announcements from "../quality/pages/Announcements";
import Stores from "../store/pages/Stores";
import StoreDetail from "../store/pages/StoreDetail";
import Inventory from "../store/pages/Inventory";
import DispatchList from "../store/pages/DispatchList";
import CreateDispatch from "../store/pages/CreateDispatch";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Main Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
      <Route path="/apply-leave" element={<ProtectedRoute><ApplyLeave /></ProtectedRoute>} />
      <Route path="/leave-history" element={<ProtectedRoute><LeaveHistory /></ProtectedRoute>} />
      <Route path="/resignation" element={<ProtectedRoute><Resignation /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Procurement Routes */}
      <Route path="/procurement" element={<ProtectedRoute><POList /></ProtectedRoute>} />
      <Route path="/procurement/create" element={<ProtectedRoute><CreatePO /></ProtectedRoute>} />
      <Route path="/procurement/:id" element={<ProtectedRoute><PODetails /></ProtectedRoute>} />
      <Route path="/procurement/:id/edit" element={<ProtectedRoute><CreatePO /></ProtectedRoute>}/>

      {/* Quality Routes */}
      <Route path="/quality" element={<ProtectedRoute><MaterialReceipt /></ProtectedRoute>} />
      <Route path="/quality/inspection/:mrNumber" element={<ProtectedRoute><Inspection /></ProtectedRoute>} />
      <Route path="/quality/gate-pass/:inspectionId" element={<ProtectedRoute><QualityGatePass /></ProtectedRoute>}/>
      <Route path="/quality/report/:inspectionId" element={<ProtectedRoute><QualityReport /></ProtectedRoute>} />
      <Route path="/quality/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
      <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />


      {/* Store Routes */}
      <Route path="/store" element={<ProtectedRoute><Stores /></ProtectedRoute>} />
      <Route path="/store/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/store/dispatches" element={<ProtectedRoute><DispatchList /></ProtectedRoute>} />
      <Route path="/store/dispatch/create" element={<ProtectedRoute><CreateDispatch /></ProtectedRoute>} />
      <Route path="/store/:storeId" element={<ProtectedRoute><StoreDetail /></ProtectedRoute>} />
    </Routes>
  );
}
