import { MainLayout } from "../layouts/MainLayout";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../middleware/AuthContext";

const SidangIndex = () => {
  const location = useLocation();
  const { roles } = useAuth();

  const [sidangs, setSidangs] = useState(null);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayOfWeek = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${dayOfWeek}, ${dayOfMonth} ${month} ${year} - ${hour}:${minute}`;
  };
  return (
    <MainLayout>
      <ol className="breadcrumb  mb-0">
        {roles.find((role) => ["RLPBG"].includes(role)) &&
        location.pathname("/sidangs/pembimbing") ? (
          // @if($pembimbing AND Request::is('sidangs/pembimbing'))
          <div className="col-12">
            <h3>BIMBINGAN TA</h3>
            <hr className="mt-0" />
            <h6 className="mb-3">
              <a href="{{ route('home') }}" className="text-dark">
                BERANDA
              </a>{" "}
              / BIMBINGAN TA
            </h6>
          </div>
        ) : roles.find((role) => ["RLPIC"].includes(role)) &&
          location.pathname("/sidangs/pic") ? (
          // @elseif($pic AND Request::is('sidangs/pic'))
          <div className="col-12">
            <h3>PENJADWALAN SIDANG</h3>
            <hr className="mt-0" />
            <h6 className="mb-3">
              <a href="{{ route('home') }}" className="text-dark">
                BERANDA
              </a>{" "}
              / PENJADWALAN SIDANG
            </h6>
          </div>
        ) : (
          // @else
          <div className="col-12">
            <h3>PENGAJUAN SIDANG</h3>
            <hr className="mt-0" />
            <h6 className="mb-3">
              <a href="{{ route('home') }}" className="text-dark">
                BERANDA
              </a>{" "}
              / PENGAJUAN SIDANG
            </h6>
          </div>
          // @endif
        )}
      </ol>
      <div className="container-fluid">
        <div className="animated fadeIn">
          {/* @include('flash::message') 
          @include('coreui-templates::common.errors') */}
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div
                    className="table-responsive-sm"
                    style="overflow-x:scroll"
                  >
                    <table className="table table-striped" id="sidangs-table">
                      <thead>
                        <tr>
                          <th>NIM</th>
                          <th>Nama</th>
                          <th>Judul TA</th>
                          <th>Jumlah Bimbingan</th>
                          {roles.find((role) => ["RLADM"].includes(role)) && (
                            <>
                              <th>Tak</th>
                              <th>Eprt</th>
                              <th>Bahasa Sidang</th>
                              <th>Periode</th>
                              <th>SKS</th>
                            </>
                          )}
                          <th>Dokumen TA</th>
                          <th>Jurnal</th>
                          <th>Status</th>
                          <th>Diajukan pada</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sidangs &&
                          sidangs.map((value, index) => (
                            <tr key={index}>
                              <td>{value.nim}</td>
                              <td>
                                {value.nim}
                                {/* {{ $sidang->mahasiswa->user->nama }} */}
                              </td>
                              <td>{value.judul}</td>
                              <td>
                                Pembimbing 1: {value.totalguidance_advisor1}{" "}
                                Pertemuan <br /> Pembimbing 2 :{" "}
                                {value.totalguidance_advisor2} Pertemuan
                              </td>
                              {roles.find((role) =>
                                ["RLADM"].includes(role)
                              ) && (
                                <>
                                  <td>{value.tak}</td>
                                  <td>{value.eprt}</td>
                                  <td>
                                    {value.is_english === 0
                                      ? "Indonesia"
                                      : "Inggris"}
                                  </td>
                                  <td>{value.period_id}</td>
                                  <td>
                                    Lulus: {value.credit_uncomplete}
                                    <br /> Belum: {value.credit_uncomplete}
                                  </td>
                                </>
                              )}
                              <td>
                                {value.dokumen_ta && (
                                  <a
                                    href="/uploads/ta/{{$sidang->dokumen_ta}}"
                                    className="btn btn-outline-primary"
                                    download
                                  >
                                    Download
                                  </a>
                                )}
                              </td>
                              <td>
                                {value.makalah && (
                                  <a
                                    href="/uploads/makalah/{{$sidang->makalah }}"
                                    className="btn btn-outline-primary"
                                    download
                                  >
                                    Download
                                  </a>
                                )}
                              </td>
                              <td className="text-center">
                                {value.name === "belum dijadwalkan" ? (
                                  <span className="badge badge-secondary">
                                    Belum Dijadwalkan
                                  </span>
                                ) : value.name === "belum dilaksanakan" ? (
                                  <span className="badge badge-secondary">
                                    Belum Dilaksanakan
                                  </span>
                                ) : value.name === "belum disetujui admin" ? (
                                  <span className="badge badge-secondary">
                                    Belum Disetujui Admin
                                  </span>
                                ) : value.name === "dikembalikan" ? (
                                  <span className="badge badge-secondary">
                                    Dikembalikan
                                  </span>
                                ) : value.name === "disetujui" ? (
                                  <span className="badge badge-success">
                                    Disetujui
                                  </span>
                                ) : value.name ===
                                  "disetujui oleh pembimbing1" ? (
                                  <span className="badge badge-success">
                                    Disetujui Pembimbing 1
                                  </span>
                                ) : value.name ===
                                  "disetujui oleh pembimbing2" ? (
                                  <span className="badge badge-success">
                                    Disetujui Pembimbing 2
                                  </span>
                                ) : value.name === "sudah dijadwalkan" ? (
                                  <span className="badge badge-success">
                                    Dijadwalkan
                                  </span>
                                ) : value.name === "telah disetujui admin" ? (
                                  <span className="badge badge-success">
                                    Disetujui Admin
                                  </span>
                                ) : value.name === "pengajuan" ? (
                                  <span className="badge badge-warning">
                                    Pengajuan
                                  </span>
                                ) : value.name ===
                                  "perbaikan berkas ke admin" ? (
                                  <span className="badge badge-warning">
                                    Perbaikan Berkas Ke Admin
                                  </span>
                                ) : value.name === "sedang dikerjakan" ? (
                                  <span className="badge badge-warning">
                                    Sedang Dikerjakan
                                  </span>
                                ) : value.name === "sedang dilaksanakan" ? (
                                  <span className="badge badge-warning">
                                    Sedang Dilaksanakan
                                  </span>
                                ) : value.name === "lulus" ? (
                                  <span className="badge badge-primary">
                                    Lulus
                                  </span>
                                ) : value.name === "ditolak oleh admin" ? (
                                  <span className="badge danger">
                                    Ditolak Admin
                                  </span>
                                ) : (
                                  value.name
                                )}
                              </td>
                              <td>{formatDate(value.created_at)}</td>
                              <td>
                                {roles.find((role) =>
                                  ["RLADM"].includes(role)
                                ) &&
                                  roles.find(
                                    (role) => !["RLSDM"].includes(role)
                                  ) && (
                                    <>
                                      value.status.includes(['belum disetujui
                                      admin']) ? (
                                      <div className="btn-group">
                                        {/* <button className='btn btn-success' data-toggle="modal" data-target="#feedbackAcceptAdminModal_{{$sidang->id}}" {{ $sidang->pembimbingBelumSetuju() ? 'disabled' : '' }}>
                                      <i className="fa fa-check" style="color:white;"></i>
                                    </button>
                                    <button className='btn btn-danger' data-toggle="modal" data-target="#feedbackRejectAdminModal_{{$sidang->id}}" {{ $sidang->pembimbingBelumSetuju() ? 'disabled' : '' }}>
                                      <i className="fa fa-times" style="color:white;"></i>
                                    </button> */}
                                      </div>
                                      ) : value.status.includes(['sudah
                                      dijadwalkan']) && (
                                      <div className="btn-group w-100">
                                        <a
                                          href="{{ route('schedules.show', [$sidang->schedules[0]->id]) }}"
                                          className="btn btn-light w-100"
                                        >
                                          Lihat Jadwal
                                        </a>
                                      </div>
                                      )
                                      <div className="btn-group w-100">
                                        <a
                                          href="{{ route('sidangs.updateData', [$sidang->id]) }}"
                                          className="btn btn-light w-100"
                                        >
                                          Update
                                        </a>
                                      </div>
                                    </>
                                  )}
                                {roles.find((role) =>
                                  ["RLPIC"].includes(role)
                                ) ||
                                  (roles.find((role) =>
                                    ["RLSDM"].includes(role)
                                  ) &&
                                    location.pathname.startsWith(
                                      "/sidangs/pic"
                                    ) && (
                                      <div className="btn-group">
                                        {/* @if($sidang->status=='belum dijadwalkan' OR $sidang->status == 'tidak lulus (belum dijadwalkan)')
                            <a href="{{ route('schedules.create', [$sidang->mahasiswa->team->id]) }}" className='btn btn-primary'>Jadwalkan</a>
                            @elseif($sidang->status == 'sudah dijadwalkan' OR $sidang->status == 'tidak lulus (sudah dijadwalkan)')
                            <button type="button" className='btn btn-primary' disabled>Sudah Dijadwalkan</button>
                            @endif */}
                                      </div>
                                    ))}
                                {roles.find((role) =>
                                  ["RLPBG"].includes(role)
                                ) &&
                                  location.pathname.startsWith(
                                    "sidangs/pembimbing"
                                  ) && (
                                    <div className="btn-group">
                                      {value.status === "sudah dijadwalkan" ? (
                                        <></>
                                      ) : (
                                        // @if($sidang->schedules->last()->status == 'telah dilaksanakan')
                                        // <a href="{{ route('revisions.show', $sidang->schedules->last()->id) }}" className="btn btn-success text-white">List Revisi</a>
                                        // @else
                                        // <a href="#" className="btn btn-dark text-white disabled">List Revisi</a>
                                        // @endif
                                        <a
                                          href="#"
                                          className="btn btn-dark text-white disabled"
                                        >
                                          List Revisi
                                        </a>
                                      )}
                                    </div>
                                  )}
                              </td>
                            </tr>
                          ))}
                        {/* <!--Modal Section -->
                        {/* @if(auth()->user()->isAdmin()) */}
                        {/* <div
                          className="modal fade"
                          id="feedbackAcceptAdminModal_{{$sidang->id}}"
                          tabindex="-1"
                          role="dialog"
                          aria-labelledby="feedbackModal"
                          aria-hidden="true"
                        >
                          <form
                            action="{{ route('sidangs.approve', [$sidang->id]) }}"
                            method="post"
                          >
                            @csrf
                            <div className="modal-dialog" role="document">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title">Feedback</h5>
                                  <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                  >
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                                <div className="modal-body">
                                  <div className="form-group">
                                    <label
                                      for="message-text"
                                      className="col-form-label"
                                    >
                                      Feedback
                                    </label>
                                    <textarea
                                      className="form-control"
                                      id="message-text"
                                      name="feedback"
                                    ></textarea>
                                  </div>
                                  <div className="form-group">
                                    <label
                                      for="message-text"
                                      className="col-form-label"
                                    >
                                      Bahasa Sidang
                                    </label>
                                    <p>
                                      <small>
                                        Pastikan anda melihat nilai EPRT
                                        mahasiswa yang bersangkutan
                                      </small>
                                    </p>
                                    <select
                                      className="form-control"
                                      name="bahasa"
                                    >
                                      <option value="indonesia">
                                        Indonesia
                                      </option>
                                      <option value="inggris">Inggris</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-dismiss="modal"
                                  >
                                    Close
                                  </button>
                                  <button
                                    type="submit"
                                    className="btn btn-primary"
                                  >
                                    Approve Sidang
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div
                          className="modal fade"
                          id="feedbackRejectAdminModal_{{$sidang->id}}"
                          tabindex="-1"
                          role="dialog"
                          aria-labelledby="feedbackModal"
                          aria-hidden="true"
                        >
                          <form
                            action="{{ route('sidangs.feedback', [$sidang->id]) }}"
                            method="post"
                          >
                            @csrf
                            <div className="modal-dialog" role="document">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title">Feedback</h5>
                                  <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                  >
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                                <div className="modal-body">
                                  <div className="form-group">
                                    <label
                                      for="message-text"
                                      className="col-form-label"
                                    >
                                      Feedback
                                    </label>
                                    <textarea
                                      className="form-control"
                                      id="message-text"
                                      name="feedback"
                                    ></textarea>
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-dismiss="modal"
                                  >
                                    Close
                                  </button>
                                  <button
                                    type="submit"
                                    className="btn btn-primary"
                                  >
                                    Send Feedback
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        @endif
                        {/* @if(auth()->user()->isPembimbing()) */}
                        {/* <div
                          className="modal fade"
                          id="feedbackAcceptPembimbingModal_{{$sidang->id}}"
                          tabindex="-1"
                          role="dialog"
                          aria-labelledby="feedbackModal"
                          aria-hidden="true"
                        >
                          <form
                            action="{{ route('sidangs.terimaPengajuan', [$sidang->id]) }}"
                            method="post"
                          >
                            @csrf
                            <div className="modal-dialog" role="document">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title">
                                    Penyetujuan Pengajuan
                                  </h5>
                                  <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                  >
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                                <div className="modal-body">
                                  <div className="form-group">
                                    <label
                                      for="message-text"
                                      className="col-form-label"
                                    >
                                      Komentar
                                    </label>
                                    <textarea
                                      className="form-control"
                                      id="message-text"
                                      name="feedback"
                                    ></textarea>
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-dismiss="modal"
                                  >
                                    Batal
                                  </button>
                                  <button
                                    type="submit"
                                    className="btn btn-primary"
                                  >
                                    Setujui Pengajuan
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div
                          className="modal fade"
                          id="feedbackRejectPembimbingModal_{{$sidang->id}}"
                          tabindex="-1"
                          role="dialog"
                          aria-labelledby="feedbackModal"
                          aria-hidden="true"
                        >
                          <form
                            action="{{ route('sidangs.tolakPengajuan', [$sidang->id]) }}"
                            method="post"
                          >
                            @csrf
                            <div className="modal-dialog" role="document">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title">
                                    Penolakan Pengajuan
                                  </h5>
                                  <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                  >
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                                <div className="modal-body">
                                  <div className="form-group">
                                    <label
                                      for="message-text"
                                      className="col-form-label"
                                    >
                                      Komentar
                                    </label>
                                    <textarea
                                      className="form-control"
                                      id="message-text"
                                      name="feedback"
                                    ></textarea>
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-dismiss="modal"
                                  >
                                    Batal
                                  </button>
                                  <button
                                    type="submit"
                                    className="btn btn-danger"
                                  >
                                    Tolak Pengajuan
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        @endif @endforeach */}
                      </tbody>
                    </table>
                  </div>

                  {/* @push('scripts')
<script type="text/javascript">
    $('#sidangs-table').DataTable({
        pageLength: 15,

        order: [[ 12, "desc" ]],

        order: [[ 7, "desc" ]],

    });
</script>
@endpush() */}

                  <div className="pull-right mr-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SidangIndex;
