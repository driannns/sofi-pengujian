import { Link, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import Alert from "../../components/Alert";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Loading from "../../components/Loading";
import ReactLoading from "react-loading";

const JadwalCreate = () => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const [teams, setTeams] = useState({ members: [] });
  const [lecturers, setLecturers] = useState([]);

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
        const teamResponse = await axios.get(`/api/team/get/${params.id}`, {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
          },
        });
        setTeams(teamResponse.data.data);

        const memberPromises = teamResponse.data.data?.members.map(
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
        await setTeams((prevTeams) => ({
          ...prevTeams,
          members: updatedMembers,
        }));

        const penguji = updatedMembers.flatMap((member) => [
          member.pengajuan.pembimbing1_id,
          member.pengajuan.pembimbing2_id,
        ]);

        const lecturersResponse = await axios.get(
          `https://sofi.my.id/api/schedule/penguji?lectureid=${penguji.join(
            ","
          )}`
        );
        const allLecturers = lecturersResponse.data.data;

        setLecturers({
          penguji1: allLecturers.penguji1,
          penguji2: allLecturers.penguji2,
        });
      } catch (error) {
        navigate("/sidangs/pic", {
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
      setAlertBoxVisible
    ) => {
      if (date && time && penguji && typeof penguji === "string") {
        const pengujiId = penguji.split(" - ")[0];
        const dateTime = `${date}T${time}:00+07:00`;
        axios
          .post(`/api/schedule/check-penguji/${pengujiId}?condition=create`, {
            date_time: dateTime,
            pengajuan_id: [],
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

    checkPengujiAvailability(
      penguji1,
      setMessage,
      setAlertClass,
      setAlertBoxVisible
    );
    checkPengujiAvailability(
      penguji2,
      setMessage2,
      setAlertClass2,
      setAlertBoxVisible2
    );
  }, [date, time, penguji1, penguji2]);

  const extractPengujiData = (penguji) => {
    if (!penguji) {
      return { id: null, jfa: null, kk: null };
    }
    const parts = penguji.split(" - ");
    if (parts.length < 3) {
      return { id: null, jfa: null, kk: null };
    }
    return {
      id: parseInt(parts[0], 10),
      jfa: parts[1] || null,
      kk: parts[2] || null,
    };
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

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        times.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return times;
  };

  const createPenjadwalan = async () => {
    const userDate = new Date(date + "T" + time);
    const gmtDateTime = userDate.toISOString();
    const currentDateTime = new Date();
    const twoHoursBefore = new Date(userDate.getTime() - 2 * 60 * 60 * 1000);
    const penguji1Data = extractPengujiData(penguji1);
    const penguji2Data = extractPengujiData(penguji2);

    setIsSubmitting(true);

    // Validasi Tanggal dan Waktu Lampau
    if (currentDateTime > userDate) {
      setErrorMessage("Waktu sidang sudah lewat");
      setIsSubmitting(false);
      return;
    }

    // Validasi waktu sidang
    if (
      currentDateTime.toDateString() === userDate.toDateString() &&
      currentDateTime > twoHoursBefore
    ) {
      setErrorMessage("Maksimal jadwal sidang h-2 jam");
      setIsSubmitting(false);
      return;
    }

    // Validasi Penguji 1 dan 2 tidak boleh sama
    if (penguji1 === penguji2) {
      setErrorMessage("Penguji 1 Tidak boleh sama dengan Penguji 2");
      setIsSubmitting(false);
      return;
    }

    // Validasi Kesamaan Peminatan (KK) dengan Mahasiswa
    const penguji1KK = penguji1.split(" - ")[2];
    const penguji2KK = penguji2.split(" - ")[2];
    let isKKMatch = false;
    for (const member of teams.members) {
      if (
        member.pengajuan.kk === penguji1KK ||
        member.pengajuan.kk === penguji2KK
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
    if (penguji1Data.jfa === "NJFA") {
      setErrorMessage("Penguji 1 harus memiliki JFA");
      setIsSubmitting(false);
      return;
    }

    // Validasi Penguji tidak sama dengan pembimbing
    let isPembimbingMatch = false;
    for (const member of teams.members) {
      if (
        member.pembimbing1_id === parseInt(penguji1) ||
        member.pembimbing1_id === parseInt(penguji2) ||
        member.pembimbing2_id === parseInt(penguji1) ||
        member.pembimbing2_id === parseInt(penguji2)
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
      team_id: teams.id,
      date_time: gmtDateTime,
      room: room,
      penguji1: penguji1Data,
      penguji2: penguji2Data,
      members: teams.members.map((member) => ({
        user_id: member.user_id,
        pengajuan_id: member.pengajuan.id,
        pembimbing1_id: member.pengajuan.pembimbing1_id,
        pembimbing2_id: member.pengajuan.pembimbing2_id,
        kk: member.pengajuan.kk,
      })),
    };

    try {
      const response = await axios.post(`/api/schedule/create`, data, {
        headers: {
          Authorization: `Bearer ${cookies["auth-token"]}`,
        },
      });
      if (response.status) {
        navigate("/schedules", {
          state: {
            successMessage: "Berhasil Menjadwalkan",
          },
        });
      }
    } catch (error) {
      navigate("/sidangs/pic", {
        state: {
          errorMessage: "Gagal Menjadwalkan",
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
              <h3>JADWAL SIDANG</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  BERANDA
                </Link>{" "}
                / TAMBAH JADWAL SIDANG
              </h6>
            </div>
          </ol>

          <div className="container-fluid">
            <div className="animated fadeIn">
              <Alert type="danger" message={errorMessage} />
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <form>
                        {/*<!-- Sidang Id Field -->*/}
                        <div className="form-group col-sm-6">
                          <input
                            type="hidden"
                            className="form-control"
                            value={teams.id}
                          />
                          <label>TIM</label>
                          <input
                            type="text"
                            name="tim"
                            className="form-control"
                            value={teams.name}
                            readOnly
                          />
                        </div>
                        <hr />
                        {teams.members.map((member, index) => (
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
                          <select
                            className="form-control time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                          >
                            {generateTimeOptions().map((timeOption) => (
                              <option key={timeOption} value={timeOption}>
                                {timeOption}
                              </option>
                            ))}
                          </select>
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
                            value={penguji1}
                            onChange={(e) => setPenguji1(e.target.value)}
                          >
                            <option value="">Pilih Penguji 1</option>
                            {lecturers.penguji1 &&
                              lecturers.penguji1.map((lecturer) => (
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
                            value={penguji2}
                            onChange={(e) => setPenguji2(e.target.value)}
                          >
                            <option value="">Pilih Penguji 2</option>
                            {lecturers.penguji2 &&
                              lecturers.penguji2.map((lecturer) => (
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
                              createPenjadwalan();
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
                            to="/sidangs/pic"
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

export default JadwalCreate;
