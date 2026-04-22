import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/reviews", label: "Reviews" },
  { to: "/businesses", label: "Businesses" },
  { to: "/analytics", label: "Analytics" },
];

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          background: "#1e293b",
          color: "#fff",
          padding: "1.5rem 1rem",
        }}
      >
        <h2 style={{ marginBottom: "2rem", fontSize: "1.25rem" }}>
          ⭐ StarBoard
        </h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                padding: "0.5rem 0.75rem",
                borderRadius: 6,
                color: isActive ? "#fff" : "#94a3b8",
                background: isActive ? "#334155" : "transparent",
                textDecoration: "none",
                fontWeight: isActive ? 600 : 400,
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <header
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid #e2e8f0",
            gap: "1rem",
          }}
        >
          <span style={{ color: "#64748b" }}>{user?.email}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.4rem 0.9rem",
              borderRadius: 6,
              border: "1px solid #e2e8f0",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "2rem" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}