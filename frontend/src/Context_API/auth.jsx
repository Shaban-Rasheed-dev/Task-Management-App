/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { createContext, useContext } from "react";
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext();
// helper function - token se role nikalne ke liye

const getRoleFormToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch {
    return null;
  }
};
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  // role ko token se hi derive kar rahe hain shuru mein
  const [role, setRole] = useState(
    getRoleFormToken(localStorage.getItem("token")),
  );

  // set token for localstorage
  const storeTokeninLS = (tokenserver) => {
    localStorage.setItem("token", tokenserver);
    setToken(tokenserver);
    setRole(getRoleFormToken(tokenserver)); // naya role bhi set karo
  };

  // get token anywhere
  const getToken = () => {
    return localStorage.getItem("token");
  };

  //logout function
  const logOut = () => {
    setToken("");
    localStorage.removeItem("token");
  };
  return (
    <AuthContext.Provider
      value={{ storeTokeninLS, token, logOut, getToken, role }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
