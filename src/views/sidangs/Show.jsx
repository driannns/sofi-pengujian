import { MainLayout } from "../layouts/MainLayout";
import { NavLink, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { checkSidang } from "../../store/modules/sidang/action";
import { useEffect } from "react";

const SidangShow = () => {
  const { data: dataSidang } = useSelector((state) => state.sidang);
  const dispatch = useDispatch();

  const [cookies, setCookies] = useCookies();
  const location = useLocation();
  const jwtDecoded = jwtDecode(cookies["auth-token"]);
  const roles = jwtDecoded.role;
  useEffect(() => {
    console.log("awal:", dataSidang);
    dispatch(checkSidang(cookies["auth-token"]));
    console.log("akhir:", dataSidang);
  }, [dispatch]);

  useEffect(() => {
    console.log("diluar useEffect:", dataSidang);
  }, [dataSidang]);

  return (
    <MainLayout>
      <ol className="breadcrumb mb-0">
        <div className="col-12">
          <h3>INFORMASI PENDAFTARAN</h3>
          <hr className="mt-0" />
          <h6 className="mb-3">
            <NavLink to="/home" className="text-dark">
              BERANDA
            </NavLink>{" "}
            / INFORMASI PENDAFTARAN
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
          {/* @if ($sidang->status == 'tidak lulus' OR $sidang->status == 'tidak lulus (sudah update dokumen)') */}
          <div className="alert alert-warning" role="alert">
            Sidang anda tidak lulus, anda diwajibkan untuk mengupload PPT dan
            membuat team baru. silahkan menuju menu 'Materi Presentasi'.
          </div>
          {/* @endif */}
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="card">
                <div className="card-header">
                  <strong>Detail</strong>
                </div>
                <div className="card-body">@include('sidangs.show_fields')</div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card">
                <div className="card-header">
                  <i className="fa fa-history fa-lg"></i>
                  <strong>Riwayat Proses Pengajuan</strong>
                </div>
                <div className="card-body">
                  <div
                    className="table-responsive-sm"
                    style={{ height: "50vh", overflowY: "scroll" }}
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
                        @foreach($status_logs as $log)
                        <tr>
                          {/* <td>{{ date('l, d F Y - d:m', strtotime($log->created_at)) }}</td> */}
                          <td className="text-center">
                            {/* {{-- {{$log->name}} --}} */}

                            {/* @if ($log->name == 'belum dijadwalkan')
                                            <span className="badge badge-secondary">Belum Dijadwalkan</span>
                                          @elseif ($log->name == 'belum dilaksanakan')
                                            <span className="badge badge-secondary">Belum Dilaksanakan</span>
                                          @elseif ($log->name == 'belum disetujui admin')
                                            <span className="badge badge-secondary">Belum Disetujui Admin</span>
                                          @elseif ($log->name == 'dikembalikan')
                                            <span className="badge badge-secondary">Dikembalikan</span>

                                          @elseif ($log->name == 'disetujui')
                                            <span className="badge badge-success">Disetujui</span>
                                          @elseif ($log->name == 'disetujui oleh pembimbing1')
                                            <span className="badge badge-success">Disetujui Pembimbing 1</span>
                                          @elseif ($log->name == 'disetujui oleh pembimbing2')
                                            <span className="badge badge-success">Disetujui Pembimbing 2</span>
                                          @elseif ($log->name == 'sudah dijadwalkan')
                                            <span className="badge badge-success">Dijadwalkan</span>
                                          @elseif ($log->name == 'telah disetujui admin')
                                            <span className="badge badge-success">Disetujui Admin</span>

                                          @elseif ($log->name == 'pengajuan')
                                            <span className="badge badge-warning">Pengajuan</span>
                                          @elseif ($log->name == 'perbaikan berkas ke admin')
                                            <span className="badge badge-warning">Perbaikan Berkas Ke Admin</span>
                                          @elseif ($log->name == 'sedang dikerjakan')
                                            <span className="badge badge-warning">Sedang Dikerjakan</span>
                                          @elseif ($log->name == 'sedang dilaksanakan')
                                            <span className="badge badge-warning">Sedang Dilaksanakan</span>

                                          @elseif ($log->name == 'lulus')
                                            <span className="badge badge-primary">Lulus</span>

                                          @elseif ($log->name == 'ditolak oleh admin')
                                            <span className="badge danger">Ditolak Admin</span>

                                          @endif */}
                          </td>
                          {/* <td>{{$log->feedback}}</td> */}
                          {/* <td>{{$log->user->username}}</td> */}
                        </tr>
                        @endforeach
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

export default SidangShow;
