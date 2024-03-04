import { MainLayout } from "../layouts/MainLayout";
import { Link } from "react-router-dom";
import Fields from "./Fields";

const SidangEdit = () => {
  return (
    <MainLayout>
      <ol className="breadcrumb mb-0">
        <div className="col-12">
          <h3>SIDANG</h3>
          <hr className="mt-0" />
          <h6 className="mb-3">
            <Link to="/home" className="text-dark">
              BERANDA
            </Link>
            /
            <a href="{!! route('sidangs.index') !!}" className="text-dark">
              SIDANG
            </a>
          </h6>
        </div>
      </ol>

      <div className="container-fluid">
        <div className="animated fadeIn">
          {/* @include('coreui-templates::common.errors') @if
          (Session::has('error')) */}
          <div className="alert alert-danger" role="alert">
            {/*{{Session::get('error')}}*/}
          </div>
          {/* @endif */}
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="card">
                {/*{{-- */}{" "}
                <div className="card-header">
                  <i className="fa fa-edit fa-lg"></i>
                  <strong>Edit Data Sidang</strong>
                </div>
                <div className="card-body">
                  <Fields />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card">
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
                        {/* @foreach($status_logs as $log) */}
                        <tr>
                          <td>
                            {/*{{ date('l, d F Y - d:m', strtotime($log->created_at)) }}*/}{" "}
                            tes
                          </td>
                          <td>{/*{{$log->name}}*/}tes</td>
                          <td>{/*{{$log->feedback}}*/}tes</td>
                          <td>{/*{{$log->user->username}}*/}tes</td>
                        </tr>
                        {/* @endforeach */}
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
