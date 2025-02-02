import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface BarberRouteProps {
  children: React.ReactNode;
}

export default function BarberRoute({ children }: BarberRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.Osztaly !== "Barber") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
