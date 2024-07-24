import { Link, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";

const VerifyDocumentsShow = () => {
  const params = useParams();
  const [verifydocuments, setVerifyDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/verifyDocuments/${params.id}`
        );
        console.log(data);
        setVerifyDocuments(data.data.data);
      } catch (error) {
        console.error(error);
        navigate('/home');
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
              <h3>LIST SN DOKUMEN</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/verifydocuments" className="text-dark">
                  LIST SN DOKUMEN
                </Link>{" "}
                / DETAIL LIST SN DOKUMEN
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
                      <Link to="/verifydocuments" className="btn btn-light">
                        Back
                      </Link>
                    </div>
                    <div className="card-body">
                      {/*<!-- Serial Number Field -->*/}
                      <div className="form-group">
                        <label htmlFor="serialnumber">Serial Number:</label>
                        <p>{verifydocuments.serial_number}</p>
                      </div>

                      {/*<!-- Perihal Field -->*/}
                      <div className="form-group">
                        <label htmlFor="perihal">Perihal:</label>
                        <p>{verifydocuments.perihal}</p>
                      </div>

                      {/*<!-- Nim Field -->*/}
                      <div className="form-group">
                        <label htmlFor="nim">Nim:</label>
                        <p>{verifydocuments.nim}</p>
                      </div>

                      {/*<!-- Created By Field -->*/}
                      <div className="form-group">
                        <label htmlFor="createdby">Created By:</label>
                        <p>{verifydocuments.created_by}</p>
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

export default VerifyDocumentsShow;
