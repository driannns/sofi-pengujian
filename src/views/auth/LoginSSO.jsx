import { GuestLayout } from "../layouts/GuestLayout";
import { NavLink } from "react-router-dom";
import telkomLogo from "../../assets/images/telkom.png";
import { useState } from "react";
import { useAuth } from "../../middleware/AuthContext";
import ReactLoading from "react-loading";

const LoginSSO = () => {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    login(username, password);
    setUsername("");
    setPassword("");
  };

  return (
    <GuestLayout>
      <div className="card p-4">
        <div className="card-body">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <p className="text-muted">Sign In to your account</p>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="icon-user"></i>
                </span>
              </div>
              <input
                type="username"
                className="form-control {{ $errors->has('username')?'is-invalid':'' }}"
                name="username"
                value={username}
                placeholder=" igracias"
                onChange={(e) => setUsername(e.target.value)}
              />
              {/* @if ($errors->has('username')) */}
              <span className="invalid-feedback">
                <strong>username & password Anda Salah</strong>
              </span>
              {/* @endif */}
            </div>
            <div className="input-group mb-4">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="icon-lock"></i>
                </span>
              </div>
              <input
                type="password"
                className="form-control {{ $errors->has('password')?'is-invalid':'' }}"
                placeholder="password igracias"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* @if ($errors->has('password')) */}
              <span className="invalid-feedback">
                <strong>Password Anda Salah</strong>
              </span>
              {/* @endif */}
            </div>
            <div className="row">
              <div className="col-6">
                <button className="btn btn-primary px-4" type="submit">
                  {isLoading === true ? (
                    <ReactLoading
                      type="spin"
                      color="#fff"
                      height="20px"
                      width="20px"
                    />
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
              <div className="col-6 text-right">
                <NavLink
                  key="loginSSO"
                  to="/login"
                  className="btn btn-link px-0"
                >
                  Tidak punya SSO Igracias
                </NavLink>
              </div>
            </div>
            <br></br>
            <div className="row">
              <div className="col-12">
                Kontak LAAK FRI : {/* Kontak LAA dari database */}
                <a
                  className="btn btn-primary active mt-3"
                  href="+6281311997199"
                >
                  +6281311997199
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div
        className="card text-white bg-primary py-5 d-md-down-none"
        style={{ width: "44%" }}
      >
        <div className="card-body text-center">
          <div>
            <h2>SSO Telkom University</h2>
            <img src={telkomLogo} alt="" height="200px" className="" />
          </div>
        </div>
      </div>
    </GuestLayout>
  );
};

export default LoginSSO;
