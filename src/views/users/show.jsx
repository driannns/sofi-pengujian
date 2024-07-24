import { useEffect, useState } from "react";
import { MainLayout } from "../layouts/MainLayout";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";

const UserShow = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/user/${params.id}`
        );
        console.log(data);
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
                / DETAIL PENGGUNA
              </h6>
            </div>
          </ol>

          <div className="container-fluid">
            <div className="animated fadeIn">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">
                      <strong>Details</strong>
                      <Link to="/users" className="btn btn-light">
                        Back
                      </Link>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive-sm">
                        <table className="table table-striped table-borderless">
                          <tbody>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Username
                              </td>
                              <td>:</td>
                              <td>{user.username}</td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Nama
                              </td>
                              <td>:</td>
                              <td>{user.nama}</td>
                            </tr>
                            {user.lecturers && (
                              <div>
                                <tr>
                                  <td
                                    className="font-weight-bold"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    NIP
                                  </td>
                                  <td>:</td>
                                  <td>{user.lecturers.nip}</td>
                                </tr>
                                <tr>
                                  <td
                                    className="font-weight-bold"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    JFA
                                  </td>
                                  <td>:</td>
                                  <td>{user.lecturers.jfa}</td>
                                </tr>
                                <tr>
                                  <td
                                    className="font-weight-bold"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    Kelompok Keahlian
                                  </td>
                                  <td>:</td>
                                  <td>{user.lecturers.kk}</td>
                                </tr>
                              </div>
                            )}
                            {user.students && (
                              <div>
                                <tr>
                                  <td
                                    className="font-weight-bold"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    NIM
                                  </td>
                                  <td>:</td>
                                  <td>{user.students.nim}</td>
                                </tr>
                                <tr>
                                  <td
                                    className="font-weight-bold"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    TAK
                                  </td>
                                  <td>:</td>
                                  <td>{user.students.tak}</td>
                                </tr>
                                <tr>
                                  <td
                                    className="font-weight-bold"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    EPRT
                                  </td>
                                  <td>:</td>
                                  <td>{user.students.eprt}</td>
                                </tr>
                                <tr>
                                  <td
                                    className="font-weight-bold"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    Kelompok Keahlian
                                  </td>
                                  <td>:</td>
                                  <td>
                                    {user.students.kk}
                                  </td>
                                </tr>
                              </div>
                            )}
                          </tbody>
                        </table>
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

export default UserShow;
