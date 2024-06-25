import { MainLayout } from "../../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkSidang } from "../../../store/sidangSlicer";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import Loading from "../../../components/Loading";
import Alert from "../../../components/Alert";
import ModalComponent from "../../../components/Modal";

const Teams = () => {
  const dataSidang = useSelector((state) => state.sidang);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies();

  const [isLoading, setIsLoading] = useState(false);
  const [team, setTeam] = useState(null);
  const [student, setStudent] = useState(null);
  const [member, setMember] = useState("");
  const [isSudahDijadwalkan, setIsSudahDijadwalkan] = useState(true);
  const [isIndividu, setIsIndividu] = useState(false);
  const [teamName, setTeamName] = useState("");

  const [tambahModal, setTambahModal] = useState(false);
  const [ubahModal, setUbahModal] = useState(false);
  const [leaveModal, setLeaveModal] = useState(false);
  const [userIdLeave, setUserIdLeave] = useState(null);
  const jwtDecoded = jwtDecode(cookies["auth-token"]);
  const isMounted = useRef(true);

  const handleLeaveTeam = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const body = {
        team_id: team.id,
        user_id: userIdLeave,
      };
      const res = await axios.post(`/api/team/leave-team`, body, {
        headers: {
          Authorization: `Bearer ${cookies["auth-token"]}`,
          "ngrok-skip-browser-warning": true,
        },
      });
      if (res.data.code === 200) {
        fetchSidangData();
        localStorage.setItem("successMessage", "Berhasil Dihapus.");
      }
    } catch (error) {
      setIsLoading(false);
    } finally {
      setLeaveModal(false);
    }
  };

  const handleAddMember = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const memberId = parseInt(member);
      const body = {
        team_id: team.id,
        user_id: memberId,
      };
      const res = await axios.post(`/api/team/add-member`, body, {
        headers: {
          Authorization: `Bearer ${cookies["auth-token"]}`,
          "ngrok-skip-browser-warning": true,
        },
      });
      console.log(res);
      if (res.data.code === 200) {
        localStorage.setItem(
          "successMessage",
          `${res.data.data} Berhasil Ditambahkan.`
        );
        fetchSidangData();
        return;
      }
    } catch (error) {
      if (
        error.response.data.code === 404 &&
        error.response.data.message === "make sure student already upload slide"
      ) {
        localStorage.setItem("errorMessage", `${error.response.data.message}`);
      }
      console.error("error", error);
      setIsLoading(false);
    } finally {
      setMember("");
      setTambahModal(false);
    }
  };

  const formatUser = async (userId) => {
    try {
      const res = await axios.get(`https://sofi.my.id/api/user/${userId}`);
      return res.data.data.nama;
    } catch (error) {
      return "-";
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await axios.get(`/api/team/user/get`, {
        headers: {
          "ngrok-skip-browser-warning": true,
          Authorization: `Bearer ${cookies["auth-token"]}`,
        },
      });

      handleIsIndividu(res.data.data);
      if (res.data.code === 200) {
        setTeam(res.data.data);
        setTeamName(res.data.data.name);
      }
    } catch (error) {
      if (
        error.response?.data.code !== 404 ||
        error.message === "Network Error"
      ) {
        localStorage.setItem("errorMessage", "Network Error1");
        if (isMounted.current) navigate("/home");
        return;
      }
    }
  };

  const fetchMember = async () => {
    try {
      const studentRegistered = await axios.get(`/api/team/available-member`, {
        headers: {
          Authorization: `Bearer ${cookies["auth-token"]}`,
          "ngrok-skip-browser-warning": true,
        },
      });
      setStudent(studentRegistered.data.data);
    } catch (error) {
      if (error.response?.status !== 404 || error.message === "Network Error") {
        localStorage.setItem("errorMessage", "Network Error2");
        if (isMounted.current) navigate("/home");
        return;
      }
    }
  };

  const handleIsSudahDijadwalkan = () => {
    if (
      dataSidang.data.status === "belum dijadwalkan" ||
      dataSidang.data.status === "tidak lulus (belum dijadwalkan)" ||
      dataSidang.data.status === "telah disetujui admin"
    ) {
      setIsSudahDijadwalkan(false);
    }
  };

  const handleIsIndividu = (team) => {
    if (team.name === `${jwtDecoded.nim} Sidang Individu`) {
      setIsIndividu(true);
    }
  };

  const fetchSidangData = async () => {
    try {
      setIsLoading(true);
      dispatch(checkSidang(cookies["auth-token"]));

      if (!dataSidang.data) {
        localStorage.setItem(
          "errorMessage",
          "Anda belum mendaftar sidang, silahkan daftar sidang terlebih dahulu"
        );
        if (isMounted.current) navigate(-1);
        return;
      }
      if (
        dataSidang.data.status === "sudah dijadwalkan" ||
        dataSidang.data.status === "tidak lulus (sudah dijadwalkan)"
      ) {
        localStorage.setItem(
          "errorMessage",
          "Jadwal sidang anda sudah diumumkan, tidak dapat membuat team lagi"
        );
        if (isMounted.current) navigate("/schedule/mahasiswa"); //?Belum dibuat
        return;
      }

      if (dataSidang.data.status === "tidak lulus") {
        localStorage.setItem(
          "errorMessage",
          "Silahkan update berkas sidang ulang dan slide!"
        );
        if (isMounted.current) navigate("/slides");
        return;
      }
      if (
        dataSidang.data.status !== "telah disetujui admin" &&
        dataSidang.data.status !== "belum dijadwalkan" &&
        dataSidang.data.status !== "tidak lulus (sudah update dokumen)" &&
        dataSidang.data.status !== "tidak lulus (belum dijadwalkan)"
      ) {
        localStorage.setItem(
          "errorMessage",
          "Sidang anda belum di approve dosen pembimbing dan admin"
        );
        if (isMounted.current) navigate(`/sidangs/${dataSidang.data.id}/edit`);
        return;
      }

      if (dataSidang.data.slide === null) {
        localStorage.setItem(
          "errorMessage",
          "Anda harus mengupload berkas presentasi terlebih dahulu!"
        );
        if (isMounted.current) navigate("/slides");
        return;
      }

      const resUserInfo = await axios.get(
        `https://sofi.my.id/api/student/${jwtDecoded.id}`
      );
      let team_id = 0;
      if ((team_id = resUserInfo.data.data.team_id !== 0)) {
        if (dataSidang.data.status === "tidak lulus (sudah update dokumen)") {
          if (isMounted.current) navigate("/teams/create");
          return;
        }
        team_id = resUserInfo.data.data.team_id;
      } else {
        if (isMounted.current) navigate("/teams/create");
        return;
      }

      await fetchTeam();
      await fetchMember();

      handleIsSudahDijadwalkan();
    } catch (error) {
      if (error.message === "Network Error") {
        localStorage.setItem("errorMessage", "Network Error3");
        if (isMounted.current) navigate("/home");
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTeam = async (e, teamId) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const body = {
        name: teamName,
      };
      const res = await axios.patch(`/api/team/update/${teamId}`, body, {
        headers: {
          Authorization: `Bearer ${cookies["auth-token"]}`,
        },
      });
      if (res.data.code === 200) {
        localStorage.setItem("successMessage", "Tim Berhasil Di Ubah.");
        await fetchSidangData();
      }
    } catch (error) {
    } finally {
      setTeamName("");
      setUbahModal(false);
      setIsLoading(false);
    }
  };

  const handleLeaveModalOpen = (userId) => {
    setLeaveModal(true);
    setUserIdLeave(userId);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchSidang = async () => {
      try {
        setIsLoading(true);
        const dataSidangTeam = await dispatch(
          checkSidang(cookies["auth-token"])
        );
        if (
          dataSidangTeam.type === "checkSidang/rejected" &&
          dataSidangTeam.error.message === "Network Error"
        ) {
          localStorage.setItem("errorMessage", "Network Error");
          if (isMounted.current) navigate("/home");
          return;
        }
        if (!dataSidangTeam.payload) {
          localStorage.setItem(
            "errorMessage",
            "Anda belum mendaftar sidang, silahkan daftar sidang terlebih dahulu"
          );
          if (isMounted.current) navigate(-1);
          return;
        }

        if (
          dataSidangTeam.payload.status === "sudah dijadwalkan" ||
          dataSidangTeam.payload.status === "tidak lulus (sudah dijadwalkan)"
        ) {
          localStorage.setItem(
            "errorMessage",
            "Jadwal sidang anda sudah diumumkan, tidak dapat membuat team lagi"
          );
          if (isMounted.current) navigate("/schedule/mahasiswa"); //?Belum dibuat
          return;
        }

        if (dataSidangTeam.payload.status === "tidak lulus") {
          localStorage.setItem(
            "errorMessage",
            "Silahkan update berkas sidang ulang dan slide!"
          );
          if (isMounted.current) navigate("/slides");
          return;
        }
        if (
          dataSidangTeam.payload.status !== "telah disetujui admin" &&
          dataSidangTeam.payload.status !== "belum dijadwalkan" &&
          dataSidangTeam.payload.status !==
            "tidak lulus (sudah update dokumen)" &&
          dataSidangTeam.payload.status !== "tidak lulus (belum dijadwalkan)"
        ) {
          localStorage.setItem(
            "errorMessage",
            "Sidang anda belum di approve dosen pembimbing dan admin"
          );
          if (isMounted.current)
            navigate(`/sidangs/${dataSidangTeam.payload.id}/edit`);
          return;
        }

        if (dataSidangTeam.payload.slide === null) {
          localStorage.setItem(
            "errorMessage",
            "Anda harus mengupload berkas presentasi terlebih dahulu!"
          );
          if (isMounted.current) navigate("/slides");
          return;
        }

        const resUserInfo = await axios.get(
          `https://sofi.my.id/api/student/${jwtDecoded.id}`,
          { signal }
        );
        let team_id = 0;
        if ((team_id = resUserInfo.data.data.team_id !== 0)) {
          if (
            dataSidangTeam.payload.status ===
            "tidak lulus (sudah update dokumen)"
          ) {
            if (isMounted.current) navigate("/teams/create");
            return;
          }
          team_id = resUserInfo.data.data.team_id;
        } else {
          if (isMounted.current) navigate("/teams/create");
          return;
        }

        await fetchTeam();
        await fetchMember();

        handleIsSudahDijadwalkan();
      } catch (error) {
        if (error.message === "Network Error") {
          localStorage.setItem("errorMessage", "Network Error");
          if (isMounted.current) navigate("/home");
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSidang();

    return () => {
      isMounted.current = false;
      abortController.abort();
    };
  }, []);

  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <ol className="breadcrumb mb-0">
            <div className="col-12">
              <h3>TIM</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  BERANDA
                </Link>
                / TIM
              </h6>
            </div>
          </ol>

          <div className="container-fluid">
            <div className="animated fadeIn">
              <Alert type="success" />
              <Alert type="danger" />
              <Alert type="warning" />
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">
                      <i className="fa fa-align-justify"></i>
                      <span className="font-weight-bold">{team?.name}</span>
                      {!isIndividu && !isSudahDijadwalkan && (
                        <>
                          <button
                            className="pull-right btn btn-primary btn-sm"
                            onClick={() => setTambahModal(true)}
                          >
                            TAMBAH ANGGOTA
                          </button>
                          <button
                            className="pull-right mr-2 btn btn-primary btn-sm"
                            onClick={() => setUbahModal(true)}
                          >
                            UBAH NAMA TIM
                          </button>
                        </>
                      )}
                    </div>
                    <div className="card-body">
                      <div className="table-responsive-sm">
                        <table
                          className="table table-striped datatable"
                          id="teams-table"
                        >
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>NIM</th>
                              <th>Name</th>
                              <th>Aksi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {team?.members.map((value, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{value.nim}</td>
                                <td>{value.name}</td>
                                <td>
                                  {isSudahDijadwalkan ? (
                                    <div className="btn-group">
                                      <a href="#" className="btn btn-primary">
                                        Lihat Jadwal
                                      </a>
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                          handleLeaveModalOpen(value.user_id)
                                        }
                                      >
                                        Tinggalkan
                                      </button>
                                      {/* {{-- MODAL HAPUS TIM  --}} */}
                                      <ModalComponent
                                        show={leaveModal}
                                        onHide={() => setLeaveModal(false)}
                                        className="modal fade"
                                      >
                                        <div
                                          className="modal-dialog"
                                          style={{ margin: 0 }}
                                        >
                                          <div className="modal-content">
                                            {/* <!-- Modal body --> */}
                                            <div className="modal-header">
                                              <h4 className="modal-title">
                                                Perhatian
                                              </h4>
                                              <button
                                                type="button"
                                                className="close"
                                                onClick={() =>
                                                  setLeaveModal(false)
                                                }
                                              >
                                                &times;
                                              </button>
                                            </div>
                                            <div className="modal-body text-center">
                                              <form onSubmit={handleLeaveTeam}>
                                                <div className="btn-group">
                                                  {jwtDecoded.id ===
                                                  value.team_id ? (
                                                    <button
                                                      type="submit"
                                                      className="btn btn-danger btn-sm"
                                                    >
                                                      Tinggalkan
                                                    </button>
                                                  ) : (
                                                    <center>
                                                      <h5>
                                                        Jika anda memilih
                                                        tinggalkan, maka anda
                                                        akan meninggalkan tim.
                                                      </h5>
                                                      <br />
                                                      <div className="d-flex justify-content-center">
                                                        <button
                                                          type="submit"
                                                          className="btn btn-danger w-25 mr-1"
                                                        >
                                                          Tinggalkan
                                                        </button>
                                                        <button
                                                          type="button"
                                                          onClick={() =>
                                                            setLeaveModal(false)
                                                          }
                                                          className="btn btn-secondary w-25"
                                                        >
                                                          Batal
                                                        </button>
                                                      </div>
                                                    </center>
                                                  )}
                                                </div>
                                              </form>
                                            </div>
                                          </div>
                                        </div>
                                      </ModalComponent>
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="pull-right mr-3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* {{-- MODAL TAMBAH --}} */}
          <ModalComponent
            show={tambahModal}
            onHide={() => setTambahModal(false)}
            className="modal fade"
          >
            <div className="modal-dialog modal-lg" style={{ margin: 0 }}>
              <div className="modal-content">
                {/* <!-- Modal Header --> */}
                <div className="modal-header">
                  <h4 className="modal-title">Tambah Anggota Tim</h4>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setTambahModal(false)}
                  >
                    &times;
                  </button>
                </div>
                <form onSubmit={handleAddMember}>
                  {/* <!-- Modal body --> */}
                  <div className="modal-body">
                    {/* <!-- Name Field --> */}
                    <div className="form-group col-8">
                      <label htmlFor="nim">NIM Anggota Tim:</label>
                      <select
                        className="form-control select2"
                        name="nim"
                        value={member}
                        onChange={(e) => setMember(e.target.value)}
                      >
                        <option value="" readOnly>
                          -- Silahkan pilih nama anggota --
                        </option>
                        {student?.map((value, index) => (
                          <option key={index} value={value.user_id}>
                            {value.nim} - {value.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <input
                      type="submit"
                      value="Tambah"
                      className="btn btn-primary"
                    />
                    <div
                      onClick={() => setTambahModal(false)}
                      className="btn btn-secondary"
                    >
                      Batal
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </ModalComponent>

          {/* {{-- MODAL UBAH TIM  --}} */}
          <ModalComponent
            className="modal fade"
            show={ubahModal}
            onHide={() => setUbahModal(false)}
          >
            <div className="modal-dialog" style={{ margin: 0 }}>
              <div className="modal-content">
                {/* <!-- Modal Header --> */}
                <div className="modal-header">
                  <h4 className="modal-title">Ubah Nama Tim</h4>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setUbahModal(false)}
                  >
                    &times;
                  </button>
                </div>
                {/* {!! Form::model($team, ['route' => ['teams.update', $team->id], 'method' => 'patch']) !!} */}
                <form onSubmit={(e) => handleUpdateTeam(e, team.id)}>
                  {/* <!-- Modal body --> */}
                  <div className="modal-body">
                    {/* <!-- Name Field --> */}
                    <div className="form-group">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="form-control"
                        placeholder="Masukkan Nama Kelompok"
                      />
                    </div>
                  </div>

                  {/* <!-- Modal footer --> */}
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      Simpan
                    </button>
                    <div
                      onClick={() => setUbahModal(false)}
                      className="btn btn-secondary"
                    >
                      Batal
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </ModalComponent>
        </>
      )}
    </MainLayout>
  );
};

export default Teams;
