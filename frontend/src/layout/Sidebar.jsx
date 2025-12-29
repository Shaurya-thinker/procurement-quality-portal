import { Link } from "react-router-dom";
import { getRole, logout } from "../auth/auth";

export default function Sidebar() {
  const role = getRole();

  return (
    <aside className="sidebar-compact">
      <h3 style={{ fontSize: 18, marginBottom: 16 }}>Portal</h3>
      {/* Always-visible Announcements link */}
      <Link className="sidebar-link" to="/announcements">Announcements</Link>
      {role === "procurement" && (
        <>
<<<<<<< HEAD
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/apply-leave">Apply Leave</Link>
          <Link to="/procurement">Purchase Orders</Link>
=======
          <Link className="sidebar-link" to="/dashboard">Dashboard</Link>
          <Link className="sidebar-link" to="/apply-leave">Apply Leave</Link>
          <Link className="sidebar-link" to="/procurement">Purchase Orders</Link>
          <Link className="sidebar-link" to="/announcements">Announcements</Link>
>>>>>>> 308545638b080213daaf91faec07e10dd3f2ba32
        </>
      )}
      {role === "quality" && (
        <>
<<<<<<< HEAD
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/apply-leave">Apply Leave</Link>
          <Link to="/quality">Material Receipt</Link>
=======
          <Link className="sidebar-link" to="/dashboard">Dashboard</Link>
          <Link className="sidebar-link" to="/apply-leave">Apply Leave</Link>
          <Link className="sidebar-link" to="/quality">Material Receipt</Link>
          <Link className="sidebar-link" to="/announcements">Announcements</Link>
>>>>>>> 308545638b080213daaf91faec07e10dd3f2ba32
        </>
      )}
      {role === "store" && (
        <>
<<<<<<< HEAD
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/apply-leave">Apply Leave</Link>
          <Link to="/store">Stores</Link>
          <Link to="/store/dispatches">Material Dispatches</Link>
=======
          <Link className="sidebar-link" to="/dashboard">Dashboard</Link>
          <Link className="sidebar-link" to="/apply-leave">Apply Leave</Link>
          <Link className="sidebar-link" to="/store">Stores</Link>
          <Link className="sidebar-link" to="/store/dispatches">Material Dispatches</Link>
          <Link className="sidebar-link" to="/announcements">Announcements</Link>
>>>>>>> 308545638b080213daaf91faec07e10dd3f2ba32
        </>
      )}
      <button className="sidebar-link" style={{ marginTop: 16 }} onClick={logout}>Logout</button>
    </aside>
  );
}
