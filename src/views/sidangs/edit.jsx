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

import "sweetalert2/dist/sweetalert2.min.css";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const tokenAfif =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjA4LCJ1c2VybmFtZSI6IjExMDIxMzAyNDQiLCJuYW1hIjoiWUFaSUQiLCJuaW0iOjExMDIxMzAyNDQsIm5pcCI6bnVsbCwicm9sZSI6WyJSTE1IUyJdfQ.xmXkBtO-i71wlaLGwlc1hz53iqdOlxDvYH4eEe-JRLc";
const testLocal = "http://127.0.0.1:8000/api";

const SidangEdit = () => {
  const dispatch = useDispatch();
  const { data: dataLecturer } = useSelector((state) => state.lecturer);
  const { data: dataSidang } = useSelector((state) => state.sidang);

  const { roles } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

  const [periodId, setPeriodId] = useState("");
  const [pembimbing1, setPembimbing1] = useState(
    dataSidang.data ? dataSidang.data.data.pembimbing1_id : ""
  );
  const [pembimbing2, setPembimbing2] = useState(
    dataSidang.data ? dataSidang.data.data.pembimbing2_id : ""
  );
  const [judul, setJudul] = useState(
    dataSidang.data ? dataSidang.data.data.judul : ""
  );
  const form_bimbingan1 =
    dataSidang.data && dataSidang.data.data.form_bimbingan1;
  const form_bimbingan2 =
    dataSidang.data && dataSidang.data.data.form_bimbingan2;
  const [isEnglish, setIsEnglish] = useState("");
  const [status, setStatus] = useState("");
  const [komentar, setKomentar] = useState("");
  const [docTA, setDocTA] = useState("");
  const [makalah, setMakalah] = useState("");
  const [peminatanId, setPeminatanId] = useState("");
  const jwtDecoded = jwtDecode(cookies["auth-token"]);

  const handleDocTAChange = (e) => {
    setDocTA(e.target.files[0]);
  };

  const handleMakalahChange = (e) => {
    setMakalah(e.target.files[0]);
  };

  useEffect(() => {
    const fetchSidang = async () => {
      try {
        setIsLoading(true);
        await dispatch(checkSidang(cookies["auth-token"]));
      } catch (err) {
        console.error("Error fetching sidang data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSidang();
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        dispatch(fetchLecturerList());

        const resUserInfo = await axios.get(
          `${testLocal}/student/${jwtDecoded.id}`
        );

        setUserInfo(resUserInfo.data.data);

        const resPeminatans = await axios.post(`${testLocal}/peminatans`, {
          kk: resUserInfo.data.data.kk,
        });
        setPeminatans(resPeminatans.data.data);

        //* STATUS LOG

        // Parameter
        const resAllPeriods = await axios.get(
          "https://fdc9-36-65-247-251.ngrok-free.app/api/period/get",
          {
            headers: {
              Authorization: "Bearer " + tokenAfif,
              "ngrok-skip-browser-warning": true,
            },
          }
        );

        if (!dataSidang.data) {
          navigate("/sidangs");
        }

        setPeriods(resAllPeriods.data.data);
      } catch (e) {
        console.error("Erorr fetching data:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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
          {location.state &&
            location.state.error(
              <div className="alert alert-danger" role="alert">
                {location.state.error}
              </div>
            )}
          {/* @endif */}
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={attend2}>
                    {/* <!-- Period Id Field --> */}
                    <div className="form-group col-sm-12">
                      <label htmlFor="period_id">Period Sidang: </label>
                      {isLoading ? (
                        <Skeleton height={30} />
                      ) : roles &&
                        roles.find((role) => !["RLADM"].includes(role)) ? (
                        <select
                          name="period_id"
                          id="period_id"
                          className="select2 form-control"
                          onChange={(e) => setPeriodId(e.target.value)}
                          value={periodId}
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
                            {/* <option value=""></option> */}
                            //? bingung ini kenapa disabled
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
                            // value={dataSidang && dataSidang.data.data.period_id}
                          />
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
                              dataSidang ? (
                                <option
                                  key={index}
                                  value={data.id}
                                  selected={
                                    data.id ===
                                    dataSidang.data.data.pembimbing1_id
                                  }
                                >
                                  {data.code} - {data.user.nama}
                                </option>
                              ) : (
                                <option key={index} value={data.id}>
                                  {data.code} - {data.user.nama}
                                </option>
                              )
                            )}
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
                              dataSidang ? (
                                <option key={index} value={data.id}>
                                  {data.code} - {data.user.nama}
                                </option>
                              ) : (
                                <>
                                  <option
                                    key={index}
                                    value={data.code}
                                    selected={
                                      dataSidang &&
                                      data.id ===
                                        dataSidang.data.data.pembimbing2_id
                                    }
                                  >
                                    {data.code} - {data.fullname}
                                  </option>
                                  test
                                </>
                              )
                            )}
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
                          onChange={(e) => {
                            setJudul(e.target.value);
                          }}
                          value={judul}
                          className="form-control"
                        />
                      )}
                    </div>

                    {/* <!-- Form Bimbingan Field --> */}
                    <div className="form-group col-sm-12">
                      <label htmlFor="form_bimbingan">Jumlah Bimbingan:</label>
                      {isLoading ? (
                        <Skeleton height={30} />
                      ) : (
                        <>
                          <input
                            type="text"
                            id="form_bimbingan1"
                            value={`Pembimbing 1:${form_bimbingan1}`}
                            className="form-control"
                            disabled
                          />
                          <input
                            type="text"
                            id="form_bimbingan2"
                            value={`Pembimbing 2:${form_bimbingan2}`}
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
                              dataSidang ? (
                                <option value={data.id} key={index}>
                                  {data.nama}
                                </option>
                              ) : (
                                <option
                                  value={data.id}
                                  key={index}
                                  selected={data.id === userInfo.peminatan_id}
                                >
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
                      <input type="hidden" name="eprt" value={userInfo.eprt} />
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
                          <label htmlFor="dokumen_ta">Draft Dokumen TA:</label>
                          {isLoading ? (
                            <>
                              <br />
                              <Skeleton height={30} width={90} />
                            </>
                          ) : dataSidang && dataSidang.data.data.doc_ta ? (
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
                              value={docTA}
                              onChange={(e) => setDocTA(e.target.files[0])}
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
                          ) : dataSidang.data.data.makalah ? (
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
                              value={makalah}
                              onChange={(e) => setMakalah(e.target.files[0])}
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
                            {Object.entries(statusList).map(([key, value]) => (
                              <option value={key} key={key}>
                                {value}
                              </option>
                            ))}
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
                    <table className="table table-striped" id="sidangs-table">
                      <thead>
                        <tr>
                          <td>Tanggal</td>
                          <td>Nama Event</td>
                          <td>Komentar</td>
                          <td>Oleh</td>
                        </tr>
                      </thead>
                      <tbody>
                        {/* @foreach($status_logs as $log) */}
                        <tr>
                          <td>
                            {/*{{ date('l, d F Y - d:m', strtotime($log->created_at)) }}*/}{" "}
                            tes
                          </td>
                          <td>{/*{{$log->name}}*/}tes</td>
                          <td>{/*{{$log->feedback}}*/}tes</td>
                          <td>{/*{{$log->user->username}}*/}tes</td>
                        </tr>
                        {/* @endforeach */}
                      </tbody>
                    </table>
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

export default SidangEdit;
