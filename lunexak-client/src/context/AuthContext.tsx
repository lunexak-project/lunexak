"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { authService } from "@/services";

type Role = "customer" | "employee" | "admin" | "visitor";

interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isVisitor: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (token: string, isMock?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginAsVisitor: () => void;
  isAdmin: boolean;
  isEmployee: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisitor, setIsVisitor] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedVisitor = localStorage.getItem("isVisitor");
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    } else if (storedVisitor === "true") {
      setIsVisitor(true);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authService.login(email, password);
    // Server returns `accessToken` field
    const userData = data.user;
    const accessToken = data.accessToken;
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", accessToken);
    setUser(userData);
    setToken(accessToken);
  }, []);

  const loginWithGoogle = useCallback(async (credential: string, isMock: boolean = false) => {
    const data = await authService.googleLogin(credential, isMock);
    const userData = data.user;
    const accessToken = data.accessToken;
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", accessToken);
    setUser(userData);
    setToken(accessToken);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    // Register just creates the account — then login to get the token
    await authService.register(name, email, password);
    const data = await authService.login(email, password);
    const userData = data.user;
    const accessToken = data.accessToken;
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", accessToken);
    setUser(userData);
    setToken(accessToken);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isVisitor");
    setUser(null);
    setToken(null);
    setIsVisitor(false);
  }, []);

  const loginAsVisitor = useCallback(() => {
    localStorage.setItem("isVisitor", "true");
    setIsVisitor(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isVisitor,
        login,
        loginWithGoogle,
        register,
        logout,
        loginAsVisitor,
        isAdmin: user?.role === "admin",
        isEmployee: user?.role === "employee" || user?.role === "admin",
        isCustomer: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};