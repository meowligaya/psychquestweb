import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Start with null or fetch from localStorage:
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  const updateProfile = async (form) => {
    // Call API to update profile, or just update locally
    const updated = { ...(user || {}), ...form };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    // Optionally show a toast notification
  };

  return (
    <AuthContext.Provider value={{ user, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}