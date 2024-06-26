import { Link, useLocation, useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import DataTable from "react-data-table-component";

const Clos = () => {
  const [clos, setClos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resClos = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/clo`
        );
        setClos(resClos.data.data);
        console.log(resClos.data.data);
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
          `${import.meta.env.VITE_API_SOFILAMA}/api/clo/${id}`
        );
        setClos((Clos) => Clos.filter((Clos) => Clos.id !== id));
        navigate("/cLOS", {
          state: { successMessage: "Clos Berhasil Dihapus." },
        });
      } catch (error) {
        console.error("Clos Gagal Dihapus.", error);
      }
    }
  };

  const filteredItems = clos.filter((item) => {
    const searchText = filterText.toLowerCase();
    const code = String(item.code).toLowerCase();
    const description = item.description.toLowerCase();
    const period = item.period ? item.period.name.toLowerCase() : "";
    return (
      code.includes(searchText) ||
      description.includes(searchText) ||
      period.includes(searchText)
    );
  });

  const columnsClos = [
    {
      name: "Code",
      selector: (row) => row.code,
      sortable: true,
      width: "6%",
    },
    {
      name: "Percentage",
      selector: (row) => row.precentage,
      sortable: true,
      width: "8%",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      width: "25%",
    },
    {
      name: "Untuk Periode",
      selector: (row) => row.period?.name,
      sortable: true,
      width: "9%",
    },
    {
      name: "Prodi",
      selector: (row) => (row.studyProgram ? row.studyProgram?.name : "-"),
      sortable: true,
      width: "6%",
    },
    {
      name: "Pembimbing",
      selector: (row) =>
        row.components[0].pembimbing ? "Berlaku" : "Tidak Berlaku",
      sortable: true,
      width: "8%",
    },
    {
      name: "Penguji",
      selector: (row) =>
        row.components[0].penguji ? "Berlaku" : "Tidak Berlaku",
      sortable: true,
      width: "8%",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="btn-group">
          <Link to={`/cLOS/${row.id}`} className="btn btn-success">
            <i className="fa fa-eye"></i>
          </Link>
          <Link to={`/cLOS/${row.id}/edit`} className="btn btn-info">
            <i className="fa fa-edit" style={{ color: "white" }}></i>
          </Link>
          <Link
            to={`/clo/preview/${row.period_id}/${
              row.study_program_id ? row.study_program_id : -1
            }/pembimbing`}
            target="_blank"
            className="btn btn-warning"
            style={{ color: "white" }}
          >
            Preview Pembimbing
          </Link>
          <Link
            to={`/clo/preview/${row.period_id}/${
              row.study_program_id ? row.study_program_id : -1
            }/penguji`}
            target="_blank"
            className="btn btn-warning"
            style={{ color: "white" }}
          >
            Preview Penguji
          </Link>
          <button
            className="btn btn-danger"
            onClick={() => handleDelete(row.id)}
          >
            <i className="fa fa-trash"></i>
          </button>
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
              <h3>CLOS</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  BERANDA
                </Link>{" "}
                / CLOS
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
                      <i className="fa fa-align-justify"></i>
                      CLOS
                      <Link
                        className="pull-right btn btn-primary"
                        to="/cLOS/create"
                      >
                        <i className="fa fa-plus-square fa-lg text-white"></i>
                      </Link>
                      <Link
                        className="pull-right btn btn-success mr-2"
                        to="/cLOS/clone"
                      >
                        Clone CLO Period
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
                          customStyles={customStyles}
                          columns={columnsClos}
                          data={filteredItems}
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

export default Clos;
