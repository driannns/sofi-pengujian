import { MainLayout } from "../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkSidang } from "../../store/sidangSlicer";
import { useCookies } from "react-cookie";
import Alert from "../../components/Alert";

const APISOFI = "https://6f73-180-253-71-196.ngrok-free.app";

const MateriPresentasi = () => {
  const dataSidang = useSelector((state) => state.sidang);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies] = useCookies();

  const [periodNow, setPeriodNow] = useState(null);
  const [oldPeriod, setOldPeriod] = useState(null);
  const [slide, setSlide] = useState(null);
  const [makalah, setMakalah] = useState();

  const handleDocTAChange = (e) => {
    setDocTA(e.target.files[0]);
  };

  const handleMakalahChange = (e) => {
    setDocTA(e.target.files[0]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataSidangStudent = await dispatch(
          checkSidang(cookies["auth-token"])
        );

        if (!dataSidangStudent.payload) {
          localStorage.setItem("errorMessae", "Anda belum mendaftar sidang!");
          navigate(-1);
        }

        if (
          dataSidangStudent.payload.status === "sudah dijadwalkan" ||
          dataSidangStudent.payload.status === "tidak lulus (sudah dijadwalkan)"
        ) {
          localStorage.setItem(
            "warningMessage",
            "Sidang anda sudah dijadwalkan, tidak dapat merubah file presentasi"
          );
          navigate("/schedule/mahasiswa"); //?Belum dibuat
        }

        if (
          !dataSidangStudent.payload.status.includes([
            "telah disetujui admin",
            "belum dijadwalkan",
            "tidak lulus",
            "tidak lulus (sudah update dokumen)",
            "tidak lulus (belum dijadwalkan)",
          ])
        ) {
          localStorage.setItem(
            "errorMessage",
            "Sidang anda belum di approve dosen pembimbing dan admin"
          );
          navigate(-1);
        }

        const res = await axios.get(`${APISOFI}/api/slide/get-latest-slide`, {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
            "ngrok-skip-warning-browser": true,
          },
        });

        console.log(res);
        setSlide(res.data);

        if (dataSidangStudent.payload.status === "tidak lulus") {
          setOldPeriod(dataSidangStudent.payload.period_id);
          const resPeriodNow = await axios.get(
            `${APISOFI}/api/period/get/${dataSidangStudent.payload.period_id}`,
            {
              headers: {
                Authorization: `Bearer ${cookies["auth-token"]}`,
                "ngrok-skip-browser-warning": true,
              },
            }
          );
          setPeriodNow(resPeriodNow.data);
        }
      } catch (err) {
        localStorage.setItem("errorMessage", "Network error");
        // navigate("/home");
        navigate(-1);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!dataSidang.data) {
      localStorage.setItem("errorMessage", "Anda belum mendaftar sidang!");
      navigate("/sidangs/create");
    }

    if (
      dataSidang.data?.status === "sudah dijadwalkan" ||
      dataSidang.data?.status === "tidak lulus (sudah dijadwalkan)"
    ) {
      localStorage.setItem("warningMessage", "Anda belum mendaftar sidang!");
      navigate("schedule/mahasiswa");
    }

    if (
      dataSidang.data &&
      !dataSidang.data.status.includes([
        "telah disetujui admin",
        "belum dijadwalkan",
        "tidak lulus",
        "tidak lulus (sudah update dokumen)",
        "tidak lulus (belum dijadwalkan)",
      ])
    ) {
      localStorage.setItem(
        "errorMessage",
        "Sidang anda belum di approve dosen pembimbing dan admin"
      );
      navigate(-1);
    }
  }, [dataSidang]);

  return (
    <MainLayout>
      <ol className="breadcrumb mb-0">
        <div className="col-12">
          <h3>MATERI PRESENTASI</h3>
          <hr className="mt-0" />
          <h6 className="mb-3">
            <Link to="/home" className="text-dark">
              BERANDA
            </Link>{" "}
            / UPLOAD MATERI PRESENTASI
          </h6>
        </div>
      </ol>

      <div className="container-fluid">
        <div className="animated fadeIn">
          {/*@include('flash::message') @include('coreui-templates::common.errors')*/}
          <Alert type="danger" />
          {dataSidang.data &&
            (dataSidang.data.status === "tidak lulus" ||
              dataSidang.data.status === "titak lulus (sudah update dokumen)" ||
              dataSidang.data.status === "tidak lulus (belum dijadwalkan)") && (
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <form>
                        {/* @csrf */}
                        <input
                          type="text"
                          name="sidang_id"
                          defaultValue={dataSidang.data && dataSidang.data.id}
                          hidden
                        />
                        <div className="form-group col-sm-6">
                          <p>
                            Pastikan anda mengupload berkas TA sesuai yang anda
                            revisi
                          </p>
                          <div className="form-group">
                            <label htmlFor="period_id">
                              Periode Sidang Ulang
                            </label>
                            <select
                              name="period_id"
                              id="period_id"
                              className="select2 form-control"
                              value={oldPeriod && oldPeriod}
                            >
                              {periodNow &&
                                periodNow.map((value, index) => (
                                  <option key={index} value={value.id}>
                                    {value.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label htmlFor="">Dokumen TA Sidang Ulang</label>
                            <div className="custom-file">
                              <input
                                type="file"
                                className="custom-file-input forminput"
                                name="doc_ta"
                                onChange={handleDocTAChange}
                              />
                              <label className="custom-file-label">
                                Choose file
                              </label>
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="">Jurnal Sidang Ulang</label>
                            <div className="custom-file">
                              <input
                                type="file"
                                className="custom-file-input forminput"
                                name="makalah"
                                onChange={handleMakalahChange}
                              />
                              <label className="custom-file-label">
                                Choose file
                              </label>
                            </div>
                          </div>
                          <button
                            type="submit"
                            name="button"
                            className="btn btn-primary"
                          >
                            Update
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <h2 className="text-right">
                        PILIH FILE MATERI PRESENTASI
                      </h2>
                      <p className="text-right">
                        Format file <b> .ppt </b> atau <b> .pptx </b> (maksimal
                        10mb)
                      </p>
                    </div>

                    <div className="col">
                      <form>
                        <input
                          type="text"
                          name="sidang_id"
                          defaultValue={dataSidang.data && dataSidang.data.id}
                          hidden
                        />
                        <div className="input-group mb-3">
                          <div className="custom-file">
                            {slide ? (
                              <>
                                <input
                                  type="file"
                                  className="custom-file-input forminput"
                                  name="slide"
                                />
                                <label className="custom-file-label">
                                  {slide.url}
                                </label>
                              </>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  className="custom-file-input forminput"
                                  name="slide"
                                  required
                                />
                                <label className="custom-file-label">
                                  Upload File
                                </label>
                              </>
                            )}
                          </div>
                        </div>
                        {slide ? (
                          <div className="row ml-0">
                            <a
                              href={`${APISOFI}/public/slides/${slide.url}`}
                              className="btn btn-danger mr-2"
                            >
                              Download
                            </a>
                            <br />
                            <button
                              type="submit"
                              name="button"
                              className="btn btn-outline-primary"
                            >
                              Upload Ulang
                            </button>
                          </div>
                        ) : (
                          <button
                            type="submit"
                            name="button"
                            className="btn btn-primary"
                          >
                            Upload
                          </button>
                        )}
                      </form>
                    </div>
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

export default MateriPresentasi;
