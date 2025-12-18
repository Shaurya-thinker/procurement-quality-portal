import { Navigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

const getRole = () => localStorage.getItem("role");

export default function ProtectedRoute({ children }) {
  const role = getRole();
  if (!role) {
    return <Navigate to="/login" />;
  }
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
