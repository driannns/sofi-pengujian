import { Link, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";

const VerifyDocumentsEdit = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [inputEmpty, setInputEmpty] = useState("");
  const [serial_number, setserial_number] = useState("");
  const [perihal, setPerihal] = useState("");
  const [nim, setNim] = useState("");
  const [created_by, setCreated_by] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/verifyDocuments/${params.id}`
        );
        console.log(data);
        const { serial_number, perihal, nim, created_by } = data.data.data;
        setserial_number(serial_number);
        setPerihal(perihal);
        setNim(nim);
        setCreated_by(created_by);
      } catch (error) {
        console.error(error);
        navigate('/home');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params,navigate]);

  const EditVerifyDocuments = () => {
    if (
      !serial_number.trim() ||
      !perihal.trim() ||
      !nim.trim() ||
      !created_by.trim()
    ) {
      setInputEmpty("Inputan Kosong");
      return;
    }

    const data = { serial_number, perihal, nim, created_by };
    axios
      .put(`${import.meta.env.VITE_API_SOFILAMA}/api/verifyDocuments/${params.id}`, data)
      .then(() => {
        navigate("/verifyDocuments", {
          state: { successMessage: "Verify Document Berhasil Diubah." },
        });
      })
      .catch((error) => {
        console.error("Verify Document Gagal Diubah.:", error);
      });
  };

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
                / UBAH LIST SN DOKUMEN
              </h6>
            </div>
          </ol>
          <div className="container-fluid">
            <div className="animated fadeIn">
              {inputEmpty && <Alert type="danger" message={inputEmpty} />}
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      {/*<!-- Serial Number Field -->*/}
                      <div className="form-group col-sm-6">
                        <label htmlFor="serial_number">Serial Number:</label>
                        <input
                          type="text"
                          value={serial_number}
                          className="form-control"
                          onChange={(e) => setserial_number(e.target.value)}
                        />
                      </div>

                      {/*<!-- Perihal Field -->*/}
                      <div className="form-group col-sm-6">
                        <label htmlFor="perihal">Perihal:</label>
                        <input
                          type="text"
                          value={perihal}
                          className="form-control"
                          onChange={(e) => setPerihal(e.target.value)}
                        />
                      </div>

                      {/*<!-- Nim Field -->*/}
                      <div className="form-group col-sm-6">
                        <label htmlFor="nim">Nim:</label>
                        <input
                          type="text"
                          value={nim}
                          className="form-control"
                          onChange={(e) => setNim(e.target.value)}
                        />
                      </div>

                      {/*<!-- Created By Field -->*/}
                      <div className="form-group col-sm-6">
                        <label htmlFor="created_by">Created By:</label>
                        <input
                          type="number"
                          value={created_by}
                          className="form-control"
                          onChange={(e) => setCreated_by(e.target.value)}
                        />
                      </div>

                      {/*<!-- Submit Field -->*/}
                      <div className="form-group col-sm-12">
                        <button
                          onClick={EditVerifyDocuments}
                          className="btn btn-primary my-3"
                        >
                          Save
                        </button>
                        <Link
                          to="/verifydocuments"
                          className="btn btn-secondary ml-1"
                        >
                          Cancel
                        </Link>
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

export default VerifyDocumentsEdit;
