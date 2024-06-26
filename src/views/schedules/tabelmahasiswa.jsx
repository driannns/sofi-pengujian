import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import DataTable from "react-data-table-component";

const TabelMahasiswa = () => {
  const [cookies] = useCookies();
  const jwtDecoded = jwtDecode(cookies["auth-token"]);
  const location = useLocation();
  const [scheduleData, setscheduleData] = useState([]);
  const [team, setTeam] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const schedulerResponse = await axios.get(`/schedule/mahasiswa/get`, {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
          },
        });

        const data = schedulerResponse.data.data;

        const penguji1Response = await axios.get(
          `https://sofi.my.id/api/lecturer/${data.schedules[0].penguji1_id}`
        );
        const penguji2Response = await axios.get(
          `https://sofi.my.id/api/lecturer/${data.schedules[0].penguji2_id}`
        );

        const updatedData = {
          ...data,
          penguji1: penguji1Response.data.data.code,
          penguji2: penguji2Response.data.data.code,
        };
        setscheduleData([updatedData]);

        const teamResponse = await axios.get(`/api/team/user/get`, {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
          },
        });
        setTeam(teamResponse.data.data);
      } catch (err) {
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    };

    if (
      jwtDecoded.role.includes("RLMHS") &&
      location.pathname === "/schedule/mahasiswa"
    ) {
      fetchData();
    }
  }, []);

  const user_id = scheduleData[0]?.schedules[0]?.pengajuan?.user_id;
  const teamMember = team?.members?.find(
    (member) => member.user_id === user_id
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "belum dilaksanakan":
        return "badge badge-secondary";
      case "telah dijadwalkan":
        return "badge badge-info";
      case "telah dilaksanakan":
        return "badge badge-primary";
      case "sedang dilaksanakan":
        return "badge badge-success";
      default:
        return "badge";
    }
  };

  const isVirtualRoom = (room) => {
    return room.includes("http") || room.includes(".co");
  };

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#20a8d8",
        color: "white",
        fontWeight: "bold",
        borderBottom: "1px solid black",
      },
    },
  };

  const columns = [
    {
      name: "Jadwal",
      selector: (row) =>
        new Date(row.schedules[0].date_time).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Jam",
      selector: (row) =>
        new Date(row.schedules[0].date_time).toLocaleTimeString(),
      sortable: true,
    },
    {
      name: "Penguji 1",
      selector: (row) => row.penguji1,
      sortable: true,
    },
    {
      name: "Penguji 2",
      selector: (row) => row.penguji2,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <span className={getStatusBadgeClass(row.schedules[0].status)}>
          {row.schedules[0].status}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Daftar Hadir",
      selector: () => (
        <form className="form">
          <input type="hidden" name="date" />
          <input type="hidden" name="time" />
          <button type="button" className="btn btn-outline-primary btn-sm form">
            Daftar Hadir
          </button>
        </form>
      ),
    },
    {
      name: "Ruang",
      selector: (row) =>
        row.schedules[0].room && isVirtualRoom(row.schedules[0].room) ? (
          <Link
            to={
              row.schedules[0].room.startsWith("http")
                ? row.schedules.room
                : `https://${row.schedules[0].room}`
            }
            className="btn btn-success btn-sm"
          >
            Virtual Room
          </Link>
        ) : (
          row.schedules[0].room
        ),
      sortable: true,
    },
  ];

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        jwtDecoded.role.includes("RLMHS") &&
        location.pathname === "/schedule/mahasiswa" && (
          <div>
            <form>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label font-weight-bold">
                  Nama Lengkap
                </label>
                <div className="col-sm-10">
                  <span>
                    : {teamMember?.name} / {teamMember?.nim}
                  </span>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label font-weight-bold">
                  Judul Tugas Akhir
                </label>
                <div className="col-sm-6">
                  <span>
                    : {scheduleData[0]?.schedules?.[0]?.pengajuan?.judul}
                  </span>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label font-weight-bold">
                  Jenis Sidang
                </label>
                <div className="col-sm-10">
                  <span>
                    :{" "}
                    {team?.name?.includes("Individu") ? "INDIVIDU" : "KELOMPOK"}
                  </span>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label font-weight-bold">
                  Anggota
                </label>
                <div className="col-sm-10">
                  {scheduleData[0]?.member &&
                    scheduleData[0].member.map((member, index) => (
                      <span key={index}>
                        : {member.name} / {member.nim}
                        <br />
                      </span>
                    ))}
                </div>
              </div>
            </form>
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
                placeholder="Search"
                style={{
                  width: "200px",
                  marginRight: "1rem",
                }}
              />
            </div>
            <div className="table-responsive-sm" style={{ overflow: "scroll" }}>
              <DataTable
                customStyles={customStyles}
                columns={columns}
                data={scheduleData}
                pagination
                highlightOnHover
                striped
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TabelMahasiswa;
