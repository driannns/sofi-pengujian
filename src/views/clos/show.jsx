import { Link, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";

const ClosShow = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [clos, setClos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/clo/${params.id}`
        );
        console.log(data.data);
        setClos(data.data.data);
      } catch (error) {
        console.error(error);
        navigate('/cLOS')
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params, navigate]);

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
                  CLOS
                </Link>{" "}
                / DETAIL CLOS
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
                      <Link to="/cLOS" className="btn btn-light">
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
                                Code
                              </td>
                              <td>:</td>
                              <td>{clos.code}</td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Percentage
                              </td>
                              <td>:</td>
                              <td>{clos.precentage}%</td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Description
                              </td>
                              <td>:</td>
                              <td>{clos.description}</td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Unsur Penilaian
                              </td>
                              <td>:</td>
                              <td>
                                {clos.components &&
                                  clos.components[0] &&
                                  clos.components[0].unsur_penilaian}
                              </td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Period
                              </td>
                              <td>:</td>
                              <td>{clos.period?.name}</td>
                            </tr>
                            <tr>
                              <td
                                className="font-weight-bold"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Berlaku Untuk
                              </td>
                              <td>:</td>
                              <td>
                              {clos.components && clos.components.length > 0 && (
                                <>
                                  {clos.components[0].pembimbing && <div>Pembimbing<br/></div>}
                                  {clos.components[0].penguji && <div>Penguji<br/></div>}
                                </>
                              )}
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

export default ClosShow;
