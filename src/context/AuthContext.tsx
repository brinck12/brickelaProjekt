import { createContext, useContext, useState } from "react";
import { User } from "../types/user";
import { login as loginAPI, fetchUserData } from "../api/apiService";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("authToken") !== null
  );
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const response = await fetchUserData();
        setUser(response.data);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await loginAPI(email, password);
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
