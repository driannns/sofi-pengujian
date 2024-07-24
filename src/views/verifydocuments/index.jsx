import { Link, useLocation, useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";

const VerifyDocuments = () => {
  const [verifydocuments, setVerifyDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resVerifyDocuments = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/verifyDocuments`
        );
        setVerifyDocuments(resVerifyDocuments.data.data);
        console.log(resVerifyDocuments.data.data);
      } catch (err) {
        console.log(err);
        navigate('/home');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <ol className="breadcrumb mb-0">
            <div className="col-12">
              <h3>LIST SN DOKUMEN</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  BERANDA
                </Link>{" "}
                / LIST SN DOKUMEN
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
                      List SN Dokumen
                    </div>
                    <div className="card-body">
                      <div className="table-responsive-sm">
                        <table
                          className="table table-striped"
                          id="verifyDocuments-table"
                        >
                          <thead>
                            <tr>
                              <th>Serial Number</th>
                              <th>Perihal</th>
                              <th>Nim</th>
                              <th>Created By</th>
                              <th colSpan="3">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {verifydocuments.map((verifyDocument) => (
                              <tr key={verifyDocument.id}>
                                <td>{verifyDocument.serial_number}</td>
                                <td>{verifyDocument.perihal}</td>
                                <td>{verifyDocument.nim}</td>
                                <td>{verifyDocument.created_by}</td>
                                <td>
                                  <div className="btn-group">
                                    <Link
                                      to={`/verifydocuments/${verifyDocument.id}`}
                                      className="btn btn-ghost-success"
                                    >
                                      <i className="fa fa-eye"></i>
                                    </Link>
                                    <Link
                                      to={`/verifydocuments/${verifyDocument.id}/edit`}
                                      className="btn btn-ghost-info"
                                    >
                                      <i className="fa fa-edit"></i>
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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

export default VerifyDocuments;
