import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";

const PeminatansCreate = () => {
    const navigate = useNavigate();
    const [nama, setNama] = useState("");
    const [kk, setKk] = useState("");
    const [inputEmpty, setInputEmpty] = useState("");
  
    const createPerminatans = async () => {
      if (!nama.trim() || !kk.trim()) {
        setInputEmpty("Semua input harus diisi");
        return;
      }

      const data = { nama, kk};
      await axios.post(`${import.meta.env.VITE_API_SOFILAMA}/api/peminatan`, data)
      .then(() => {
        navigate("/peminatans", { state: { successMessage: 'Peminatan Berhasil Disimpan.' } });
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <MainLayout>
      <ol className="breadcrumb mb-0">
        <div className="col-12">
          <h3>PEMINATAN</h3>
          <hr className="mt-0" />
          <h6 className="mb-3">
            <Link 
            to="/peminatans"
            className="text-dark">
              PEMINATAN
            </Link>{" "}
            / TAMBAH PEMINATAN
          </h6>
        </div>
      </ol>
      <div className="container-fluid">
        <div className="animated fadeIn">
          {inputEmpty && (
            <Alert
              type="danger"
              message={inputEmpty}
            />
          )}
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
                        onClick={createPerminatans}
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
    </MainLayout>
  );
};

export default PeminatansCreate;
