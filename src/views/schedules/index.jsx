import { Link, useLocation } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import JadwalTable from "./tabel";
import TableSuperAdmin from "./tableSuperadmin";
import TabelBermasalah from "./tabelbermasalah";
import TabelMahasiswa from "./tabelmahasiswa";
import Alert from "../../components/Alert";

const JadwalIndex = () => {
  const [cookies] = useCookies();
  const jwtDecoded = jwtDecode(cookies["auth-token"]);
  const location = useLocation();
  const { state } = location;

  return (
    <MainLayout>
      <ol className="breadcrumb mb-0">
        {jwtDecoded.role.find((role) => ["RLPBB"].includes(role)) &&
        location.pathname === "/schedule/pembimbing" ? (
          <div className="col-12">
            <h3>JADWAL BIMBINGAN</h3>
            <hr className="mt-0" />
            <h6 className="mb-3">
              <Link to="/home" className="text-dark">
                BERANDA
              </Link>{" "}
              / JADWAL BIMBINGAN
            </h6>
          </div>
        ) : jwtDecoded.role.find((role) => ["RLPGJ"].includes(role)) &&
          location.pathname === "/schedule/penguji" ? (
          <div className="col-12">
            <h3>JADWAL SIDANG PENGUJI</h3>
            <hr className="mt-0" />
            <h6 className="mb-3">
              <Link to="/home" className="text-dark">
                BERANDA
              </Link>{" "}
              / JADWAL SIDANG PENGUJI
            </h6>
          </div>
        ) : jwtDecoded.role.find((role) => ["RLPIC"].includes(role)) &&
          location.pathname === "/schedule" ? (
          <div className="col-12">
            <h3>JADWAL SIDANG KK</h3>
            <hr className="mt-0" />
            <h6 className="mb-3">
              <Link to="/home" className="text-dark">
                BERANDA
              </Link>{" "}
              / JADWAL SIDANG KK
            </h6>
          </div>
        ) : jwtDecoded.role.find((role) => ["RLADM"].includes(role)) &&
          location.pathname === "/schedule/admin" ? (
          <div className="col-12">
            <h3> PERUBAHAN HAK AKSES </h3>
            <hr className="mt-0" />
            <h6 className="mb-3">
              <Link to="/home" className="text-dark">
                BERANDA
              </Link>{" "}
              / PERUBAHAN HAK AKSES{" "}
            </h6>
          </div>
        ) : jwtDecoded.role.find((role) => ["RLADM"].includes(role)) &&
          location.pathname === "/schedule/bermasalahSuperAdmin" ? (
          <div className="col-12">
            <h3>SELURUH SIDANG BERMASALAH</h3>
            <hr className="mt-0" />
            <h6 className="mb-3">
              <Link to="/home" className="text-dark">
                BERANDA
              </Link>{" "}
              / SELURUH SIDANG BERMASALAH
            </h6>
          </div>
        ) : jwtDecoded.role.find((role) => ["RLADM"].includes(role)) &&
          location.pathname === "/schedule/bermasalah" ? (
          <div className="col-12">
            <h3>SELURUH SIDANG BERMASALAH</h3>
            <hr className="mt-0" />
            <h6 className="mb-3">
              <Link to="/home" className="text-dark">
                BERANDA
              </Link>{" "}
              / SELURUH SIDANG BERMASALAH
            </h6>
          </div>
        ) : jwtDecoded.role.find((role) => ["RLADM"].includes(role)) &&
          location.pathname === "/schedule/superadmin" ? (
          <div className="col-12">
            <h3>SELURUH JADWAL SIDANG</h3>
            <hr className="mt-0" />
            <h6 className="mb-3">
              <Link to="/home" className="text-dark">
                BERANDA
              </Link>{" "}
              / SELURUH JADWAL SIDANG
            </h6>
          </div>
        ) : jwtDecoded.role.find((role) => ["RLADM"].includes(role)) &&
          location.pathname === "/schedule/bukaAkses" ? (
          <div className="col-12">
            <h3>SELURUH JADWAL SIDANG KK</h3>
            <hr className="mt-0" />
            <h6 className="mb-3">
              <Link to="/home" className="text-dark">
                BERANDA
              </Link>{" "}
              / SELURUH JADWAL SIDANG KK
            </h6>
          </div>
        ) : jwtDecoded.role.find((role) => ["RLPIC"].includes(role)) &&
          location.pathname === "/schedule/bukaAkses" ? (
          <div className="col-12">
            <h3>BUKA AKSES MENU</h3>
            <hr className="mt-0" />
            <h6 className="mb-3">
              <Link to="/home" className="text-dark">
                BERANDA
              </Link>{" "}
              / BUKA AKSES MENU
            </h6>
          </div>
        ) : (
          jwtDecoded.role.find((role) => ["RLMHS"].includes(role)) &&
          location.pathname === "/schedule/mahasiswa" && (
            <div className="col-12">
              <h3>JADWAL SIDANG MAHASISWA</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  BERANDA
                </Link>{" "}
                / JADWAL SIDANG MAHASISWA
              </h6>
            </div>
          )
        )}
      </ol>
      <div className="container-fluid">
        <div className="animated fadeIn">
          {/*@include('flash::message')
        @if (Session::has('error'))*/}
          <div
          // className="alert alert-danger"
          // role="alert"
          >
            {/*{{Session::get('error')}}*/}
            {state && state.successMessage && (
              <Alert type="success" message={state.successMessage} />
            )}
            {state && state.errorMessage && (
              <Alert type="danger" message={state.errorMessage} />
            )}
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  {jwtDecoded.role.includes("RLADM") &&
                  location.pathname === "/schedule/superadmin" ? (
                    <TableSuperAdmin />
                  ) : (location.pathname === "/schedule/bermasalah" ||
                      location.pathname === "/schedule/bermasalahSuperAdmin") &&
                    jwtDecoded.role.includes("RLADM") ? (
                    <TabelBermasalah />
                  ) : jwtDecoded.role.includes("RLMHS") &&
                    location.pathname === "/schedule/mahasiswa" ? (
                    <TabelMahasiswa />
                  ) : (
                    <JadwalTable />
                  )}
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

export default JadwalIndex;
