import { MainLayout } from "../layouts/MainLayout";
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import { checkSidang } from "../../store/modules/sidang/action";
import { useState, useEffect } from "react";
import Alert from "../../components/Alert";

const SidangShow = () => {
  const { data: dataSidang } = useSelector((state) => state.sidang);

  const dispatch = useDispatch();
  const [cookies] = useCookies();

  const [pembimbing1, setPembimbing1] = useState("");
  const [pembimbing2, setPembimbing2] = useState("");
  const [period, setPeriod] = useState("");
  const [statusLog, setStatusLog] = useState("");

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

  useEffect(() => {
    dispatch(checkSidang(cookies["auth-token"]));
  }, []);

  useEffect(() => {
    const fetchingData = async () => {
      if (dataSidang.data) {
        const resPembimbing1 = await axios.get(
          `http://127.0.0.1:8000/api/lecturer/${dataSidang.data.pembimbing1_id}`
        );
        setPembimbing1(
          `${resPembimbing1.data.data.code} - ${resPembimbing1.data.data.user.nama}`
        );

        const resPembimbing2 = await axios.get(
          `http://127.0.0.1:8000/api/lecturer/${dataSidang.data.pembimbing2_id}`
        );
        setPembimbing2(
          `${resPembimbing2.data.data.code} - ${resPembimbing2.data.data.user.nama}`
        );

        const resPeriod = await axios.get(
          `https://ca07-182-2-46-163.ngrok-free.app/api/period/get/${dataSidang.data.period_id}`,
          {
            headers: {
              "ngrok-skip-browser-warning": true,
              Authorization: `Bearer ${cookies["auth-token"]}`,
            },
          }
        );
        setPeriod(resPeriod.data.data.name);

        const resStatusLog = await axios.get(
          "https://ca07-182-2-46-163.ngrok-free.app/api/status-log/get",
          {
            headers: {
              "ngrok-skip-browser-warning": true,
              Authorization: `Bearer ${cookies["auth-token"]}`,
            },
          }
        );
        setStatusLog(resStatusLog.data.data);
      }
    };

    fetchingData();
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
          <Alert type="danger" />
          {dataSidang.data.status === "tidak lulus" ||
            (dataSidang.data.status ===
              "tidak lulus (sudah update dokumen)" && (
              <Alert
                type="warning"
                message="Sidang anda tidak lulus, anda diwajibkan untuk mengupload PPT dan membuat team baru. silahkan menuju menu 'Materi Presentasi'."
              />
            ))}
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="card">
                <div className="card-header">
                  <strong>Detail</strong>
                </div>
                <div className="card-body">
                  <div className="table-responsive-sm">
                    <table className="table table-striped table-borderless">
                      <tr>
                        <td
                          className="font-weight-bold"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          NIM
                        </td>
                        <td>:</td>
                        <td>{dataSidang.data.nim}</td>
                      </tr>
                      <tr>
                        <td
                          className="font-weight-bold"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Pembimbing 1
                        </td>
                        <td>:</td>
                        <td>{pembimbing1}</td>
                      </tr>
                      <tr>
                        <td
                          className="font-weight-bold"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Pembimbing 2
                        </td>
                        <td>:</td>
                        <td>{pembimbing2}</td>
                      </tr>
                      <tr>
                        <td
                          className="font-weight-bold"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Judul TA
                        </td>
                        <td>:</td>
                        {dataSidang.data.judul}
                      </tr>
                      <tr>
                        <td
                          className="font-weight-bold"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Jumlah Bimbingan
                        </td>
                        <td>:</td>
                        <td>
                          <p>
                            Pembimbing 1: {dataSidang.data.form_bimbingan1}{" "}
                            Pertemuan
                          </p>
                          <p>
                            Pembimbing 2: {dataSidang.data.form_bimbingan2}{" "}
                            Pertemuan
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="font-weight-bold"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          TAK
                        </td>
                        <td>:</td>
                        {dataSidang.data.tak}
                      </tr>
                      <tr>
                        <td
                          className="font-weight-bold"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          EPRT
                        </td>
                        <td>:</td>
                        {dataSidang.data.eprt}
                      </tr>
                      <tr>
                        <td
                          className="font-weight-bold"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Dokumen TA
                        </td>
                        <td>:</td>
                        <td>
                          {dataSidang.data.doc_ta ? (
                            <a
                              href="/{{$dokumen_ta->file_url}}"
                              className="btn btn-outline-primary"
                              download
                            >
                              Download
                            </a>
                          ) : (
                            <a
                              href="#"
                              target="_blank"
                              className="btn btn-primary disabled"
                            >
                              Data tidak ditemukan
                            </a>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="font-weight-bold"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Jurnal
                        </td>
                        <td>:</td>
                        <td>
                          {dataSidang.data.makalah ? (
                            <a
                              href="/{{$makalah->file_url}}"
                              className="btn btn-outline-primary"
                              download
                            >
                              Download
                            </a>
                          ) : (
                            <a
                              href="#"
                              target="_blank"
                              className="btn btn-primary disabled"
                            >
                              Data tidak ditemukan
                            </a>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="font-weight-bold"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Status
                        </td>
                        <td>:</td>
                        <td>
                          {dataSidang.data.status === "lulus" ? (
                            <span className="badge badge-success">Lulus</span>
                          ) : dataSidang.data.status === "belum dijadwalkan" ? (
                            <span className="badge badge-secondary">
                              Belum Dijadwakan
                            </span>
                          ) : dataSidang.data.status === "sudah dijadwalkan" ? (
                            <span className="badge badge-info">Dijadwakan</span>
                          ) : dataSidang.data.status === "tidak lulus" ? (
                            <span className="badge badge-danger">
                              Tidak Lulus
                            </span>
                          ) : dataSidang.data.status ===
                            "ditolak oleh admin" ? (
                            <span className="badge badge-danger">
                              Ditolak Oleh Admin
                            </span>
                          ) : dataSidang.data.status === "pengajuan" ? (
                            <span className="badge badge-warning">
                              Pengajuan
                            </span>
                          ) : dataSidang.data.status ===
                            "disetujui oleh pembimbing2" ? (
                            <span className="badge badge-primary">
                              Disetujui Oleh Pembimbing 2
                            </span>
                          ) : dataSidang.data.status ===
                            "disetujui oleh pembimbing1" ? (
                            <span className="badge badge-primary">
                              Disetujui Oleh Pembimbing 1
                            </span>
                          ) : (
                            dataSidang.data.status
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="font-weight-bold"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Bahasa
                        </td>
                        <td>:</td>
                        <td>
                          {dataSidang.data.is_english ? "English" : "Indonesia"}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="font-weight-bold"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Periode
                        </td>
                        <td>:</td>
                        <td>{period}</td>
                      </tr>
                    </table>
                  </div>
                </div>
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
