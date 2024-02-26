import { NavLink } from "react-router-dom";
import "../assets/css/sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar shadow">
      <nav className="sidebar-nav">
        <ul className="nav">
          <li className="nav-item mb-2">
            <NavLink
              key="beranda"
              to="/home"
              className={({ isActive }) => {
                return "nav-link " + (!isActive ? "active" : "");
              }}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <i className="nav-icon icon-home"></i>Beranda
            </NavLink>
          </li>
          <li className="nav-item nav-dropdown mb-2">
            <a
              className="nav-link nav-dropdown-toggle "
              href="#"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <i className="nav-icon icon-list"></i>Sidang TA
            </a>
            <ul className="nav-dropdown-items" style={{ fontSize: "12px" }}>
              <li className="nav-item {{ Request::is('sidangs') ? 'active' : '' }}">
                <a className="nav-link" href="{{ route('sidangs.index') }}">
                  <i className="nav-icon icon-list"></i>
                  <span>Pengajuan</span>
                </a>
              </li>
              <li className="nav-item {{ Request::is('schedules') ? 'active' : '' }}">
                <a
                  className="nav-link"
                  href="{{ route('schedule.admin-before') }}"
                >
                  <i className="nav-icon icon-list"></i>
                  <span>Jadwal Sidang</span>
                </a>
              </li>
              <li className="nav-item {{ Request::is('schedules') ? 'active' : '' }}">
                <a className="nav-link" href="{{ route('schedule.admin') }}">
                  <i className="nav-icon icon-calendar"></i>
                  <span>Perubahan Hak Akses</span>
                </a>
              </li>
              <li className="nav-item {{ Request::is('schedule.adminBermasalah') ? 'active' : '' }}">
                <a
                  className="nav-link"
                  href="{{ route('schedule.adminBermasalah') }}"
                >
                  <i className="nav-icon icon-exclamation"></i>
                  <span>Sidang Bermasalah</span>
                </a>
              </li>
              <li className="nav-item {{ Request::is('sidangs') ? 'active' : '' }}">
                <a
                  className="nav-link"
                  href="{{ route('sidangs.indexSuratTugasPenguji') }}"
                >
                  <i className="nav-icon icon-list"></i>
                  <span>Surat Tugas Penguji</span>
                </a>
              </li>
            </ul>
          </li>

          <li className="nav-item nav-dropdown mb-2">
            <a
              className="nav-link nav-dropdown-toggle "
              href="#"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <i className="nav-icon fa fa-database"></i>Data Master
            </a>
            <ul className="nav-dropdown-items" style={{ fontSize: "12px" }}>
              <li className="nav-item {{ Request::is('users*') ? 'active' : '' }}">
                <a
                  className="nav-link {{ Request::is('users*') ? 'active' : '' }}"
                  href="{{ route('users.index') }}"
                >
                  <i className="nav-icon icon-user"></i>
                  <span>Pengguna</span>
                </a>
              </li>
              <li className="nav-item {{ Request::is('lecturers*') ? 'active' : '' }}">
                <a
                  className="nav-link {{ Request::is('lecturers*') ? 'active' : '' }}"
                  href="{{ route('lecturers.index') }}"
                >
                  <i className="nav-icon fa fa-users"></i>
                  <span>Hak Akses</span>
                </a>
              </li>
              <li className="nav-item {{ Request::is('periods*') ? 'active' : '' }}">
                <a
                  className="nav-link {{ Request::is('periods*') ? 'active' : '' }}"
                  href="{{ route('periods.index') }}"
                >
                  <i className="nav-icon fa fa-clock-o"></i>
                  <span>Periode</span>
                </a>
              </li>
              <li className="nav-item {{ Request::is('studyPrograms*') ? 'active' : '' }}">
                <a
                  className="nav-link {{ Request::is('studyPrograms*') ? 'active' : '' }}"
                  href="{{ route('studyPrograms.index') }}"
                >
                  <i className="nav-icon icon-list"></i>
                  <span>Program Studi</span>
                </a>
              </li>
              <li className="nav-item {{ Request::is('peminatans*') ? 'active' : '' }}">
                <a
                  className="nav-link {{ Request::is('peminatans*') ? 'active' : '' }}"
                  href="{{ route('peminatans.index') }}"
                >
                  <i className="nav-icon icon-list"></i>
                  <span>Peminatan</span>
                </a>
              </li>
              <li className="nav-item {{ Request::is('verifyDocuments*') ? 'active' : '' }}">
                <a
                  className="nav-link {{ Request::is('verifyDocuments*') ? 'active' : '' }}"
                  href="{{ route('verifyDocuments.index') }}"
                >
                  <i className="nav-icon icon-doc"></i>
                  <span>List SN Dokumen</span>
                </a>
              </li>
              <li className="nav-item {{ (Request::is('cLOS*') OR Request::is('clo*')) ? 'active' : '' }}">
                <a
                  className="nav-link {{ (Request::is('cLOS*') OR Request::is('clo*')) ? 'active' : '' }}"
                  href="{{ route('cLOS.index') }}"
                >
                  <i className="nav-icon icon-key"></i>
                  <span>Setting CLO</span>
                </a>
              </li>
              <li className="nav-item {{ Request::is('scorePortions*') ? 'active' : '' }}">
                <a
                  className="nav-link {{ Request::is('scorePortions*') ? 'active' : '' }}"
                  href="{{ route('scorePortions.index') }}"
                >
                  <i className="nav-icon icon-key"></i>
                  <span>Porsi Nilai</span>
                </a>
              </li>
              <li className="nav-item {{ Request::is('studyPrograms*') ? 'active' : '' }}">
                <a
                  className="nav-link"
                  href="{{ route('studyPrograms.index') }}"
                >
                  <i className="nav-icon icon-cursor"></i>
                  <span>Program Studi</span>
                </a>
              </li>
              <li className="nav-item {{ Request::is('parameters.index') ? 'active' : '' }}">
                <a
                  className="nav-link {{ Request::is('parameters.index') ? 'active' : '' }}"
                  href="{{ route('parameters.index') }}"
                >
                  <i className="nav-icon icon-list"></i>
                  <span>Parameters</span>
                </a>
              </li>
              <li className="nav-item {{ Request::is('schedule/status_revisi') ? 'active' : '' }}">
                <a
                  className="nav-link {{ Request::is('schedule/status_revisi') ? 'active' : '' }}"
                  href="{{ route('schedule.status_revisi') }}"
                >
                  <i className="nav-icon icon-list"></i>
                  <span>Status Revisi Mahasiswa</span>
                </a>
              </li>
            </ul>
          </li>
          <li className="nav-item nav-dropdown mb-2">
            <a
              className="nav-link nav-dropdown-toggle "
              href="#"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <i className="nav-icon icon-doc"></i>Export Data
            </a>
            <ul className="nav-dropdown-items" style={{ fontSize: "12px" }}>
              <li className="nav-item {{ Request::is('cetak/index*') ? 'active' : '' }}">
                <a
                  className="nav-link {{ Request::is('cetak/index*') ? 'active' : '' }}"
                  href="{{ route('cetak.index') }}"
                >
                  <i className="nav-icon fa fa-files-o"></i>
                  <span>Dokumen Sidang</span>
                </a>
              </li>
              <li className="nav-item {{ Request::is('exports*') ? 'active' : '' }}">
                <a
                  className="nav-link {{ Request::is('exports*') ? 'active' : '' }}"
                  href="{{ route('export.index') }}"
                >
                  <i className="nav-icon fa fa-files-o"></i>
                  <span>Export Dokumen</span>
                </a>
              </li>
            </ul>
          </li>
          <li className="nav-item nav-dropdown mb-2">
            <a
              className="nav-link nav-dropdown-toggle "
              href="#"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <i className="nav-icon fa fa-bookmark-o"></i>Guide Book
            </a>
            <ul className="nav-dropdown-items" style={{ fontSize: "12px" }}>
              <li className="nav-item {{ Request::is('guide_book_admin') ? 'active' : '' }}">
                <a
                  className="nav-link {{ Request::is('guide_book_admin') ? 'active' : '' }}"
                  href="{{route('guide_book_admin')}}"
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                >
                  <i className="nav-icon icon-notebook"></i>Admin
                </a>
              </li>
              <li className="nav-item {{ Request::is('guide_book_PIC') ? 'active' : '' }}">
                <a
                  className="nav-link {{ Request::is('guide_book_admin_PIC') ? 'active' : '' }}"
                  href="{{route('guide_book_PIC')}}"
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                >
                  <i className="nav-icon icon-notebook"></i>PIC
                </a>
              </li>
              <li className="nav-item {{ Request::is('guide_book_pembimbing') ? 'active' : '' }}">
                <a
                  className="nav-link {{ Request::is('guide_book_admin_pembimbing') ? 'active' : '' }}"
                  href="{{route('guide_book_pembimbing')}}"
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                >
                  <i className="nav-icon icon-notebook"></i>Dosen
                </a>
              </li>
              <li className="nav-item {{ Request::is('guide_book_student') ? 'active' : '' }}">
                <a
                  className="nav-link {{ Request::is('guide_book_admin_student') ? 'active' : '' }}"
                  href="{{route('guide_book_student')}}"
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                >
                  <i className="nav-icon icon-notebook"></i>Mahasiswa
                </a>
              </li>
            </ul>
          </li>
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
