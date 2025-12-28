import { NavLink } from "react-router-dom";
import { getRole, logout } from "../auth/auth";

export default function Sidebar() {
  const role = getRole();

  return (
    <aside>
      <h3>Portal</h3>

      {role === "procurement" && (
        <>
          <Link to="/procurement">Purchase Orders</Link>
        </>
      )}

      {role === "quality" && (
        <>
          <NavLink to="/quality">Material Receipt</NavLink>
          <NavLink to="/announcements">Announcements</NavLink>
        </>
      )}

      {role === "store" && (
        <>
          <Link to="/store">Stores</Link>
          <Link to="/store/dispatches">Material Dispatches</Link>
        </>
      )}

      <button onClick={logout}>Logout</button>
    </aside>
  );
}
