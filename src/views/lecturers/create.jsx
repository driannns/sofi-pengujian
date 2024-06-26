import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import Alert from "../../components/Alert";

const LecturersCreate = () => {
  const [lecturers, setLecturers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resLecturers = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/lecturer`
        );
        setLecturers(resLecturers.data.data);
        console.log(resLecturers.data.data);
      } catch (err) {
        console.log(err);
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <ol className="breadcrumb mb-0">
            <div className="col-12">
              <h3>HAK AKSES</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <a
                  href="{!! route('lecturers.index') !!}"
                  className="text-dark"
                >
                  HAK AKSES
                </a>{" "}
                / TAMBAH HAK AKSES
              </h6>
            </div>
          </ol>

          <div className="container-fluid">
            <div className="animated fadeIn">
            <Alert type="success"/>
            <Alert type="danger"/>
              <div className="row">
                <div className="col-lg-6">
                  <div className="card">
                    <div className="card-header">
                      <i className="fa fa-plus-square-o fa-lg"></i>
                      <strong>Tambah Hak Akses</strong>
                    </div>
                    <div className="card-body">
                      {/*<!-- Nip Field -->*/}
                      <div className="form-group col-sm-12">
                        <label>NIP:</label>
                        <select className="form-control select2" name="user_id">
                        {lecturers.map((lecturer) => (
                          <option key={lecturer.id}>
                          {lecturer.user.nama} - {lecturer.nip ? lecturer.nip : 'Belum ada NIP'}
                          </option>
                        ))}
                        </select>
                      </div>

                      {/*<!-- role Field -->*/}
                      <div className="form-group col-sm-12">
                        <label>Role:</label>
                        <select className="form-control select2" name="role">
                          <option
                          >
                            Admin
                          </option>
                        </select>
                      </div>

                      {/*<!-- Submit Field -->*/}
                      <div className="form-group col-sm-12">
                        <button type="submit" className="btn btn-primary">
                          Simpan
                        </button>
                        <Link
                          to="/lectures"
                          className="btn btn-secondary ml-1"
                        >
                          Batal
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="card">
                    <div className="card-header">
                      <i className="fa fa-plus-square-o fa-lg"></i>
                      <strong>Tambah Admin</strong>
                    </div>
                    <div className="card-body">

                      {/*<!-- Username Field -->*/}
                      <div className="form-group col-sm-12">
                        <label>Username:</label>
                        <input type="text" className="form-control" />
                      </div>

                      {/*<!-- Nama Field -->*/}
                      <div className="form-group col-sm-12">
                        <label>Nama:</label>
                        <input type="text" className="form-control" />
                      </div>

                      {/*<!-- Password Field -->*/}
                      <div className="form-group col-sm-12">
                        <label>Password:</label>
                        <input type="password" className="form-control" />
                      </div>

                      {/*<!-- Submit Field -->*/}
                      <div className="form-group col-sm-12">
                        <button type="submit" className="btn btn-primary">
                          Tambah Admin
                        </button>
                        <Link
                          to="/lectures"
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
        </div>
      )}
    </MainLayout>
  );
};

export default LecturersCreate;
