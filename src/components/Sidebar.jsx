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
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <i className="nav-icon icon-home"></i>Beranda
            </NavLink>
          </li>
          {/* Admin */}
          {/* <li className="nav-item nav-dropdown mb-2">
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
          */}
          {/* End of Admin */}

          {/* Student */}
          <li className="nav-item nav-dropdown mb-2">
            <a
              className="nav-link nav-dropdown-toggle {{ Request::is('sidangs*') ? 'active' : '' }} {{ Request::is('slides*') ? 'active' : '' }} {{ Request::is('teams*') ? 'active' : '' }}"
              href="#"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <i className="nav-icon icon-user"></i>Mahasiswa
            </a>
            <ul className="nav-dropdown-items" style={{ fontSize: "12px" }}>
              <li className="nav-item">
                <NavLink
                  to="sidangs/create"
                  className={({ isActive }) =>
                    isActive ? "nav-link active open" : "nav-link open"
                  }
                >
                  <i className="nav-icon icon-info ml-1"></i>
                  <span>Informasi Pendaftaran</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link {{ Request::is('slides.index') ? 'active' : '' }}"
                  href="{{ route('slides.index') }}"
                >
                  <i className="nav-icon fa fa-folder-o ml-1"></i>
                  <span>Materi Presentasi</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link {{ Request::is('teams.index') ? 'active' : '' }}"
                  href="{{ route('teams.index') }}"
                >
                  <i className="nav-icon fa fa-users ml-1"></i>
                  <span>Buat Tim</span>
                </a>
              </li>
            </ul>
          </li>
          {/* <a
            href="#submenumhs1"
            data-toggle="collapse"
            aria-expanded="false"
            className="bg-dark list-group-item list-group-item-action flex-column align-items-start {{ Request::is('sidangs*') ? 'active' : '' }}
{{ Request::is('slides*') ? 'active' : '' }} {{ Request::is('teams*') ? 'active' : '' }}"
          >
            <div className="d-flex w-100 justify-content-start align-items-center">
              <i className="nav-icon icon-user"></i>
              <li style={{ padding: "7px 5px 7px 20px", fontWeight: "bold" }}>
                Mahasiswa
              </li>
              <i className="nav-icon icon-arrow-right ml-auto"></i>
            </div>
          </a>
          <div id="submenumhs1" className="collapse sidebar-submenu">
            <li className="nav-item  {{ Request::is('sidangs*') ? 'active' : '' }}">
              <a className="nav-link" href="{{ route('sidangs.create') }}">
                <i className="nav-icon icon-plus"></i>
                <span>Pendaftaran</span>
              </a>
            </li>

            <li className="nav-item {{ Request::is('slides.index') ? 'active' : '' }}">
              <a className="nav-link" href="{{ route('slides.index') }}">
                <i className="nav-icon icon-cursor"></i>
                <span>Materi Presentasi</span>
              </a>
            </li>
            <li className="nav-item {{ Request::is('teams.index') ? 'active' : '' }}">
              <a className="nav-link" href="{{ route('teams.index') }}">
                <i className="nav-icon icon-user"></i>
                <span>Tim</span>
              </a>
            </li>
          </div> */}
          <li className="nav-item nav-dropdown mb-2">
            <a
              className="nav-link nav-dropdown-toggle {{ Request::is('schedule*') ? 'active' : '' }}"
              href="#"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <i className="nav-icon icon-list"></i>Jadwal Sidang
            </a>
            <ul className="nav-dropdown-items" style={{ fontSize: "12px" }}>
              <li className="nav-item">
                <a
                  className="nav-link {{ Request::is('schedule.mahasiswa') ? 'active' : '' }}"
                  href="{{ route('schedule.mahasiswa') }}"
                >
                  <i className="nav-icon fa fa-calendar-check-o ml-1"></i>
                  <span>Jadwal Sidang</span>
                </a>
              </li>
            </ul>
          </li>
          {/* <a
            href="#submenumhs2"
            data-toggle="collapse"
            aria-expanded="false"
            className="bg-dark list-group-item list-group-item-action flex-column align-items-start {{ Request::is('schedule*') ? 'active' : '' }}"
          >
            <div className="d-flex w-100 justify-content-start align-items-center">
              <i className="nav-icon icon-list"></i>
              <li style={{ padding: "7px 5px 7px 20px", fontWeight: "bold" }}>
                Jadwal Sidang
              </li>
              <i className="nav-icon icon-arrow-right ml-auto"></i>
            </div>
          </a>
          <div id="submenumhs2" className="collapse sidebar-submenu">
            <li className="nav-item {{ Request::is('schedule.mahasiswa') ? 'active' : '' }}">
              <a className="nav-link" href="{{ route('schedule.mahasiswa') }}">
                <i className="nav-icon icon-list"></i>
                <span>Jadwal Sidang</span>
              </a>
            </li>
          </div> */}
          {/* <a
            href="#submenumhs3"
            data-toggle="collapse"
            aria-expanded="false"
            className="bg-dark list-group-item list-group-item-action flex-column align-items-start {{ Request::is('revision*') ? 'active' : '' }}"
          >
            <div className="d-flex w-100 justify-content-start align-items-center">
              <i className="nav-icon icon-note"></i>
              <li style={{ padding: "7px 5px 7px 20px", fontWeight: "bold" }}>
                Revisi TA
              </li>
              <i className="nav-icon icon-arrow-right ml-auto"></i>
            </div>
          </a> */}
          <div id="submenumhs3" className="collapse sidebar-submenu">
            <li className="nav-item {{ Request::is('revisions.index.mahasiswa') ? 'active' : '' }}">
              <a
                className="nav-link"
                href="{{ route('revisions.index.mahasiswa') }}"
              >
                <i className="nav-icon icon-note"></i>
                <span>Revisi TA</span>
              </a>
            </li>
          </div>
          <li className="nav-item nav-dropdown mb-2">
            <a
              className="nav-link nav-dropdown-toggle {{ Request::is('revision*') ? 'active' : '' }}"
              href="#"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <i className="nav-icon icon-note"></i>Revisi TA
            </a>
            <ul className="nav-dropdown-items" style={{ fontSize: "12px" }}>
              <li className="nav-item">
                <a
                  className="nav-link {{ Request::is('revisions.index.mahasiswa') ? 'active' : '' }}"
                  href="{{ route('revisions.index.mahasiswa') }}"
                >
                  <i className="nav-icon fa fa-check-square-o ml-1"></i>
                  <span>Revisi TA</span>
                </a>
              </li>
            </ul>
          </li>
          {/* End of Student

          {/* Pembimbing or Penguji */}
          {/* <a
            href="#submenudsn1"
            data-toggle="collapse"
            aria-expanded="false"
            className="bg-dark list-group-item list-group-item-action flex-column align-items-start {{ Request::is('sidangs*') ? 'active' : '' }} {{ Request::is('schedule*') ? 'active' : '' }}"
          >
            <div className="d-flex w-100 justify-content-start align-items-center">
              <i className="nav-icon icon-list"></i>
              <li style={{ padding: "7px 5px 7px 20px", fontWeight: "bold" }}>
                Pembimbing
              </li>
              <i className="nav-icon icon-arrow-right ml-auto"></i>
            </div>
          </a>
          <div id="submenudsn1" className="collapse sidebar-submenu">
            <li className="nav-item {{ Request::is('sidangs.pembimbing') ? 'active' : '' }}">
              <a className="nav-link" href="{{ route('sidangs.pembimbing') }}">
                <i className="nav-icon icon-list"></i>
                <span>Bimbingan TA</span>
              </a>
            </li>
            <li className="nav-item {{ Request::is('schedule.pembimbing') ? 'active' : '' }}">
              <a className="nav-link" href="{{ route('schedule.pembimbing') }}">
                <i className="nav-icon icon-calendar"></i>
                <span>Jadwal Sidang Bimbingan</span>
              </a>
            </li>
          </div>
          <li className="nav-item nav-dropdown mb-2">
            <a
              className="nav-link nav-dropdown-toggle {{ Request::is('sidangs*') ? 'active' : '' }} {{ Request::is('schedule*') ? 'active' : '' }}"
              href="#"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <i className="nav-icon icon-list"></i>Pembimbing
            </a>
            <a
              className="nav-link nav-dropdown-toggle"
              href="#"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <i className="nav-icon fa fa-book"></i>Pembimbing
            </a>
            <ul className="nav-dropdown-items">
              <li className="nav-item">
                <a
                  className="nav-link {{ Request::is('sidangs.pembimbing') ? 'active' : '' }}"
                  href="{{ route('sidangs.pembimbing') }}"
                >
                  <i className="nav-icon fa fa-check-square-o ml-1"></i>
                  <span>Bimbingan TA</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link {{ Request::is('schedule.pembimbing') ? 'active' : '' }}"
                  href="{{ route('schedule.pembimbing') }}"
                >
                  <i className="nav-icon fa fa-calendar-check-o ml-1"></i>
                  <span>Jadwal Sidang Bimbingan</span>
                </a>
              </li>
            </ul>
          </li> */}
          {/* Penguji */}
          {/* <a
            href="#submenudsn2"
            data-toggle="collapse"
            aria-expanded="false"
            className="bg-dark list-group-item list-group-item-action flex-column align-items-start {{ Request::is('schedule*') ? 'active' : '' }}"
          >
            <div className="d-flex w-100 justify-content-start align-items-center">
              <i className="nav-icon icon-calendar"></i>
              <li style={{ padding: "7px 5px 7px 20px", fontWeight: "bold" }}>
                Jadwal Sidang
              </li>
              <i className="nav-icon icon-arrow-right ml-auto"></i>
            </div>
          </a>
          <div id="submenudsn2" className="collapse sidebar-submenu">
            <li className="nav-item {{ Request::is('schedule.penguji') ? 'active' : '' }}">
              <a className="nav-link" href="{{ route('schedule.penguji') }}">
                <i className="nav-icon icon-calendar"></i>
                <span>Jadwal Sidang Penguji</span>
              </a>
            </li>
          </div>
          <li className="nav-item nav-dropdown mb-2">
            <a
              className="nav-link nav-dropdown-toggle  {{ Request::is('schedule*') ? 'active' : '' }}"
              href="#"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <i className="nav-icon icon-calendar"></i>Jadwal Sidang
            </a>
            <a
              className="nav-link nav-dropdown-toggle"
              href="#"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <i className="nav-icon fa fa-hourglass-half"></i>Penguji
            </a>
            <ul className="nav-dropdown-items">
              <li className="nav-item">
                <a
                  className="nav-link {{ Request::is('schedule.penguji') ? 'active' : '' }}"
                  href="{{ route('schedule.penguji') }}"
                >
                  <i className="nav-icon fa fa-calendar-check-o ml-1"></i>
                  <span>Jadwal Sidang Penguji</span>
                </a>
              </li>
            </ul>
          </li> */}
          {/* End of Penguji */}

          {/* <li className="nav-item nav-dropdown">
            <a
              className="nav-link nav-dropdown-toggle {{ Request::is('revision*') ? 'active' : '' }}"
              href="#"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <i className="nav-icon icon-note"></i>Revisi Sidang
            </a>
            <ul className="nav-dropdown-items">
              <li className="nav-item">
                <a
                  className="nav-link {{ Request::is('revisions.index.dosen') ? 'active' : '' }}"
                  href="{{ route('revisions.index.dosen') }}"
                >
                  <i className="nav-icon fa fa-check-square-o ml-1"></i>
                  <span>Revisi Mahasiswa</span>
                </a>
              </li>
            </ul>
          </li> */}
          {/* End of Pembimbing or Penguji */}

          {/* ? PIC  */}
          {/* <a
            href="#submenupic1"
            data-toggle="collapse"
            aria-expanded="false"
            className="bg-dark list-group-item list-group-item-action flex-column align-items-start {{ Request::is('sidangs*') ? 'active' : '' }} {{ Request::is('schedules*') ? 'active' : '' }} {{ Request::is('schedule*') ? 'active' : '' }}"
          >
            <div className="d-flex w-100 justify-content-start align-items-center">
              <i className="nav-icon icon-list"></i>
              <li style={{ padding: "7px 5px 7px 20px", fontWeight: "bold" }}>
                PIC TA
              </li>
              <i className="nav-icon icon-arrow-right ml-auto"></i>
            </div>
          </a>
          <div id="submenupic1" className="collapse sidebar-submenu">
            <li className="nav-item {{ Request::is('sidangs.pic') ? 'active' : '' }}">
              <a className="nav-link" href="{{ route('sidangs.pic') }}">
                <i className="nav-icon icon-list"></i>
                <span>Penjadwalan Sidang</span>
              </a>
            </li>
            <li className="nav-item {{ Request::is('schedules.index') ? 'active' : '' }}">
              <a className="nav-link" href="{{ route('schedules.index') }}">
                <i className="nav-icon icon-calendar"></i>
                <span>Jadwal Sidang KK</span>
              </a>
            </li>

            <li className="nav-item {{ Request::is('schedule.bukaAkses') ? 'active' : '' }}">
              <a className="nav-link" href="{{ route('schedule.bukaAkses') }}">
                <i className="nav-icon icon-key"></i>
                <span>Buka Akses Menu</span>
              </a>
            </li>
          </div>{" "}
          <li className="nav-item nav-dropdown mb-2">
            <a
              className="nav-link nav-dropdown-toggle {{ Request::is('sidangs*') ? 'active' : '' }} {{ Request::is('schedules*') ? 'active' : '' }} {{ Request::is('schedule*') ? 'active' : '' }}"
              href="#"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <i className="nav-icon icon-list"></i>PIC TA
            </a>{" "}
            <a
              className="nav-link nav-dropdown-toggle "
              href="#"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <i className="nav-icon icon-list"></i>PIC TA
            </a>
            <ul className="nav-dropdown-items">
              <li className="nav-item">
                <a
                  className="nav-link {{ Request::is('sidangs.pic') ? 'active' : '' }}"
                  href="{{ route('sidangs.pic') }}"
                >
                  <i className="nav-icon fa fa-calendar ml-1"></i>
                  <span>Penjadwalan Sidang</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link {{ Request::is('schedules.index') ? 'active' : '' }}"
                  href="{{ route('schedules.index') }}"
                >
                  <i className="nav-icon fa fa-calendar-check-o ml-1"></i>
                  <span>Jadwal Sidang KK</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link {{ Request::is('schedule.bukaAkses') ? 'active' : '' }}"
                  href="{{ route('schedule.bukaAkses') }}"
                >
                  <i className="nav-icon icon-key ml-1"></i>
                  <span>Buka Akses Menu</span>
                </a>
              </li>
            </ul>
          </li> */}
          {/* End of PIC */}

          {/* Guide Book */}
          <li className="nav-item nav-dropdown mb-2">
            <a
              className="nav-link nav-dropdown-toggle "
              href="#"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <i className="nav-icon fa fa-bookmark-o"></i>Guide Book
            </a>
            <ul className="nav-dropdown-items" style={{ fontSize: "12px" }}>
              {/* <li className="nav-item {{ Request::is('guide_book_admin') ? 'active' : '' }}">
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
              </li> */}
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
