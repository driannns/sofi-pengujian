import { Link, useLocation, useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";
import { useCookies } from "react-cookie";
import DataTable from "react-data-table-component";

const Periods = () => {
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resALlPeriods = await axios.get(
          `${import.meta.env.VITE_API_PERIOD }/api/period/get`,
          {
            headers: {
              Authorization: `Bearer ${cookies["auth-token"]}`,
            },
          }
        );
        console.log("Periode", resALlPeriods);
        setPeriods(resALlPeriods.data.data);

      } catch (error) {
        console.log("Failed to fetch data", error);
        navigate('/home');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [cookies, navigate]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Apakah Anda yakin?");
    if (confirm) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_PERIOD }/api/period/delete/${id}`
        );
        if (response.status === 200) {
          setPeriods((Periods) => Periods.filter((period) => period.id !== id));
          navigate("/periods", {
            state: { successMessage: "Periode Berhasil Dihapus." },
          });
        }
      } catch (error) {
        console.error(error);
        if (error.response) {
          if (error.response.status === 404) {
            navigate("/periods", {
              state: { errorMessage: "Periode Tidak Ada" },
            });
          } else {
            navigate("/periods", {
              state: {
                errorMessage:
                  "Periode tidak dapat dihapus karena digunakan pada data lain",
              },
            });
          }
        }
      }
    }
  };

  const formatDateTime = (dateStr, includeTime = false) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } else {
      return `${day}-${month}-${year}`;
    }
  };

  const filteredItems = periods.filter(item => {
    const searchText = filterText.toLowerCase();
    const name = item.name.toLowerCase();
    const start_date = formatDateTime(item.start_date).toLowerCase();
    const end_date = formatDateTime(item.end_date).toLowerCase();
    const created_at = formatDateTime(item.created_at).toLowerCase();
    const updated_at = formatDateTime(item.updated_at).toLowerCase();

    return name.includes(searchText) || start_date.includes(searchText) || end_date.includes(searchText) || created_at.includes(searchText) || updated_at.includes(searchText);
  });

  const columnsPeriod = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      width: '17%',
      
    },
    {
      name: 'Start Date',
      selector: row => formatDateTime(row.start_date),
      sortable: true,
      width: '10%'
    },
    {
      name: 'End Date',
      selector: row => formatDateTime(row.end_date),
      sortable: true,
      width: '10%'
    },
    {
      name: 'Created At',
      selector: row => formatDateTime(row.created_at, true),
      sortable: true,
      width: '15%'
    },
    {
      name: 'Updated At',
      selector: row => formatDateTime(row.updated_at, true),
      sortable: true,
      width: '15%'
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="btn-group" style={{ alignItems: "center" }}>
          <Link className="btn btn-ghost-success" to={`/periods/${row.id}`}>
            <i className="fa fa-eye"></i>
          </Link>
          <Link className="btn btn-ghost-info" to={`/periods/${row.id}/edit`}>
            <i className="fa fa-edit"></i>
          </Link>
          <button className="btn btn-ghost-danger" onClick={() => handleDelete(row.id)}>
            <i className="fa fa-trash"></i>
          </button>
          <a className="btn btn-primary" href={`/exports/score/${row.id}`}>
            Download Nilai
          </a>
          <a className="btn btn-primary" href={`/exports/revisions/${row.id}`}>
            Download List Revisi
          </a>
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
              <h3>PERIODE</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  BERANDA
                </Link>{" "}
                / PERIODE
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
                      Periods
                      <Link className="pull-right" to="/periods/create">
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
                        columns={columnsPeriod}
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

export default Periods;
