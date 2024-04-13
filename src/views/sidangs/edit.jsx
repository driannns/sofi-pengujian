import { MainLayout } from "../layouts/MainLayout";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchLecturer } from "../../store/lecturerSlicer";
import { updateSidang, checkSidang } from "../../store/sidangSlicer";
import { isLoadingTrue, isLoadingFalse } from "../../store/loadingSlicer";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";

import "sweetalert2/dist/sweetalert2.min.css";
import Swal from "sweetalert2";

const SidangEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataLecturer = useSelector((state) => state.lecturer);
  const dataSidang = useSelector((state) => state.sidang);
  const isLoading = useSelector((state) => state.loading.loading);
  const params = useParams();
  const [cookies] = useCookies("");

  const [userInfo, setUserInfo] = useState({});
  const [peminatans, setPeminatans] = useState("");
  const [periods, setPeriods] = useState();
  const languages = ["Indonesia", "English"];
  const statusList = {
    0: "--Pilihan Ubah Status--",
    "ditolak oleh admin": "Ditolak Oleh Admin",
    "belum disetujui admin": "Belum Disetujui Admin",
    "telah disetujui admin": "Telah Disetujui Admin",
    "tidak lulus": "Tidak Lulus",
    "reset status": "Reset Status",
  };

  const [periodId, setPeriodId] = useState(dataSidang?.data.period_id);
  const [pembimbing1, setPembimbing1] = useState(
    dataSidang?.data.pembimbing1_id || ""
  );
  const [pembimbing2, setPembimbing2] = useState(
    dataSidang?.data.pembimbing2_id || ""
  );
  const [judul, setJudul] = useState(dataSidang?.data.judul);
  const form_bimbingan1 = dataSidang?.data.form_bimbingan1 || 0;
  const form_bimbingan2 = dataSidang?.data.form_bimbingan2 || 0;
  const [peminatanId, setPeminatanId] = useState(userInfo?.peminatan_id);
  const [docTA, setDocTA] = useState("");
  const [makalah, setMakalah] = useState("");
  const [isEnglish, setIsEnglish] = useState("");
  const [status, setStatus] = useState("");
  const [komentar, setKomentar] = useState("");
  const [statusLog, setStatusLog] = useState("");

  const jwtDecoded = jwtDecode(cookies["auth-token"]);

  const handleDocTAChange = (e) => {
    setDocTA(e.target.files[0]);
  };

  const handleMakalahChange = (e) => {
    setMakalah(e.target.files[0]);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayOfWeek = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${dayOfWeek}, ${dayOfMonth} ${month} ${year} - ${hour}:${minute}`;
  };

  const formatUser = async (userId) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/user/${userId}`);
      return res.data.data.username;
    } catch (error) {
      return "-";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(isLoadingTrue());
        const dataSidangStudent = await dispatch(
          checkSidang(cookies["auth-token"])
        );
        dispatch(fetchLecturer());

        const resUserInfo = await axios.get(
          `https://sofi.my.id/api/student/${jwtDecoded.id}`
        );
        setUserInfo(resUserInfo.data.data);
        setPeminatanId(resUserInfo.data.data.peminatan_id);

        const resPeminatans = await axios.post(
          "https://sofi.my.id/api/peminatans",
          {
            kk: resUserInfo.data.data.kk,
          }
        );
        setPeminatans(resPeminatans.data.data);

        if (jwtDecoded.role.find((role) => !["RLADM"].includes(role))) {
          const resStatusLog = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/status-log/get`,
            {
              headers: {
                "ngrok-skip-browser-warning": true,
                Authorization: `Bearer ${cookies["auth-token"]}`,
              },
            }
          );
          const formatStatusLog = await Promise.all(
            resStatusLog.data.data.map(async (value) => {
              const manipulatedData = await formatUser(value.created_by);
              return { ...value, created_by: manipulatedData };
            })
          );
          setStatusLog(formatStatusLog);
        } else {
          const resStatusLog = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/status-log/get`,
            {
              headers: {
                "ngrok-skip-browser-warning": true,
                Authorization: `Bearer ${cookies["auth-token"]}`,
              },
            }
          );
          const formatStatusLog = await Promise.all(
            resStatusLog.data.data.map(async (value) => {
              const manipulatedData = await formatUser(value.created_by);
              return { ...value, created_by: manipulatedData };
            })
          );
          setStatusLog(formatStatusLog);
        }

        // Parameter
        const resALlPeriods = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/period/get`,
          {
            headers: {
              Authorization: `Bearer ${cookies["auth-token"]}`,
              "ngrok-skip-browser-warning": true,
            },
          }
        );
        setPeriods(resALlPeriods.data.data);

        if (!dataSidangStudent.payload) {
          localStorage.setItem("errorMessage", "Sidang Tidak Ada");
          navigate("/sidangs");
          return;
        }

        if (params.id != dataSidangStudent.payload.id) {
          navigate("/home");
          return;
        }

        if (
          !["pengajuan", "ditolak oleh admin"].includes(
            dataSidangStudent.payload.status
          ) &&
          !jwtDecoded.role.find((role) => ["RLADM"].includes(role))
        ) {
          navigate(`/sidangs/${dataSidangStudent.payload.id}`);
          return;
        }
      } catch (error) {
        if (
          error.response?.status !== 404 ||
          error.message === "Network Error"
        ) {
          localStorage.setItem("errorMessage", "Network Error");
          console.error("Erorr fetching data:", error);
          navigate("/home");
          return;
        }
      } finally {
        dispatch(isLoadingFalse());
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (params.id != dataSidang.data.id) {
          navigate("/home");
          return;
        }
        if (
          !["pengajuan", "ditolak oleh admin"].includes(
            dataSidang.data.status
          ) &&
          !jwtDecoded.role.find((role) => ["RLADM"].includes(role))
        ) {
          navigate(`/sidangs/${dataSidang.data.id}`);
          return;
        }
      } catch (e) {
        console.error("Erorr fetching data:", e);
      }
    };
    fetchData();
  }, [dataSidang]);

  function attend2(e) {
    e.preventDefault();
    Swal.fire({
      title: "Pastikan semua data anda benar.",
      text: "Apakah anda yakin akan menyimpan data?",
      icon: "info",
      showCancelButton: true,
      cancelButtonColor: "#f86c6b",
      confirmButtonColor: "#43afd6",
      cancelButtonText: "Batal",
      confirmButtonText: "Simpan",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(
          updateSidang({
            nim: jwtDecoded.nim,
            pembimbing1,
            pembimbing2,
            judul,
            eprt: dataSidang.data.eprt,
            docTA,
            makalah,
            tak: dataSidang.data.tak,
            periodId,
            totalguidance_advisor1: form_bimbingan1,
            totalguidance_advisor2: form_bimbingan2,
            peminatanId,
            sidangId: dataSidang.data.id,
            authToken: cookies["auth-token"],
          })
        );
        localStorage.setItem("successMessage", "Sidang berhasil diedit");
        navigate("/sidangs/create");
        return;
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }

  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <ol className="breadcrumb mb-0">
            <div className="col-12">
              <h3>SIDANG</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  BERANDA
                </Link>{" "}
                /{" "}
                <a href="{!! route('sidangs.index') !!}" className="text-dark">
                  SIDANG
                </a>
              </h6>
            </div>
          </ol>

          <div className="container-fluid">
            <div className="animated fadeIn">
              {/* @include('coreui-templates::common.errors') */}
              <Alert type="danger" />
              <Alert type="warning" />
              <Alert type="success" />
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <form onSubmit={attend2}>
                        {/* <!-- Period Id Field --> */}
                        <div className="form-group col-sm-12">
                          <label htmlFor="period_id">Period Sidang: </label>
                          {jwtDecoded.role &&
                          jwtDecoded.role.find(
                            (role) => !["RLADM"].includes(role)
                          ) ? (
                            <select
                              name="period_id"
                              id="period_id"
                              className="select2 form-control"
                              value={periodId}
                              onChange={(e) => setPeriodId(e.target.value)}
                            >
                              <option value="">Pilih Periode</option>
                              {periods &&
                                periods.map((data, index) => (
                                  <option value={data.id} key={index}>
                                    {data.name}
                                  </option>
                                ))}
                            </select>
                          ) : (
                            <>
                              <select
                                name="period_id"
                                id="period_id"
                                className="select2 form-control"
                                value={periodId}
                                disabled
                              >
                                {periods &&
                                  periods.map((data, index) => (
                                    <option value={data.id} key={index}>
                                      {data.name}
                                    </option>
                                  ))}
                              </select>
                              <input
                                type="hidden"
                                name="period_id"
                                defaultValue={
                                  dataSidang.data && dataSidang.data.period_id
                                }
                              />
                            </>
                          )}
                        </div>

                        {/* } <!-- Mahasiswa Id Field --> */}
                        <div className="form-group col-sm-12">
                          <label htmlFor="mahasiswa_id">NIM Mahasiswa:</label>

                          <input
                            type="number"
                            defaultValue={userInfo.nim}
                            className="form-control"
                            disabled
                          />

                          <input
                            type="hidden"
                            name="mahasiswa_id"
                            defaultValue={userInfo.nim}
                          />
                        </div>

                        {/* <!-- Pembimbing1 Id Field --> */}
                        <div className="form-group col-sm-12">
                          <label htmlFor="pembinbing1_id">
                            Kode Dosen Pembimbing 1:
                          </label>
                          <select
                            className="form-control select2"
                            name="pembimbing1_id"
                            value={pembimbing1}
                            onChange={(e) => setPembimbing1(e.target.value)}
                            disabled
                          >
                            <option value="">Pilih Pembimbing 1</option>
                            {dataLecturer.data &&
                              dataLecturer.data.map((data, index) => (
                                <option key={index} value={data.id}>
                                  {data.code} - {data.user.nama}
                                </option>
                              ))}
                          </select>
                        </div>

                        {/* <!-- Pembimbing2 Id Field --> */}
                        <div className="form-group col-sm-12">
                          <label htmlFor="pembimbing2_id">
                            Kode Dosen Pembimbing 2:
                          </label>
                          <select
                            className="form-control select2"
                            name="pembimbing2_id"
                            value={pembimbing2}
                            onChange={(e) => {
                              setPembimbing2(e.target.value);
                            }}
                            disabled
                          >
                            <option value="">Pilih Pembimbing 2</option>
                            {dataLecturer.data &&
                              dataLecturer.data.map((data, index) => (
                                <option key={index} value={data.id}>
                                  {data.code} - {data.user.nama}
                                </option>
                              ))}
                          </select>
                        </div>

                        {/* <!-- Judul Field --> */}
                        <div className="form-group col-sm-12 col-lg-12">
                          <label htmlFor="judul">Judul Tugas Akhir:</label>
                          <textarea
                            name="judul"
                            id="judul"
                            cols="2"
                            rows="4"
                            value={judul}
                            onChange={(e) => {
                              setJudul(e.target.value);
                            }}
                            className="form-control"
                          />
                        </div>

                        {/* <!-- Form Bimbingan Field --> */}
                        <div className="form-group col-sm-12">
                          <label htmlFor="form_bimbingan">
                            Jumlah Bimbingan:
                          </label>
                          <input
                            type="text"
                            id="form_bimbingan1"
                            defaultValue={`Pembimbing 1: ${form_bimbingan1}`}
                            className="form-control"
                            disabled
                          />
                          <input
                            type="text"
                            id="form_bimbingan2"
                            defaultValue={`Pembimbing 2: ${form_bimbingan2}`}
                            className="form-control"
                            disabled
                          />
                          <input
                            type="hidden"
                            defaultValue={`${form_bimbingan1};${form_bimbingan2}`}
                          />
                        </div>

                        {/* <!-- KK Field --> */}
                        <div className="form-group col-sm-12 col-lg-12">
                          <label htmlFor="kk">Kelompok Keahlian:</label>
                          <input
                            type="text"
                            name="form_bimbingan1"
                            className="form-control"
                            defaultValue={userInfo.kk}
                            disabled
                          />
                        </div>

                        {/* <!-- peminatans Field --> */}
                        <div className="form-group col-sm-12">
                          <label htmlFor="peminatans">Peminatan:</label>
                          <select
                            className="form-control select2"
                            name="peminatan"
                            value={peminatanId}
                            onChange={(e) => setPeminatanId(e.target.value)}
                          >
                            <option value="">Pilih Peminatan</option>
                            {peminatans &&
                              peminatans.map((data, index) => (
                                <option value={data.id} key={index}>
                                  {data.nama}
                                </option>
                              ))}
                          </select>
                        </div>

                        {/* <!-- Eprt Field --> */}
                        <div className="form-group col-sm-12">
                          <label htmlFor="eprt">EPRT:</label>
                          <input
                            type="text"
                            name="eprt"
                            className="form-control"
                            defaultValue={userInfo.eprt}
                            disabled
                          />
                          <input
                            type="hidden"
                            name="eprt"
                            defaultValue={userInfo.eprt}
                          />
                        </div>

                        {/* <!-- Tak Field --> */}
                        <div className="form-group col-sm-12">
                          <label htmlFor="tak">TAK:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="tak"
                            defaultValue={userInfo.tak}
                            disabled
                          />
                          <input
                            type="hidden"
                            name="tak"
                            defaultValue={userInfo.tak}
                          />
                        </div>

                        {jwtDecoded.role &&
                        jwtDecoded.role.find(
                          (role) => !["RLADM"].includes(role)
                        ) ? (
                          <>
                            {/* <!-- Dokumen Ta Field --> */}
                            <div className="form-group col-sm-12">
                              <label htmlFor="dokumen_ta">
                                Draft Dokumen TA:
                              </label>
                              {dataSidang.data && dataSidang.data.doc_ta ? (
                                <p>
                                  <a
                                    href={`${
                                      import.meta.env.VITE_API_URL
                                    }/public/doc_ta/${dataSidang.data.doc_ta}`}
                                    className="btn btn-primary"
                                    download
                                  >
                                    Download
                                  </a>
                                </p>
                              ) : (
                                <p>
                                  <a
                                    href="#"
                                    target="_blank"
                                    className="btn btn-primary disabled"
                                  >
                                    Data tidak ditemukan
                                  </a>
                                </p>
                              )}

                              <input
                                type="file"
                                name="dokumen_ta"
                                onChange={handleDocTAChange}
                                className="form-control"
                              />
                            </div>

                            {/* <!-- Makalah Field -/-> */}
                            <div className="form-group col-sm-12">
                              <label htmlFor="makalah">Jurnal:</label>
                              {dataSidang.data && dataSidang.data.makalah ? (
                                <p>
                                  <a
                                    href={`${
                                      import.meta.env.VITE_API_URL
                                    }/public/doc_ta/${dataSidang.data.makalah}`}
                                    className="btn btn-primary"
                                    download
                                  >
                                    Download
                                  </a>
                                </p>
                              ) : (
                                <p>
                                  <a
                                    href="#"
                                    target="_blank"
                                    className="btn btn-primary disabled"
                                  >
                                    Data tidak ditemukan
                                  </a>
                                </p>
                              )}

                              <input
                                type="file"
                                name="makalah"
                                onChange={handleMakalahChange}
                                className="form-control"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            {/* <!-- Bahasa Field --> */}
                            <div className="form-group col-sm-12">
                              <label htmlFor="is_english">Bahasa:</label>
                              <select
                                name="is_english"
                                id="is_english"
                                className="select2 form-control"
                                value={isEnglish}
                                onChange={(e) => setIsEnglish(e.target.value)}
                              >
                                {languages.map((data, index) => (
                                  <option value={data} key={index}>
                                    {data}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* <!-- Status Field --> */}
                            <div className="form-group col-sm-12">
                              <label htmlFor="status">Status:</label>
                              <select
                                name="status"
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                              >
                                <option value=""></option>
                                {Object.entries(statusList).map(
                                  ([key, value]) => (
                                    <option value={key} key={key}>
                                      {value}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>

                            {/* <!-- Komentar Field --> */}
                            <div
                              className="form-group col-sm-12"
                              id="field_komentar"
                              style={{ display: "none" }}
                            >
                              <label htmlFor="komentas">Komentar:</label>
                              <textarea
                                name="komentar"
                                id="komentar"
                                className="form-control"
                                value={komentar}
                                onChange={(e) => setKomentar(e.target.value)}
                              />
                            </div>
                          </>
                        )}

                        {/* <!-- Submit Field --> */}
                        <div className="form-group col-sm-12">
                          <button className="btn btn-primary">Simpan</button>
                          <Link to="/home" className="btn btn-secondary">
                            Batal
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div
                        className="table-responsive-sm"
                        style={{ height: "100vh", overflowY: "scroll" }}
                      >
                        <table
                          className="table table-striped"
                          id="sidangs-table"
                        >
                          <thead>
                            <tr>
                              <td>Tanggal</td>
                              <td>Nama Event</td>
                              <td>Komentar</td>
                              <td>Oleh</td>
                            </tr>
                          </thead>
                          <tbody>
                            {statusLog &&
                              statusLog.map((value, index) => (
                                <tr key={index}>
                                  <td>{formatDate(value.created_at)}</td>
                                  <td>{value.name}</td>
                                  <td>{value.feedback}</td>
                                  <td>{value.created_by}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default SidangEdit;
