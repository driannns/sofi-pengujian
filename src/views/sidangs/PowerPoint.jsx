import { MainLayout } from "../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkSidang } from "../../store/sidangSlicer";
import { uploadSlide } from "../../store/dokumentLogSlicer";
import { useCookies } from "react-cookie";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import DownloadButton from "../../components/DownloadButton";
import axios from "axios";

const MateriPresentasi = () => {
  const dataSidang = useSelector((state) => state.sidang);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies] = useCookies();

  const [isLoading, setIsLoading] = useState(false);
  const [periodNow, setPeriodNow] = useState(null);
  const [oldPeriod, setOldPeriod] = useState(null);
  const [file, setFile] = useState("");
  const isMounted = useRef(true);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadSlide = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const resUploadSlide = await dispatch(
        uploadSlide({ authToken: cookies["auth-token"], slide: file })
      );
      console.log(resUploadSlide);
      if (
        resUploadSlide.payload ||
        resUploadSlide.type === "checkSidang/fulfilled"
      ) {
        await dispatch(checkSidang(cookies["auth-token"]));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setFile("");
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resPeriodNow = await axios.get(
          `/api/period/check-period`,
          {
            headers: {
              Authorization: `Bearer ${cookies["auth-token"]}`,
              "ngrok-skip-browser-warning": true,
            },
          },
          { signal }
        );
        if (resPeriodNow.data.code === 200) {
          setPeriodNow(resPeriodNow.data.data);
        }

        const dataSidangMHS = await dispatch(
          checkSidang(cookies["auth-token"])
        );

        if (!dataSidangMHS.payload) {
          localStorage.setItem("errorMessage", "Anda belum mendaftar sidang!");
          if (isMounted.current) navigate(-1);
          return;
        }

        if (
          dataSidangMHS.payload.status === "sudah dijadwalkan" ||
          dataSidangMHS.payload.status === "tidak lulus (sudah dijadwalkan)"
        ) {
          localStorage.setItem(
            "warningMessage",
            "Sidang anda sudah dijadwalkan, tidak dapat merubah file presentasi"
          );
          if (isMounted.current) navigate("/schedule/mahasiswa");
          return;
        }

        if (
          dataSidangMHS.payload.status !== "telah disetujui admin" &&
          dataSidangMHS.payload.status !== "belum dijadwalkan" &&
          dataSidangMHS.payload.status !== "tidak lulus" &&
          dataSidangMHS.payload.status !==
            "tidak lulus (sudah update dokumen)" &&
          dataSidangMHS.payload.status !== "tidak lulus (belum dijadwalkan)"
        ) {
          localStorage.setItem(
            "errorMessage",
            "Sidang anda belum di approve dosen pembimbing dan admin"
          );
          if (isMounted.current) navigate(-1);
          return;
        }

        if (dataSidangMHS.payload.status === "tidak lulus") {
          setOldPeriod(dataSidangMHS.payload.period_id);
          const resPeriodNow = await axios.get(
            `/api/period/get/${dataSidangMHS.payload.period_id}`,
            {
              headers: {
                Authorization: `Bearer ${cookies["auth-token"]}`,
                "ngrok-skip-browser-warning": true,
              },
            },
            { signal }
          );
          if (resPeriodNow.data.code === 200) {
            setPeriodNow(resPeriodNow.data.data);
          }
        }
      } catch (error) {
        console.error(error);
        console.error(error.response);
        if (
          error.response?.status !== 404 ||
          error.message === "Networking error"
        ) {
          localStorage.setItem("errorMessage", "Network error");
          if (isMounted.current) navigate(-1);
          return;
        }
        if (
          error.response?.status === 404 &&
          error.response.data.message === "time is not valid with period data"
        ) {
          localStorage.setItem("errorMessage", "Network error");
          if (isMounted.current) navigate(-1);
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
                                {dataSidang?.data?.slide ? (
                                  <>
                                    <input
                                      type="file"
                                      className="custom-file-input forminput"
                                      onChange={handleFileChange}
                                      name="slide"
                                    />
                                    <label className="custom-file-label">
                                      {dataSidang?.data.slide?.file_name}
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
                            {dataSidang?.data?.slide ? (
                              <div className="row ml-0">
                                <DownloadButton
                                  url={`/doc/${dataSidang.data.slide.file_url}`}
                                  className="btn btn-danger mr-2"
                                />
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
