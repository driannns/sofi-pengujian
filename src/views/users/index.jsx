import { Link, useLocation, useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import DataTable from "react-data-table-component";

const User = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resUsers = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/user`
        );
        setUsers(resUsers.data.data);
        console.log(resUsers.data.data);
      } catch (err) {
        console.log(err);
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (confirm) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_SOFILAMA}/api/user/${id}`
        );
        setUsers((Users) => Users.filter((Users) => Users.id !== id));
        navigate("/Users", {
          state: { successMessage: "User Berhasil Dihapus." },
        });
      } catch (error) {
        console.error("User Gagal Dihapus.", error);
      }
    }
  };

  const columnsUser = [
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
      width: "28%",
    },
    {
      name: "Nama",
      selector: (row) => row.nama,
      sortable: true,
      width: "50%",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="dropdown">
          <button
            className="btn btn-success dropdown-toggle w-100"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Lihat
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <Link to={`/users/${row.id}`} className="btn btn-success w-100">
              Lihat
            </Link>
            <Link to={`/users/${row.id}/edit`} className="btn btn-info w-100">
              Ubah
            </Link>
            <button
              className="btn btn-danger w-100"
              onClick={() => handleDelete(row.id)}
            >
              Hapus
            </button>
          </div>
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

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

  const filteredItems = users.filter((item) => {
    const nama = item.nama.toLowerCase();
    const username = item.username.toLowerCase();
    const searchText = filterText.toLowerCase();

    return nama.includes(searchText) || username.includes(searchText);
  });

  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <ol className="breadcrumb mb-0">
            <div className="col-12">
              <h3>PENGGUNA</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  BERANDA
                </Link>{" "}
                / PENGGUNA
              </h6>
            </div>
          </ol>

          <div className="container-fluid">
            <div className="animated fadeIn">
              {state && state.successMessage && (
                <Alert type="success" message={state.successMessage} />
              )}
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">
                      <div className="btn-group pull-right">
                        <Link className="btn btn-primary" to="/users">
                          <i className="fa fa-filter fa-lg"></i> Semua
                        </Link>
                        <Link
                          className="btn btn-primary"
                          // href="{{ route('users.index',['filter'=>'student']) }}"
                        >
                          <i className="fa fa-filter fa-lg"></i> Filter
                          Mahasiswa
                        </Link>
                        <Link
                          className="btn btn-primary"
                          // href="{{ route('users.index',['filter'=>'lecturer']) }}"
                        >
                          <i className="fa fa-filter fa-lg"></i> Filter Dosen
                        </Link>
                        <Link
                          className="btn btn-success"
                          // href="{{ route('users.syncLecturer') }}"
                        >
                          <i className="fa fa-refresh fa-lg"></i> Sync Data
                          Dosen
                        </Link>
                        <Link
                          className="btn btn-success"
                          // href="{{ route('users.syncStudents') }}"
                        >
                          <i className="fa fa-refresh fa-lg"></i> Sync Data Mhs
                        </Link>
                        <Link className="btn btn-primary" to="/users/create">
                          <i className="fa fa-plus-square fa-lg"></i>
                        </Link>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive-sm">
                        <span
                          className="search-label"
                          style={{ marginRight: "0.5rem" }}
                        >
                          Search:
                        </span>
                        <input
                          type="text"
                          aria-label="Search Input"
                          value={filterText}
                          onChange={(e) => setFilterText(e.target.value)}
                          style={{
                            width: "200px",
                            marginRight: "1rem",
                            marginBottom: "1rem",
                          }}
                        />
                        <DataTable
                          columns={columnsUser}
                          data={filteredItems}
                          customStyles={customStyles}
                          pagination
                          highlightOnHover
                          responsive
                        />
                      </div>
                      <div className="pull-right mr-3"></div>
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

export default User;
