import { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types/user";
import {
  login as loginAPI,
  fetchUserData,
  initializeAuth,
} from "../api/apiService";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("userToken") !== null
  );
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      console.log("Refreshing user data...");
      const token = localStorage.getItem("userToken");
      if (token) {
        const response = await fetchUserData();
        console.log("Refresh user response:", response.data);
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      // If we get an error, the token might be invalid
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Initialize user data on mount if token exists
  useEffect(() => {
    const initializeAuthData = async () => {
      try {
        console.log("Initializing auth...");
        const token = localStorage.getItem("userToken");
        if (token) {
          console.log("Token found, initializing auth...");
          initializeAuth(); // Initialize axios headers with token
          await refreshUser();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuthData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginAPI(email, password);
      localStorage.setItem("userToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setIsAuthenticated(true);
      setUser(response.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, refreshUser, isLoading }}
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
