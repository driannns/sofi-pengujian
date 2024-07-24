import { useEffect, useState } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "../../components/Alert";
import DataTable from "react-data-table-component";
import Loading from "../../components/Loading";

const Parameters = () => {
  const [parameters, setParameters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resParameters = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/parameter`
        );
        setParameters(resParameters.data.data);
        console.log(resParameters.data.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const filteredItems = parameters.filter((item) => {
    const name = item.name.toLowerCase();
    const value = item.value.toLowerCase();
    const searchText = filterText.toLowerCase();
  
    return name.includes(searchText) || value.includes(searchText);
  });
  
  const columnsParameters = [
    {
      name: "Nama",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Value",
      selector: (row) => row.value,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="btn-group">
          <Link
            className="btn btn-ghost-info"
            to={`/parameters/${row.id}/edit`}
          >
            <i className="fa fa-edit"></i>
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
              <h3>PARAMETERS</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  BERANDA
                </Link>{" "}
                / PARAMETERS
              </h6>
            </div>
          </ol>
          <div className="container-fluid">
            <div className="animated fadeIn">
              <Alert type="success"/>
              {state && state.errorMessage && (
                <Alert type="danger" message={state.errorMessage} />
              )}
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="table-responsive-sm">
                        <span
                          className="search-label"
                          style={{ marginRight: "0.5rem"}}
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
                          columns={columnsParameters}
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

export default Parameters;
