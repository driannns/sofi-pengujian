import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

const PrivateRoutes = ({ role }) => {
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
