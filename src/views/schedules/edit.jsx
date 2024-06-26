import { Link, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import Alert from "../../components/Alert";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Loading from "../../components/Loading";
import ReactLoading from "react-loading";

const JadwalEdit = () => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const [schedule, setSchedule] = useState({ members: [] });
  const [lecturers, setLecturers] = useState([]);
  const [teamsName, setTeamName] = useState({ members: [] });

  const [team_Id, setTeam_Id] = useState("");
  const [date, setDate] = useState(localStorage.getItem("date") || "");
  const [time, setTime] = useState(localStorage.getItem("time") || "");
  const [penguji1, setPenguji1] = useState(
    JSON.parse(localStorage.getItem("penguji1")) || {
      id: "",
      jfa: "",
      kk: "",
    }
  );
  const [penguji2, setPenguji2] = useState(
    JSON.parse(localStorage.getItem("penguji2")) || {
      id: "",
      jfa: "",
      kk: "",
    }
  );
  const [room, setRoom] = useState(localStorage.getItem("room") || "");

  const [message, setMessage] = useState("");
  const [alertClass, setAlertClass] = useState("");
  const [alertBoxVisible, setAlertBoxVisible] = useState(false);

  const [message2, setMessage2] = useState("");
  const [alertClass2, setAlertClass2] = useState("");
  const [alertBoxVisible2, setAlertBoxVisible2] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const scheduleResponse = await axios.get(
          `/api/schedule/team/get/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${cookies["auth-token"]}`,
            },
          }
        );
        const scheduleData = scheduleResponse.data.data;

        const dateTime = new Date(scheduleData.date_time);
        const formattedDate = dateTime.toISOString().split("T")[0];
        const formattedTime = dateTime.toTimeString().split(" ")[0].slice(0, 5);

        const currentDate = new Date().toISOString().split("T")[0];
        const currentTime = new Date().toTimeString().split(" ")[0].slice(0, 5);

        if (currentDate === formattedDate) {
          const timeStart = new Date(scheduleData.date_time).getTime();
          const twoHoursBefore = new Date(timeStart - 2 * 60 * 60 * 1000)
            .toTimeString()
            .split(" ")[0]
            .slice(0, 5);

          if (currentTime > twoHoursBefore) {
            navigate("/schedules", {
              state: {
                errorMessage: "Maksimal merubah jadwal sidang h - 2 jam",
              },
            });
            return;
          }
        }

        setTeam_Id(scheduleData.team_id);
        setDate(formattedDate);
        setTime(formattedTime);
        setRoom(scheduleData.room);

        const penguji1Response = await axios.get(
          `https://sofi.my.id/api/lecturer/${scheduleData.penguji1_id}`
        );
        const penguji2Response = await axios.get(
          `https://sofi.my.id/api/lecturer/${scheduleData.penguji2_id}`
        );

        const penguji1Data = {
          id: penguji1Response.data.data.user_id,
          jfa: penguji1Response.data.data.jfa,
          kk: penguji1Response.data.data.kk,
        };

        const penguji2Data = {
          id: penguji2Response.data.data.user_id,
          jfa: penguji2Response.data.data.jfa,
          kk: penguji2Response.data.data.kk,
        };

        setPenguji1(penguji1Data);
        setPenguji2(penguji2Data);

        const updatedData = {
          ...scheduleData,
          penguji_1: `${penguji1Response.data.data.user.nama} - ${penguji1Response.data.data.kk}`,
          penguji_2: `${penguji2Response.data.data.user.nama} - ${penguji2Response.data.data.kk}`,
        };
        setSchedule(updatedData);

        const memberPromises = scheduleResponse.data.data?.members.map(
          async (member) => {
            const pembimbing1 = await axios.get(
              `https://sofi.my.id/api/lecturer/${member.pengajuan.pembimbing1_id}`
            );

            const pembimbing2 = await axios.get(
              `https://sofi.my.id/api/lecturer/${member.pengajuan.pembimbing2_id}`
            );
            const peminatan = await axios.get(
              `https://sofi.my.id/api/peminatan/${member.peminatan_id}`
            );
            return {
              ...member,
              pembimbing1: `${pembimbing1.data.data.code} - ${pembimbing1.data.data.user.nama}`,
              pembimbing2: `${pembimbing2.data.data.code} - ${pembimbing2.data.data.user.nama}`,
              peminatan: `${peminatan.data.data.nama}`,
              peminatan_id: member.pengajuan.peminatan_id,
              pembimbing1_id: member.pengajuan.pembimbing1_id,
              pembimbing2_id: member.pengajuan.pembimbing2_id,
            };
          }
        );
        const updatedMembers = await Promise.all(memberPromises);
        await setSchedule((prevSchedule) => ({
          ...prevSchedule,
          members: updatedMembers,
        }));

        const teamResponse = await axios.get(
          `/api/team/get/${scheduleData.team_id}`,
          {
            headers: {
              Authorization: `Bearer ${cookies["auth-token"]}`,
            },
          }
        );
        setTeamName(teamResponse.data.data);

        const lecturersResponse = await axios.get(
          "https://sofi.my.id/api/lecturer"
        );
        setLecturers(lecturersResponse.data.data);
      } catch (error) {
        navigate("/schedules", {
          state: {
            errorMessage: error,
          },
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [cookies]);

  useEffect(() => {
    const checkPengujiAvailability = (
      penguji,
      setMessage,
      setAlertClass,
      setAlertBoxVisible,
      pengajuanId
    ) => {
      if (date && time && penguji && typeof penguji === "string") {
        const pengujiId = penguji.split(" - ")[0];
        const dateTime = `${date}T${time}:00+07:00`;
        axios
          .post(`/api/schedule/check-penguji/${pengujiId}?condition=update`, {
            date_time: dateTime,
            pengajuan_id: pengajuanId,
          })
          .then((response) => {
            setMessage(response.data.data.message);
            setAlertClass(
              response.data.data.is_available ? "alert-success" : "alert-danger"
            );
            setAlertBoxVisible(true);
          })
          .catch((error) => {
            if (error.response) {
              setMessage(error.response.data.message);
              setAlertClass("alert-danger");
              setAlertBoxVisible(true);
            }
          });
      }
    };

    const pengajuanIds = schedule.members.map((member) => member.pengajuan.id);

    checkPengujiAvailability(
      `${penguji1.id} - ${penguji1.jfa} - ${penguji1.kk}`,
      setMessage,
      setAlertClass,
      setAlertBoxVisible,
      pengajuanIds
    );
    checkPengujiAvailability(
      `${penguji2.id} - ${penguji2.jfa} - ${penguji2.kk}`,
      setMessage2,
      setAlertClass2,
      setAlertBoxVisible2,
      pengajuanIds
    );
  }, [date, time, penguji1, penguji2, schedule.members]);

  const extractPengujiData = (penguji) => {
    const [id, jfa, kk] = penguji.split(" - ");
    return { id: parseInt(id.trim(), 10), jfa: jfa?.trim(), kk: kk?.trim() };
  };

  const handlePenguji1Change = (e) => {
    const { value } = e.target;
    setPenguji1(extractPengujiData(value));
  };

  const handlePenguji2Change = (e) => {
    const { value } = e.target;
    setPenguji2(extractPengujiData(value));
  };

  useEffect(() => {
    localStorage.setItem("date", date);
    localStorage.setItem("time", time);
    localStorage.setItem("penguji1", JSON.stringify(penguji1));
    localStorage.setItem("penguji2", JSON.stringify(penguji2));
    localStorage.setItem("room", room);
  }, [date, time, penguji1, penguji2, room]);

  useEffect(() => {
    if (errorMessage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [errorMessage]);

  const EditPenjadwalan = async () => {
    const userDateTime = new Date(date + "T" + time).toISOString();
    setIsSubmitting(true);

    // Validasi Penguji 1 dan 2 tidak boleh sama
    if (penguji1.id === penguji2.id) {
      setErrorMessage("Penguji 1 Tidak boleh sama dengan Penguji 2");
      setIsSubmitting(false);
      return;
    }

    // Validasi Kesamaan Peminatan (KK) dengan Mahasiswa
    let isKKMatch = false;
    for (const member of schedule.members) {
      if (
        member.pengajuan.kk === penguji1.kk ||
        member.pengajuan.kk === penguji2.kk
      ) {
        isKKMatch = true;
        break;
      }
    }
    if (!isKKMatch) {
      setErrorMessage("Minimal harus ada 1 penguji dari KK yang sama");
      setIsSubmitting(false);
      return;
    }

    // penguji 1 harus memiliki jfa
    if (penguji1.jfa !== "NJFA") {
      setErrorMessage("Penguji 1 harus memiliki JFA");
      setIsSubmitting(false);
      return;
    }

    // Validasi Penguji tidak sama dengan pembimbing
    let isPembimbingMatch = false;
    for (const member of schedule.members) {
      if (
        member.pembimbing1_id === penguji1.id ||
        member.pembimbing1_id === penguji2.id ||
        member.pembimbing2_id === penguji1.id ||
        member.pembimbing2_id === penguji2.id
      ) {
        isPembimbingMatch = true;
        break;
      }
    }
    if (isPembimbingMatch) {
      setErrorMessage(
        "Penguji 1 atau Penguji 2 tidak boleh sama dengan pembimbing"
      );
      setIsSubmitting(false);
      return;
    }

    const data = {
      team_id: schedule.id,
      date_time: userDateTime,
      room: room,
      penguji1,
      penguji2,
      members: schedule.members.map((member) => ({
        user_id: member.user_id,
        pengajuan_id: member.pengajuan.id,
        pembimbing1_id: member.pengajuan.pembimbing1_id,
        pembimbing2_id: member.pengajuan.pembimbing2_id,
        kk: member.pengajuan.kk,
      })),
    };

    try {
      const response = await axios.patch(
        `/api/schedule/update/${params.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
          },
        }
      );
      if (response.status) {
        navigate("/schedules", {
          state: {
            successMessage: "Jadwal Berhasil Diubah",
          },
        });
      }
    } catch (error) {
      navigate("/schedules", {
        state: {
          errorMessage: "Jadwal Gagal Diubah",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <ol className="breadcrumb mb-0">
            <div className="col-12">
              <h3>SCHEDULE</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  BERANDA
                </Link>{" "}
                / SCHEDULE
              </h6>
            </div>
          </ol>

          <div className="container-fluid">
            <div className="animated fadeIn">
              <Alert type="danger" message={errorMessage} />
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">
                      <i className="fa fa-edit fa-lg"></i>
                      <strong>Edit Schedule</strong>
                    </div>
                    <div className="card-body">
                      <form>
                        {/*<!-- Sidang Id Field -->*/}
                        <div className="form-group col-sm-6">
                          <input
                            type="hidden"
                            className="form-control"
                            value={team_Id}
                            readOnly
                          />
                          <label>TIM</label>
                          <input
                            type="text"
                            name="tim"
                            className="form-control"
                            value={teamsName.name}
                            readOnly
                          />
                        </div>
                        <hr />
                        {schedule.members.map((member, index) => (
                          <div key={index}>
                            <div>
                              <p>IDENTITAS MAHASISWA {index + 1}</p>
                              <div className="form-group col-sm-6">
                                <input
                                  type="hidden"
                                  className="form-control"
                                  value={member.user_id}
                                  readOnly
                                />
                                <input
                                  type="hidden"
                                  className="form-control"
                                  value={member.pengajuan.id}
                                  readOnly
                                />
                              </div>
                              <div className="form-group col-sm-6">
                                <label>NIM</label>
                                <input
                                  type="number"
                                  name="nim"
                                  className="form-control"
                                  value={member.nim}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="form-group col-sm-6">
                              <label>Nama</label>
                              <input
                                type="text"
                                className="form-control"
                                value={member.name}
                                readOnly
                              />
                            </div>
                            <div className="form-group col-sm-6">
                              <label>Judul</label>
                              <textarea
                                type="textarea"
                                className="form-control"
                                value={member.pengajuan.judul}
                                readOnly
                              />
                            </div>
                            <div className="form-group col-sm-6">
                              <label>KELOMPOK KEAHLIAN</label>
                              <input
                                type="text"
                                name="kk"
                                className="form-control"
                                value={member.pengajuan.kk}
                                readOnly
                              />
                            </div>
                            <div className="form-group col-sm-6">
                              <label>Peminatan</label>
                              <input
                                type="text"
                                className="form-control"
                                value={member.peminatan}
                                readOnly
                              />
                            </div>
                            <div className="form-group col-sm-6">
                              <label>PEMBIMBING 1</label>
                              <input
                                type="text"
                                name="pembimbing1"
                                className="form-control"
                                value={member.pembimbing1}
                                readOnly
                              />
                            </div>
                            <div className="form-group col-sm-6">
                              <label>PEMBIMBING 2</label>
                              <input
                                type="text"
                                name="pembimbing2"
                                className="form-control"
                                value={member.pembimbing2}
                                readOnly
                              />
                            </div>
                          </div>
                        ))}
                        <hr />

                        {/*<!-- Date Field -->*/}
                        <div className="form-group col-sm-6">
                          <label>TANGGAL SIDANG</label>
                          <input
                            type="date"
                            name="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                          />
                        </div>

                        {/*<!-- Time Field -->*/}
                        <div className="form-group col-sm-6">
                          <label>WAKTU SIDANG</label>
                          <input
                            type="time"
                            className="form-control time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                          />
                        </div>

                        <div className="form-group col-sm-6">
                          {alertBoxVisible && (
                            <div className={`alert ${alertClass}`} role="alert">
                              {message}
                            </div>
                          )}
                        </div>
                        {/*<!-- Penguji1 Field -->*/}

                        <div className="form-group col-sm-6">
                          <label>PENGUJI 1</label>
                          <select
                            className="form-control select2"
                            name="penguji1"
                            id="penguji1"
                            value={`${penguji1.id} - ${penguji1.jfa} - ${penguji1.kk}`}
                            onChange={handlePenguji1Change}
                          >
                            <option value="">{schedule.penguji_1}</option>
                            {lecturers.map((lecturer) => (
                              <option
                                key={lecturer.id}
                                value={`${lecturer.user_id} - ${lecturer.jfa} - ${lecturer.kk}`}
                              >
                                {lecturer.user.nama} - {lecturer.kk}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group col-sm-6">
                          {alertBoxVisible2 && (
                            <div
                              className={`alert ${alertClass2}`}
                              role="alert"
                            >
                              {message2}
                            </div>
                          )}
                        </div>
                        {/*<!-- Penguji2 Field -->*/}
                        <div className="form-group col-sm-6">
                          <label>PENGUJI 2</label>
                          <select
                            className="form-control select2"
                            name="penguji2"
                            id="penguji2"
                            value={`${penguji2.id} - ${penguji2.jfa} - ${penguji2.kk}`}
                            onChange={handlePenguji2Change}
                          >
                            <option value="">{schedule.penguji_2}</option>
                            {lecturers.map((lecturer) => (
                              <option
                                key={lecturer.id}
                                value={`${lecturer.user_id} - ${lecturer.jfa} - ${lecturer.kk}`}
                              >
                                {lecturer.user.nama} - {lecturer.kk}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/*<!-- Ruang Field -->*/}
                        <div className="form-group col-sm-6">
                          <label>RUANG SIDANG / LINK VIDEO CONFERENCE</label>
                          <input
                            type="text"
                            name="room"
                            id="room"
                            className="form-control"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                          />
                        </div>

                        {/*<!-- Submit Field -->*/}
                        <div className="form-group col-sm-12">
                          <button
                            className="btn btn-primary my-3"
                            onClick={(e) => {
                              e.preventDefault();
                              EditPenjadwalan();
                            }}
                          >
                            {isSubmitting ? (
                              <ReactLoading
                                type="spin"
                                color="#fff"
                                height="20px"
                                width="20px"
                              />
                            ) : (
                              "Simpan"
                            )}
                          </button>
                          <Link
                            to="/schedules"
                            className="btn btn-secondary ml-1"
                          >
                            Batal
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default JadwalEdit;
