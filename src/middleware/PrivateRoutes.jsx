import { useNavigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./AuthContext";

const PrivateRoutes = ({ role }) => {
  const { isLoggedIn } = useAuth();
  const [cookies] = useCookies();
  const navigate = useNavigate();
  let userData;
  if (cookies["auth-token"]) {
    userData = jwtDecode(cookies["auth-token"]);
  }

  if (!isLoggedIn || (userData && !userData.role.includes(role))) {
    navigate("/login", { replace: true });
    return null;
  }

  return <Outlet />;
};

export default PrivateRoutes;
