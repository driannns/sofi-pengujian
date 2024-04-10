import { MainLayout } from "../layouts/MainLayout";
import axios from "axios";
import { useCookies } from "react-cookie";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllSidang,
  feedbackSidang,
  approveFeedbackSidang,
} from "../../store/sidangSlicer";
import Loading from "../../components/Loading";
import DataTable from "react-data-table-component";

const SidangIndex = () => {
  const dataSidang = useSelector((state) => state.sidang);

  const [cookies] = useCookies();
  const dispatch = useDispatch();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackApprove, setFeedbackApprove] = useState("");
  const [bahasa, setBahasa] = useState("");
  const [sidangs, setSidangs] = useState(null);
  const [documents, setDocuments] = useState(null);
  const jwtDecoded = jwtDecode(cookies["auth-token"]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayOfWeek = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${dayOfWeek}, ${dayOfMonth} ${month} ${year} - ${hour}:${minute}`;
  };

  const columns = [
    {
      name: "NIM",
      selector: (row) => row.nim,
      sortable: true,
    },
    {
      name: "Nama",
      selector: (row) => row.nim, // Assuming nested structure
      sortable: true,
    },
    {
      name: "Judul TA",
      selector: (row) => row.judul,
      sortable: true,
    },
    {
      name: "Jumlah Bimbingan",
      selector: (row) => (
        <>
          Pembimbing 1: {row.form_bimbingan1} Pertemuan <br />
          Pembimbing 2: {row.form_bimbingan2} Pertemuan
        </>
      ),
      sortable: true,
    },
    ...(jwtDecoded.role &&
    jwtDecoded.role.find((role) => ["RLADM"].includes(role))
      ? [
          {
            name: "Tak",
            selector: (row) => row.tak,
            sortable: true,
          },
          {
            name: "Eprt",
            selector: (row) => row.eprt,
            sortable: true,
          },
          {
            name: "Bahasa Sidang",
            selector: (row) => (row.is_english == 0 ? "Indonesia" : "Inggris"),
            sortable: true,
          },
          {
            name: "Periode",
            selector: (row) => row.period_id,
            sortable: true,
          },
          {
            name: "SKS",
            selector: (row) => (
              <>
                Lulus: {row.sks_lulus} <br />
                Belum: {row.sks_belum_lulus}
              </>
            ),
            sortable: true,
          },
        ]
      : []),
    {
      name: "Dokumen TA",
      selector: (row) =>
        row.doc_ta != null ? (
          <a
            href={`/uploads/ta/${row.doc_ta}`}
            className="btn btn-outline-primary"
            download={`${import.meta.env.VITE_API_URL}/public/doc_ta/${
              row.doc_ta
            }`}
          >
            Download
          </a>
        ) : null,
      sortable: true,
    },
    {
      name: "Jurnal",
      selector: (row) =>
        row.makalah != null ? (
          <a
            href={`/uploads/makalah/${row.makalah}`}
            className="btn btn-outline-primary"
            download
          >
            Download
          </a>
        ) : null,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => {
        if (row.status == "lulus") {
          return <span className="badge badge-success">LULUS</span>;
        } else if (row.status == "belum dijadwalkan") {
          return (
            <span className="badge badge-secondary">BELUM DIJADWAKAN</span>
          );
        } else if (row.status == "tidak lulus (sudah update dokumen)") {
          return (
            <span className="badge badge-secondary">
              SIDANG ULANG
              <br />
              SUDAH UPDATE DOKUMEN
            </span>
          );
        } else if (row.status == "tidak lulus (belum dijadwalkan)") {
          return (
            <span className="badge badge-secondary">
              SIDANG ULANG
              <br />
              BELUM DIJADWAKAN
            </span>
          );
        } else if (row.status == "sudah dijadwalkan") {
          return <span className="badge badge-info">DIJADWAKAN</span>;
        } else if (row.status == "tidak lulus") {
          return <span className="badge badge-danger">TIDAK LULUS</span>;
        } else if (row.status == "ditolak oleh admin") {
          return <span className="badge badge-danger">DITOLAK OLEH ADMIN</span>;
        } else if (row.status == "pengajuan" || row.status == "pending") {
          return <span className="badge badge-warning">PENGAJUAN</span>;
        } else if (row.status == "disetujui oleh pembimbing2") {
          return (
            <span className="badge badge-primary">
              DISETUJUI OLEH PEMBIMBING 2
            </span>
          );
        } else if (row.status == "disetujui oleh pembimbing1") {
          return (
            <span className="badge badge-primary">
              DISETUJUI OLEH PEMBIMBING 1
            </span>
          );
        } else if (row.status == "telah disetujui admin") {
          return (
            <span className="badge badge-primary">DISETUJUI OLEH ADMIN</span>
          );
        }
      },
      sortable: true,
    },
    {
      name: "Diajukan pada",
      selector: (row) => formatDate(row.created_at),
      sortable: true,
    },
    {
      name: "Aksi",
      selector: (row) => {
        if (
          jwtDecoded?.role?.find((role) => ["RLADM"].includes(role)) &&
          jwtDecoded?.role?.find((role) => !["RLSDM"].includes(role))
        ) {
          if (
            row.status === "belum disetujui admin" ||
            row.status === "pending"
          ) {
            return (
              <div className="btn-group">
                <button
                  className="btn btn-success"
                  data-toggle="modal"
                  data-target={`#feedbackAcceptAdminModal_${row.id}`}
                >
                  <i className="fa fa-check" style={{ color: "white" }}></i>
                </button>
                <button
                  className="btn btn-danger"
                  data-toggle="modal"
                  data-target={`#feedbackRejectAdminModal_${row.id}`}
                >
                  <i className="fa fa-times" style={{ color: "white" }}></i>
                </button>
              </div>
            );
          } else if (row.status === "sudah dijadwalkan") {
            return (
              <div className="btn-group w-100">
                <a
                  href="{{ route('schedules.show', [$sidang->schedules[0]->id]) }}"
                  className="btn btn-light w-100"
                >
                  Lihat Jadwal
                </a>
              </div>
            );
          }
          return (
            <div className="btn-group w-100">
              <a
                href="{{ route('sidangs.updateData', [$sidang->id]) }}"
                className="btn btn-light w-100"
              >
                Update
              </a>
            </div>
          );
        } else if (
          jwtDecoded?.role?.find((role) => ["RLADM"].includes(role)) ||
          (jwtDecoded?.role?.find((role) => ["RLSDM"].includes(role)) &&
            location.pathname.startsWith == "/sidangs/pic")
        ) {
          return (
            <div className="btn-group">
              {row.status === "belum dijadwalkan" ||
                (row.status === "tidak lulus (belum dijadwalkan)" && (
                  <a
                    href="{{ route('schedules.create', [$sidang->mahasiswa->team->id]) }}"
                    className="btn btn-primary"
                  >
                    Jadwalkan
                  </a>
                ))}
              {row.status === "sudah dijadwalkan" ||
                (row.status === "tidak lulus (sudah dijadwalkan)" && (
                  <button type="button" className="btn btn-primary" disabled>
                    Sudah Dijadwalkan
                  </button>
                ))}
            </div>
          );
        } else if (
          jwtDecoded?.role?.find((role) => ["RLPBB"].includes(role)) &&
          location.pathname.startsWith === "/sidangs/pembimbing"
        ) {
          return (
            <div className="btn-group">
              {row.status === "sudah dijadwalkan" ? (
                row.schedules.last().status === "telah dilaksanakan" ? (
                  <a
                    href="{{ route('revisions.show', $sidang->schedules->last()->id) }}"
                    className="btn btn-success text-white"
                  >
                    List Revisi
                  </a>
                ) : (
                  <a href="#" className="btn btn-dark text-white disabled">
                    List Revisi
                  </a>
                )
              ) : (
                <a href="#" className="btn btn-dark text-white disabled">
                  List Revisi
                </a>
              )}
            </div>
          );
        }
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const dataSidangAdmin = await dispatch(
          getAllSidang(cookies["auth-token"])
        );
        setSidangs(dataSidangAdmin.payload);
        setSidangs(dataSidang.data);
        if (!dataSidangAdmin.payload) {
          localStorage.setItem("errorMessage", "Network Error");
          navigate("/home");
          return;
        }

        const resSlide = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/slide/get`,
          {
            headers: {
              Authorization: `Bearer ${cookies["auth-token"]}`,
              "ngrok-skip-browser-warning": true,
            },
          }
        );
        if (resSlide.data.code === 200) {
          setDocuments(resSlide.data.data);
        }
      } catch (error) {
        console.error("Erorr fetching data:", error);
        if (!error.response.status === 404) {
          localStorage.setItem("errorMessage", "Network Error");
          navigate("/home");
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFeedbackSidang = (e, sidangId) => {
    e.preventDefault();
    dispatch(
      feedbackSidang({ authToken: cookies["auth-token"], feedback, sidangId })
    );
  };

  const handleApproveFeedbackSidang = (e, sidangId) => {
    e.preventDefault();
    dispatch(
      approveFeedbackSidang({
        authToken: cookies["auth-token"],
        feedbackApprove,
        bahasa,
        sidangId,
      })
    );
  };

  return (
    <MainLayout>
      {isLoading || dataSidang.loading ? (
        <Loading />
      ) : (
        <>
          <ol className="breadcrumb  mb-0">
            {jwtDecoded.role.find((role) => ["RLPBB"].includes(role)) &&
            location.pathname === "/sidangs/pembimbing" ? (
              <div className="col-12">
                <h3>BIMBINGAN TA</h3>
                <hr className="mt-0" />
                <h6 className="mb-3">
                  <a href="{{ route('home') }}" className="text-dark">
                    BERANDA
                  </a>{" "}
                  / BIMBINGAN TA
                </h6>
              </div>
            ) : jwtDecoded.role.find((role) => ["RLPIC"].includes(role)) &&
              location.pathname === "/sidangs/pic" ? (
              <div className="col-12">
                <h3>PENJADWALAN SIDANG</h3>
                <hr className="mt-0" />
                <h6 className="mb-3">
                  <a href="{{ route('home') }}" className="text-dark">
                    BERANDA
                  </a>{" "}
                  / PENJADWALAN SIDANG
                </h6>
              </div>
            ) : (
              <div className="col-12">
                <h3>PENGAJUAN SIDANG</h3>
                <hr className="mt-0" />
                <h6 className="mb-3">
                  <a href="{{ route('home') }}" className="text-dark">
                    BERANDA
                  </a>{" "}
                  / PENGAJUAN SIDANG
                </h6>
              </div>
              // @endif
            )}
          </ol>
          <div className="container-fluid">
            <div className="animated fadeIn">
              {/* @include('flash::message') 
              @include('coreui-templates::common.errors') */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <div
                        className="table-responsive-sm"
                        style={{ overflowX: "scroll" }}
                      >
                        <DataTable
                          data={dataSidang.data ? dataSidang.data : ""}
                          columns={columns}
                          fixedHeader
                          pagination
                        />
                        {jwtDecoded?.role?.find((role) =>
                          ["RLADM"].includes(role)
                        ) &&
                          dataSidang.data &&
                          dataSidang.data.map((value, index) => (
                            <>
                              <div
                                className="modal fade"
                                id={`feedbackAcceptAdminModal_${value.id}`}
                                tabIndex="-1"
                                role="dialog"
                                aria-labelledby="feedbackModal"
                                aria-hidden="true"
                                key={`feedbackAcceptAdminModal_${index}`}
                              >
                                <form
                                  onSubmit={(e) =>
                                    handleApproveFeedbackSidang(e, value.id)
                                  }
                                >
                                  <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5 className="modal-title">
                                          Feedback
                                        </h5>
                                        <button
                                          type="button"
                                          className="close"
                                          data-dismiss="modal"
                                          aria-label="Close"
                                        >
                                          <span aria-hidden="true">
                                            &times;
                                          </span>
                                        </button>
                                      </div>
                                      <div className="modal-body">
                                        <div className="form-group">
                                          <label
                                            htmlFor="message-text"
                                            className="col-form-label"
                                          >
                                            Feedback
                                          </label>
                                          <textarea
                                            className="form-control"
                                            id="message-text"
                                            name="feedback"
                                            value={feedbackApprove}
                                            onChange={(e) =>
                                              setFeedbackApprove(e.target.value)
                                            }
                                          />
                                        </div>
                                        <div className="form-group">
                                          <label
                                            htmlFor="message-text"
                                            className="col-form-label"
                                          >
                                            Bahasa Sidang
                                          </label>
                                          <p>
                                            <small>
                                              Pastikan anda melihat nilai EPRT
                                              mahasiswa yang bersangkutan
                                            </small>
                                          </p>
                                          <select
                                            className="form-control"
                                            name="bahasa"
                                            value={bahasa}
                                            onChange={(e) =>
                                              setBahasa(e.target.value)
                                            }
                                          >
                                            <option value="0">Indonesia</option>
                                            <option value="1">Inggris</option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="modal-footer">
                                        <button
                                          type="button"
                                          className="btn btn-secondary"
                                          data-dismiss="modal"
                                        >
                                          Close
                                        </button>
                                        <button
                                          type="submit"
                                          className="btn btn-primary"
                                        >
                                          Approve Sidang
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </div>

                              <div
                                className="modal fade"
                                id={`feedbackRejectAdminModal_${value.id}`}
                                tabIndex="-1"
                                role="dialog"
                                aria-labelledby="feedbackModal"
                                aria-hidden="true"
                                key={`feedbackRejectAdminModal_${index}`}
                              >
                                <form
                                  onSubmit={(e) =>
                                    handleFeedbackSidang(e, value.id)
                                  }
                                >
                                  <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5 className="modal-title">
                                          Feedback
                                        </h5>
                                        <button
                                          type="button"
                                          className="close"
                                          data-dismiss="modal"
                                          aria-label="Close"
                                        >
                                          <span aria-hidden="true">
                                            &times;
                                          </span>
                                        </button>
                                      </div>
                                      <div className="modal-body">
                                        <div className="form-group">
                                          <label
                                            htmlFor="message-text"
                                            className="col-form-label"
                                          >
                                            Feedback
                                          </label>
                                          <textarea
                                            className="form-control"
                                            id="message-text"
                                            name="feedback"
                                            value={feedback}
                                            onChange={(e) =>
                                              setFeedback(e.target.value)
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="modal-footer">
                                        <button
                                          type="button"
                                          className="btn btn-secondary"
                                          data-dismiss="modal"
                                        >
                                          Close
                                        </button>
                                        <button
                                          type="submit"
                                          className="btn btn-primary"
                                        >
                                          Send Feedback
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </>
                          ))}
                      </div>
                      <div className="pull-right mr-3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default SidangIndex;
