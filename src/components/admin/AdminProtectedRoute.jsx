import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "@/lib/AdminAuthContext";

export default function AdminProtectedRoute() {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}