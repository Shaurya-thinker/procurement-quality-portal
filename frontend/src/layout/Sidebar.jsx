import { Link } from "react-router-dom";
import { getRole, logout } from "../auth/auth";

export default function Sidebar() {
  const role = getRole();

  return (
    <aside>
      <h3>Portal</h3>

      {role === "procurement" && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/apply-leave">Apply Leave</Link>
          <Link to="/procurement">Purchase Orders</Link>
        </>
      )}

      {role === "quality" && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/apply-leave">Apply Leave</Link>
          <Link to="/quality">Material Receipt</Link>
        </>
      )}

      {role === "store" && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/apply-leave">Apply Leave</Link>
          <Link to="/store">Stores</Link>
          <Link to="/store/dispatches">Material Dispatches</Link>
        </>
      )}

      <button onClick={logout}>Logout</button>
    </aside>
  );
}
