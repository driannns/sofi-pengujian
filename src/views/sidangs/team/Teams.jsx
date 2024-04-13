import { MainLayout } from "../../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkSidang } from "../../../store/sidangSlicer";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { isLoadingTrue, isLoadingFalse } from "../../../store/loadingSlicer";
import Loading from "../../../components/Loading";
import Alert from "../../../components/Alert";

const Teams = () => {
  const dataSidang = useSelector((state) => state.sidang);
  const isLoading = useSelector((state) => state.loading.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies();

  const [team, setTeam] = useState(null);
  const [student, setStudent] = useState(null);
  const [member, setMember] = useState(null);
  const [isSudahDijadwalkan, setIsSudahDijadwalkan] = useState(true);
  const [isIndividu, setIsIndividu] = useState(false);
  const [teamName, setTeamName] = useState("");
  const jwtDecoded = jwtDecode(cookies["auth-token"]);

  const handleLeaveTeam = async (e) => {
    try {
      dispatch(isLoadingTrue());
      console.log("loading true1");
      e.preventDefault();
      const body = {
        team_id: team.id,
      };
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/team/leave-team`,
        body,
        {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      if (res.data.code === 200) {
        fetchSidangData();
        localStorage.setItem("successMessage", "Berhasil Dihapus.");
      }
      console.log(res.data);
    } catch (error) {
      console.error(error);
      dispatch(isLoadingFalse());
    }
  };

  const handleAddMember = async (e) => {
    try {
      dispatch(isLoadingTrue());
      e.preventDefault();
      const memberId = parseInt(member);
      const body = {
        team_id: team.id,
        user_id: memberId,
      };
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/team/add-member`,
        body,
        {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      console.log(res.data);
      if (res.data.code === 200) {
        localStorage.setItem(
          "succesMessage",
          `${res.data.data.nim} Berhasil Ditambahkan.`
        );
        fetchSidangData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(isLoadingFalse());
    }
  };

  const formatUser = async (userId) => {
    try {
      const res = await axios.get(`https://sofi.my.id/api/user/${userId}`);
      // console.log(res.data.data);
      return res.data.data.nama;
    } catch (error) {
      return "-";
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/team/get-team`,
        {
          headers: {
            "ngrok-skip-browser-warning": true,
            Authorization: `Bearer ${cookies["auth-token"]}`,
          },
        }
      );

      handleIsIndividu(res.data.data);
      if (res.data.code === 200) {
        setTeam(res.data.data);
      }
    } catch (error) {
      console.error(error);
      if (
        error.response?.data.status !== 404 ||
        error.message === "Network Error"
      ) {
        localStorage.setItem("errorMessage", "Network Error1");
        navigate("/home");
        return;
      }
    }
  };

  const fetchMember = async () => {
    try {
      const studentNoTeam = await axios.get(
        "https://sofi.my.id/api/team/get-nonmember"
      );

      const studentRegistered = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pengajuan/status/approve`,
        {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
            "ngrok-skip-browser-warning": true,
          },
        }
      );

      const matchedStudents = studentNoTeam.data.data.filter((student) => {
        return studentRegistered.data.data.some(
          (registeredStudent) => registeredStudent.user_id === student.user_id
        );
      });

      const formatStudents = await Promise.all(
        matchedStudents.map(async (value) => {
          const manipulatedData = await formatUser(value.user_id);
          return { ...value, username: manipulatedData };
        })
      );
      setStudent(formatStudents);
      console.log(formatStudents);
    } catch (error) {
      console.error(error);
      if (error.response?.status !== 404 || error.message === "Network Error") {
        localStorage.setItem("errorMessage", "Network Error2");
        navigate("/home");
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
      dispatch(isLoadingTrue());

      dispatch(checkSidang(cookies["auth-token"]));

      if (!dataSidang.data) {
        localStorage.setItem(
          "errorMessage",
          "Anda belum mendaftar sidang, silahkan daftar sidang terlebih dahulu"
        );
        navigate(-1);
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
        navigate("/schedule/mahasiswa"); //?Belum dibuat
        return;
      }

      if (dataSidang.data.status === "tidak lulus") {
        localStorage.setItem(
          "errorMessage",
          "Silahkan update berkas sidang ulang dan slide!"
        );
        navigate("/slides");
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
        navigate(`/sidangs/${dataSidang.data.id}/edit`);
        return;
      }
      await axios.get(
        `${import.meta.env.VITE_API_URL}/api/slide/get-latest-slide`,
        {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
            "ngrok-skip-browser-warning": true,
          },
        }
      );

      const resUserInfo = await axios.get(
        `https://sofi.my.id/api/student/${jwtDecoded.id}`
      );

      let team_id = 0;
      if ((team_id = resUserInfo.data.data.team_id !== 0)) {
        if (dataSidang.data.status === "tidak lulus (sudah update dokumen)") {
          console.log("a");
          navigate("/teams/create");
          return;
        }
        team_id = resUserInfo.data.data.team_id;
      } else {
        console.log("b");
        navigate("/teams/create");
        return;
      }

      await fetchTeam();
      await fetchMember();

      handleIsSudahDijadwalkan();
    } catch (error) {
      if (error.response?.status === 404) {
        localStorage.setItem(
          "errorMessage",
          "Anda harus mengupload berkas presentasi terlebih dahulu!"
        );
        navigate("/slides");
        return;
      }
      if (error.message === "Network Error") {
        localStorage.setItem("errorMessage", "Network Error3");
        navigate("/home");
        return;
      }
      console.error(error);
    } finally {
      dispatch(isLoadingFalse());
    }
  };

  const handleUpdateTeam = async (e, teamId) => {
    try {
      e.preventDefault();
      dispatch(isLoadingTrue());
      const body = {
        name: teamName,
      };
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/team/update/${teamId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
          },
        }
      );
      console.log(res.data);
      if (res.data.code === 201) {
        localStorage.setItem("successMessage", "Tim Berhasil Di Ubah.");
        await fetchSidangData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTeamName("");
      dispatch(isLoadingFalse());
    }
  };

  useEffect(() => {
    fetchSidangData();
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
                            data-toggle="modal"
                            data-target="#modaltambah"
                          >
                            TAMBAH ANGGOTA
                          </button>
                          <button
                            className="pull-right mr-2 btn btn-primary btn-sm"
                            data-toggle="modal"
                            data-target="#modalubah"
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
                                <td>{value.user_id}</td>
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
                                        data-toggle="modal"
                                        data-target="#hapustim"
                                      >
                                        Tinggalkan
                                      </button>

                                      {/* {{-- MODAL HAPUS TIM  --}} */}
                                      <div className="modal fade" id="hapustim">
                                        <div className="modal-dialog">
                                          <div className="modal-content">
                                            {/* <!-- Modal body --> */}
                                            <div className="modal-header">
                                              <h4 className="modal-title">
                                                Perhatian
                                              </h4>
                                              <button
                                                type="button"
                                                className="close"
                                                data-dismiss="modal"
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
                                                    ></button>
                                                  ) : (
                                                    <center>
                                                      <h5>
                                                        Jika anda memilih
                                                        tinggalkan, maka anda
                                                        akan meninggalkan tim.
                                                      </h5>
                                                      <br />
                                                      <button
                                                        type="submit"
                                                        className="btn btn-danger"
                                                        data-toggle="modal"
                                                        data-target="#hapustim"
                                                      >
                                                        Tinggalkan
                                                      </button>
                                                      <button
                                                        data-dismiss="modal"
                                                        className="btn btn-secondary"
                                                      >
                                                        Batal
                                                      </button>
                                                    </center>
                                                  )}
                                                </div>
                                              </form>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
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
          <div className="modal fade" id="modaltambah">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                {/* <!-- Modal Header --> */}
                <div className="modal-header">
                  <h4 className="modal-title">Tambah Anggota Tim</h4>
                  <button type="button" className="close" data-dismiss="modal">
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
                            {value.nim} - {value.username}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div class="modal-footer">
                    <input
                      type="submit"
                      value="tambah"
                      className="btn btn-primary"
                    />
                    <button data-dismiss="modal" class="btn btn-secondary">
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* {{-- MODAL UBAH TIM  --}} */}
          <div className="modal fade" id="modalubah">
            <div className="modal-dialog">
              <div className="modal-content">
                {/* <!-- Modal Header --> */}
                <div className="modal-header">
                  <h4 className="modal-title">Ubah Nama Tim</h4>
                  <button type="button" className="close" data-dismiss="modal">
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
                    <button data-dismiss="modal" className="btn btn-secondary">
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Teams;
