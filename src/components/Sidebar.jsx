import { NavLink, useLocation } from "react-router-dom";
import "../assets/css/sidebar.css";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";

const Sidebar = ({ isOpenSidebar, toggleMinimize }) => {
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
  const initialDropdownState = {
    sidangTA: location.pathname.startsWith("/sidangs"),
    dataMaster: location.pathname.startsWith("/data-master"),
    exportData: location.pathname.startsWith("/export-data"),
    guideBook: false,
  };
  const [openDropdowns, setOpenDropdowns] = useState(initialDropdownState);

  const [guideBookDropdowns, setGuideBookDropdowns] = useState(false);
  const toogleGuideBookDropdowns = () => {
    setGuideBookDropdowns(!guideBookDropdowns);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [dropdown]: !prevState[dropdown],
    }));
  };

  const menuItems = [
    {
      key: "sidangTA",
      icon: "icon-list",
      title: "Sidang TA",
      items: [
        { path: "/sidangs", icon: "icon-list", label: "Pengajuan" },
        { path: "#", icon: "icon-list", label: "Jadwal Sidang" },
        { path: "#", icon: "icon-calendar", label: "Perubahan Hak Akses" },
        { path: "#", icon: "icon-exclamation", label: "Sidang Bermasalah" },
        {
          path: "/sidangs/surat-tugas",
          icon: "icon-list",
          label: "Surat Tugas Penguji",
        },
      ],
    },
    {
      key: "dataMaster",
      icon: "fa fa-database",
      title: "Data Master",
      items: [
        { path: "#", icon: "icon-user", label: "Pengguna" },
        { path: "#", icon: "fa fa-users", label: "Hak Akses" },
        { path: "#", icon: "fa fa-clock-o", label: "Periode" },
        { path: "/studyPrograms", icon: "icon-list", label: "Program Studi" },
        { path: "#", icon: "icon-list", label: "Peminatan" },
        { path: "#", icon: "icon-doc", label: "List SN Dokumen" },
        { path: "#", icon: "icon-key", label: "Setting CLO" },
        { path: "#", icon: "icon-key", label: "Porsi Nilai" },
        { path: "/studyPrograms", icon: "icon-cursor", label: "Program Studi" },
        { path: "#", icon: "icon-list", label: "Parameters" },
        { path: "#", icon: "icon-list", label: "Status Revisi Mahasiswa" },
      ],
    },
    {
      key: "exportData",
      icon: "icon-doc",
      title: "Export Data",
      items: [
        { path: "#", icon: "fa fa-files-o", label: "Dokumen Sidang" },
        { path: "#", icon: "fa fa-files-o", label: "Export Dokumen" },
      ],
    },
  ];

  useEffect(() => {
    setOpenDropdowns({
      ...openDropdowns,
      sidangTA:
        location.pathname.startsWith("/sidangs") || openDropdowns.sidangTA,
      dataMaster:
        location.pathname.startsWith("/data-master") ||
        openDropdowns.dataMaster,
      exportData:
        location.pathname.startsWith("/export-data") ||
        openDropdowns.exportData,
    });
  }, [location.pathname]);

  return (
    <div
      className="sidebar shadow"
      style={{ marginLeft: isOpenSidebar ? "-200px" : 0 }}
    >
      <nav className="sidebar-nav">
        <ul className="nav">
          <li className="nav-item mb-2">
            <NavLink
              to="/home"
              className={`nav-link`}
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
              {menuItems.map((menu) => (
                <li
                  key={menu.key}
                  className={`nav-item nav-dropdown mb-2  ${
                    openDropdowns[menu.key] ? "open" : ""
                  }`}
                  onClick={() => toggleDropdown(menu.key)}
                >
                  <div
                    className="nav-link nav-dropdown-toggle"
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    <i className={`nav-icon ${menu.icon}`}></i> {menu.title}
                  </div>
                  <ul
                    className="nav-dropdown-items"
                    style={{ fontSize: "12px" }}
                  >
                    {menu.items.map((item, index) => (
                      <li
                        key={index}
                        className={`nav-item ${isActive(item.path)}`}
                      >
                        {item.path.startsWith("/") ? (
                          <NavLink className="nav-link" to={item.path}>
                            <i className={`nav-icon ${item.icon}`}></i>
                            <span>{item.label}</span>
                          </NavLink>
                        ) : (
                          <a className="nav-link" href={item.path}>
                            <i className={`nav-icon ${item.icon}`}></i>
                            <span>{item.label}</span>
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
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
            className={`nav-item nav-dropdown mb-2  ${isOpen(
              "/guide-book-admin"
            )} ${isOpen("/guide-book-pembimbing")} ${isOpen(
              "/guide-book-student"
            )} ${isOpen("/guide-book-PIC")} ${guideBookDropdowns && "open"} `}
            onClick={() => toogleGuideBookDropdowns()}
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
        onClick={toggleMinimize}
      ></button>
    </div>
  );
};

export default Sidebar;
