import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./AuthContext";
("react");

const PrivateRoutes = ({ role }) => {
  const { isLoggedIn } = useAuth();
  const [cookies] = useCookies();
  let userData;
  if (cookies["auth-token"]) {
    userData = jwtDecode(cookies["auth-token"]);
  }

  return userData?.role?.find((roles) => role?.includes(roles)) ? (
    <Outlet />
  ) : userData ? (
    <Navigate to="/home" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoutes;
