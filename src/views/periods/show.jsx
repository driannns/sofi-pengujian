import { Link, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";

const PeriodsShow = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [periods, setPeriods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${import.meta.env.VITE_API_PERIOD}/api/period/get/${params.id}`
        );
        console.log(data);
        setPeriods(data.data.data);
      } catch (error) {
        console.error(error);
        navigate('/home');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params,navigate]);

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
                <Link to="/periods" className="text-dark">
                  PERIODE
                </Link>{" "}
                / DETAIL PERIODE
              </h6>
            </div>
          </ol>
          <div className="container-fluid">
            <div className="animated fadeIn">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">
                      <strong>Details</strong>
                      <Link to="/periods" className="btn btn-light">
                        Back
                      </Link>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive-sm">
                        <table className="table table-striped table-borderless">
                          <tbody>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Start Date
                              </td>
                              <td>:</td>
                              <td>{formatDateTime(periods.start_date)}</td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                End Date
                              </td>
                              <td>:</td>
                              <td>{formatDateTime(periods.end_date)}</td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Description
                              </td>
                              <td>:</td>
                              <td>{periods.description}</td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Created At
                              </td>
                              <td>:</td>
                              <td>
                                {formatDateTime(periods.created_at, true)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
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

export default PeriodsShow;
