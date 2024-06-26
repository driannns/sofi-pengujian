import { Link, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";

const PeminatansShow = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [perminatans, setPerminatans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/peminatan/${params.id}`
        );
        console.log(data);
        setPerminatans(data.data.data);
      } catch (error) {
        console.error("Failed to fetch study program", error);
        navigate("/peminatans", {
          state: { errorMessage: "Peminatan Tidak Ada" },
        });
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
              <h3>PEMINATAN</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/peminatans" className="text-dark">
                  PEMINATAN
                </Link>{" "}
                / DETAIL PEMINATAN
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
                      <Link to="/peminatans" className="btn btn-light">
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
                                Nama
                              </td>
                              <td>:</td>
                              <td>{perminatans.nama}</td>
                            </tr>
                            <tr>
                              <td className="font-weight-bold">
                                Kelompok Keahlian
                              </td>
                              <td>:</td>
                              <td>{perminatans.kk}</td>
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

export default PeminatansShow;
