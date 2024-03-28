import { MainLayout } from "../layouts/MainLayout";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../middleware/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { fetchLecturer } from "../../store/lecturerSlicer";
import { createSidang, checkSidang } from "../../store/sidangSlicer";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";

import "sweetalert2/dist/sweetalert2.min.css";
import Swal from "sweetalert2";

const tokenSSO =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiOWY3ZDMxZTZhMzhmYmFmOTI5NjljMDNlMzJhOTc4MjFkNjY0MGJiZWQ4NzU0Y2Y0MzY4NWVjM2EyZTdkOGU5NTBkYWUzYWJjOGFiZWNhMDAiLCJpYXQiOjE3MTAyMzQ4MjMsIm5iZiI6MTcxMDIzNDgyMywiZXhwIjoxNzEwMzIxMjIzLCJzdWIiOiJla2t5bm92cml6YWxhbSIsInNjb3BlcyI6WyJjZWxvZS1kYXNoYm9hcmQiLCJvbGQtZG9zZW4iLCJvbGQtZG9zZW4td2FsaSIsImFkbWlzc2lvbi1hZG1pbiIsImFkbWlzc2lvbi1kYXNoYm9hcmQtdXNlcnMiLCJhdHRlbmRhbmNlLWVtcGxveWVlIiwiZGFzaGJvYXJkLXVzZXIiLCJuZXctc3NvIiwib2xkLXBlZ2F3YWkiLCJzc28tb3BlbmxpYiIsInN0YWZmX3Rlc3Rfc3BzIiwib2xkLWtlbG9tcG9rLWtlYWhsaWFuIiwiZW1wbG95ZWUtc3RydWN0dXJhbCIsIm9sZC1hZG1pbi1yZWdpc3RyYXNpLWZha3VsdGFzIl19.PDA6tjeuPNeaqi3KORQR7H-MD4qZc7dEzSFVKbilas4Q4T8MRtSVeHLmRUAaM4WiiqIrf486hnEw0RvV9YkXIYtU1zVVN456Zyano66pW9FfLHbptxC59zc_MM560XT7fokxATYZGPKn5Ds8AHyOB4Z3Mfak82FAJHFp9O_eEG_JDvX8OVGxTS5mJDhLnsnOUs6DTiJlyLM4nMlfn1WBwvpv6hn3U_q9g0CNflaULd6jYfvvFf63ybShOvxQeevZDdk1wpVrYB26fjVo5TJuHGg7fuPaO1jrJLiCXQWZN0u51ZGvt1PMLoxNVhpWMio6EMiEiECbAZsQ99JmCv_mJhWBT-g2_udJZcPFSmaABTKAV3glrImbIf--17UC7lqllYthXyVD03JWQIpLf9Bycab4jH4Bl7aFSdFyzTvCOfEBEbq3jqL9IqBToOc6FEV0Sfzxx9VlKHE3t-AQ4a9twPYZw1xhxoiaeFwH_g6Fh9ii2ALZJLwozy7GaR5qgnOWTEO5dnjaDIiA2nAcfPcSGAcL5hzP8HqLvPAV-ya4hqB9HlRgaajhiWMxeTdE3L1vQ2Qpku7c1GHkHABahS3zqVyGQTvoT8pMX2oBw2rvrB0NQbaga7lxCNbeqgJWSYhJD-tNn46dHKqyq9XbumDOghfcRBIwdgkZhXJpCBAE5tw";
const getAllStudentAPI =
  "https://dev-gateway.telkomuniversity.ac.id/bf7b719639cf0e2ef94a1cf212e00ce6/2324-2"; //2324-2
const getStatusLog =
  "https://dev-gateway.telkomuniversity.ac.id/d650182722315309a25aa5a43a033303/2324-2"; //2324-2
const testLocal = "http://127.0.0.1:8000/api";
const APISOFI = "https://5490-180-253-71-196.ngrok-free.app/api";

const SidangCreate = () => {
  const dispatch = useDispatch();
  const dataLecturer = useSelector((state) => state.lecturer);
  const dataSidang = useSelector((state) => state.sidang);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [cookies] = useCookies("");
  const [userInfo, setUserInfo] = useState({});
  const [dataStudent, setDataStudent] = useState({});
  const [statusLog, setStatusLog] = useState("");
  const [peminatans, setPeminatans] = useState("");
  const [periods, setPeriods] = useState("");
  const languages = ["Indonesia", "English"];
  const statusList = {
    0: "--Pilihan Ubah Status--",
    "ditolak oleh admin": "Ditolak Oleh Admin",
    "belum disetujui admin": "Belum Disetujui Admin",
    "telah disetujui admin": "Telah Disetujui Admin",
    "tidak lulus": "Tidak Lulus",
    "reset status": "Reset Status",
  };

  const [periodId, setPeriodId] = useState("");
  const [pembimbing1, setPembimbing1] = useState("");
  const [pembimbing2, setPembimbing2] = useState("");
  const [judul, setJudul] = useState("");
  const form_bimbingan1 =
    dataStudent && !dataStudent.totalguidance_advisor1
      ? 0
      : dataStudent.totalguidance_advisor1;
  const form_bimbingan2 =
    dataStudent && !dataStudent.totalguidance_advisor2
      ? 0
      : dataStudent.totalguidance_advisor2;
  const [peminatanId, setPeminatanId] = useState(
    userInfo.peminatan_id ? userInfo.peminatan_id : ""
  );
  const [docTA, setDocTA] = useState("");
  const [makalah, setMakalah] = useState("");
  const [isEnglish, setIsEnglish] = useState("");
  const [status, setStatus] = useState("");
  const [komentar, setKomentar] = useState("");

  const jwtDecoded = jwtDecode(cookies["auth-token"]);

  const handleDocTAChange = (e) => {
    setDocTA(e.target.files[0]);
  };

  const handleMakalahChange = (e) => {
    setMakalah(e.target.files[0]);
  };

  useEffect(() => {
    const fetchSidangData = async () => {
      try {
        setIsLoading(true);
        dispatch(fetchLecturer());

        const resUserInfo = await axios.get(
          `${testLocal}/student/${jwtDecoded.id}`
        );
        setUserInfo(resUserInfo.data.data);

        const resALlPeriods = await axios.get(`${APISOFI}/period/get`, {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
            "ngrok-skip-browser-warning": true,
          },
        });
        setPeriods(resALlPeriods.data.data);

        const dataSidangStudent = await dispatch(
          checkSidang(cookies["auth-token"])
        );

        if (dataSidangStudent.payload) {
          if (
            dataSidangStudent.payload.status === "pengajuan" ||
            dataSidangStudent.payload.status === "ditolak oleh admin" ||
            dataSidangStudent.payload.status === "pending"
          ) {
            navigate(`/sidangs/${dataSidangStudent.payload.id}/edit`);
          } else {
            navigate(`/sidangs/${dataSidangStudent.payload.id}`);
          }
        }

        //? Parameter

        const resStudentData = await axios.get(
          // `${getAllStudentAPI}/${resUserInfo.data.data.nim}`,
          `${getAllStudentAPI}/1202204011`,
          {
            headers: {
              Authorization: `Bearer ${tokenSSO} `,
            },
          }
        );

        if (resStudentData.data.data.length === 0) {
          localStorage.setItem(
            "errorMessage",
            "Anda tidak terdaftar di periode akademik ini"
          );
          navigate("/home");
        }
        setDataStudent(resStudentData.data.data[0]);

        const resStatusLog = await axios.get(
          // `${getStatusLog}/${resUserInfo.data.data.nim}`,
          `${getStatusLog}/1202204011`,
          {
            headers: { Authorization: `Bearer ${tokenSSO}` },
          }
        );

        if (resStatusLog.data.data.length === 0) {
          localStorage.setItem(
            "errorMessage",
            "Data anda tidak ditemukan. Silahkan hubungi admin"
          );
          navigate("/home");
        }
        setStatusLog(resStatusLog.data.data[0]);

        const resPeminatans = await axios.post(`${testLocal}/peminatans`, {
          kk: resUserInfo.data.data.kk,
        });
        setPeminatans(resPeminatans.data.data);
      } catch (e) {
        localStorage.setItem("errorMessage", "Network Error");
        navigate("/home");
        console.error("Erorr fetching data:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSidangData();
  }, []);

  useEffect(() => {
    if (dataSidang.data) {
      if (
        dataSidang.data.status === "pengajuan" ||
        dataSidang.data.status === "ditolak oleh admin" ||
        dataSidang.data.status === "pending"
      ) {
        navigate(`/sidangs/${dataSidang.data.id}/edit`);
      } else {
        navigate(`/sidangs/${dataSidang.data.id}`);
      }
    }
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
          createSidang({
            nim: jwtDecoded.nim,
            pembimbing1,
            pembimbing2,
            judul,
            eprt: dataStudent.eprt,
            docTA,
            makalah,
            tak: dataStudent.tak,
            periodId,
            totalguidance_advisor1: form_bimbingan1,
            totalguidance_advisor2: form_bimbingan2,
            peminatanId,
            authToken: cookies["auth-token"],
          })
        );
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }

  return (
    <MainLayout>
      {isLoading || dataSidang.loading ? (
        <Loading />
      ) : (
        <div>
          <ol className="breadcrumb mb-0">
            <div className="col-12">
              <h3> PENDAFTARAN SIDANG </h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  BERANDA
                </Link>{" "}
                / PENDAFTARAN SIDANG
              </h6>
            </div>
          </ol>

          <div className="container-fluid">
            <div className="animated fadeIn">
              {/* @include('coreui-templates::common.errors') */}
              <Alert type="danger" />
              <Alert
                type="warning"
                message=" Pastikan data dibawah sudah benar, terutama status approval. Jika
              ada perbedaan data, silahkan hubungi admin sebelum submit"
              />
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <form>
                        {/* Credit Field */}
                        <input
                          type="text"
                          name="credit_complete"
                          defaultValue={
                            dataStudent && dataStudent.credit_complete
                          }
                          hidden
                        />
                        <input
                          type="text"
                          name="credit_uncomplete"
                          defaultValue={
                            dataStudent && dataStudent.credit_uncomplete
                          }
                          hidden
                        />

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
                                  <option key={index} value={data.id}>
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
                                defaultValue={periodId}
                                disabled
                              >
                                {periods &&
                                  periods.map((data, key) => (
                                    <option index={key} value={data.id}>
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

                        {/* <!-- Status Form Field --> */}

                        <div className="form-group col-sm-12">
                          <label htmlFor="lecturer_status">
                            Status Igracias:
                          </label>
                          <input
                            type="text"
                            name="lecturer_status"
                            className="form-control"
                            value={
                              statusLog &&
                              statusLog.lecturerstatus == "APPROVED"
                                ? statusLog.lecturerstatus
                                : "BELUM APPROVED"
                            }
                            readOnly
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

                        {/* <!-- Peminatans Field --> */}
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
                        <div
                          className="form-group col-sm-12"
                          style={{ display: "flex" }}
                        >
                          <button className="btn btn-primary" onClick={attend2}>
                            Simpan
                          </button>
                          <Link to="/home" className="btn btn-secondary">
                            Batal
                          </Link>
                        </div>
                      </form>
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

export default SidangCreate;
