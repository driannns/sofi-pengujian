import { MainLayout } from "../layouts/MainLayout";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchLecturer } from "../../store/lecturerSlicer";
import { updateSidang, checkSidang } from "../../store/sidangSlicer";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import DownloadButton from "../../components/DownloadButton";

import "sweetalert2/dist/sweetalert2.min.css";
import Swal from "sweetalert2";

const SidangEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataLecturer = useSelector((state) => state.lecturer);
  const dataSidang = useSelector((state) => state.sidang);

  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies("");
  const params = useParams();

  const [userInfo, setUserInfo] = useState({});
  const [peminatans, setPeminatans] = useState("");
  const [periods, setPeriods] = useState(null);
  const languages = ["Indonesia", "English"];
  const statusList = {
    0: "--Pilihan Ubah Status--",
    "ditolak oleh admin": "Ditolak Oleh Admin",
    "belum disetujui admin": "Belum Disetujui Admin",
    "telah disetujui admin": "Telah Disetujui Admin",
    "tidak lulus": "Tidak Lulus",
    "reset status": "Reset Status",
  };

  const [periodId, setPeriodId] = useState(dataSidang?.data?.period_id);
  const [pembimbing1, setPembimbing1] = useState("");
  const [pembimbing2, setPembimbing2] = useState("");
  const [judul, setJudul] = useState("");
  const [form_bimbingan1, setForm_Bimbingan1] = useState(0);
  const [form_bimbingan2, setForm_Bimbingan2] = useState(0);
  const [peminatanId, setPeminatanId] = useState(userInfo?.peminatan_id);
  const [docTA, setDocTA] = useState("");
  const [makalah, setMakalah] = useState("");
  const [isEnglish, setIsEnglish] = useState("");
  const [status, setStatus] = useState("");
  const [komentar, setKomentar] = useState("");
  const [statusLog, setStatusLog] = useState("");
  const isMounted = useRef(true);
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
    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      const res = await axios.get(`https://sofi.my.id/api/user/${userId}`, {
        signal,
      });
      return res.data.data.username;
    } catch (error) {
      return "-";
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const dataSidangEdit = await dispatch(checkSidang(cookies["auth-token"]));
      if (!dataSidangEdit.payload) {
        localStorage.setItem("errorMessage", "Sidang Tidak Ada");
        if (isMounted.current) navigate("/sidangs");
        return;
      }

      if (
        !["pengajuan", "ditolak oleh admin"].includes(
          dataSidangEdit.payload.status
        ) &&
        !jwtDecoded.role.find((role) => ["RLADM"].includes(role))
      ) {
        if (isMounted.current)
          navigate(`/sidangs/${dataSidangEdit.payload.id}`);
        return;
      }
      setForm_Bimbingan1(dataSidangEdit?.payload.form_bimbingan1);
      setForm_Bimbingan2(dataSidangEdit?.payload.form_bimbingan2);
      setPembimbing1(dataSidangEdit?.payload.pembimbing1_id);
      setPembimbing2(dataSidangEdit?.payload.pembimbing2_id);
      setJudul(dataSidangEdit?.payload.judul);

      dispatch(fetchLecturer());

      const resUserInfo = await axios.get(
        `https://sofi.my.id/api/student/${jwtDecoded.id}`,
        { signal }
      );
      setUserInfo(resUserInfo.data.data);
      setPeminatanId(resUserInfo.data.data.peminatan_id);

      const resPeminatans = await axios.post(
        "https://sofi.my.id/api/peminatans",
        {
          kk: resUserInfo.data.data.kk,
        },
        { signal }
      );
      setPeminatans(resPeminatans.data.data);

      const formatStatusLog = await Promise.all(
        dataSidangEdit?.payload?.status_logs?.map(async (value) => {
          const manipulatedData = await formatUser(value.created_by);
          return { ...value, created_by: manipulatedData };
        })
      );
      setStatusLog(formatStatusLog);

      const resALlPeriods = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/period/get`,
        {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
            "ngrok-skip-browser-warning": true,
          },
        },
        { signal }
      );

      setPeriods(resALlPeriods.data.data);

      if (params.id != dataSidangEdit.payload.id) {
        if (isMounted.current) navigate("/home");
        return;
      }
    } catch (error) {
      if (error.response?.status !== 404 || error.message === "Network Error") {
        localStorage.setItem("errorMessage", "Network Error");
        if (isMounted.current) navigate("/home");
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const dataSidangEdit = await dispatch(
          checkSidang(cookies["auth-token"])
        );
        if (!dataSidangEdit.payload) {
          localStorage.setItem("errorMessage", "Sidang Tidak Ada");
          if (isMounted.current) navigate("/sidangs");
          return;
        }

        if (
          !["pengajuan", "ditolak oleh admin"].includes(
            dataSidangEdit.payload.status
          ) &&
          !jwtDecoded.role.find((role) => ["RLADM"].includes(role))
        ) {
          if (isMounted.current)
            navigate(`/sidangs/${dataSidangEdit.payload.id}`);
          return;
        }
        setForm_Bimbingan1(dataSidangEdit?.payload.form_bimbingan1);
        setForm_Bimbingan2(dataSidangEdit?.payload.form_bimbingan2);
        setPembimbing1(dataSidangEdit?.payload.pembimbing1_id);
        setPembimbing2(dataSidangEdit?.payload.pembimbing2_id);
        setJudul(dataSidangEdit?.payload.judul);

        dispatch(fetchLecturer());

        const resUserInfo = await axios.get(
          `https://sofi.my.id/api/student/${jwtDecoded.id}`,
          { signal }
        );
        setUserInfo(resUserInfo.data.data);
        setPeminatanId(resUserInfo.data.data.peminatan_id);

        const resPeminatans = await axios.post(
          "https://sofi.my.id/api/peminatans",
          {
            kk: resUserInfo.data.data.kk,
          },
          { signal }
        );
        setPeminatans(resPeminatans.data.data);

        const formatStatusLog = await Promise.all(
          dataSidangEdit?.payload?.status_logs?.map(async (value) => {
            const manipulatedData = await formatUser(value.created_by);
            return { ...value, created_by: manipulatedData };
          })
        );
        setStatusLog(formatStatusLog);

        const resALlPeriods = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/period/get`,
          {
            headers: {
              Authorization: `Bearer ${cookies["auth-token"]}`,
              "ngrok-skip-browser-warning": true,
            },
          },
          { signal }
        );

        setPeriods(resALlPeriods.data.data);

        if (params.id != dataSidangEdit.payload.id) {
          if (isMounted.current) navigate("/home");
          return;
        }
      } catch (error) {
        if (
          error.response?.status !== 404 ||
          error.message === "Network Error"
        ) {
          localStorage.setItem("errorMessage", "Network Error");
          if (isMounted.current) navigate("/home");
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    return () => {
      isMounted.current = false;
      abortController.abort();
    };
  }, []);

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
        const updateData = await dispatch(
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
        console.log(updateData);
        if (updateData.type === "updateSidang/fulfilled") {
          localStorage.setItem("successMessage", "Sidang berhasil diedit");
          if (isMounted.current) navigate("/sidangs/create");
          return;
        }
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
                                  <DownloadButton
                                    url={`${import.meta.env.VITE_API_URL}${
                                      dataSidang.data.doc_ta
                                    }`}
                                  />
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
                                  <DownloadButton
                                    url={`${import.meta.env.VITE_API_URL}${
                                      dataSidang.data.makalah
                                    }`}
                                  />
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
                          <button className="btn btn-primary mx-1">
                            Simpan
                          </button>
                          <Link to="/home" className="btn btn-secondary mx-1">
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
