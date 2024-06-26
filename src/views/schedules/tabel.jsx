import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

const JadwalTable = () => {
  const [cookies] = useCookies();
  const jwtDecoded = jwtDecode(cookies["auth-token"]);
  const location = useLocation();
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [detailSidang, setDetailSidang] = useState(null);

  const [isNilai, setIsNilai] = useState(false);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setSchedules([]);
        let apiSchedule = "";

        if (
          jwtDecoded.role.includes("RLPBB") &&
          location.pathname === "/schedule/pembimbing"
        ) {
          apiSchedule = `/schedule/pembimbing/get`;
        } else if (
          jwtDecoded.role.includes("RLPGJ") &&
          location.pathname === "/schedule/penguji"
        ) {
          apiSchedule = `/schedule/penguji/get`;
        } else if (
          jwtDecoded.role.includes("RLADM") &&
          location.pathname === "/schedule/admin"
        ) {
          apiSchedule = `/schedule/admin/get`;
        } else if (
          jwtDecoded.role.includes("RLADM") &&
          location.pathname === "/schedule/admin-before"
        ) {
          apiSchedule = `/schedule/admin-before/get`;
        } else if (
          (jwtDecoded.role.includes("RLPIC") &&
            location.pathname === "/schedules") ||
          location.pathname === "/schedule/bukaAkses"
        ) {
          apiSchedule = `/schedule/get`;
        }

        if (apiSchedule) {
          const response = await axios.get(apiSchedule, {
            headers: {
              Authorization: `Bearer ${cookies["auth-token"]}`,
            },
          });
          const scheduleData = response.data.data;
          if (scheduleData) {
            const user1Response = await Promise.all(
              scheduleData?.map(async (schedule) => {
                const userResponse = await axios.get(
                  `https://sofi.my.id/api/user/${schedule.pengajuan.user_id}`
                );
                return {
                  ...schedule,
                  user: userResponse.data.data.nama,
                };
              })
            );

            setSchedules(user1Response);
          }
        }
      } catch (err) {
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [location.pathname]);

  const isVirtualRoom = (room) => {
    return room.includes("http") || room.includes(".co");
  };

  const closeModal = () => {
    document.body.classList.remove("modal-open");
    setIsModalOpen(false);
  };

  const openModal = async (id) => {
    document.body.classList.add("modal-open");
    setIsModalOpen(true);
    setIsModalLoading(true);
    try {
      const detailResponse = await axios.get(`/schedule/get/${id}`);
      const data = detailResponse.data.data;

      const pembimbing1Response = await axios.get(
        `https://sofi.my.id/api/lecturer/${data.pengajuan.pembimbing1_id}`
      );
      const pembimbing2Response = await axios.get(
        `https://sofi.my.id/api/lecturer/${data.pengajuan.pembimbing2_id}`
      );

      const user1Response = await axios.get(
        `https://sofi.my.id/api/user/${data.pengajuan.user_id}`
      );

      const updatedData = {
        ...data,
        pembimbing1: `${pembimbing1Response.data.data.code} - ${pembimbing1Response.data.data.user.nama}`,
        pembimbing2: `${pembimbing2Response.data.data.code} - ${pembimbing2Response.data.data.user.nama}`,
        user: `${user1Response.data.data.nama}`,
      };
      setDetailSidang(updatedData);
    } catch (error) {
      navigate("/schedules");
    } finally {
      setIsModalLoading(false);
    }
  };

  const deleteSchedule = async (id) => {
    try {
      const response = await axios.delete(`/schedule/delete/${id}`);
      if (response.status === 200) {
        Swal.fire("Berhasil", "Jadwal berhasil dihapus", "success");
        navigate(0);
      } else {
        Swal.fire("Gagal", "Gagal menghapus jadwal", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan saat menghapus jadwal", "error");
    }
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Anda Sudah Yakin?",
      text: "Data ini akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#FF585E",
      confirmButtonColor: "#00A8DC",
      cancelButtonText: "Batal",
      confirmButtonText: "Hapus",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSchedule(id);
      }
    });
  };

  const handleFlagChange = async (id, code, pathname) => {
    try {
      const response = await axios.patch(
        `/schedule/change-flag/${id}?code=${code}`
      );
      if (response.status === 200) {
        navigate(pathname, {
          state: {
            successMessage: "Berhasil menambahkan akses",
          },
        });
      } else {
        navigate(pathname, {
          state: {
            successMessage: "Gagal menambahkan akses",
          },
        });
      }
    } catch (error) {
      navigate("/home");
    }
  };

  const columns = [
    {
      name: "NIM",
      selector: (row) => row.pengajuan.nim,
      sortable: true,
      width: "115px",
    },
    {
      name: "Nama",
      selector: (row) => row.user,
      sortable: true,
      wrap: true,
    },
    {
      name: "Judul TA",
      selector: (row) => row.pengajuan.judul,
      sortable: true,
      wrap: true,
      width: "250px",
    },
    {
      name: "Tanggal",
      selector: (row) => new Date(row.date_time).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Waktu",
      selector: (row) => new Date(row.date_time).toLocaleTimeString(),
      sortable: true,
      width: "125px",
    },
    {
      name: "Ruang",
      selector: (row) =>
        row.room && isVirtualRoom(row.room) ? (
          <Link
            to={row.room.startsWith("http") ? row.room : `https://${row.room}`}
            className="btn btn-success btn-sm"
          >
            Virtual Room
          </Link>
        ) : (
          row.room
        ),
      sortable: true,
      width: "130px",
    },
    jwtDecoded.role.some((role) =>
      ["RLMHS", "RLPBB", "RLPGJ", "RLADM"].includes(role)
    ) &&
      (location.pathname === "/schedule/pembimbing" ||
        location.pathname === "/schedule/penguji") && {
        name: "Daftar Hadir",
        cell: (row) => (
          <form
            className="form"
            action={`/attendances/hadir/${row.id}`}
            method="post"
          >
            <input
              type="hidden"
              name="date"
              value={new Date(row.date_time).toISOString().split("T")[0]}
            />
            <input
              type="hidden"
              name="time"
              value={new Date(row.date_time)
                .toISOString()
                .split("T")[1]
                .slice(0, 5)}
            />
            <button
              type="submit"
              className="btn btn-outline-primary form"
              disabled={
                (new Date() >= new Date(`${row.date_time}`) &&
                  row.status === "belum dilaksanakan") ||
                (row.status === "sedang dilaksanakan" && !row.isHadir)
                  ? false
                  : true
              }
            >
              Daftar Hadir
            </button>
          </form>
        ),
        sortable: true,
        wrap: true,
        width: "130px",
      },
    {
      name: "Status",
      selector: (row) => (
        <div className="text-center">
          {row.status === "telah dilaksanakan" && (
            <span className="badge badge-success">TERLAKSANA</span>
          )}
          {row.status === "sedang dilaksanakan" && (
            <span className="badge badge-warning">BERLANGSUNG</span>
          )}
          {row.status === "belum dilaksanakan" && (
            <span className="badge badge-secondary">BELUM DILAKSANAKAN</span>
          )}
        </div>
      ),
      sortable: true,
      width: "150px",
    },
    jwtDecoded.role.some((role) => ["RLMHS"].includes(role)) && {
      name: "Penguji 1",
      selector: (row) => row.penguji1_id,
      sortable: true,
    },
    jwtDecoded.role.some((role) => ["RLMHS"].includes(role)) && {
      name: "Penguji 2",
      selector: (row) => row.penguji2_id,
      sortable: true,
    },
    jwtDecoded.role.some((role) => ["RLMHS"].includes(role)) && {
      name: "Keputusan",
      selector: (row) => row.decision,
      sortable: true,
    },
    jwtDecoded.role.some((role) => ["RLADM"].includes(role)) &&
      (location.pathname === "/schedule/admin" ||
        location.pathname === "/schedule/bermasalah") && {
        name: "KK",
        selector: (row) => row.pengajuan.kk,
        sortable: true,
        wrap: true,
      },
    jwtDecoded.role.some((role) => ["RLPGJ"].includes(role)) &&
      location.pathname === "/schedule/penguji" && {
        name: "Surat Tugas",
        cell: (row) =>
          row.pengajuan.sk_penguji ? (
            <a
              href={`/uploads/sk_penguji/${row.pengajuan.sk_penguji}`}
              className="btn btn-outline-primary"
              download
            >
              Download
            </a>
          ) : (
            "-"
          ),
        sortable: true,
        width: "130px",
      },
    (location.pathname === "/schedule/bukaAkses" ||
      location.pathname === "/schedule/pembimbing" ||
      location.pathname === "/schedule/penguji" ||
      location.pathname === "/schedules" ||
      location.pathname === "/schedule/admin") && {
      name: "Aksi",
      cell: (row) => (
        <div>
          {jwtDecoded.role.some((role) => ["RLPIC"].includes(role)) &&
            location.pathname === "/schedules" && (
              <div className="dropdown">
                <button
                  className="btn btn-success dropdown-toggle w-100"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Pilih
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <button
                    type="button"
                    data-toggle="modal"
                    data-target="#detailSidangModal"
                    className="btn btn-outline-primary border-0 view w-100"
                    onClick={() => openModal(row.id)}
                  >
                    Detail
                  </button>
                  <hr className="mt-0 mb-0" />
                  <Link
                    to={`/schedule/${row.id}/edit`}
                    className={`btn btn-outline-primary border-0 w-100 ${
                      row.status !== "belum dilaksanakan" ? "disabled" : ""
                    }`}
                  >
                    Ubah Jadwal
                  </Link>
                  <br />
                  <hr className="mt-0 mb-0" />
                  <button
                    className={`btn btn-outline-primary border-0 w-100 ${
                      row.status !== "belum dilaksanakan" ? "disabled" : ""
                    }`}
                    onClick={() => handleDeleteClick(row.id)}
                  >
                    Hapus
                  </button>
                  <hr className="mt-0 mb-0" />
                  <form
                    className=""
                    action={`/schedules/berita_acara/show/${row.id}`}
                    method="get"
                  >
                    <button
                      type="submit"
                      className={`btn btn-outline-primary border-0 rounded-0 w-100 ${
                        row.status === "belum dilaksanakan" ? "disabled" : ""
                      }`}
                    >
                      Berita Acara
                    </button>
                    <hr className="mt-0 mb-0" />
                  </form>
                </div>
              </div>
            )}
          {jwtDecoded.role.some((role) => ["RLPIC", "RLADM"].includes(role)) &&
            (location.pathname === "/schedule/bermasalah" ||
              location.pathname === "/schedule/bukaAkses" ||
              location.pathname === "/schedule/admin") && (
              <div className="dropdown">
                <button
                  className="btn btn-success dropdown-toggle w-100"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Pilih
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <Link
                    to={`/schedules/${row.id}`}
                    className="btn btn-outline-primary border-0 w-100"
                  >
                    Detail
                  </Link>
                  <hr className="mt-0 mb-0" />
                  {location.pathname === "/schedule/bermasalah" && (
                    <div>
                      <Link
                        to={`/scores/simpulan/${row.id}`}
                        className="btn btn-outline-primary border-0 w-100"
                      >
                        Simpulan Nilai
                      </Link>
                      <hr className="mt-0 mb-0" />
                      <Link
                        to={`/revisions/show/${row.id}`}
                        className="btn btn-outline-primary border-0 w-100"
                      >
                        Lihat Revisi
                      </Link>
                    </div>
                  )}
                  <hr className="mt-0 mb-0" />
                  <button
                    className={`btn btn-outline-primary border-0 w-100 ${
                      row.status === "belum dilaksanakan" ? "disabled" : ""
                    }`}
                    onClick={() => handleFlagChange(row.id, "rev")}
                  >
                    Buka Revisi
                  </button>
                  <hr className="mt-0 mb-0" />
                  <button
                    className={`btn btn-outline-primary border-0 w-100 ${
                      row.status === "belum dilaksanakan" ? "disabled" : ""
                    }`}
                    onClick={() => handleFlagChange(row.id, "scr")}
                  >
                    Buka Penilaian
                  </button>
                  <hr className="mt-0 mb-0" />
                </div>
              </div>
            )}
          {jwtDecoded.role.some((role) => ["RLPGJ"].includes(role)) &&
            location.pathname === "/schedule/penguji" && (
              <div className="dropdown">
                <button
                  className="btn btn-success dropdown-toggle w-100"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Pilih
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <Link
                    to={`/schedules/${row.id}`}
                    className="btn btn-outline-primary border-0 w-100"
                  >
                    Detail
                  </Link>
                  <hr className="mt-0 mb-0" />
                  {isNilai ? (
                    <Link
                      to={`/scores/penguji/edit/${row.id}`}
                      className="btn btn-outline-primary border-0 w-100"
                    >
                      Ubah Nilai
                    </Link>
                  ) : (
                    <Link
                      to={`/scores/penguji/create/${row.id}`}
                      className={`btn btn-outline-primary border-0 w-100 ${
                        row.status === "sedang dilaksanakan" && row.isHadir
                          ? ""
                          : "disabled"
                      }`}
                    >
                      Nilai
                    </Link>
                  )}
                  <hr className="mt-0 mb-0" />
                  <Link
                    to={`/revisions/create/${row.id}`}
                    className={`btn btn-outline-primary border-0 w-100 ${
                      (row.status !== "belum dilaksanakan" ||
                        row.flag_add_revision) &&
                      row.isHadir
                        ? ""
                        : "disabled"
                    }`}
                  >
                    Revisi TA
                  </Link>
                  <hr className="mt-0 mb-0" />
                  <Link
                    to={`/scores/simpulan/${row.id}`}
                    className="btn btn-outline-primary border-0 w-100"
                  >
                    Simpulan Nilai
                  </Link>
                  <hr className="mt-0 mb-0" />
                  <form
                    className=""
                    action={`/schedules/berita_acara/show/${row.id}`}
                    method="get"
                  >
                    <button
                      type="submit"
                      className="btn btn-outline-primary border-0 rounded-0 w-100"
                    >
                      Berita Acara
                    </button>
                    <hr className="mt-0 mb-0" />
                  </form>
                </div>
              </div>
            )}
          {jwtDecoded.role.some((role) => ["RLPBB"].includes(role)) &&
            location.pathname === "/schedule/pembimbing" && (
              <div className="dropdown">
                <button
                  className="btn btn-success dropdown-toggle w-100"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Pilih
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <Link
                    to={`/schedules/${row.id}`}
                    className="btn btn-outline-primary border-0 w-100"
                  >
                    Detail
                  </Link>
                  <hr className="mt-0 mb-0" />
                  {isNilai ? (
                    <Link
                      to={`/scores/pembimbing/edit/${row.id}`}
                      className="btn btn-outline-primary border-0 w-100"
                    >
                      Ubah Nilai
                    </Link>
                  ) : (
                    <Link
                      to={`/scores/pembimbing/create/${row.id}`}
                      className={`btn btn-outline-primary border-0 w-100 ${
                        row.status === "sedang dilaksanakan" && row.isHadir
                          ? ""
                          : "disabled"
                      }`}
                    >
                      Nilai
                    </Link>
                  )}
                  <hr className="mt-0 mb-0" />
                  <Link
                    to={`/revisions/create/${row.id}`}
                    className={`btn btn-outline-primary border-0 w-100 ${
                      (row.status !== "belum dilaksanakan" ||
                        row.flag_add_revision) &&
                      row.isHadir
                        ? ""
                        : "disabled"
                    }`}
                  >
                    Revisi TA
                  </Link>
                  <hr className="mt-0 mb-0" />
                  <form
                    className=""
                    action={`/schedules/berita_acara/show/${row.id}`}
                    method="get"
                  >
                    <button
                      type="submit"
                      className={`btn btn-outline-primary border-0 rounded-0 w-100 ${
                        row.status === "belum dilaksanakan" ? "disabled" : ""
                      }`}
                    >
                      Berita Acara
                    </button>
                    <hr className="mt-0 mb-0" />
                  </form>
                </div>
              </div>
            )}
        </div>
      ),
    },
  ];

  const filteredColumns = columns.filter((col) => col);

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#20a8d8",
        color: "white",
        fontWeight: "bold",
        borderBottom: "1px solid black",
      },
    },
    cells: {
      style: {
        whiteSpace: "nowrap",
      },
    },
  };

  const searchSchedules = schedules.filter((row) => {
    const tanggal = new Date(row.date_time).toLocaleDateString();
    const waktu = new Date(row.date_time).toLocaleTimeString();
    const status =
      row.status === "telah dilaksanakan"
        ? "TERLAKSANA"
        : row.status === "sedang dilaksanakan"
        ? "BERLANGSUNG"
        : "BELUM DILAKSANAKAN";

    return (
      row.pengajuan.nim.toLowerCase().includes(filterText.toLowerCase()) ||
      row.user.toLowerCase().includes(filterText.toLowerCase()) ||
      row.pengajuan.judul.toLowerCase().includes(filterText.toLowerCase()) ||
      row.room.toLowerCase().includes(filterText.toLowerCase()) ||
      tanggal.includes(filterText) ||
      waktu.includes(filterText) ||
      status.toLowerCase().includes(filterText.toLowerCase()) ||
      row.penguji1_id.toString().includes(filterText) ||
      row.penguji2_id.toString().includes(filterText) ||
      row.pengajuan.kk.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  return (
    <div>
      {isLoading || schedules.loading ? (
        <Loading />
      ) : (
        <div>
          <div className="table-responsive-sm">
            <div
              className="table table-striped"
              style={{ overflowX: "scroll" }}
            >
              <div
                className="search-container"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "1rem",
                }}
              >
                <label style={{ marginRight: "0.5rem", alignSelf: "center" }}>
                  Search:
                </label>
                <input
                  type="text"
                  aria-label="Search Input"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Search"
                  style={{
                    width: "200px",
                    marginRight: "1rem",
                  }}
                />
              </div>
              <DataTable
                customStyles={customStyles}
                columns={filteredColumns}
                data={searchSchedules}
                pagination
                highlightOnHover
                striped
              />
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div>
          <div
            className="modal-backdrop"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1040,
            }}
          />
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Detail Sidang</h5>
                  <button
                    type="button"
                    className="close"
                    aria-label="Close"
                    onClick={closeModal}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div
                  className="modal-body"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  {isModalLoading ? (
                    <Loading />
                  ) : (
                    <div
                      style={{
                        backgroundColor: "#f1f1f1",
                        padding: "30px",
                        borderRadius: "5px",
                      }}
                    >
                      <div className="form-group">
                        {detailSidang ? (
                          <div className="card">
                            <div className="card-header">
                              <strong>Details</strong>
                            </div>
                            <div className="card-body">
                              <div className="table-responsive-sm">
                                <table className="table table-striped table-borderless">
                                  <tbody>
                                    <tr>
                                      <td
                                        className="font-weight-bold"
                                        style={{ whiteSpace: "nowrap" }}
                                      >
                                        NIM
                                      </td>
                                      <td>:</td>
                                      <td>{detailSidang.pengajuan.nim}</td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="font-weight-bold"
                                        style={{ whiteSpace: "nowrap" }}
                                      >
                                        NAMA
                                      </td>
                                      <td>:</td>
                                      <td>{detailSidang.user}</td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="font-weight-bold"
                                        style={{ whiteSpace: "nowrap" }}
                                      >
                                        PEMBIMBING 1
                                      </td>
                                      <td>:</td>
                                      <td>{detailSidang.pembimbing1}</td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="font-weight-bold"
                                        style={{ whiteSpace: "nowrap" }}
                                      >
                                        PEMBIMBING 2
                                      </td>
                                      <td>:</td>
                                      <td>{detailSidang.pembimbing2}</td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="font-weight-bold"
                                        style={{ whiteSpace: "nowrap" }}
                                      >
                                        JUDUL TA
                                      </td>
                                      <td>:</td>
                                      <td>{detailSidang.pengajuan.judul}</td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="font-weight-bold"
                                        style={{ whiteSpace: "nowrap" }}
                                      >
                                        DOKUMEN TA
                                      </td>
                                      <td>:</td>
                                      <td>
                                        {detailSidang.pengajuan.doc_ta ? (
                                          <a
                                            href={detailSidang.pengajuan.doc_ta}
                                            className="btn btn-primary"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            Download
                                          </a>
                                        ) : (
                                          <span>Data tidak ditemukan</span>
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="font-weight-bold"
                                        style={{ whiteSpace: "nowrap" }}
                                      >
                                        JURNAL
                                      </td>
                                      <td>:</td>
                                      <td>
                                        {detailSidang.pengajuan.makalah ? (
                                          <a
                                            href={
                                              detailSidang.pengajuan.makalah
                                            }
                                            className="btn btn-primary"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            Download
                                          </a>
                                        ) : (
                                          <span>Data tidak ditemukan</span>
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="font-weight-bold"
                                        style={{ whiteSpace: "nowrap" }}
                                      >
                                        MATERI PRESENTASI
                                      </td>
                                      <td>:</td>
                                      <td>
                                        {detailSidang.pengajuan.slide ? (
                                          <a
                                            href={
                                              detailSidang.pengajuan.slide
                                                .file_url
                                            }
                                            className="btn btn-primary"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            Download
                                          </a>
                                        ) : (
                                          <span>Data tidak ditemukan</span>
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        className="font-weight-bold"
                                        style={{ whiteSpace: "nowrap" }}
                                      >
                                        KEPUTUSAN
                                      </td>
                                      <td>:</td>
                                      <td>
                                        {detailSidang.decision ? (
                                          <span className="badge badge-success">
                                            {detailSidang.decision.toUpperCase()}
                                          </span>
                                        ) : (
                                          <span className="badge badge-danger">
                                            BELUM DIPUTUSKAN
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p>Data tidak ditemukan</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JadwalTable;
