const SidangIndex = () => {
  return (
    <>
      <ol className="breadcrumb  mb-0">
        @if($pembimbing AND Request::is('sidangs/pembimbing'))
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
        @elseif($pic AND Request::is('sidangs/pic'))
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
        @else
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
        @endif
      </ol>
      <div className="container-fluid">
        <div className="animated fadeIn">
          @include('flash::message') @include('coreui-templates::common.errors')
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
                          {/* @if(auth()->user()->isAdmin()) */}
                          <th>Tak</th>
                          <th>Eprt</th>
                          <th>Bahasa Sidang</th>
                          <th>Periode</th>
                          <th>SKS</th>
                          {/* @endif */}
                          <th>Dokumen TA</th>
                          <th>Jurnal</th>
                          <th>Status</th>
                          <th>Diajukan pada</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        @foreach($sidangs as $sidang)
                        <tr>
                          {/* <td>{{ $sidang->mahasiswa_id }}</td>
                <td>{{ $sidang->mahasiswa->user->nama }}</td>
                <td>{{ $sidang->judul }}</td>
                <td><?php
                        $dataBimbingan = explode(";", $sidang->form_bimbingan);
                        if(count($dataBimbingan)>1){
                          $bimbingan1 = $dataBimbingan[0];
                          $bimbingan2 = $dataBimbingan[1];
                        }else
                        {
                          $bimbingan1 = "tidak ada data";
                          $bimbingan2 = "tidak ada data";
                        }
                        echo "Pembimbing 1: ".$bimbingan1." Pertemuan <br>"."Pembimbing 2: ".$bimbingan2." Pertemuan";
                    ?>
                </td>
                @if(auth()->user()->isAdmin())
                <td>{{ $sidang->tak }}</td>
                <td>{{ $sidang->eprt }}</td>
                <td>{{ $sidang->is_english == 0 ? 'Indonesia' : 'Inggris' }}</td>
                <td>{{ $sidang->period->name }}</td>
                <td>{{ 'Lulus: '.$sidang->credit_complete}}<br>{{'Belum: '.$sidang->credit_uncomplete }}</td>
                @endif
                <td>
                  @if($sidang->dokumen_ta != null)
                  <a href="/uploads/ta/{{$sidang->dokumen_ta}}" className="btn btn-outline-primary" download>Download</a>
                  @endif
                </td>
                <td>
                  @if($sidang->makalah != null)
                  <a href="/uploads/makalah/{{$sidang->makalah }}" className="btn btn-outline-primary" download>Download</a>
                  @endif
                </td>
                <td className="text-center">
                  @if ($sidang->status == 'lulus')
                    <span className="badge badge-success">LULUS</span>
                  @elseif ($sidang->status == 'belum dijadwalkan')
                    <span className="badge badge-secondary">BELUM DIJADWAKAN</span>
                    @elseif ($sidang->status == 'tidak lulus (sudah update dokumen)')
                        <span className="badge badge-secondary">SIDANG ULANG<br>SUDAH UPDATE DOKUMEN</span>
                    @elseif ($sidang->status == 'tidak lulus (belum dijadwalkan)')
                        <span className="badge badge-secondary">SIDANG ULANG<br>BELUM DIJADWAKAN</span>
                    @elseif ($sidang->status == 'sudah dijadwalkan')
                    <span className="badge badge-info">DIJADWAKAN</span>
                     @elseif ($sidang->status == 'tidak lulus')
                    <span className="badge badge-danger">TIDAK LULUS</span>
                    @elseif ($sidang->status == 'ditolak oleh admin')
                    <span className="badge badge-danger">DITOLAK OLEH ADMIN</span>
                    @elseif ($sidang->status == 'pengajuan')
                    <span className="badge badge-warning">PENGAJUAN</span>
                    @elseif ($sidang->status == 'disetujui oleh pembimbing2')
                    <span className="badge badge-primary">DISETUJUI OLEH PEMBIMBING 2</span>
                    @elseif ($sidang->status == 'disetujui oleh pembimbing1')
                    <span className="badge badge-primary">DISETUJUI OLEH PEMBIMBING 1</span>
                    @elseif ($sidang->status == 'telah disetujui admin')
                        <span className="badge badge-primary">DISETUJUI OLEH ADMIN</span>
                  @endif
                </td> */}
                          {/* <td>{{ date('d M Y', strtotime($sidang->created_at)) }}</td> */}
                          <td>
                            {/* @if(auth()->user()->isAdmin()&& !auth()->user()->isSuperadmin())
                      @if(in_array($sidang->status,array('belum disetujui admin')))
                      <div className='btn-group'>
                          <button className='btn btn-success' data-toggle="modal" data-target="#feedbackAcceptAdminModal_{{$sidang->id}}" {{ $sidang->pembimbingBelumSetuju() ? 'disabled' : '' }}>
                            <i className="fa fa-check" style="color:white;"></i>
                          </button>
                          <button className='btn btn-danger' data-toggle="modal" data-target="#feedbackRejectAdminModal_{{$sidang->id}}" {{ $sidang->pembimbingBelumSetuju() ? 'disabled' : '' }}>
                            <i className="fa fa-times" style="color:white;"></i>
                          </button>
                      </div>
                      @elseif(in_array($sidang->status,array('sudah dijadwalkan')))
                      <div className='btn-group w-100'>
                        <a href="{{ route('schedules.show', [$sidang->schedules[0]->id]) }}" className='btn btn-light w-100'>
                          Lihat Jadwal
                        </a>
                      </div>
                      @endif
                      <div className='btn-group w-100'>
                          <a href="{{ route('sidangs.updateData', [$sidang->id]) }}" className='btn btn-light w-100'>
                              Update
                          </a>
                      </div>
                    @elseif( (auth()->user()->isPIC() || auth()->user()->isSuperadmin()) && Request::is('sidangs/pic*'))
                    <div className='btn-group'>
                        @if($sidang->status=='belum dijadwalkan' OR $sidang->status == 'tidak lulus (belum dijadwalkan)')
                        <a href="{{ route('schedules.create', [$sidang->mahasiswa->team->id]) }}" className='btn btn-primary'>Jadwalkan</a>
                        @elseif($sidang->status == 'sudah dijadwalkan' OR $sidang->status == 'tidak lulus (sudah dijadwalkan)')
                        <button type="button" className='btn btn-primary' disabled>Sudah Dijadwalkan</button>
                        @endif
                    </div>
                    @endif
                    @if(auth()->user()->isPembimbing() && Request::is('sidangs/pembimbing*'))
                    <div className='btn-group'>
                        @if($sidang->status == 'sudah dijadwalkan')
                          @if($sidang->schedules->last()->status == 'telah dilaksanakan')
                          <a href="{{ route('revisions.show', $sidang->schedules->last()->id) }}" className="btn btn-success text-white">List Revisi</a>
                          @else
                          <a href="#" className="btn btn-dark text-white disabled">List Revisi</a>
                          @endif
                        @else
                        <a href="#" className="btn btn-dark text-white disabled">List Revisi</a>
                        @endif
                    </div>
                    @endif */}
                          </td>
                        </tr>
                        {/* <!--Modal Section --> */}
                        {/* @if(auth()->user()->isAdmin()) */}
                        <div
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
                        <div
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
                        @endif @endforeach
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
    </>
  );
};

export default SidangIndex;
