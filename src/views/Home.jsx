import { MainLayout } from "./layouts/MainLayout";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const [cookies] = useCookies();
  const authToken = cookies["auth-token"];
  const userData = jwtDecode(authToken);
  const statusSidang = null;
  const kaurAkademik = "Edi Sutoyo, S.Kom., M.CompSc.";
  const no_laa = "+6281311997199";
  const location = useLocation();
  const [error, setError] = useState(null);

  const clearLocalStorage = () => {
    localStorage.removeItem("error");
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (error) {
        localStorage.setItem("error", error);
      } else {
        clearLocalStorage();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [error]);

  useEffect(() => {
    clearLocalStorage();
  }, []);

  return (
    <MainLayout>
      <div className="container-fluid">
        <div className="animated fadeIn">
          <div className="row mt-3">
            <div className="col-12">
              {localStorage.getItem("message") && (
                <div className="alert alert-danger" role="alert">
                  {localStorage.getItem("message")}
                </div>
              )}
            </div>
          </div>
          <div className="row">
            {userData.role?.find((roles) => "RLADM".includes(roles)) ? (
              <div className="card">
                <div className="card-header">
                  <h1>Selamat Datang username {userData?.nama}</h1>
                </div>
                <div className="card-body">
                  <ol>
                    <li>
                      Pastikan parameter pada id <b>academicPeriod</b> sudah
                      sesuai dengan periode sidang sekarang
                    </li>
                    <li>Update dahulu data dosen di menu data dosen</li>
                    <li>Isi Data Period</li>
                    <li>Isi Data CLO di menu Setting CLO</li>
                    <li>
                      Jika ada user dosen yang ingin di set menjadi role
                      tertentu silahkan masuk ke menu Manage Role
                    </li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="col-12">
                <h3>TATA TERTIB PELAKSAAN SIDANG TUGAS AKHIR</h3>
                {/* <!-- update notif lulus --> */}
                {userData.role?.find((roles) => "RLMHS".includes(roles)) &&
                  // @if($statussidang)
                  statusSidang &&
                  statusSidang.status === "lulus" && (
                    <div className="alert alert-success" role="alert">
                      Selamat Anda Dinyatakan <b>LULUS</b> pada sidang periode{" "}
                      {statusSidang.period_id}
                    </div>
                  )}
                <hr className="mt-0" />
                <h6 className="mb-3">
                  <Link to="/home" className="text-dark">
                    BERANDA
                  </Link>
                </h6>
                <div className="card">
                  <div className="card-body">
                    <p>
                      Jika sudah mendapatkan jadwal sidang Mohon konfirmasi ke
                      dosen pembimbing dan penguji
                    </p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <p>
                      Berikut adalah tata tertib yang harus dipenuhi selama
                      sidang tugas akhir berlangsung:
                    </p>
                    <ol>
                      <li>
                        Peserta sidang berpakaian rapi dan Menggunakan jas
                        almamater Telkom University (warna marun).
                      </li>
                      <li>
                        Seluruh Dosen, baik pembimbing ataupun penguji
                        Berpakaian rapih dan formal
                      </li>
                      <li>
                        Mahasiswa dan Dosen wajib online dilink yang sudah
                        ditentukan 15 menit sebelum pelaksanaan sidang, untuk
                        melakukan persiapan
                      </li>
                      <li>
                        Peserta sidang dilarang mengambil gambar (Foto/Video)
                        selama sidang berlangsung
                      </li>
                      <li>
                        Dosen dan Mahasiswa tidak diperkenankan melakukan
                        aktifitas makan
                      </li>
                      <li>
                        Materi presentasi sidang menggunakan Bahasa Inggris.
                      </li>
                      <li>
                        Untuk Mahasiswa Kelas Internasional : buku laporan,
                        jurnal, materi presentasi dan proses sidang tugas akhir
                        menggunakan Bahasa Inggris
                      </li>
                    </ol>
                    Demikian disampaikan untuk diperhatikan.
                    <br></br>
                    <br></br>
                    Ka.Urusan Akademik
                    <br></br>
                    <br></br>
                    <span className="font-weight-bold">{kaurAkademik}</span>
                    <p>
                      Kontak LAAK FRI :{" "}
                      <a target="_blank" href={`http://wa.me/${no_laa}`}>
                        {no_laa}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="row">
            {userData.role?.find((roles) => "RLDSN".includes(roles)) && (
              <>
                <div className="col-4">
                  <h5>DAFTAR SIDANG BELUM DI MULAI</h5>
                  <div className="card">
                    <div className="card-body">
                      <table
                        className="table table-striped"
                        id="schedules-table"
                      >
                        <thead>
                          <tr>
                            <th>NIM</th>
                            <th>Nama</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* @foreach($schedules as $data) @foreach( $data as
                          $schedule) */}
                          <tr>
                            <td> $schedule-sidang-mahasiswa-nim</td>
                            <td> $schedule-sidang-mahasiswa-user-nama</td>
                            <td>
                              <a
                                href="{{ route('scores.pembimbing.create', [$schedule->id]) }}"
                                className="btn btn-primary w-100"
                              >
                                Nilai
                              </a>
                            </td>
                          </tr>
                          {/* @endforeach @endforeach */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <h5>DAFTAR REVISI BELUM DI APPROVE</h5>
                  <div className="card">
                    <div className="card-body">
                      <table
                        className="table table-striped"
                        id="revisions-table"
                      >
                        <thead>
                          <tr>
                            <th>NIM</th>
                            <th>Nama</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* @foreach($revisions as $data) @foreach( $data as
                          $revision) */}
                          <tr>
                            <td>$revision-sidang-mahasiswa-nim</td>
                            <td>$revision-sidang-mahasiswa-user-nama</td>
                            <td>
                              <a
                                href="{{ route('revisions.index.dosen') }}"
                                className="btn btn-warning w-100"
                              >
                                Revisi
                              </a>
                            </td>
                          </tr>
                          {/* @endforeach @endforeach */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <h5>DAFTAR SIDANG BELUM DI TUTUP</h5>
                  <div className="card">
                    <div className="card-body">
                      <table
                        className="table table-striped"
                        id="revisions-table"
                      >
                        <thead>
                          <tr>
                            <th>NIM</th>
                            <th>Nama</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* @foreach($schedulesNotComplete as $data) @foreach(
                          $data as $schedule) */}
                          <tr>
                            <td>$schedule-sidang-mahasiswa-nim</td>
                            <td>$schedule-sidang-mahasiswa-user-nama</td>
                            <td>
                              <a
                                href="{{ route('scores.simpulan', [$schedule->id]) }}"
                                className="btn btn-danger w-100"
                              >
                                Simpulan
                              </a>
                            </td>
                          </tr>
                          {/* @endforeach @endforeach */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
