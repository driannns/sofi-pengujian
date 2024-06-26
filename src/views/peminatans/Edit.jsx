import { Link, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";

const PeminatansEdit = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [kk, setKk] = useState("");
  const [inputEmpty, setInputEmpty] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/peminatan/${params.id}`
        );
        console.log(data);
        const { nama, kk } = data.data.data;
        setNama(nama);
        setKk(kk);
      } catch (error) {
        console.error(error);
        navigate("/peminatans", {
          state: { errorMessage: "Peminatan Tidak Ada" },
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params, navigate]);

  const EditPeminatan = () => {
    if (!nama.trim() || !kk.trim()) {
      setInputEmpty("Semua input harus diisi");
      return;
    }
    const data = { nama, kk };
    axios
      .put(
        `${import.meta.env.VITE_API_SOFILAMA}/api/peminatan/${params.id}`,
        data
      )
      .then(() => {
        navigate("/peminatans", {
          state: { successMessage: "Peminatan Berhasil DIupdate." },
        });
      })
      .catch((error) => {
        console.error(error);
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
              <h3>PEMINATAN</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/peminatans" className="text-dark">
                  PEMINATAN
                </Link>{" "}
                / UBAH PEMINATAN
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
                      {/* <!-- Nama Field -->*/}
                      <div className="form-group col-sm-6">
                        <label htmlFor="nama">Nama:</label>
                        <input
                          type="text"
                          value={nama}
                          className="form-control"
                          onChange={(e) => setNama(e.target.value)}
                        />
                      </div>

                      {/*<!-- Kk Field -->*/}
                      <div className="form-group col-sm-6">
                        <label htmlFor="kk">Kk:</label>
                        <input
                          type="text"
                          value={kk}
                          className="form-control"
                          onChange={(e) => setKk(e.target.value)}
                        />
                      </div>

                      {/*<!-- Submit Field -->*/}
                      <div className="form-group col-sm-12">
                        <button
                          onClick={EditPeminatan}
                          className="btn btn-primary my-3"
                        >
                          Save
                        </button>
                        <Link
                          to="/peminatans"
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

export default PeminatansEdit;
