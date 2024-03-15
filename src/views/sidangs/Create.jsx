import { MainLayout } from "../layouts/MainLayout";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../middleware/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { fetchLecturerList } from "../../store/modules/lecturer/action";
import { createSidang, checkSidang } from "../../store/modules/sidang/action";
import Alert from "../../components/Alert";

import "sweetalert2/dist/sweetalert2.min.css";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const tokenSSO =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiM2M4MWNmNTZiZTg3ZTY4MThjMDhlMjkyNDdkMjBhM2E0Mjc1OWJkNWMyMDNlNGU5Y2Y0ZDk1ZDNhODUxYzI5MzI0MTRkNmI4OTdjMjk1NjkiLCJpYXQiOjE3MTAxNjc3MjYsIm5iZiI6MTcxMDE2NzcyNiwiZXhwIjoxNzEwMjU0MTI2LCJzdWIiOiJla2t5bm92cml6YWxhbSIsInNjb3BlcyI6WyJjZWxvZS1kYXNoYm9hcmQiLCJvbGQtZG9zZW4iLCJvbGQtZG9zZW4td2FsaSIsImFkbWlzc2lvbi1hZG1pbiIsImFkbWlzc2lvbi1kYXNoYm9hcmQtdXNlcnMiLCJhdHRlbmRhbmNlLWVtcGxveWVlIiwiZGFzaGJvYXJkLXVzZXIiLCJuZXctc3NvIiwib2xkLXBlZ2F3YWkiLCJzc28tb3BlbmxpYiIsInN0YWZmX3Rlc3Rfc3BzIiwib2xkLWtlbG9tcG9rLWtlYWhsaWFuIiwiZW1wbG95ZWUtc3RydWN0dXJhbCIsIm9sZC1hZG1pbi1yZWdpc3RyYXNpLWZha3VsdGFzIl19.UkjYitwG_c4hk4__7AHL01gsEYcbsfbxlUEjQiXjAgW0IYmfV0ZpL4WZnrffrO3yYGFLeaoINQWUaD-mS3z9OR6jB0adQ9y9EQxsxY0raTLuuhwU-tXq9-DVOo1sN7ZpQWPAXywHKnm1WvIJ-9hWuhY0s7EtHXCVCSSN628wMJp6srcnwLvykHSasE2iXDlwoEjhRaD_lWOClf1WFIoYfTy8o0eSHZ8jRGTmrCyXhB2n3-MTFz7AHiJH3agSNk_lGS4iHVTJdE2Byk6KQdUDyQYuOOp1toEsoCB9iei8tdX1Ua6Nu-DO6nSX_yQXUK5qF5tML5v2dhAjiD1b8FmdMsRekWM6WnmPtx-j3n4FMLN5_H-VGukxrPYEM_oVzkYcGTTJrtdFTAJ7Emeizu0gYxWLoRYIox6uQ_OI79N35_9w9kmKU3bUI1E8xF0eJY1NhlPot6xIC6Xt2p2Zgu94S7zkH3f4z_mpd1pK7cck9qWnefYDBkvbd4agfXry4JIJ1Xqkmy666qJvyR-_1QYcY46mt1VRpWRUNfPsEDr_1woPAmabyYZyDf4gWAvb26yUDDw6mq4F2hV8KoREDUF_R1fwqIQBGoojC4lU3BW9BGYv-TM5GNIHpkiRyW6gBWbeSjAUkd0CGbZUlygFQ5Xr7HpVj_E1a2Hz-ix5jOvXObs";
const getAllStudentAPI =
  "https://dev-gateway.telkomuniversity.ac.id/bf7b719639cf0e2ef94a1cf212e00ce6/2324-2"; //2324-2
const getStatusLog =
  "https://dev-gateway.telkomuniversity.ac.id/d650182722315309a25aa5a43a033303/2324-2"; //2324-2
const testLocal = "http://127.0.0.1:8000/api";

const SidangCreate = () => {
  const dispatch = useDispatch();
  const { data: dataLecturer } = useSelector((state) => state.lecturer);
  const { data: dataSidang } = useSelector((state) => state.sidang);
  const { roles } = useAuth();
  const location = useLocation();
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
  const [isEnglish, setIsEnglish] = useState("");
  const [status, setStatus] = useState("");
  const [komentar, setKomentar] = useState("");
  const [docTA, setDocTA] = useState("");
  const [makalah, setMakalah] = useState("");
  const [peminatanId, setPeminatanId] = useState(
    userInfo.peminatan_id ? userInfo.peminatan_id : ""
  );
  const form_bimbingan1 =
    dataStudent.totalguidance_advisor1 === null
      ? 0
      : dataStudent.totalguidance_advisor1;
  const form_bimbingan2 =
    dataStudent.totalguidance_advisor2 === null
      ? 0
      : dataStudent.totalguidance_advisor2;

  const jwtDecoded = jwtDecode(cookies["auth-token"]);

  const handleDocTAChange = (e) => {
    setDocTA(e.target.files[0]);
  };

  const handleMakalahChange = (e) => {
    setMakalah(e.target.files[0]);
  };

  const fetchSidangData = async () => {
    try {
      setIsLoading(true);
      await dispatch(checkSidang(cookies["auth-token"]));
    } catch (err) {
      console.error("Error fetching sidang data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSidangData();
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (dataSidang.data && dataSidang.data.code === 200) {
          console.log;
          if (dataSidang.data.code === 200) {
            if (
              dataSidang.data.data.status === "pengajuan" ||
              dataSidang.data.data.status === "ditolak oleh admin"
            ) {
              navigate(`/sidangs/${dataSidang.data.data.id}/edit`);
            } else {
              navigate(`/sidangs/${dataSidang.data.data.id}`);
            }
          }
        }
        setIsLoading(true);
        dispatch(fetchLecturerList());

        const resUserInfo = await axios.get(
          `${testLocal}/student/${jwtDecoded.id}`
        );
        setUserInfo(resUserInfo.data.data);
        // Get Period Now
        //? const periodNow = await axios.get(`${apiSOFI}/period/check-period`, {
        //?   headers: {
        //?     Authorization: "Bearer " + cookies["auth-token"],
        //?  },
        //? });

        // Parameter

        const resStudentData = await axios.get(
          // `${getAllStudentAPI}/${resUserInfo.data.data.nim}`,
          `${getAllStudentAPI}/1202204011`,
          {
            headers: {
              Authorization: `Bearer ${tokenSSO} `,
            },
          }
        );

        if (!resStudentData) {
          localStorage.setItem(
            "errorMessage",
            "Anda tidak terdaftar di periode akademik ini"
          );
          navigate("/home");
        }
        setDataStudent(resStudentData.data.data[0]);

        const resStatusLog = await axios.get(
          // `${getStatusLog}/${resUserInfo.data.data.nim}`,
          `${getStatusLog}/"1202204011"`,
          {
            headers: { Authorization: `Bearer ${tokenSSO}` },
          }
        );
        setStatusLog(resStatusLog.data.data[0]);

        const resPeminatans = await axios.post(`${testLocal}/peminatans`, {
          kk: resUserInfo.data.data.kk,
        });
        setPeminatans(resPeminatans.data.data);

        const resALlPeriods = await axios.get(`${testLocal}/allPeriod`);
        setPeriods(resALlPeriods.data.data);
      } catch (e) {
        console.error("Erorr fetching data:", e);
      } finally {
        setIsLoading(false);
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
        fetchSidangData();
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }

  return (
    <MainLayout>
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
            {sessionStorage.getItem("errorMessage") && (
              <Alert
                message={sessionStorage.getItem("errorMessage")}
                type="danger"
              />
            )}
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
                      {location.pathname == "/sidangs/create" && (
                        <>
                          <input
                            type="text"
                            name="credit_complete"
                            value={dataStudent && dataStudent.credit_complete}
                            hidden
                          />
                          <input
                            type="text"
                            name="credit_uncomplete"
                            value={dataStudent && dataStudent.credit_uncomplete}
                            hidden
                          />
                        </>
                      )}

                      {/* <!-- Period Id Field --> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="period_id">Peiod Sidang: </label>
                        {isLoading ? (
                          <Skeleton height={30} />
                        ) : roles &&
                          roles.find((role) => !["RLADM"].includes(role)) ? (
                          <select
                            name="period_id"
                            id="period_id"
                            className="select2 form-control"
                            value={periodId}
                            onChange={(e) => setPeriodId(e.target.value)}
                          >
                            <option value="">Pilih Periode</option>
                            {periods &&
                              Object.entries(periods).map(([key, value]) => (
                                <option value={key} key={key}>
                                  {value}
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
                              {/* <option value=""></option> */}
                              //? bingung ini kenapa disabled
                              {periods &&
                                Object.entries(periods).map(([key, value]) => (
                                  <option value={key} key={key}>
                                    {value}
                                  </option>
                                ))}
                            </select>
                            <input
                              type="hidden"
                              name="period_id"
                              value={
                                dataSidang.length > 0 &&
                                dataSidang.data.data.period_id
                              }
                            />
                            //? ini diambil dari database sidang walaupun
                            dicreate? API AFIF
                          </>
                        )}
                      </div>

                      {/* } <!-- Mahasiswa Id Field --> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="mahasiswa_id">NIM Mahasiswa:</label>
                        {isLoading ? (
                          <Skeleton height={30} />
                        ) : (
                          <input
                            type="number"
                            value={userInfo.nim}
                            className="form-control"
                            disabled
                          />
                        )}
                        <input
                          type="hidden"
                          name="mahasiswa_id"
                          value={userInfo.nim}
                        />
                      </div>

                      {/* <!-- Pembimbing1 Id Field --> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="pembinbing1_id">
                          Kode Dosen Pembimbing 1:
                        </label>
                        {isLoading ? (
                          <Skeleton height={30} />
                        ) : (
                          <select
                            className="form-control select2"
                            name="pembimbing1_id"
                            value={pembimbing1}
                            onChange={(e) => setPembimbing1(e.target.value)}
                          >
                            <option value="">Pilih Pembimbing 1</option>
                            {dataLecturer &&
                              dataLecturer.map((data, index) =>
                                dataSidang.length > 0 ? (
                                  <option key={index} value={data.id}>
                                    {data.code} - {data.user.nama}
                                  </option>
                                ) : (
                                  <option
                                    key={index}
                                    value={data.id}
                                    selected={
                                      dataSidang.length > 0 &&
                                      dataSidang.data.data.pembimbing1_id ===
                                        data.id
                                    }
                                  >
                                    {data.code} - {data.user.nama}
                                  </option>
                                  //? Ini Pake Lecturer ID kalau di SOFI LAmA
                                )
                              )}
                            //? Perkondisian jika sidang == null belum
                          </select>
                        )}
                      </div>

                      {/* <!-- Pembimbing2 Id Field --> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="pembimbing2_id">
                          Kode Dosen Pembimbing 2:
                        </label>
                        {isLoading ? (
                          <Skeleton height={30} />
                        ) : (
                          <select
                            className="form-control select2"
                            name="pembimbing2_id"
                            value={pembimbing2}
                            onChange={(e) => {
                              setPembimbing2(e.target.value);
                            }}
                          >
                            <option value="">Pilih Pembimbing 2</option>
                            {dataLecturer &&
                              dataLecturer.map((data, index) =>
                                dataSidang.length > 0 ? (
                                  <option key={index} value={data.id}>
                                    {data.code} - {data.user.nama}
                                  </option>
                                ) : (
                                  <option
                                    key={index}
                                    value={data.id}
                                    selected={
                                      dataSidang.length > 0 &&
                                      dataSidang.data.data.pembimbing2_id ===
                                        data.id
                                    }
                                  >
                                    {data.code} - {data.user.nama}
                                  </option>
                                  //? Ini Pake Lecturer ID kalau di SOFI LAmA
                                )
                              )}
                            //? Perkondisian jika sidang == null belum
                          </select>
                        )}
                      </div>

                      {/* <!-- Judul Field --> */}
                      <div className="form-group col-sm-12 col-lg-12">
                        <label htmlFor="judul">Judul Tugas Akhir:</label>
                        {isLoading ? (
                          <Skeleton height={85} />
                        ) : (
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
                        )}
                      </div>

                      {/* <!-- Form Bimbingan Field --> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="form_bimbingan">
                          Jumlah Bimbingan:
                        </label>
                        {isLoading ? (
                          <Skeleton height={30} />
                        ) : (
                          <>
                            <input
                              type="text"
                              id="form_bimbingan1"
                              value={form_bimbingan1}
                              className="form-control"
                              disabled
                            />
                            <input
                              type="text"
                              id="form_bimbingan2"
                              value={form_bimbingan2}
                              className="form-control"
                              disabled
                            />
                          </>
                        )}
                        <input
                          type="hidden"
                          value={`${form_bimbingan1};${form_bimbingan2}`}
                        />
                      </div>

                      {/* <!-- Status Form Field --> */}

                      <div className="form-group col-sm-12">
                        <label htmlFor="lecturer_status">
                          Status Igracias:
                        </label>
                        {isLoading ? (
                          <Skeleton height={30} />
                        ) : (
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
                        )}
                      </div>

                      {/* <!-- KK Field --> */}
                      <div className="form-group col-sm-12 col-lg-12">
                        <label htmlFor="kk">Kelompok Keahlian:</label>
                        {isLoading ? (
                          <Skeleton height={30} />
                        ) : (
                          <input
                            type="text"
                            name="form_bimbingan1"
                            className="form-control"
                            value={userInfo.kk}
                            disabled
                          />
                        )}
                      </div>

                      {/* <!-- peminatans Field --> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="peminatans">Peminatan:</label>
                        {isLoading ? (
                          <Skeleton height={30} />
                        ) : (
                          <select
                            className="form-control select2"
                            name="peminatan"
                            value={peminatanId}
                            onChange={(e) => setPeminatanId(e.target.value)}
                          >
                            <option value="">Pilih Peminatan</option>
                            //? perkondisian jika sidang == null dan
                            old('$peminatan') ? 'selected' : '' //?
                            {peminatans &&
                              peminatans.map((data, index) =>
                                dataSidang.data ? (
                                  <option value={data.id} key={index}>
                                    {data.nama}
                                  </option>
                                ) : (
                                  <option value={data.id} key={index}>
                                    {data.nama}
                                  </option>
                                )
                              )}
                          </select>
                        )}
                      </div>

                      {/* <!-- Eprt Field --> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="eprt">EPRT:</label>
                        {isLoading ? (
                          <Skeleton height={30} />
                        ) : (
                          <input
                            type="text"
                            name="eprt"
                            className="form-control"
                            value={userInfo.eprt}
                            disabled
                          />
                        )}
                        <input
                          type="hidden"
                          name="eprt"
                          value={userInfo.eprt}
                        />
                      </div>

                      {/* <!-- Tak Field --> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="tak">TAK:</label>
                        {isLoading ? (
                          <Skeleton height={30} />
                        ) : (
                          <input
                            type="text"
                            className="form-control"
                            name="tak"
                            value={userInfo.tak}
                            disabled
                          />
                        )}
                        <input type="hidden" name="tak" value={userInfo.tak} />
                      </div>

                      {roles &&
                      roles.find((role) => !["RLADM"].includes(role)) ? (
                        <>
                          {/* <!-- Dokumen Ta Field --> */}
                          <div className="form-group col-sm-12">
                            <label htmlFor="dokumen_ta">
                              Draft Dokumen TA:
                            </label>
                            {isLoading ? (
                              <>
                                <br />
                                <Skeleton height={30} width={90} />
                              </>
                            ) : dataSidang.data &&
                              dataSidang.data.data.doc_ta ? (
                              <p>
                                <a
                                  href="/{{$dokumen_ta->file_url}}"
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
                            {isLoading ? (
                              <Skeleton height={30} />
                            ) : (
                              <input
                                type="file"
                                name="dokumen_ta"
                                onChange={handleDocTAChange}
                                className="form-control"
                              />
                            )}
                          </div>

                          {/* <!-- Makalah Field -/-> */}
                          <div className="form-group col-sm-12">
                            <label htmlFor="makalah">Jurnal:</label>
                            {isLoading ? (
                              <>
                                <br />
                                <Skeleton height={30} width={90} />
                              </>
                            ) : dataSidang.data &&
                              dataSidang.data.data.makalah ? (
                              <p>
                                <a
                                  href="/{{$makalah->file_url}}"
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

                            {isLoading ? (
                              <Skeleton height={30} />
                            ) : (
                              <input
                                type="file"
                                name="makalah"
                                onChange={handleMakalahChange}
                                className="form-control"
                              />
                            )}
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
    </MainLayout>
  );
};

export default SidangCreate;
