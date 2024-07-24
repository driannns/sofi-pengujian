import { Link, useLocation, useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";
import DataTable from "react-data-table-component";
import Loading from "../../components/Loading";

const Peminatans = () => {
  const [peminatans, setPeminatans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resPerminatans = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/peminatan`
        );
        setPeminatans(resPerminatans.data.data);
        console.log(resPerminatans.data.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
        navigate('/home');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const filteredItems = peminatans.filter((item) => {
    const nama = item.nama.toLowerCase();
    const kk = item.kk.toLowerCase();
    const searchText = filterText.toLowerCase();
  
    return nama.includes(searchText) || kk.includes(searchText);
  });
  

  const columnsPeminatan = [
    {
      name: "Nama",
      selector: (row) => row.nama,
      sortable: true,
    },
    {
      name: "Kelompok Keahlian",
      selector: (row) => row.kk,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="btn-group">
          <Link className="btn btn-ghost-success" to={`/peminatans/${row.id}`}>
            <i className="fa fa-eye"></i>
          </Link>
          <Link
            className="btn btn-ghost-info"
            to={`/peminatans/${row.id}/edit`}
          >
            <i className="fa fa-edit"></i>
          </Link>
          <button
            className="btn btn-ghost-danger"
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

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (confirm) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_SOFILAMA}/api/peminatan/${id}`
        );
        setPeminatans((prevPeminatans) =>
          prevPeminatans.filter((peminatans) => peminatans.id !== id)
        );
        navigate("/peminatans", {
          state: { successMessage: "Peminatan Berhasil Dihapus." },
        });
      } catch (error) {
        console.error(error);
        navigate("/peminatans", {
          state: { errorMessage: "Peminatan Tidak Ada" },
        });
      }
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
              <h3>PEMINATAN</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  BERANDA
                </Link>{" "}
                / PEMINATAN
              </h6>
            </div>
          </ol>
          <div className="container-fluid">
            <div className="animated fadeIn">
              {state && state.successMessage && (
                <Alert type="success" message={state.successMessage} />
              )}
              {state && state.errorMessage && (
                <Alert type="danger" message={state.errorMessage} />
              )}
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">
                      <i className="fa fa-align-justify"></i>
                      Peminatan
                      <Link className="pull-right" to="/peminatans/create">
                        <i className="fa fa-plus-square fa-lg"></i>
                      </Link>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive-sm">
                        <span className="search-label" style={{ marginRight: '0.5rem'}}>Search:</span>
                        <input
                          type="text"
                          aria-label="Search Input"
                          value={filterText}
                          onChange={(e) => setFilterText(e.target.value)}
                          style={{ width: '200px', marginRight: '1rem', marginBottom: '1rem' }}
                        />
                        <DataTable
                          customStyles={customStyles}
                          columns={columnsPeminatan}
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

export default Peminatans;
