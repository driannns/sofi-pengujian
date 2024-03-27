import { MainLayout } from "../layouts/MainLayout";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkSidang } from "../../store/sidangSlicer";
import { useCookies } from "react-cookie";
const APISOFI = "https://ca07-182-2-46-163.ngrok-free.app/api";

const MateriPresentasi = () => {
  const { data: dataSidang } = useSelector((state) => state.sidang);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies] = useCookies();
  const [docTA, setDocTA] = useState();
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
        await dispatch(checkSidang(cookies["auth-token"]));
        const res = await axios.get(`${APISOFI}/slide/get-latest-slide`, {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
            "ngrok-skip-warning-browser": true,
          },
        });
      } catch (err) {
        console.error(err);
        localStorage.setItem("errorMessage", "Network error");
        navigate("/home");
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
          {location.state?.error && (
            <div className="alert alert-danger" role="alert">
              {location.state.error}
            </div>
          )}

          {dataSidang.data &&
            (dataSidang.data.status === "tidak lulus" ||
              dataSidang.data.status === "titak lulus (sudah update dokumen)" ||
              dataSidang.data.status === "tidak lulus (belum dijadwalkan)") && (
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <form
                        className=""
                        // action="{{ route('sidang-ulang.update', $sidang->id) }}"
                        // method="post"
                        // enctype="multipart/form-data"
                      >
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
                            <label htmlFor="">Periode Sidang Ulang</label>
                            {/*{!! Form::select('period_id', $periods, $oldPeriod, ['className' => 'select2
                                    form-control'])!!}*/}
                          </div>
                          <div className="form-group">
                            <label htmlFor="">Dokumen TA Sidang Ulang</label>
                            <div className="custom-file">
                              <input
                                type="file"
                                className="custom-file-input forminput"
                                name="dokumen_ta"
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
                      <form
                        className=""
                        // action="{{ route('slides.upload') }}"
                        // method="post"
                        // enctype="multipart/form-data"
                      >
                        {/* @csrf */}
                        <input
                          type="text"
                          name="sidang_id"
                          defaultValue={dataSidang.data && dataSidang.data.id}
                          hidden
                        />
                        <div className="input-group mb-3">
                          <div className="custom-file">
                            {true ? (
                              <>
                                <input
                                  type="file"
                                  className="custom-file-input forminput"
                                  name="slide"
                                />
                                <label className="custom-file-label">
                                  {/* {slide.url} */}
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
                        {true ? (
                          <div className="row ml-0">
                            <a
                              href="/{{ $slide->file_url }}"
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
