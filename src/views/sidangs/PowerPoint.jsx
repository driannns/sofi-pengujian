import { MainLayout } from "../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkSidang } from "../../store/sidangSlicer";
import { useCookies } from "react-cookie";
import Alert from "../../components/Alert";

const MateriPresentasi = () => {
  const dataSidang = useSelector((state) => state.sidang);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies] = useCookies();

  const [periodNow, setPeriodNow] = useState(null);
  const [oldPeriod, setOldPeriod] = useState(null);
  const [slide, setSlide] = useState(null);

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

      console.log(res.data);
      if (res.data.code === 200) {
        setSlide(res.data.data);
      }
    } catch (error) {
      if (!error.response.data.code === 404) {
        localStorage.setItem("errorMessage", "Network Error");
        navigate("/home");
        return;
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
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
          return;
        }

        fetchSlide();

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
        if (!error.response.status === 404) {
          localStorage.setItem("errorMessage", "Network error");
          navigate(-1);
          return;
        }
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   if (!dataSidang.data) {
  //     localStorage.setItem("errorMessage", "Anda belum mendaftar sidang!");
  //     navigate("/sidangs/create");
  //     return;
  //   }

  //   if (
  //     dataSidang.data?.status === "sudah dijadwalkan" ||
  //     dataSidang.data?.status === "tidak lulus (sudah dijadwalkan)"
  //   ) {
  //     localStorage.setItem("warningMessage", "Anda belum mendaftar sidang!");
  //     navigate("schedule/mahasiswa");
  //     return;
  //   }

  //   if (
  //     dataSidang.data &&
  //     !dataSidang.data.status.includes([
  //       "telah disetujui admin",
  //       "belum dijadwalkan",
  //       "tidak lulus",
  //       "tidak lulus (sudah update dokumen)",
  //       "tidak lulus (belum dijadwalkan)",
  //     ])
  //   ) {
  //     localStorage.setItem(
  //       "errorMessage",
  //       "Sidang anda belum di approve dosen pembimbing dan admin"
  //     );
  //     navigate(-1);
  //     return;
  //   }
  // }, [dataSidang]);

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
                              href={`${
                                import.meta.env.VITE_API_URL
                              }/public/slides/${slide.url}`}
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
