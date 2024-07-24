import telkomLogo from "../assets/images/telkom.png";
import Button from "../components/Button";
import { NavLink } from "react-router-dom";
import { useAuth } from "../middleware/AuthContext";

const Error = () => {
  const { isLoggedIn } = useAuth();
  return (
    <div
      className="d-flex justify-content-center position-relative align-items-center text-center flex-column"
      style={{
        backgroundColor: "#fff",
        fontFamily: "Nunito, sans-serif",
        fontWeigh: 200,
        minHeight: "100vh",
        margin: 0,
        color: "#636b6f",
      }}
    >
      <img src={telkomLogo} alt="Logo Telkom" height="200px" />
      <p
        className="mt-5"
        style={{
          fontSize: "84px",
          fontWeight: 200,
          fontFamily: "Nunito, sans-serif",
        }}
      >
        404 Error - Nothing here
      </p>
      <div className="mb-4">
        <a
          href="#"
          className="fw-semibold text-decoration-none text-uppercase"
          style={{
            color: "#636b6f",
            padding: "0 25px",
            fontSize: "13px",
            letterSpacing: ".1rem",
          }}
        >
          SOFI - Sidang Online FRI
        </a>
      </div>
      <div className="form-group w-100">
        {isLoggedIn ? (
          <NavLink key="home" to="/home">
            <Button value="Home" variant="btn-primary" />
          </NavLink>
        ) : (
          <NavLink key="home" to="/login">
            <Button value="Login" variant="btn-primary" />
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Error;
