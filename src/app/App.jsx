import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../shared/layouts/MainLayout";
import AuthLayout from "../shared/layouts/AuthLayout";
import ProtectedRoute from "../shared/components/ProtectedRoute";

import LoginPage from "../features/auth/LoginPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import ReviewsPage from "../features/reviews/ReviewsPage";
import BusinessesPage from "../features/businesses/BusinessesPage";
import AnalyticsPage from "../features/analytics/AnalyticsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/businesses" element={<BusinessesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: "center", marginTop: "4rem" }}>
              <h1>404 — Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}