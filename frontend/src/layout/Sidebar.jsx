import { Link } from "react-router-dom";
import { getRole, logout } from "../auth/auth";

export default function Sidebar() {
  const role = getRole();

  return (
    <aside className="sidebar-compact">
  <h3 style={{ fontSize: 18, marginBottom: 16 }}>Portal</h3>

      {/* Always visible */}
      <Link className="sidebar-link" to="/dashboard">
        Dashboard
      </Link>

      <Link className="sidebar-link" to="/apply-leave">
        Apply Leave
      </Link>

      <Link className="sidebar-link" to="/announcements">
        Announcements
      </Link>

      {/* Role based */}
      {role === "procurement" && (
        <>
          <Link className="sidebar-link" to="/procurement">
            Purchase Orders
          </Link>
        </>
      )}

      {role === "quality" && (
        <>
          <Link className="sidebar-link" to="/quality">
            Material Receipt
          </Link>
        </>
      )}

      {role === "store" && (
        <>
          <Link className="sidebar-link" to="/store">
            Stores
          </Link>
          <Link className="sidebar-link" to="/store/dispatches">
            Material Dispatches
          </Link>
        </>
      )}

      <button
        className="sidebar-link"
        style={{ marginTop: 16 }}
        onClick={logout}
      >
        Logout
      </button>
    </aside>
  );
}
