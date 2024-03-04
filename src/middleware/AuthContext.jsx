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
const loginUrl = "http://127.0.0.1:8000";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [roles, setRoles] = useState();
  const [cookies, setCookies, removeCookie] = useCookies();
  const navigate = useNavigate();
  const expirationDate = new Date(new Date().getTime() + 60 * 60 * 1000);

  const login = async (username, password) => {
    try {
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
    }
  };

  const logout = () => {
    removeCookie("auth-token");
    setIsLoggedIn(false);
    navigate("/loginsso");
  };

  useEffect(() => {
    const token = cookies["auth-token"];
    if (token) {
      const jwtDecoded = jwtDecode(cookies["auth-token"]);
      setRoles(jwtDecoded.role);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      setIsLoggedIn(true);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      removeCookie("auth-token");
      setIsLoggedIn(false);
    }
  }, [cookies["auth-token"]]);

  const contextValue = useMemo(() => ({
    roles,
    isLoggedIn,
    login,
    logout,
  }));

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
