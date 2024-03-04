import { MainLayout } from "../layouts/MainLayout";
import Fields from "./Fields";
import { Link } from "react-router-dom";

const SidangCreate = () => {
  return (
    <MainLayout>
      <div>
        <ol className="breadcrumb mb-0">
          <div className="col-12">
            <h3> PENDAFTARAN SIDANG </h3>
            <hr className="mt-0" />
            <h6 className="mb-3">
              <Link to="/home" className="text-dark">
                BERANDA
              </Link>{" "}
              / PENDAFTARAN SIDANG
            </h6>
          </div>
        </ol>

        <div className="container-fluid">
          <div className="animated fadeIn">
            {/* @include('coreui-templates::common.errors')
            @if (Session::has('error'))
            <div className="alert alert-danger" role="alert">
              {{Session::get('error')}}
            </div>
            @endif
            {/* @if(Request::is('sidangs/create')) */}
            <div className="alert alert-warning" role="alert">
              Pastikan data dibawah sudah benar, terutama status approval. Jika
              ada perbedaan data, silahkan hubungi admin sebelum submit
            </div>
            {/* @endif */}
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <Fields />
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

export default SidangCreate;
