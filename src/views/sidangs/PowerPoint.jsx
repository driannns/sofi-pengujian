import { MainLayout } from "../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkSidang } from "../../store/sidangSlicer";
import { uploadSlide } from "../../store/dokumentLogSlicer";
import { useCookies } from "react-cookie";
import { isLoadingTrue, isLoadingFalse } from "../../store/loadingSlicer";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";

const MateriPresentasi = () => {
  const dataSidang = useSelector((state) => state.sidang);
  const isLoading = useSelector((state) => state.loading.loading);
  const dokumenLog = useSelector((state) => state.dokumenLog);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies] = useCookies();

  const [periodNow, setPeriodNow] = useState(null);
  const [oldPeriod, setOldPeriod] = useState(null);
  const [slide, setSlide] = useState(null);
  const [file, setFile] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const fetchSlide = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/slide/get-latest-slide`,
        {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      //? bingung ini error.response.data.code atau error.response.status?
      console.log(res.data);
      if (res.data.code === 200) {
        setSlide(res.data.data);
      }
    } catch (error) {
      if (error.response.data.code !== 404) {
        localStorage.setItem("errorMessage", "Network Error");
        navigate("/home");
        return;
      }
    }
  };

  const handleUploadSlide = async (e) => {
    try {
      e.preventDefault();
      await dispatch(
        uploadSlide({ authToken: cookies["auth-token"], slide: file })
      );
      fetchSlide();
      setFile("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(isLoadingTrue());

        const resPeriodNow = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/period/check-period`,
          {
            headers: {
              Authorization: `Bearer ${cookies["auth-token"]}`,
              "ngrok-skip-browser-warning": true,
            },
          }
        );
        if (resPeriodNow.data.code === 200) {
          setPeriodNow(resPeriodNow.data.data);
        }

        dispatch(checkSidang(cookies["auth-token"]));

        if (!dataSidang.data) {
          localStorage.setItem("errorMessage", "Anda belum mendaftar sidang!");
          navigate(-1);
          return;
        }

        if (
          dataSidang.data.status === "sudah dijadwalkan" ||
          dataSidang.data.status === "tidak lulus (sudah dijadwalkan)"
        ) {
          localStorage.setItem(
            "warningMessage",
            "Sidang anda sudah dijadwalkan, tidak dapat merubah file presentasi"
          );
          navigate("/schedule/mahasiswa"); //?Belum dibuat
          return;
        }

        if (
          dataSidang.data.status !== "telah disetujui admin" &&
          dataSidang.data.status !== "belum dijadwalkan" &&
          dataSidang.data.status !== "tidak lulus" &&
          dataSidang.data.status !== "tidak lulus (sudah update dokumen)" &&
          dataSidang.data.status !== "tidak lulus (belum dijadwalkan)"
        ) {
          localStorage.setItem(
            "errorMessage",
            "Sidang anda belum di approve dosen pembimbing dan admin"
          );
          navigate(-1);
          return;
        }

        await fetchSlide();

        if (dataSidang.data.status === "tidak lulus") {
          setOldPeriod(dataSidang.data.period_id);
          const resPeriodNow = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/period/get/${
              dataSidang.data.period_id
            }`,
            {
              headers: {
                Authorization: `Bearer ${cookies["auth-token"]}`,
                "ngrok-skip-browser-warning": true,
              },
            }
          );
          if (resPeriodNow.data.code === 200) {
            setPeriodNow(resPeriodNow.data.data);
          }
        }
      } catch (error) {
        if (
          error.response?.status !== 404 ||
          error.message === "Networking error"
        ) {
          localStorage.setItem("errorMessage", "Network error");
          navigate(-1);
          return;
        }
      } finally {
        dispatch(isLoadingFalse());
      }
    };

    fetchData();
  }, []);

  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <>
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
              <Alert type="success" />
              <Alert type="danger" />
              {dataSidang.data &&
                (dataSidang.data.status === "tidak lulus" ||
                  dataSidang.data.status ===
                    "titak lulus (sudah update dokumen)" ||
                  dataSidang.data.status ===
                    "tidak lulus (belum dijadwalkan)") && (
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card">
                        <div className="card-body">
                          <form>
                            <input
                              type="text"
                              name="sidang_id"
                              defaultValue={
                                dataSidang.data && dataSidang.data.id
                              }
                              hidden
                            />
                            <div className="form-group col-sm-6">
                              <p>
                                Pastikan anda mengupload berkas TA sesuai yang
                                anda revisi
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
                                <label htmlFor="">
                                  Dokumen TA Sidang Ulang
                                </label>
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
                            Format file <b> .ppt </b> atau <b> .pptx </b>{" "}
                            (maksimal 10mb)
                          </p>
                        </div>
                        <div className="col">
                          <form onSubmit={handleUploadSlide}>
                            <input
                              type="text"
                              name="sidang_id"
                              defaultValue={
                                dataSidang.data && dataSidang.data.id
                              }
                              hidden
                            />
                            <div className="input-group mb-3">
                              <div className="custom-file">
                                {slide ? (
                                  <>
                                    <input
                                      type="file"
                                      className="custom-file-input forminput"
                                      onChange={handleFileChange}
                                      name="slide"
                                    />
                                    <label className="custom-file-label">
                                      {slide.file_url}
                                    </label>
                                  </>
                                ) : (
                                  <>
                                    <input
                                      type="file"
                                      className="custom-file-input forminput"
                                      name="slide"
                                      onChange={handleFileChange}
                                      required
                                    />
                                    <label className="custom-file-label">
                                      Upload Filed
                                    </label>
                                  </>
                                )}
                              </div>
                            </div>
                            {slide ? (
                              <div className="row ml-0">
                                <a
                                  href={`${import.meta.env.VITE_API_URL}${
                                    slide.file_url
                                  }`}
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
        </>
      )}
    </MainLayout>
  );
};

export default MateriPresentasi;
