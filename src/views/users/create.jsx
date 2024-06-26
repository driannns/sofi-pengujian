import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";

const UserCreate = () => {
  const navigate = useNavigate();
  const [inputEmpty, setInputEmpty] = useState("");
  const [username, setUsername] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");

  const createUser = async () => {
    if (!username.trim() || !nama.trim()) {
      setInputEmpty("Inputan Kosong");
      return;
    }

    const data = { username, nama, password };
    await axios
      .post(`${import.meta.env.VITE_API_SOFILAMA}/api/user`, data)
      .then(() => {
        navigate("/users", {
          state: { successMessage: "User Berhasil Disimpan." },
        });
      })
      .catch((error) => {
        console.error("User Gagal Disimpan.:", error);
      });
  };

  return (
    <MainLayout>
      <ol className="breadcrumb mb-0">
        <div className="col-12">
          <h3>PENGGUNA</h3>
          <hr className="mt-0" />
          <h6 className="mb-3">
            <Link
              to="/home"
              className="text-dark"
            >
              PENGGUNA
            </Link>{" "}
            / TAMBAH PENGGUNA
          </h6>
        </div>
      </ol>

      <div className="container-fluid">
        <div className="animated fadeIn">
          {inputEmpty && (
            <Alert
              type="danger"
              message={inputEmpty}
            />
          )}
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  {/*<!-- Username Field -->*/}
                  <div className="form-group col-sm-6">
                    <label>Username:</label>
                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)}/>
                  </div>

                  {/*<!-- Nama Field -->*/}
                  <div className="form-group col-sm-6">
                    <label>Nama:</label>
                    <input type="text" className="form-control" value={nama} onChange={(e) => setNama(e.target.value)}/>
                  </div>

                  {/*<!-- Password Field -->*/}
                  <div className="form-group col-sm-6">
                    <label>Password:</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <small>
                      Field password biarkan kosong jika tidak ingin merubah
                      password
                    </small>
                  </div>

                  {/*<!-- Submit Field -->*/}
                  <div className="form-group col-sm-12">
                    <button type="submit" className="btn btn-primary" onClick={createUser}>
                      Save
                    </button>
                    <Link
                      to="/users"
                      className="btn btn-secondary ml-1"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserCreate;
