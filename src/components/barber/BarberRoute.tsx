import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface BarberRouteProps {
  children: React.ReactNode;
}

export default function BarberRoute({ children }: BarberRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user?.Osztaly !== "Barber") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
