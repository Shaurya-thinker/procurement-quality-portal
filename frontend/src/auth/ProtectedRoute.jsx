import { Navigate } from "react-router-dom";

const getRole = () => localStorage.getItem("role");

export default function ProtectedRoute({ allow, children }) {
  const role = getRole();
  if (!role || !allow.includes(role)) {
    return <Navigate to="/login" />;
  }
  return children;
}
