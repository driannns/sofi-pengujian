import { MainLayout } from "../layouts/MainLayout";
import { Link, useLocation } from "react-router-dom";

const MateriPresentasi = () => {
  const location = useLocation();
  const sidang = null;
  const slide = null;

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

          {(sidang && sidang?.status === "tidak lulus") ||
            sidang?.status === "titak lulus (sudah update dokumen)" ||
            (sidang?.status === "tidak lulus (belum dijadwalkan)" && (
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
                          value="{{ $sidang->id }}"
                          hidden
                        />
                        <div className="form-group col-sm-6">
                          <p>
                            Pastikan anda mengupload berkas TA sesuai yang anda
                            revisi
                          </p>
                          <div className="form-group">
                            <label for="">Periode Sidang Ulang</label>
                            {/*{!! Form::select('period_id', $periods, $oldPeriod, ['className' => 'select2
                                    form-control'])!!}*/}
                          </div>
                          <div className="form-group">
                            <label for="">Dokumen TA Sidang Ulang</label>
                            <div className="custom-file">
                              <input
                                type="file"
                                className="custom-file-input forminput"
                                name="dokumen_ta"
                              />
                              <label className="custom-file-label">
                                Choose file
                              </label>
                            </div>
                          </div>
                          <div className="form-group">
                            <label for="">Jurnal Sidang Ulang</label>
                            <div className="custom-file">
                              <input
                                type="file"
                                className="custom-file-input forminput"
                                name="makalah"
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
            ))}
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
                          value="{{ $sidang->id }}"
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
