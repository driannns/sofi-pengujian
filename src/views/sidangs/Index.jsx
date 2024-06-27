import { MainLayout } from "../layouts/MainLayout";
import axios from "axios";
import { useCookies } from "react-cookie";
import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllSidang,
  getPICSidang,
  getPembimbingSidang,
  feedbackSidang,
  approveFeedbackSidang,
} from "../../store/sidangSlicer";
import Loading from "../../components/Loading";
import DatatableComponent from "../../components/Datatable";
import ModalComponent from "../../components/Modal";
import DownloadButton from "../../components/DownloadButton";
import Alert from "../../components/Alert";

const SidangIndex = () => {
  const [cookies] = useCookies();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const jwtDecoded = jwtDecode(cookies["auth-token"]);
  const isMounted = useRef(true);

  const dataSidang = useSelector((state) => state.sidang);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackApprove, setFeedbackApprove] = useState("");
  const [bahasa, setBahasa] = useState("");
  const [data, setData] = useState([]);
  const [approveModal, setApproveModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState("");
  const [rejectModal, setRejectModal] = useState(false);

  const formatUser = async (userId) => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      const res = await axios.get(`https://sofi.my.id/api/user/${userId}`, {
        signal,
      });
      return res.data.data.nama;
    } catch (error) {
      return "-";
    }
  };

  const formatScheduleId = async (pengajuanId) => {
    try {
      const res = axios.get(`/api/schedule/pengajuan/get/${pengajuanId}`);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const periodById = async (periodId) => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      const res = await axios.get(`/api/period/get/${periodId}`, { signal });
      return res.data.data.name;
    } catch (error) {
      return "-";
    }
  };

  const handleApproveModalOpen = (rowData) => {
    setSelectedRowData(rowData);
    setApproveModal(true);
  };

  const handleRejectModalOpen = (rowData) => {
    setSelectedRowData(rowData);
    setRejectModal(true);
  };

  const updateData = async (sidangId) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/pengajuan/get/${sidangId}`, {
        headers: {
          Authorization: `Bearer ${cookies["auth-token"]}`,
          "ngrok-skip-browser-warning": true,
        },
      });
      //? Parameter

      const resGetAllStudent = await axios.get(
        // `${import.meta.env.VITE_getAllStudents_API_URL}/2324-2/${res.data.data.nim}`,
        `${import.meta.env.VITE_getAllStudents_API_URL}/2324-2/1202204011`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_tokenSSO}`,
          },
        }
      );
      if (resGetAllStudent.data.data.length === 0) {
        localStorage.setItem(
          "errorMessage",
          "Mahasiswa tidak terdaftar di periode akademik ini"
        );
        if (isMounted.current) navigate("/home");
        return;
      }

      if (jwtDecoded.role.find((role) => ["RLSPR"].includes(role))) {
        if (isMounted.current) navigate("/sidangs/indexAll");
        return;
      } else {
        if (isMounted.current) navigate("/sidangs/create");
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  const columns = [
    {
      name: "NIM",
      selector: (row) => row.nim,
      sortable: true,
      width: "120px",
      left: true,
    },
    {
      name: "Nama",
      cell: (row) => row.nama,
      sortable: true,
      left: true,
      width: "120px",
    },
    {
      name: "Judul TA",
      cell: (row) => row.judul,
      sortable: true,
      width: "220px",
      left: true,
    },
    {
      name: "Jumlah Bimbingan",
      cell: (row) => (
        <>
          Pembimbing 1: {row.form_bimbingan1} Pertemuan <br />
          Pembimbing 2: {row.form_bimbingan2} Pertemuan
        </>
      ),
      sortable: true,
      width: "200px",
    },
    ...(jwtDecoded.role &&
    jwtDecoded.role.find((role) => ["RLADM"].includes(role))
      ? [
          {
            name: "Tak",
            selector: (row) => row.tak,
            sortable: true,
            width: "100px",
          },
          {
            name: "Eprt",
            selector: (row) => row.eprt,
            sortable: true,
            width: "100px",
          },
          {
            name: "Bahasa Sidang",
            selector: (row) => (row.is_english == 0 ? "Indonesia" : "Inggris"),
            sortable: true,
            width: "100px",
          },
          {
            name: "Periode",
            cell: (row) => row.periodName,
            sortable: true,
            width: "100px",
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
            width: "100px",
          },
        ]
      : []),
    {
      name: "Dokumen TA",
      selector: (row) =>
        row.doc_ta != null ? <DownloadButton url={`${row.doc_ta}`} /> : null,
      sortable: true,
      width: "120px",
    },
    {
      name: "Jurnal",
      selector: (row) =>
        row.makalah != null ? <DownloadButton url={`${row.makalah}`} /> : null,
      sortable: true,
      width: "120px",
    },
    {
      name: "Status",
      cell: (row) => {
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
      width: "150px",
    },
    {
      name: "Diajukan pada",
      selector: (row) => formatDate(row.created_at),
      sortable: true,
      width: "140px",
    },
    {
      name: "Aksi",
      selector: (row) => {
        if (
          jwtDecoded?.role?.find((role) => ["RLADM"].includes(role)) &&
          jwtDecoded?.role?.find((role) => !["RLSPR"].includes(role))
        ) {
          if (row.status === "belum disetujui admin") {
            return (
              <div className="btn-group">
                <button
                  className="btn btn-success"
                  onClick={() => handleApproveModalOpen(row)}
                >
                  <i className="fa fa-check" style={{ color: "white" }}></i>
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRejectModalOpen(row)}
                >
                  <i className="fa fa-times" style={{ color: "white" }}></i>
                </button>
              </div>
            );
          } else if (row.status === "sudah dijadwalkan") {
            return (
              <div className="btn-group w-100">
                <Link
                  to={`/schedules/${formatScheduleId(row.id)}`}
                  className="btn btn-light w-100"
                >
                  Lihat Jadwal
                </Link>
              </div>
            );
          }
          return (
            <div className="btn-group w-100">
              <button
                onClick={() => updateData(row.id)}
                className="btn btn-light w-100"
              >
                Update
              </button>
            </div>
          );
        } else if (location.pathname === "/sidangs/pic") {
          if (
            jwtDecoded?.role?.find((role) => ["RLPIC"].includes(role)) ||
            jwtDecoded?.role?.find((role) => ["RLSPR"].includes(role))
          ) {
            return (
              <div className="btn-group">
                {row.status === "belum dijadwalkan" ||
                row.status === "tidak lulus (belum dijadwalkan)" ? (
                  <a href={`/schedules/create/3`} className="btn btn-primary">
                    Jadwalkan
                  </a>
                ) : (
                  ""
                )}
                {row.status === "sudah dijadwalkan" ||
                  (row.status === "tidak lulus (sudah dijadwalkan)" && (
                    <button type="button" className="btn btn-primary" disabled>
                      Sudah Dijadwalkan
                    </button>
                  ))}
              </div>
            );
          }
        } else if (
          jwtDecoded?.role?.find((role) => ["RLPBB"].includes(role)) &&
          location.pathname === "/sidangs/pembimbing"
        ) {
          if (row.status !== "sudah dijadwalkan") {
            return (
              <div className="btn-group">
                <a href="#" className="btn btn-dark text-white disabled">
                  List Revisi
                </a>
              </div>
            );
          } else {
            if (row.status === "telah dilaksanakan") {
              return (
                <div className="btn-group">
                  <a
                    href="{{ route('revisions.show', $sidang->schedules->last()->id) }}"
                    className="btn btn-success text-white"
                  >
                    List Revisi
                  </a>
                </div>
              );
            }
            return (
              <div className="btn-group">
                <a href="#" className="btn btn-dark text-white disabled">
                  List Revisi
                </a>
              </div>
            );
          }
        }
      },
      width: "140px",
    },
  ];

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        let datas;
        if (
          jwtDecoded.role.find((role) => ["RLPIC"].includes(role)) &&
          location.pathname === "/sidangs/pic"
        ) {
          datas = await dispatch(getPICSidang(cookies["auth-token"]));
          if (datas.type === "getPICSidang/fulfilled") {
            if (datas.payload) {
              const dataSidangMHS = await Promise.all(
                datas?.payload?.map(async (value) => {
                  const manipulatedData = await formatUser(value.user_id);
                  return {
                    ...value,
                    nama: manipulatedData,
                  };
                })
              );
              setData(dataSidangMHS);
            } else {
              setData([]);
            }
          }
        } else if (
          jwtDecoded.role.find((role) => ["RLPBB"].includes(role)) &&
          location.pathname === "/sidangs/pembimbing"
        ) {
          datas = await dispatch(getPembimbingSidang(cookies["auth-token"]));
          if (datas.type === "getPembimbingSidang/fulfilled") {
            if (datas.payload) {
              const dataSidangMHS = await Promise.all(
                datas?.payload?.map(async (value) => {
                  const manipulatedData = await formatUser(value.user_id);
                  return {
                    ...value,
                    nama: manipulatedData,
                  };
                })
              );
              setData(dataSidangMHS);
            } else {
              setData([]);
            }
          }
        } else if (jwtDecoded.role.find((role) => ["RLADM"].includes(role))) {
          datas = await dispatch(getAllSidang(cookies["auth-token"]));
          console.log(datas);
          if (datas.type === "getAllSidang/fulfilled") {
            if (datas.payload) {
              const dataSidangMHS = await Promise.all(
                datas?.payload?.map(async (value) => {
                  const manipulatedData = await formatUser(value.user_id);
                  const periodName = await periodById(value.period_id);
                  return {
                    ...value,
                    nama: manipulatedData,
                    periodName: periodName,
                  };
                })
              );
              setData(dataSidangMHS);
            } else {
              setData([]);
            }
          }
        }
        if (
          datas.type === "getAllSidang/rejected" ||
          datas.type === "getPembimbingSidang/rejected" ||
          datas.type === "getPICSidang/rejected"
        ) {
          if (datas.error.message === "Network Error") {
            localStorage.setItem("errorMessage", "Network Error");
            if (isMounted.current) navigate("/home");
            return;
          }
        }
      } catch (error) {
        if (
          error.response?.status !== 404 ||
          error.message === "Network Error"
        ) {
          localStorage.setItem("errorMessage", "Network Error");
          if (isMounted.current) navigate("/home");
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    return () => {
      isMounted.current = false;
      abortController.abort();
    };
  }, [location.pathname]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      let datas;
      if (
        jwtDecoded.role.find((role) => ["RLPIC"].includes(role)) &&
        location.pathname === "/sidangs/pic"
      ) {
        datas = await dispatch(getPICSidang(cookies["auth-token"]));
      } else if (
        jwtDecoded.role.find((role) => ["RLPBB"].includes(role)) &&
        location.pathname === "/sidangs/pembimbing"
      ) {
        datas = await dispatch(getPembimbingSidang(cookies["auth-token"]));
        if (datas.payload) {
          const dataSidangMHS = await Promise.all(
            datas?.payload?.map(async (value) => {
              const manipulatedData = await formatUser(value.user_id);
              return {
                ...value,
                nama: manipulatedData,
              };
            })
          );
          setData(dataSidangMHS);
        }
      } else if (jwtDecoded.role.find((role) => ["RLADM"].includes(role))) {
        datas = await dispatch(getAllSidang(cookies["auth-token"]));
        if (datas.payload) {
          const dataSidangMHS = await Promise.all(
            datas?.payload?.map(async (value) => {
              const manipulatedData = await formatUser(value.user_id);
              const periodName = await periodById(value.period_id);
              return {
                ...value,
                nama: manipulatedData,
                periodName: periodName,
              };
            })
          );
          setData(dataSidangMHS);
        }
      }
      if (
        datas.type === "getAllSidang/rejected" ||
        datas.type === "getPembimbingSidang/rejected" ||
        datas.type === "getPICSidang/rejected"
      ) {
        if (datas.error.message === "Network Error") {
          localStorage.setItem("errorMessage", "Network Error");
          if (isMounted.current) navigate("/home");
          return;
        }
      }
    } catch (error) {
      if (error.response?.status !== 404 || error.message === "Network Error") {
        localStorage.setItem("errorMessage", "Network Error");
        if (isMounted.current) navigate("/home");
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSidang = async (e, sidangId) => {
    try {
      e.preventDefault();
      setRejectModal(false);
      const approveSidang = await dispatch(
        feedbackSidang({ authToken: cookies["auth-token"], feedback, sidangId })
      );

      if (approveSidang.type === "feedbackSidang/fulfilled") {
        fetchData();
        localStorage.removeItem("errorMessage");
        localStorage.removeItem("warningMessage");
        localStorage.removeItem("successMessage");
        localStorage.setItem("successMessage", "Feedback Sudah Dikirim");
        setFeedback("");
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleApproveFeedbackSidang = async (e, sidangId) => {
    try {
      e.preventDefault();
      setApproveModal(false);

      const approveSidang = await dispatch(
        approveFeedbackSidang({
          authToken: cookies["auth-token"],
          feedbackApprove,
          bahasa,
          sidangId,
        })
      );

      if (approveSidang.type === "approveFeedbackSidang/fulfilled") {
        fetchData();
        localStorage.removeItem("errorMessage");
        localStorage.removeItem("warningMessage");
        localStorage.removeItem("successMessage");
        localStorage.setItem("successMessage", "Berhasil di Disetujui");
        setFeedbackApprove("");
      }
    } catch (error) {
      console.error("error", error);
    }
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
            )}
          </ol>
          <div className="container-fluid">
            <div className="animated fadeIn">
              <Alert type="success" />
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <div
                        className="table-responsive-sm"
                        style={{ overflowX: "scroll" }}
                      >
                        <DatatableComponent
                          data={data ? data : ""}
                          columns={columns}
                        />
                        {jwtDecoded?.role?.find((role) =>
                          ["RLADM"].includes(role)
                        ) &&
                          data && (
                            <>
                              <ModalComponent
                                show={approveModal}
                                onHide={() => setApproveModal(false)}
                              >
                                <form
                                  onSubmit={(e) =>
                                    handleApproveFeedbackSidang(
                                      e,
                                      selectedRowData?.id
                                    )
                                  }
                                >
                                  <div
                                    className="modal-dialog"
                                    role="document"
                                    style={{ margin: 0 }}
                                  >
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5 className="modal-title">
                                          Feedback
                                        </h5>
                                        <button
                                          type="button"
                                          className="close"
                                          onClick={() => setApproveModal(false)}
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
                                            <option value="false">
                                              Indonesia
                                            </option>
                                            <option value="true">
                                              Inggris
                                            </option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="modal-footer">
                                        <button
                                          type="button"
                                          className="btn btn-secondary"
                                          onClick={() => setApproveModal(false)}
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
                              </ModalComponent>

                              <ModalComponent
                                show={rejectModal}
                                onHide={() => setRejectModal(false)}
                              >
                                <form
                                  onSubmit={(e) =>
                                    handleFeedbackSidang(e, selectedRowData?.id)
                                  }
                                >
                                  <div
                                    className="modal-dialog"
                                    role="document"
                                    style={{ margin: 0 }}
                                  >
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5 className="modal-title">
                                          Feedback
                                        </h5>
                                        <button
                                          type="button"
                                          className="close"
                                          onClick={() => setRejectModal(false)}
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
                                          onClick={() => setRejectModal(false)}
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
                              </ModalComponent>
                            </>
                          )}
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
