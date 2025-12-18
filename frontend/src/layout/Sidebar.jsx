import { Link } from "react-router-dom";
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
          <Link to="/quality">Material Receipt</Link>
        </>
      )}

      {role === "store" && (
        <>
          <Link to="/store">Stores</Link>
        </>
      )}

      <button onClick={logout}>Logout</button>
    </aside>
  );
}
