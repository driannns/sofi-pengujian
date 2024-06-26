import { Link, useLocation, useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import DataTable from "react-data-table-component";

const Lecturers = () => {
  const [lecturers, setLecturers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resLecturers = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/lecturer`
        );
        setLecturers(resLecturers.data.data);
        console.log(resLecturers.data.data);
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
          `${import.meta.env.VITE_API_SOFILAMA}/api/lecturer/${id}`
        );
        setLecturers((Lecturers) =>
          Lecturers.filter((lecturers) => lecturers.id !== id)
        );
        navigate("/lecturers", {
          state: { successMessage: "Hak Akses Berhasil Dihapus." },
        });
      } catch (error) {
        console.error("Hak Akses Gagal Dihapus.", error);
      }
    }
  };

  const filteredItems = lecturers.filter((item) => {
    const nama = item.user?.nama?.toLowerCase() ?? "belum diinputkan";
    const kode = (item.code || "belum diinputkan").toLowerCase();
    const nip = (item.nip || "belum diinputkan").toLowerCase();
    const kk = (item.kk || "belum diinputkan").toLowerCase();
    const role = item.role?.toLowerCase() ?? "belum diinputkan";
    const searchText = filterText.toLowerCase();

    return (
      nama.includes(searchText) ||
      kode.includes(searchText) ||
      nip.includes(searchText) ||
      kk.includes(searchText) ||
      role.includes(searchText)
    );
  });

  const columnsLecturers = [
    {
      name: "No",
      selector: (row, index) => index + 1,
      sortable: true,
      grow: 0,
    },
    {
      name: "Nama",
      selector: (row) => row.user.nama,
      sortable: true,
    },
    {
      name: "Kode",
      selector: (row) => row.code || "Belum diinputkan",
      sortable: true,
    },
    {
      name: "NIP",
      selector: (row) => row.nip || "Belum diinputkan",
      sortable: true,
    },
    {
      name: "Kelompok Keahlian",
      selector: (row) => row.kk || "Belum diinputkan",
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="btn-group">
          <Link
            to="#"
            className="btn btn-ghost-danger"
            onClick={() => handleDelete(row.id)}
          >
            <i className="fa fa-trash"></i>
          </Link>
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

  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <ol className="breadcrumb mb-0">
            <div className="col-12">
              <h3>HAK AKSES</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  BERANDA
                </Link>{" "}
                / HAK AKSES
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
                      <Link className="pull-right" to="/lectures/create">
                        <i className="fa fa-plus-square fa-lg"></i>
                      </Link>
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
                          columns={columnsLecturers}
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

export default Lecturers;
