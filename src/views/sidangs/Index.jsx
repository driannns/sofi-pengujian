import { MainLayout } from "../layouts/MainLayout";
import { useAuth } from "../../middleware/AuthContext";
import { useLocation } from "react-router-dom";

const SidangIndex = () => {
  const { roles } = useAuth();
  const location = useLocation();

  return (
    <MainLayout>
      <ol class="breadcrumb  mb-0">
        {roles.find((role) => ["RLPBM"].includes(role)) &&
        location.pathname == "/sidangs/pembimbing" ? (
          <div class="col-12">
            <h3>BIMBINGAN TA</h3>
            <hr class="mt-0" />
            <h6 class="mb-3">
              <a href="{{ route('home') }}" class="text-dark">
                BERANDA
              </a>{" "}
              / BIMBINGAN TA
            </h6>
          </div>
        ) : roles.find((role) => ["RLPIC"].includes(role)) &&
          location.pathname == "/sidangs/pic" ? (
          <div class="col-12">
            <h3>PENJADWALAN SIDANG</h3>
            <hr class="mt-0" />
            <h6 class="mb-3">
              <a href="{{ route('home') }}" class="text-dark">
                BERANDA
              </a>{" "}
              / PENJADWALAN SIDANG
            </h6>
          </div>
        ) : (
          <div class="col-12">
            <h3>PENGAJUAN SIDANG</h3>
            <hr class="mt-0" />
            <h6 class="mb-3">
              <a href="{{ route('home') }}" class="text-dark">
                BERANDA
              </a>{" "}
              / PENGAJUAN SIDANG
            </h6>
          </div>
        )}
      </ol>
      <div class="container-fluid">
        <div class="animated fadeIn">
          {/* @include('flash::message')
        @include('coreui-templates::common.errors') */}
          <div class="row">
            <div class="col-lg-12">
              <div class="card">
                <div class="card-body">
                  @include('sidangs.table')
                  <div class="pull-right mr-3"></div>
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
