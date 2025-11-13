"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUsername: (
    newUsername: string,
    currentPassword: string
  ) => Promise<boolean>;
  updateEmail: (newEmail: string, currentPassword: string) => Promise<boolean>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_CREDENTIALS = {
  username: "admin",
  password: "admin123",
  email: "admin@herbful.com",
};

const AUTH_STORAGE_KEY = "herbful_admin_auth";
const CREDENTIALS_STORAGE_KEY = "herbful_admin_credentials";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize credentials in localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(
          CREDENTIALS_STORAGE_KEY,
          JSON.stringify(DEFAULT_CREDENTIALS)
        );
      }
    } catch (error) {
      console.error("Failed to initialize credentials:", error);
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const authData = JSON.parse(stored);
          const expiresAt = new Date(authData.expiresAt);

          if (expiresAt > new Date()) {
            setUser(authData.user);
          } else {
            // Session expired
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect logic
  useEffect(() => {
    if (isLoading) return;

    const publicRoutes = [
      "/admin/login",
      "/admin/forgot-password",
      "/admin/reset-password",
    ];
    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!user && !isPublicRoute) {
      // Not logged in and trying to access protected route
      router.push("/admin/login");
    } else if (user && pathname === "/admin/login") {
      // Logged in but on login page
      router.push("/admin");
    }
  }, [user, pathname, isLoading, router]);

  const login = async (
    usernameOrEmail: string,
    password: string
  ): Promise<boolean> => {
    try {
      // Get current credentials from localStorage, with fallback to defaults
      let credentials = DEFAULT_CREDENTIALS;
      try {
        const stored = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
        if (stored) {
          credentials = JSON.parse(stored);
        }
      } catch (storageError) {
        console.warn(
          "Could not access localStorage, using default credentials:",
          storageError
        );
        credentials = DEFAULT_CREDENTIALS;
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Normalize and validate inputs
      const normalizedInput = usernameOrEmail.trim().toLowerCase();
      const normalizedPassword = password.trim();

      // Debug logging
      console.log("Login attempt with:", {
        inputLength: normalizedInput.length,
        passwordLength: normalizedPassword.length,
        storedUsername: credentials.username,
        storedEmail: credentials.email,
      });

      // Check if input matches username or email
      const isUsernameMatch =
        normalizedInput === credentials.username.toLowerCase();
      const isEmailMatch = normalizedInput === credentials.email.toLowerCase();
      const isPasswordMatch = normalizedPassword === credentials.password;

      console.log("Match results:", {
        usernameMatch: isUsernameMatch,
        emailMatch: isEmailMatch,
        passwordMatch: isPasswordMatch,
      });

      if ((isUsernameMatch || isEmailMatch) && isPasswordMatch) {
        const userData: User = {
          username: credentials.username,
          email: credentials.email,
        };

        // Create session with 24-hour expiration
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const authData = {
          user: userData,
          expiresAt: expiresAt.toISOString(),
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
        setUser(userData);
        console.log("Login successful");
        return true;
      }

      console.log("Login failed: credentials do not match");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    router.push("/admin/login");
  };

  const updateUsername = async (
    newUsername: string,
    currentPassword: string
  ): Promise<boolean> => {
    try {
      const stored = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
      const credentials = stored ? JSON.parse(stored) : DEFAULT_CREDENTIALS;

      // Verify current password
      if (currentPassword !== credentials.password) {
        return false;
      }

      // Update credentials
      const updatedCredentials = {
        ...credentials,
        username: newUsername,
      };

      localStorage.setItem(
        CREDENTIALS_STORAGE_KEY,
        JSON.stringify(updatedCredentials)
      );

      // Force logout to re-login with new credentials
      logout();
      return true;
    } catch (error) {
      console.error("Update username error:", error);
      return false;
    }
  };

  const updateEmail = async (
    newEmail: string,
    currentPassword: string
  ): Promise<boolean> => {
    try {
      const stored = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
      const credentials = stored ? JSON.parse(stored) : DEFAULT_CREDENTIALS;

      // Verify current password
      if (currentPassword !== credentials.password) {
        return false;
      }

      // Update credentials
      const updatedCredentials = {
        ...credentials,
        email: newEmail,
      };

      localStorage.setItem(
        CREDENTIALS_STORAGE_KEY,
        JSON.stringify(updatedCredentials)
      );

      // Update user in current session
      setUser({
        username: credentials.username,
        email: newEmail,
      });

      // Update auth storage if user is logged in
      const authStored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (authStored) {
        const authData = JSON.parse(authStored);
        authData.user.email = newEmail;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      }

      return true;
    } catch (error) {
      console.error("Update email error:", error);
      return false;
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      const stored = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
      const credentials = stored ? JSON.parse(stored) : DEFAULT_CREDENTIALS;

      // Verify current password
      if (currentPassword !== credentials.password) {
        return false;
      }

      // Update credentials
      const updatedCredentials = {
        ...credentials,
        password: newPassword,
      };

      localStorage.setItem(
        CREDENTIALS_STORAGE_KEY,
        JSON.stringify(updatedCredentials)
      );

      // Force logout to re-login with new password
      logout();
      return true;
    } catch (error) {
      console.error("Update password error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUsername,
        updateEmail,
        updatePassword,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AdminAuthProvider");
  }
  return context;
}
