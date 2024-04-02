import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const loginUrl = "https://sofi.my.id";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roles, setRoles] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [cookies, setCookies, removeCookie] = useCookies();
  const navigate = useNavigate();
  const expirationDate = new Date(new Date().getTime() + 120 * 60 * 1000);

  const clearLocalStorage = () => {
    localStorage.removeItem("persist:root");
    localStorage.removeItem("errorMessage");
    localStorage.removeItem("warningMessage");
    localStorage.removeItem("successMessage");
  };

  const login = async (username, password) => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${loginUrl}/api/login`, {
        username,
        password,
      });

      if (res.data.status >= 200 && res.data.status < 300) {
        setCookies("auth-token", res.data.token, {
          expires: expirationDate,
          path: "/",
        });
        setIsLoggedIn(true);
        navigate("/home");
        window.location.reload();
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    clearLocalStorage();
    removeCookie("auth-token");
    navigate("/loginsso");
  };

  useEffect(() => {
    const token = cookies["auth-token"];
    if (token) {
      setIsLoggedIn(true);
      const jwtDecoded = jwtDecode(cookies["auth-token"]);
      setRoles(jwtDecoded.role);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
      setIsLoggedIn(false);
      delete axios.defaults.headers.common["Authorization"];
      clearLocalStorage();
      removeCookie("auth-token");
    }
  }, [cookies["auth-token"]]);

  const contextValue = useMemo(() => ({
    isLoggedIn,
    roles,
    isLoading,
    login,
    logout,
  }));

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
