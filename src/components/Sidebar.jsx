import { NavLink, useLocation } from "react-router-dom";
import "../assets/css/sidebar.css";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";

const Sidebar = () => {
  const location = useLocation();
  const [cookies] = useCookies();
  const authToken = cookies["auth-token"];
  const userData = jwtDecode(authToken);

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? "active" : "";
  };
  const isOpen = (path) => {
    return location.pathname.startsWith(path) ? "open" : "";
  };

  return (
    <div className="sidebar shadow">
      <nav className="sidebar-nav">
        <ul className="nav">
          <li className="nav-item mb-2">
            <NavLink
              to="/home"
              className={`nav-link ${isActive("/home")}`}
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              <i className="nav-icon icon-home"></i>Beranda
            </NavLink>
          </li>

          {userData.role?.find((roles) => "RLMHS".includes(roles)) && (
            <>
              <li
                className={`nav-item nav-dropdown mb-2 ${isOpen(
                  "/sidangs"
                )} ${isOpen("/slides")} ${isOpen("/teams")}`}
              >
                <div
                  className={`nav-link nav-dropdown-toggle ${isActive(
                    "/sidangs"
                  )} ${isActive("/slides")} ${isActive("/teams")}`}
                  // href="#"
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  <i className="nav-icon icon-user"></i>Mahasiswa
                </div>
                <ul className="nav-dropdown-items" style={{ fontSize: "12px" }}>
                  <li className="nav-item">
                    <NavLink
                      to="/sidangs/create"
                      className={`nav-link ${isActive("/sidangs")} open`}
                    >
                      <i className="nav-icon icon-info ml-1"></i>
                      <span>Informasi Pendaftaran</span>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/slides"
                      className={`nav-link ${isActive("/slides")} open`}
                    >
                      <i className="nav-icon fa fa-folder-o ml-1"></i>
                      <span>Materi Presentasi</span>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/teams"
                      className={`nav-link ${isActive("/teams")} open`}
                    >
                      <i className="nav-icon fa fa-users ml-1"></i>
                      <span>Buat Tim</span>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item nav-dropdown mb-2">
                <a
                  className="nav-link nav-dropdown-toggle {{ Request::is('schedule*') ? 'active' : '' }}"
                  href="#"
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  <i className="nav-icon icon-list"></i>Jadwal Sidang
                </a>
                <ul className="nav-dropdown-items" style={{ fontSize: "12px" }}>
                  <li className="nav-item">
                    <a
                      className="nav-link {{ Request::is('schedule.mahasiswa') ? 'active' : '' }}"
                      href="#"
                    >
                      <i className="nav-icon fa fa-calendar-check-o ml-1"></i>
                      <span>Jadwal Sidang</span>
                    </a>
                  </li>
                </ul>
              </li>
              <div id="submenumhs3" className="collapse sidebar-submenu">
                <li className="nav-item {{ Request::is('revisions.index.mahasiswa') ? 'active' : '' }}">
                  <a className="nav-link" href="#">
                    <i className="nav-icon icon-note"></i>
                    <span>Revisi TA</span>
                  </a>
                </li>
              </div>
              <li className="nav-item nav-dropdown mb-2">
                <a
                  className="nav-link nav-dropdown-toggle {{ Request::is('revision*') ? 'active' : '' }}"
                  href="#"
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  <i className="nav-icon icon-note"></i>Revisi TA
                </a>
                <ul className="nav-dropdown-items" style={{ fontSize: "12px" }}>
                  <li className="nav-item">
                    <a
                      className="nav-link {{ Request::is('revisions.index.mahasiswa') ? 'active' : '' }}"
                      href="#"
                    >
                      <i className="nav-icon fa fa-check-square-o ml-1"></i>
                      <span>Revisi TA</span>
                    </a>
                  </li>
                </ul>
              </li>
            </>
          )}

          {userData.role?.find((roles) =>
            ["RLPGJ", "RLPBB"].includes(roles)
          ) && (
            <>
              <li
                className={`nav-item nav-dropdown mb-2 ${isOpen(
                  "/sidangs/pembimbing"
                )}`}
              >
                <div
                  className="nav-link nav-dropdown-toggle"
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  <i className="nav-icon fa fa-book"></i>Pembimbing
                </div>
                <ul className="nav-dropdown-items">
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                      }
                      to="/sidangs/pembimbing"
                    >
                      <i className="nav-icon fa fa-check-square-o ml-1"></i>
                      <span>Bimbingan TA</span>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link {{ Request::is('schedule.pembimbing') ? 'active' : '' }}"
                      href="#"
                    >
                      <i className="nav-icon fa fa-calendar-check-o ml-1"></i>
                      <span>Jadwal Sidang Bimbingan</span>
                    </a>
                  </li>
                </ul>
              </li>
            </>
          )}

          {userData.role?.find((roles) => ["RLPGJ"].includes(roles)) && (
            <>
              <li className="nav-item nav-dropdown mb-2">
                <div
                  className="nav-link nav-dropdown-toggle"
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  <i className="nav-icon fa fa-hourglass-half"></i>
                  Penguji
                </div>
                <ul className="nav-dropdown-items">
                  <li className="nav-item">
                    <a
                      className="nav-link {{ Request::is('schedule.penguji') ? 'active' : '' }}"
                      href="#"
                    >
                      <i className="nav-icon fa fa-calendar-check-o ml-1"></i>
                      <span>Jadwal Sidang Penguji</span>
                    </a>
                  </li>
                </ul>
              </li>
            </>
          )}

          {userData.role?.find((roles) => ["RLPIC"].includes(roles)) && (
            <>
              <li
                className={`nav-item nav-dropdown mb-2 ${isOpen(
                  "/sidangs/pic"
                )}`}
              >
                <div
                  className="nav-link nav-dropdown-toggle "
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  <i className="nav-icon icon-list"></i>PIC TA
                </div>
                <ul className="nav-dropdown-items">
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                      }
                      to="/sidangs/pic"
                    >
                      <i className="nav-icon fa fa-calendar ml-1"></i>
                      <span>Penjadwalan Sidang</span>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link {{ Request::is('schedules.index') ? 'active' : '' }}"
                      href="#"
                    >
                      <i className="nav-icon fa fa-calendar-check-o ml-1"></i>
                      <span>Jadwal Sidang KK</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link {{ Request::is('schedule.bukaAkses') ? 'active' : '' }}"
                      href="#"
                    >
                      <i className="nav-icon icon-key ml-1"></i>
                      <span>Buka Akses Menu</span>
                    </a>
                  </li>
                </ul>
              </li>{" "}
            </>
          )}

          {userData.role?.find((roles) => "RLADM".includes(roles)) && (
            <>
              <li
                className={`nav-item nav-dropdown mb-2 ${isOpen("/sidangs")}`}
              >
                <div
                  className="nav-link nav-dropdown-toggle "
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  <i className="nav-icon icon-list"></i>Sidang TA
                </div>
                <ul className="nav-dropdown-items" style={{ fontSize: "12px" }}>
                  <li className={`nav-item ${isActive("/sidangs")}`}>
                    <NavLink className="nav-link" to="/sidangs">
                      <i className="nav-icon icon-list"></i>
                      <span>Pengajuan</span>
                    </NavLink>
                  </li>
                  <li className="nav-item {{ Request::is('schedules') ? 'active' : '' }}">
                    <a className="nav-link" href="#">
                      <i className="nav-icon icon-list"></i>
                      <span>Jadwal Sidang</span>
                    </a>
                  </li>
                  <li className="nav-item {{ Request::is('schedules') ? 'active' : '' }}">
                    <a className="nav-link" href="#">
                      <i className="nav-icon icon-calendar"></i>
                      <span>Perubahan Hak Akses</span>
                    </a>
                  </li>
                  <li className="nav-item {{ Request::is('schedule.adminBermasalah') ? 'active' : '' }}">
                    <a className="nav-link" href="#">
                      <i className="nav-icon icon-exclamation"></i>
                      <span>Sidang Bermasalah</span>
                    </a>
                  </li>
                  <li className={`nav-item ${isActive("/sidangs")}`}>
                    <NavLink className="nav-link" to="/sidangs/surat-tugas">
                      <i className="nav-icon icon-list"></i>
                      <span>Surat Tugas Penguji</span>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item nav-dropdown mb-2">
                <div
                  className="nav-link nav-dropdown-toggle "
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  <i className="nav-icon fa fa-database"></i>Data Master
                </div>
                <ul className="nav-dropdown-items" style={{ fontSize: "12px" }}>
                  <li className="nav-item {{ Request::is('users*') ? 'active' : '' }}">
                    <a
                      className="nav-link {{ Request::is('users*') ? 'active' : '' }}"
                      href="#"
                    >
                      <i className="nav-icon icon-user"></i>
                      <span>Pengguna</span>
                    </a>
                  </li>
                  <li className="nav-item {{ Request::is('lecturers*') ? 'active' : '' }}">
                    <a
                      className="nav-link {{ Request::is('lecturers*') ? 'active' : '' }}"
                      href="#"
                    >
                      <i className="nav-icon fa fa-users"></i>
                      <span>Hak Akses</span>
                    </a>
                  </li>
                  <li className="nav-item {{ Request::is('periods*') ? 'active' : '' }}">
                    <a
                      className="nav-link {{ Request::is('periods*') ? 'active' : '' }}"
                      href="#"
                    >
                      <i className="nav-icon fa fa-clock-o"></i>
                      <span>Periode</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/studyPrograms"
                      className={({ isActive }) =>
                        isActive ? "nav-link active open" : "nav-link open"
                      }
                    >
                      <i className="nav-icon icon-list"></i>
                      <span>Program Studi</span>
                    </NavLink>
                  </li>
                  <li className="nav-item {{ Request::is('peminatans*') ? 'active' : '' }}">
                    <a
                      className="nav-link {{ Request::is('peminatans*') ? 'active' : '' }}"
                      href="#"
                    >
                      <i className="nav-icon icon-list"></i>
                      <span>Peminatan</span>
                    </a>
                  </li>
                  <li className="nav-item {{ Request::is('verifyDocuments*') ? 'active' : '' }}">
                    <a
                      className="nav-link {{ Request::is('verifyDocuments*') ? 'active' : '' }}"
                      href="#"
                    >
                      <i className="nav-icon icon-doc"></i>
                      <span>List SN Dokumen</span>
                    </a>
                  </li>
                  <li className="nav-item {{ (Request::is('cLOS*') OR Request::is('clo*')) ? 'active' : '' }}">
                    <a
                      className="nav-link {{ (Request::is('cLOS*') OR Request::is('clo*')) ? 'active' : '' }}"
                      href="#"
                    >
                      <i className="nav-icon icon-key"></i>
                      <span>Setting CLO</span>
                    </a>
                  </li>
                  <li className="nav-item {{ Request::is('scorePortions*') ? 'active' : '' }}">
                    <a
                      className="nav-link {{ Request::is('scorePortions*') ? 'active' : '' }}"
                      href="#"
                    >
                      <i className="nav-icon icon-key"></i>
                      <span>Porsi Nilai</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/studyPrograms"
                      className={({ isActive }) =>
                        isActive ? "nav-link active open" : "nav-link open"
                      }
                    >
                      <i className="nav-icon icon-cursor"></i>
                      <span>Program Studi</span>
                    </NavLink>
                  </li>
                  <li className="nav-item {{ Request::is('parameters.index') ? 'active' : '' }}">
                    <a
                      className="nav-link {{ Request::is('parameters.index') ? 'active' : '' }}"
                      href="#"
                    >
                      <i className="nav-icon icon-list"></i>
                      <span>Parameters</span>
                    </a>
                  </li>
                  <li className="nav-item {{ Request::is('schedule/status_revisi') ? 'active' : '' }}">
                    <a
                      className="nav-link {{ Request::is('schedule/status_revisi') ? 'active' : '' }}"
                      href="#"
                    >
                      <i className="nav-icon icon-list"></i>
                      <span>Status Revisi Mahasiswa</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item nav-dropdown mb-2">
                <div
                  className="nav-link nav-dropdown-toggle "
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  <i className="nav-icon icon-doc"></i>Export Data
                </div>
                <ul className="nav-dropdown-items" style={{ fontSize: "12px" }}>
                  <li className="nav-item {{ Request::is('cetak/index*') ? 'active' : '' }}">
                    <a
                      className="nav-link {{ Request::is('cetak/index*') ? 'active' : '' }}"
                      href="#"
                    >
                      <i className="nav-icon fa fa-files-o"></i>
                      <span>Dokumen Sidang</span>
                    </a>
                  </li>
                  <li className="nav-item {{ Request::is('exports*') ? 'active' : '' }}">
                    <a
                      className="nav-link {{ Request::is('exports*') ? 'active' : '' }}"
                      href="#"
                    >
                      <i className="nav-icon fa fa-files-o"></i>
                      <span>Export Dokumen</span>
                    </a>
                  </li>
                </ul>
              </li>
            </>
          )}

          {userData.role?.find((roles) =>
            ["RLPGJ", "RLPBB"].includes(roles)
          ) && (
            <li className="nav-item nav-dropdown">
              <div
                className="nav-link nav-dropdown-toggle {{ Request::is('revision*') ? 'active' : '' }}"
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                <i className="nav-icon icon-note"></i>Revisi Sidang
              </div>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <a
                    className="nav-link {{ Request::is('revisions.index.dosen') ? 'active' : '' }}"
                    href="#"
                  >
                    <i className="nav-icon fa fa-check-square-o ml-1"></i>
                    <span>Revisi Mahasiswa</span>
                  </a>
                </li>
              </ul>
            </li>
          )}

          {/* Guide Book */}
          <li
            className={`nav-item nav-dropdown mb-2 ${isOpen(
              "/guide-book-admin"
            )} ${isOpen("/guide-book-pembimbing")} ${isOpen(
              "/guide-book-student"
            )} ${isOpen("/guide-book-PIC")}`}
          >
            <a
              className="nav-link nav-dropdown-toggle "
              href="#"
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              <i className="nav-icon fa fa-bookmark-o"></i>Guide Book
            </a>
            <ul className="nav-dropdown-items" style={{ fontSize: "12px" }}>
              {userData.role?.find((roles) => ["RLADM"].includes(roles)) && (
                <li className={`nav-item ${isActive("/guide-book-admin")}`}>
                  <NavLink
                    to="/guide-book-admin"
                    className={`nav-link ${isActive("/guide-book-admin")}`}
                    style={{ fontSize: "14px", fontWeight: "bold" }}
                  >
                    <i className="nav-icon icon-notebook"></i>Admin
                  </NavLink>
                </li>
              )}
              {userData.role?.find((roles) =>
                ["RLADM", "RLPIC"].includes(roles)
              ) && (
                <li className={`nav-item ${isActive("/guide-book-PIC")}`}>
                  <NavLink
                    className={`nav-link ${isActive("/guide-book-PIC")}`}
                    to="/guide-book-PIC"
                    style={{ fontSize: "14px", fontWeight: "bold" }}
                  >
                    <i className="nav-icon icon-notebook"></i>PIC
                  </NavLink>
                </li>
              )}{" "}
              {userData.role?.find((roles) =>
                ["RLADM", "RLDSN"].includes(roles)
              ) && (
                <li
                  className={`nav-item ${isActive("/guide-book-pembimbing")}`}
                >
                  <NavLink
                    className={`nav-link ${isActive("/guide-book-pembimbing")}`}
                    to="/guide-book-pembimbing"
                    style={{ fontSize: "14px", fontWeight: "bold" }}
                  >
                    <i className="nav-icon icon-notebook"></i>Dosen
                  </NavLink>
                </li>
              )}
              {userData.role?.find((roles) =>
                ["RLADM", "RLMHS"].includes(roles)
              ) && (
                <li className={`nav-item ${isActive("/guide-book-student")}`}>
                  <NavLink
                    className={`nav-link ${isActive("/guide-book-student")}`}
                    to="/guide-book-student"
                    style={{ fontSize: "14px", fontWeight: "bold" }}
                  >
                    <i className="nav-icon icon-notebook"></i>Mahasiswa
                  </NavLink>
                </li>
              )}
            </ul>
          </li>
          {/* End of Guide Book */}
        </ul>
      </nav>
      <button
        className="sidebar-minimizer brand-minimizer"
        type="button"
      ></button>
    </div>
  );
};

export default Sidebar;
