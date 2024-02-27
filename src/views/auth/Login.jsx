import { GuestLayout } from "../layouts/GuestLayout";
import { NavLink } from "react-router-dom";

const Login = () => {
  return (
    <GuestLayout>
      <div className="card p-4">
        <div className="card-body">
          <form method="post" action="{{ url('/login') }}">
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
                value="username"
                placeholder="NIM / Kode Dosen"
              />
              {/* @if ($errors->has('username')) */}
              <span className="invalid-feedback">
                <strong>NIM / Kode Dosen Anda Salah</strong>
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
                placeholder="Password"
                name="password"
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
                  Login
                </button>
              </div>
              <div className="col-6 text-right">
                <NavLink
                  key="loginSSO"
                  to="/loginSSO"
                  classNameName="btn btn-link px-0"
                >
                  Login via SSO Igracias
                </NavLink>
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
            <h2>Sign up</h2>
            <p>belum memiliki akun ? silahkan menghubungi admin akademik FRI</p>
            Kontak LAAK FRI :{" "}
            <a
              className="btn btn-primary active mt-3"
              href="http://wa.me>"
            >
             no_laa
            </a>
            {" "}
          </div>
        </div>
      </div>
    </GuestLayout>
  );
};

export default Login;
