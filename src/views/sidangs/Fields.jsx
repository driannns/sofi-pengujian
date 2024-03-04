import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../middleware/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { fetchLecturerList } from "../../store/modules/lecturer/action";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const tokenSSO =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZmFmM2UxYTZkOTBkZWM2MDYyMDFiZjU1MzkzMzgzOTdjMjYzOGFlYTYyZmMyMDM0NGU5MzI5Zjg4YTY3YWRjZGI4Yzk1NjAwOTBmM2ZjNjkiLCJpYXQiOjE3MDkyNzcyMDYsIm5iZiI6MTcwOTI3NzIwNiwiZXhwIjoxNzA5MzYzNjA2LCJzdWIiOiJla2t5bm92cml6YWxhbSIsInNjb3BlcyI6WyJjZWxvZS1kYXNoYm9hcmQiLCJvbGQtZG9zZW4iLCJvbGQtZG9zZW4td2FsaSIsImFkbWlzc2lvbi1hZG1pbiIsImFkbWlzc2lvbi1kYXNoYm9hcmQtdXNlcnMiLCJhdHRlbmRhbmNlLWVtcGxveWVlIiwiZGFzaGJvYXJkLXVzZXIiLCJuZXctc3NvIiwib2xkLXBlZ2F3YWkiLCJzc28tb3BlbmxpYiIsInN0YWZmX3Rlc3Rfc3BzIiwib2xkLWtlbG9tcG9rLWtlYWhsaWFuIiwiZW1wbG95ZWUtc3RydWN0dXJhbCIsIm9sZC1hZG1pbi1yZWdpc3RyYXNpLWZha3VsdGFzIl19.RS7v3zkRBsgGnAqyFBH3IFEkW5sddqmYbg8uRjX6uS-3_S3wVmx5sqOodUlQr8fNS18dk-44lPwgBkrtC8m6pXgVrEU8-hlTbknqCXX-BGmM4j-kRv3SjjgbcAredazFMb8m1lxFMbbJohgJ2fitUDJwkryzdmz39LNKIAxBzLdAPTA8ttzRlURrfYzXlEGkBt5CZ_c5rsV0EV2F74l7X70WV4HPYWZwh1S3Z_iF29RVZpEd4MJQAcHVgyAN3MBQT0gX0cZNaQi3MOSFL7CE3qyxvOvzkGO3zwYxb79mRtJ5Xd0CBWfU4oN3HFGB7OPAcTNUh_xfXFp2nc13JvCFzbIhxLPeBD7Mvpkey-9lNkVpggyn5h_5V52N9-gqyQIKVig4AYqTZTWdpMxviTGngZVaIG6lhYx44DYiQKtNL4orNU2K47qYKpWtglmbG2KH9dBYlrEd1xSBzQfkPgaombuPG0ZvbP4ZFbjC6sPLgys2RxEHJkMm6A_FAddhOoHjfQ8R8j-5nj2rD2_alLVn_PFQq2CRGRLWq28llGgzxfMZ5KgFBECTZxw9_6Vuq4silQSj85TXds_sYs5PFA_0D3QA9vBbGYlJHTbcR2k1yy7WZtqc_Z_0PCjXSPJuMjDgjKK0mzC_broWrxnaQo3BDqDLtj7xnnzp0-XB_TeGyBg";
const getAllStudentAPI =
  "https://dev-gateway.telkomuniversity.ac.id/bf7b719639cf0e2ef94a1cf212e00ce6/2324-2"; //2324-2
const getStatusLog =
  "https://dev-gateway.telkomuniversity.ac.id/d650182722315309a25aa5a43a033303/2324-2"; //2324-2
const testLocal = "http://127.0.0.1:8000/api";

const Fields = () => {
  const dispatch = useDispatch();
  const {
    loading: loadingLecturer,
    data: dataLecturer,
    error: errorLecturer,
  } = useSelector((state) => state.lecturer);

  const { roles } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const sidang = null; //Sidang set to Null DUMMY
  const [cookies] = useCookies();
  const [userInfo, setUserInfo] = useState({});
  const [dataStudent, setDataStudent] = useState({});
  const [statusLog, setStatusLog] = useState();
  const [peminatans, setPeminatans] = useState();
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
  const [pembimbing1, setPembimbing1] = useState("");
  const [pembimbing2, setPembimbing2] = useState("");
  const [judul, setJudul] = useState("");
  const [isEnglish, setIsEnglish] = useState("");
  const [status, setStatus] = useState("");
  const [komentar, setKomentar] = useState("");

  const jwtDecoded = jwtDecode(cookies["auth-token"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchLecturerList());

        const resUserInfo = await axios.get(
          `${testLocal}/student/${jwtDecoded.id}`
        );
        setUserInfo(resUserInfo.data.data);
        // Get Period Now
        // Check Sidang ifexist

        // Parameter

        const resStudentData = await axios.get(
          `${getAllStudentAPI}/${resUserInfo.data.data.nim}`,
          {
            headers: {
              Authorization: `Bearer ${tokenSSO} `,
            },
          }
        );

        if (resStudentData.data.data.length === 0) {
          navigate("/home", {
            state: {
              error: "Anda tidak terdaftar di periode akademik ini",
            },
          });
        }
        setDataStudent(resStudentData.data.data[0]);

        const resStatusLog = await axios.get(
          `${getStatusLog}/${resUserInfo.data.data.nim}`,
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
      }
    };
    fetchData();
  }, []);

  // const handleSubmit = (e) => {
  //   console.log("Berhasil diSubmit");
  // };

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
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("submit");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }

  return (
    <form onSubmit={attend2}>
      {/* Credit Field */}
      {location.pathname == "/sidangs/create" && ( // If Route /sidangs/create
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
            onChange={dataStudent && dataStudent.credit_uncomplete}
            hidden
          />
        </>
      )}

      {/* <!-- Period Id Field --> */}
      <div className="form-group col-sm-12">
        <label htmlFor="period_id">Peiod Sidang: </label>
        {roles && roles.find((role) => !["RLADM"].includes(role)) ? (
          <select
            name="period_id"
            id="period_id"
            className="select2 form-control"
            onChange={(e) => setPeriodId(e.target.value)}
            value={periodId}
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
              value={sidang && sidang.period_id}
            />
            //? ini diambil dari database sidang walaupun dicreate? API AFIF
          </>
        )}
      </div>

      {/* } <!-- Mahasiswa Id Field --> */}
      <div className="form-group col-sm-12">
        <label htmlFor="mahasiswa_id">NIM Mahasiswa:</label>
        <input
          type="number"
          value={userInfo.nim}
          className="form-control"
          disabled
        />
        <input type="hidden" name="mahasiswa_id" value={userInfo.nim} />
      </div>

      {/* <!-- Pembimbing1 Id Field --> */}
      <div className="form-group col-sm-12">
        <label htmlFor="pembinbing1_id">Kode Dosen Pembimbing 1:</label>
        <select
          className="form-control select2"
          name="pembimbing1_id"
          value={pembimbing1}
          onChange={(e) => setPembimbing1(e.target.value)}
        >
          <option value="">Pilih Pembimbing 1</option>
          {dataLecturer &&
            dataLecturer.map((data, index) =>
              sidang === null ? (
                <option key={index} value={data.lecturercode}>
                  {data.lecturercode} - {data.fullname}
                </option>
              ) : (
                <option
                  key={index}
                  value={data.lecturercode}
                  selected={sidang && data.id === sidang.peminatan_id}
                >
                  {data.lecturercode} - {data.fullname}
                </option>
                //? Ini Pake Lecturer ID kalau di SOFI LAmA
              )
            )}
          //? Perkondisian jika sidang == null belum
        </select>
      </div>
      {/* <!-- Pembimbing2 Id Field --> */}
      <div className="form-group col-sm-12">
        <label htmlFor="pembimbing2_id">Kode Dosen Pembimbing 2:</label>
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
              sidang === null ? (
                <option key={index} value={data.lecturercode}>
                  {data.lecturercode} - {data.fullname}
                </option>
              ) : (
                <option
                  key={index}
                  value={data.lecturercode}
                  selected={sidang && data.id === sidang.peminatan_id}
                >
                  {data.lecturercode} - {data.fullname}
                </option>
                //? Ini Pake Lecturer ID kalau di SOFI LAmA
              )
            )}
          //? Perkondisian jika sidang == null belum
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
          onChange={(e) => {
            setJudul(e.target.value);
          }}
          value={judul}
          className="form-control"
        />
      </div>

      {/* <!-- Form Bimbingan Field --> */}
      <div className="form-group col-sm-12">
        <label htmlFor="form_bimbingan">Jumlah Bimbingan:</label>
        <input
          type="text"
          id="form_bimbingan1"
          value={
            dataStudent && dataStudent.totalguidance_advisor1 === null
              ? 0
              : dataStudent.totalguidance_advisor1
          }
          className="form-control"
          disabled
        />
        <input
          type="text"
          id="form_bimbingan2"
          value={
            dataStudent && dataStudent.totalguidance_advisor2 === null
              ? 0
              : dataStudent.totalguidance_advisor2
          }
          className="form-control"
          disabled
        />
        <input
          type="hidden"
          value={`${
            dataStudent.totalguidance_advisor1 === null
              ? 0
              : dataStudent.totalguidance_advisor1
          };${
            dataStudent.totalguidance_advisor2 === null
              ? 0
              : dataStudent.totalguidance_advisor2
          }`}
        />
      </div>

      {/* <!-- Status Form Field --> */}
      {location.pathname === "/sidangs/create" && (
        <div className="form-group col-sm-12">
          <label htmlFor="lecturer_status">Status Igracias:</label>
          <input
            type="text"
            name="lecturer_status"
            className="form-control"
            value={
              statusLog && statusLog.lecturerstatus == "APPROVED"
                ? statusLog.lecturerstatus
                : "BELUM APPROVED"
            }
            readOnly
          />
        </div>
      )}

      {/* <!-- KK Field --> */}
      <div className="form-group col-sm-12 col-lg-12">
        <label htmlFor="kk">Kelompok Keahlian:</label>
        <input
          type="text"
          name="form_bimbingan1"
          className="form-control"
          value={userInfo.kk}
          disabled
        />
      </div>

      {/* <!-- peminatansns Field --> */}
      <div className="form-group col-sm-12">
        <label htmlFor="peminatans">Peminatan:</label>
        <select className="form-control select2" name="peminatan">
          <option value="">Pilih Peminatan</option>
          //? perkondisian jika sidang == null dan old('$peminatan') ?
          'selected' : '' //?
          {peminatans &&
            peminatans.map((data, index) =>
              sidang === null ? (
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
      </div>

      {/* <!-- Eprt Field --> */}
      <div className="form-group col-sm-12">
        <label htmlFor="eprt">EPRT:</label>
        <input
          type="text"
          name="eprt"
          className="form-control"
          value={userInfo.eprt}
          disabled
        />
        <input type="hidden" name="eprt" value={userInfo.eprt} />
      </div>

      {/* <!-- Tak Field --> */}
      <div className="form-group col-sm-12">
        <label htmlFor="tak">TAK:</label>
        <input
          type="text"
          className="form-control"
          name="tak"
          value={userInfo.tak}
          disabled
        />
        <input type="hidden" name="tak" value={userInfo.tak} />
      </div>

      {roles && roles.find((role) => !["RLADM"].includes(role)) ? (
        <>
          {/* <!-- Dokumen Ta Field --> */}
          <div className="form-group col-sm-12">
            <label htmlFor="dokumen_ta">Draft Dokumen TA:</label>
            {sidang &&
              (sidang.dokumen_ta ? (
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
              ))}
            <input type="file" name="dokumen_ta" className="form-control" />
          </div>

          {/* <!-- Makalah Field -/-> */}
          <div className="form-group col-sm-12">
            <label htmlFor="makalah">Jurnal:</label>
            {sidang &&
              (sidang.makalah ? (
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
              ))}
            <input type="file" name="makalah" className="form-control" />
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
  );
};

export default Fields;
