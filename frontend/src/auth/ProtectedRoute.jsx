import { Navigate } from "react-router-dom";
import { getRole } from "./auth";

export default function ProtectedRoute({ allow, children }) {
  const role = getRole();

  if (!role) return <Navigate to="/login" replace />;
  if (!allow.includes(role)) return <Navigate to="/login" replace />;

  return children;
}
