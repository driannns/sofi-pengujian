import { MainLayout } from "./layouts/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <div class="container-fluid">
        <div class="animated fadeIn">
          <div class="row mt-3">
            <div class="col-12">@include('flash::message')</div>
          </div>
          <div class="row">
            {/* Admin */}
            {/* <div class="card">
              <div class="card-header">
                <h1>Selamat Datang username(admin)</h1>
              </div>
              <div class="card-body">
                <p>
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
                </p>
              </div>
            </div> */}
            {/* End of Admin */}

            {/* else */}
            <div class="col-12">
              <h3>TATA TERTIB PELAKSAAN SIDANG TUGAS AKHIR</h3>
              {/* <!-- update notif lulus --> */}
              {/* @if(Auth::user()->isStudent())
                    @if($statussidang)
                        @if($statussidang->status == 'lulus')
                            <div class="alert alert-success" role="alert">
                                Selamat Anda Dinyatakan <b>LULUS</b> pada sidang periode {{$statussidang->period_id}}
                            </div>
                        @endif
                    @endif
                @endif */}
              <hr class="mt-0" />
              <h6 class="mb-3">
                <a href="{{ route('home') }}" class="text-dark">
                  BERANDA
                </a>
              </h6>
              <div class="card">
                <div class="card-body">
                  <p>
                    Jika sudah mendapatkan jadwal sidang Mohon konfirmasi ke
                    dosen pembimbing dan penguji
                  </p>
                </div>
              </div>
              <div class="card">
                <div class="card-body">
                  <p>
                    Berikut adalah tata tertib yang harus dipenuhi selama sidang
                    tugas akhir berlangsung:
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
                    <span class="font-weight-bold">
                      php echo $kaur_akademik
                    </span>
                  </p>
                  <p>
                    Kontak LAAK FRI :{" "}
                    <a href="<?php echo 'http://wa.me/'.$no_laa ?>">
                      php echo $no_laa
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            {/* Dosen */}
            {/* <div class="col-4">
              <h5>DAFTAR SIDANG BELUM DI MULAI</h5>
              <div class="card">
                <div class="card-body">
                  <table class="table table-striped" id="schedules-table">
                    <thead>
                      <tr>
                        <th>NIM</th>
                        <th>Nama</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      @foreach($schedules as $data) @foreach( $data as
                      $schedule)
                      <tr>
                        <td> $schedule-sidang-mahasiswa-nim</td>
                        <td> $schedule-sidang-mahasiswa-user-nama</td>
                        <td>
                          <a
                            href="{{ route('scores.pembimbing.create', [$schedule->id]) }}"
                            class="btn btn-primary w-100"
                          >
                            Nilai
                          </a>
                        </td>
                      </tr>
                      @endforeach @endforeach
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="col-4">
              <h5>DAFTAR REVISI BELUM DI APPROVE</h5>
              <div class="card">
                <div class="card-body">
                  <table class="table table-striped" id="revisions-table">
                    <thead>
                      <tr>
                        <th>NIM</th>
                        <th>Nama</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      @foreach($revisions as $data) @foreach( $data as
                      $revision)
                      <tr>
                        <td>$revision-sidang-mahasiswa-nim</td>
                        <td>$revision-sidang-mahasiswa-user-nama</td>
                        <td>
                          <a
                            href="{{ route('revisions.index.dosen') }}"
                            class="btn btn-warning w-100"
                          >
                            Revisi
                          </a>
                        </td>
                      </tr>
                      @endforeach @endforeach
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="col-4">
              <h5>DAFTAR SIDANG BELUM DI TUTUP</h5>
              <div class="card">
                <div class="card-body">
                  <table class="table table-striped" id="revisions-table">
                    <thead>
                      <tr>
                        <th>NIM</th>
                        <th>Nama</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      @foreach($schedulesNotComplete as $data) @foreach( $data
                      as $schedule)
                      <tr>
                        <td>$schedule-sidang-mahasiswa-nim</td>
                        <td>$schedule-sidang-mahasiswa-user-nama</td>
                        <td>
                          <a
                            href="{{ route('scores.simpulan', [$schedule->id]) }}"
                            class="btn btn-danger w-100"
                          >
                            Simpulan
                          </a>
                        </td>
                      </tr>
                      @endforeach @endforeach
                    </tbody>
                  </table>
                </div>
              </div>
            </div> */}
            {/* End of Dosen */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
