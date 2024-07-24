import { Link, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";

const UserEdit = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [inputEmpty, setInputEmpty] = useState("");
  const [username, setUsername] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/user/${params.id}`
        );
        console.log(data);
        const { username, nama, password } = data.data.data;
        setUsername(username);
        setNama(nama);
        setPassword(password);
        setUser(data.data.data);
      } catch (error) {
        console.error(error);
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params, navigate]);

  const EditUser = () => {
    if (!username.trim() || !nama.trim()) {
      setInputEmpty("Inputan Kosong");
      return;
    }
    const data = { username, nama, password };
    axios
      .put(`${import.meta.env.VITE_API_SOFILAMA}/user/${params.id}`, data)
      .then(() => {
        navigate("/users", {
          state: { successMessage: "User Berhasil DIupdate." },
        });
      })
      .catch((error) => {
        console.error("User Gagal DIupdate.", error);
      });
  };
  
  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <ol className="breadcrumb mb-0">
            <div className="col-12">
              <h3>PENGGUNA</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/users" className="text-dark">
                  PENGGUNA
                </Link>{" "}
                / UBAH PENGGUNA
              </h6>
            </div>
          </ol>

          <div className="container-fluid">
            <div className="animated fadeIn">
              {inputEmpty && <Alert type="danger" message={inputEmpty} />}
              <div className="row">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <i className="fa fa-edit fa-lg"></i>
                      <strong>Edit User</strong>
                    </div>
                    <div className="card-body">
                      {/*<!-- Username Field -->*/}
                      <div className="form-group col-sm-6">
                        <label>Username:</label>
                        <input
                          type="text"
                          className="form-control"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>

                      {/*<!-- Nama Field -->*/}
                      <div className="form-group col-sm-6">
                        <label>Nama:</label>
                        <input
                          type="text"
                          className="form-control"
                          value={nama}
                          onChange={(e) => setNama(e.target.value)}
                        />
                      </div>

                      {/*<!-- Password Field -->*/}
                      <div className="form-group col-sm-6">
                        <label>Password:</label>
                        <input
                          type="password"
                          className="form-control"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <small>
                          Field password biarkan kosong jika tidak ingin merubah
                          password
                        </small>
                      </div>

                      {/*<!-- Submit Field -->*/}
                      <div className="form-group col-sm-12">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={EditUser}
                        >
                          Save
                        </button>
                        <Link to="/users" className="btn btn-secondary ml-1">
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <i className="fa fa-history fa-lg"></i>
                      <strong>
                        Data Detail {user.lecturers ? "Dosen" : "Mahasiswa"}{" "}
                      </strong>
                    </div>
                    <div className="card-body">
                      {user.lecturers && (
                        <div>
                          {/*<!-- nip Field -->*/}
                          <div className="form-group">
                            <label>NIP:</label>
                            <input
                              type="text"
                              className="form-control"
                              value={user.lecturers.nip}
                            />
                          </div>
                          {/*<!-- jfa Field -->*/}
                          <div className="form-group">
                            <label>JFA:</label>
                            <input
                              type="text"
                              className="form-control"
                              value={user.lecturers.jfa}
                            />
                          </div>
                        </div>
                      )}
                      {user.students && (
                        <div>
                          {/*<!-- Tak Field -->*/}
                          <div className="form-group">
                            <label>TAK:</label>
                            <input
                              type="text"
                              className="form-control"
                              value={user.students.tak}
                            />
                          </div>

                          {/*<!-- Eprt Field -->*/}
                          <div className="form-group">
                            <label>EPRT:</label>
                            <input
                              type="text"
                              className="form-control"
                              value={user.students.eprt}
                            />
                          </div>
                        </div>
                      )}
                      {/*<!-- kk Field -->*/}
                      <div className="form-group">
                        <label>Kelompok Keahlian:</label>
                        <select className="form-control" name="kk">
                          <option value="Cybernetics">Cybernetics</option>
                          <option value="Engineering Management System">
                            Engineering Management System
                          </option>
                          <option value="Enterprise and Industrial System">
                            Enterprise and Industrial System
                          </option>
                          <option value="Production and Manufacturing System">
                            Production and Manufacturing System
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default UserEdit;
