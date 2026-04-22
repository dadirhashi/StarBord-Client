import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

export default function AuthLayout() {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <Outlet />
    </div>
  );
}