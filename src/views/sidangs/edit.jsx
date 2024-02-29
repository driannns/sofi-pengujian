import { MainLayout } from "../layouts/MainLayout";

const SidangEdit = () => {
  return (
    <MainLayout>
      <ol className="breadcrumb mb-0">
        <div className="col-12">
          <h3>SIDANG</h3>
          <hr className="mt-0" />
          <h6 className="mb-3">
            <a href="{{ route('home') }}" className="text-dark">
              BERANDA
            </a>{" "}
            /{" "}
            <a href="{!! route('sidangs.index') !!}" className="text-dark">
              SIDANG
            </a>
          </h6>
        </div>
      </ol>

      <div className="container-fluid">
        <div className="animated fadeIn">
          <div className="alert alert-danger" role="alert">
            {/*{{Session::get('error')}}*/}
          </div>
          @endif
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="card">
                {/*{{-- */}{" "}
                <div className="card-header">
                  <i className="fa fa-edit fa-lg"></i>
                  <strong>Edit Data Sidang</strong>
                </div>
                <div className="card-body">
                  {/*{!! Form::model($sidang, ['route' => ['sidangs.update', $sidang->id], 'files' => true, 'id'=> 'frm1', 'method' => 'PUT']) !!}*/}

                  {/*{!! Form::close() !!}*/}
                </div>
                {/*--}}*/}
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card">
                {/*{{--*/}{" "}
                <div className="card-header">
                  <i className="fa fa-history fa-lg"></i>
                  {/* @if ( auth()->user()->isSuperadmin() )*/}
                  <strong>Riwayat Proses</strong>
                  @else
                  <strong>Riwayat Proses Pengajuan</strong>
                  @endif
                </div>
                {/*--}}*/}
                <div className="card-body">
                  <div
                    className="table-responsive-sm"
                    style={{ height: "100vh", overflowY: "scroll" }}
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
                          <td>
                            {/*{{ date('l, d F Y - d:m', strtotime($log->created_at)) }}*/}{" "}
                            tes
                          </td>
                          <td>{/*{{$log->name}}*/}tes</td>
                          <td>{/*{{$log->feedback}}*/}tes</td>
                          <td>{/*{{$log->user->username}}*/}tes</td>
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

export default SidangEdit;
