import { Link, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";

const JadwalShow = () => {
  const [cookies] = useCookies();
  const jwtDecoded = jwtDecode(cookies["auth-token"]);
  const params = useParams();
  const [detailSchedule, setDetailSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const detailResponse = await axios.get(
          `${import.meta.env.VITE_API_URLSCHEDULE}/api/schedule/get/${
            params.id
          }`,
          {
            headers: {
              Authorization: `Bearer ${cookies["auth-token"]}`,
            },
          }
        );
        const data = detailResponse.data.data;

        const penguji1Response = await axios.get(
          `https://sofi.my.id/api/lecturer/${data.penguji1_id}`
        );
        const penguji2Response = await axios.get(
          `https://sofi.my.id/api/lecturer/${data.penguji2_id}`
        );

        const pembimbing1Response = await axios.get(
          `https://sofi.my.id/api/lecturer/${data.pengajuan.pembimbing1_id}`
        );
        const pembimbing2Response = await axios.get(
          `https://sofi.my.id/api/lecturer/${data.pengajuan.pembimbing2_id}`
        );

        const user1Response = await axios.get(
          `https://sofi.my.id/api/user/${data.pengajuan.user_id}`
        );

        const updatedData = {
          ...data,
          penguji1: `${penguji1Response.data.data.code} - ${penguji1Response.data.data.user.nama}`,
          penguji2: `${penguji2Response.data.data.code} - ${penguji2Response.data.data.user.nama}`,
          pembimbing1: `${pembimbing1Response.data.data.code} - ${pembimbing1Response.data.data.user.nama}`,
          pembimbing2: `${pembimbing2Response.data.data.code} - ${pembimbing2Response.data.data.user.nama}`,
          user: `${user1Response.data.data.nama}`,
        };
        setDetailSchedule(updatedData);
      } catch (err) {
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <ol className="breadcrumb mb-0">
            <div className="col-12">
              <h3>JADWAL</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  BERANDA
                </Link>{" "}
                / DETAIL
              </h6>
            </div>
          </ol>
          <div className="container-fluid">
            <div className="animated fadeIn">
              {/*@include('coreui-templates::common.errors')*/}
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">
                      {jwtDecoded.role.find((role) =>
                        ["RLADM"].includes(role)
                      ) ? (
                        <Link to="/schedule/admin" className="btn btn-light">
                          Kembali
                        </Link>
                      ) : jwtDecoded.role.find((role) =>
                          ["RLPGJ", "RLPBB"].includes(role)
                        ) ? (
                        <div>
                          <Link
                            to="/schedule/penguji"
                            className="btn btn-light"
                          >
                            JADWAL PENGUJI
                          </Link>
                          <Link
                            to="/schedule/pembimbing"
                            className="btn btn-light mr-3"
                          >
                            JADWAL PEMBIMBING
                          </Link>
                        </div>
                      ) : (
                        <Link to="/home" className="btn btn-light">
                          Kembali
                        </Link>
                      )}
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
                                NIM
                              </td>
                              <td>:</td>
                              <td>{detailSchedule?.pengajuan?.nim}</td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                NAMA
                              </td>
                              <td>:</td>
                              <td>{detailSchedule.user}</td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                PEMBIMBING 1
                              </td>
                              <td>:</td>
                              <td>{detailSchedule.pembimbing1}</td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                PEMBIMBING 2
                              </td>
                              <td>:</td>
                              <td>{detailSchedule.pembimbing2}</td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                PENGUJI 1
                              </td>
                              <td>:</td>
                              <td>{detailSchedule.penguji1}</td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                PENGUJI 2
                              </td>
                              <td>:</td>
                              <td>{detailSchedule.penguji2}</td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                JUDUL TA
                              </td>
                              <td>:</td>
                              <td>{detailSchedule?.pengajuan?.judul}</td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                DOKUMEN TA
                              </td>
                              <td>:</td>
                              <td>
                                {detailSchedule?.pengajuan?.doc_ta ? (
                                  <Link
                                    to={detailSchedule?.pengajuan?.doc_ta}
                                    className="btn btn-outline-primary"
                                    download
                                  >
                                    Download
                                  </Link>
                                ) : (
                                  <Link
                                    to="#"
                                    target="_blank"
                                    className="btn btn-primary disabled"
                                  >
                                    DATA TIDAK DITEMUKAN
                                  </Link>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                JURNAL
                              </td>
                              <td>:</td>
                              <td>
                                {detailSchedule?.pengajuan?.makalah ? (
                                  <Link
                                    to={detailSchedule?.pengajuan?.makalah}
                                    className="btn btn-outline-primary"
                                    download
                                  >
                                    Download
                                  </Link>
                                ) : (
                                  <Link
                                    to="#"
                                    target="_blank"
                                    className="btn btn-primary disabled"
                                  >
                                    DATA TIDAK DITEMUKAN
                                  </Link>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                MATERI PRESENTASI
                              </td>
                              <td>:</td>
                              <td>
                                {detailSchedule?.pengajuan?.slide?.file_url ? (
                                  <Link
                                    to={
                                      detailSchedule?.pengajuan?.slide?.file_url
                                    }
                                    target="_blank"
                                    className="btn btn-outline-primary"
                                    download
                                  >
                                    Download
                                  </Link>
                                ) : (
                                  <Link
                                    to="#"
                                    target="_blank"
                                    className="btn btn-primary disabled"
                                  >
                                    DATA TIDAK DITEMUKAN
                                  </Link>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Keputusan
                              </td>
                              <td>:</td>
                              <td>
                                {detailSchedule?.decision ? (
                                  <span
                                    className={`badge ${
                                      detailSchedule.decision
                                        ? "badge-success"
                                        : "badge-danger"
                                    }`}
                                  >
                                    {detailSchedule?.decision.toUpperCase()}
                                  </span>
                                ) : (
                                  <span className="badge badge-danger">
                                    BELUM DIPUTUSKAN
                                  </span>
                                )}
                              </td>
                            </tr>
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

export default JadwalShow;
