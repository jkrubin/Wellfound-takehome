import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import { User, UserResponse } from "./types";
import { useApi } from "../index";
interface LoginParams {
  email: string;
  password: string;
}
export type AuthContextType = {
  user: User | null;
  login: (auth: LoginParams) => Promise<void>;
  register: (auth: LoginParams) => Promise<void>;
  logout: () => void;
  token: string | null;
  isAuth: "TRUE" | "FALSE" | "PENDING";
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<"TRUE" | "FALSE" | "PENDING">("PENDING");
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const api = useApi();
  useEffect(() => {
    setIsAuth("PENDING");
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser ? JSON.parse(savedUser) : null);
      setIsAuth("TRUE");
    } else {
      setIsAuth("FALSE");
    }
  }, []);

  useEffect(() => {
    if (token && user) {
      console.log("authed");
      setIsAuth("TRUE");
    }
  }, [token, user]);

  const login = async ({ email, password }: LoginParams) => {
    try {
      const response = await api.fetchAPI<UserResponse>(`auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const { user, jwt } = response;
      setUser(user);
      setToken(jwt);
      localStorage.setItem("token", jwt);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      throw err;
    }
  };

  const register = async ({ email, password }: LoginParams) => {
    try {
      const response = await api.fetchAPI<UserResponse>(`auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const { user, jwt } = response;
      setUser(user);
      setToken(jwt);
    } catch (err) {
      throw err;
    }
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuth("FALSE");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, token, isAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
