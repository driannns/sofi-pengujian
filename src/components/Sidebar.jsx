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
    return location.pathname === path ? "active" : "";
  };
  const isOpen = (path) => {
    return location.pathname.startsWith(path) ? "open" : "";
  };
  const initialDropdownState = {
    sidangTA: location.pathname.startsWith("/sidangs"),
    dataMaster: location.pathname.startsWith("/data-master"),
    exportData: location.pathname.startsWith("/export-data"),
    mahasiswa:
      location.pathname.startsWith("/sidangs") ||
      location.pathname.startsWith("teams") ||
      location.pathname.startsWith("slides"),
    jadwalSidang: location.pathname.startsWith("/schedule"),
    revisiTA: location.pathname.startsWith("/revision/mahasiswa"),
    pembimbing:
      location.pathname.startsWith("/schedule/pembimbing") ||
      location.pathname.startsWith("/sidangs/pembimbing"),
    penguji: location.pathname.startsWith("/schedule/penguji"),
    picTA:
      location.pathname.startsWith("/schedule/bukaAkses") ||
      location.pathname.startsWith("/schedules") ||
      location.pathname.startsWith("/sidangs/pic"),
    revisiSidang: location.pathname.startsWith("/revisions/index/dosen"),
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
  const MHSMenu = [
    {
      key: "mahasiswa",
      icon: "icon-user",
      title: "Mahasiswa",
      items: [
        {
          path: "/sidangs/create",
          route: "/sidangs",
          icon: "icon-info",
          label: "Informasi Pendaftaran",
        },
        {
          path: "/slides",
          route: "/slides",
          icon: "fa fa-folder-o",
          label: "Materi Presentasi",
        },
        {
          path: "/teams",
          route: "/teams",
          icon: "fa fa-users",
          label: "Buat Tim",
        },
      ],
    },
    {
      key: "jadwalSidang",
      icon: "icon-list",
      title: "Jadwal Sidang",
      items: [
        {
          path: "/schedule/mahasiswa",
          icon: "fa fa-calendar-check-o",
          label: "Jadwal Sidang",
        },
      ],
    },
    {
      key: "revisiTA",
      icon: "icon-note",
      title: "Revisi TA",
      items: [
        {
          path: "#",
          icon: "fa fa-check-square-o",
          label: "Revisi TA",
        },
      ],
    },
  ];

  const ADMMenu = [
    {
      key: "sidangTA",
      icon: "icon-list",
      title: "Sidang TA",
      items: [
        { path: "/sidangs", icon: "icon-list", label: "Pengajuan" },
        {
          path: "/schedule/admin-before",
          icon: "icon-list",
          label: "Jadwal Sidang",
        },
        {
          path: "/schedule/admin",
          icon: "icon-calendar",
          label: "Perubahan Hak Akses",
        },
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

  const PBBPGJMenu1 = [
    {
      key: "pembimbing",
      icon: "fa fa-book",
      title: "Pembimbing",
      items: [
        {
          path: "/sidangs/pembimbing",
          icon: "fa fa-check-square-o",
          label: "Bimbingan TA",
        },
        {
          path: "/schedule/pembimbing",
          icon: "fa fa-calendar-check-o",
          label: "Jadwal Sidang Bimbingan",
        },
      ],
    },
  ];

  const PGJMenu = [
    {
      key: "penguji",
      icon: "fa fa-hourglass-half",
      title: "Penguji",
      items: [
        {
          path: "/schedule/penguji",
          icon: "fa fa-calendar-check-o",
          label: "Jadwal Sidang Penguji",
        },
      ],
    },
  ];

  const PICMenu = [
    {
      key: "picTA",
      icon: "icon-list",
      title: "PIC TA",
      items: [
        {
          path: "/sidangs/pic",
          icon: "fa fa-calendar",
          label: "Penjadwalan Sidang",
        },
        {
          path: "/schedule/bukaAkses",
          icon: "fa fa-calendar-check-o",
          label: "Jadwal Sidang KK",
        },
        {
          path: "/schedule/bukaAkses",
          icon: "icon-key",
          label: "Buka Akses Menu",
        },
      ],
    },
  ];

  const PBBPGJMenu2 = [
    {
      key: "revisiSidang",
      icon: "icon-note",
      title: "Revisi Sidang",
      items: [
        {
          path: "/statusrevisi",
          icon: "fa fa-check-square-o",
          label: "Revisi Mahasiswa",
        },
      ],
    },
  ];

  useEffect(() => {
    setOpenDropdowns({
      ...openDropdowns,
      mahasiswa:
        location.pathname.startsWith("/sidangs") ||
        location.pathname.startsWith("teams") ||
        location.pathname.startsWith("slides") ||
        openDropdowns.mahasiswa,
      jadwalSidang:
        location.pathname.startsWith("/schedule") || openDropdowns.jadwalSidang,
      revisiTA:
        location.pathname.startsWith("/revision/mahasiswa") ||
        openDropdowns.revisiTA,
      pembimbing:
        location.pathname.startsWith("/sidangs/pembimbing") ||
        location.pathname.startsWith("/schedule/pembimbing") ||
        openDropdowns.pembimbing,
      penguji:
        location.pathname.startsWith("/schedule/penguji") ||
        openDropdowns.penguji,
      picTA:
        location.pathname.startsWith("/sidangs/pic") ||
        location.pathname.startsWith("/schedules") ||
        location.pathname.startsWith("/schedule/bukaAkses") ||
        openDropdowns.picTA,
      sidangTA:
        location.pathname.startsWith("/sidangs") || openDropdowns.sidangTA,
      dataMaster:
        location.pathname.startsWith("/data-master") ||
        openDropdowns.dataMaster,
      exportData:
        location.pathname.startsWith("/export-data") ||
        openDropdowns.exportData,
      revisiSidang:
        location.pathname.startsWith("/revisions/index/dosen") ||
        openDropdowns.revisiSidang,
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
              {MHSMenu.map((menu) => (
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
            <>
              {PBBPGJMenu1.map((menu) => (
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

          {userData.role?.find((roles) => ["RLPGJ"].includes(roles)) && (
            <>
              {PGJMenu.map((menu) => (
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

          {userData.role?.find((roles) => ["RLPIC"].includes(roles)) && (
            <>
              {PICMenu.map((menu) => (
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

          {userData.role?.find((roles) => "RLADM".includes(roles)) && (
            <>
              {ADMMenu.map((menu) => (
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
            <>
              {PBBPGJMenu2.map((menu) => (
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
