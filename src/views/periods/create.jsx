import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";

const PeriodsCreate = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");
  const [description, setDescription] = useState("");

  const createPeriod = async () => {
    if (!name.trim() || !start_date.trim() || !end_date.trim() || !description.trim()) {
      setErrorMessage("Semua input harus diisi");
      return;
    }

    if (new Date(start_date) >= new Date(end_date)) {
      setErrorMessage("Tanggal akhir tidak sesuai, Mohon cek kembali");
      return;
    }

    const data = { name, start_date, end_date, description };
    await axios
      .post(`${import.meta.env.VITE_API_PERIOD }/api/period/create`, data)
      .then(() => {
        navigate("/periods", {
          state: { successMessage: "Periode Berhasil Disimpan." },
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <MainLayout>
      <ol className="breadcrumb mb-0">
        <div className="col-12">
          <h3>PERIODE</h3>
          <hr className="mt-0" />
          <h6 className="mb-3">
            <Link 
            to="/periods"
            className="text-dark">
              PERIODE
            </Link>{" "}
            / TAMBAH PERIODE
          </h6>
        </div>
      </ol>
      <div className="container-fluid">
        <div className="animated fadeIn">
          {errorMessage && (
            <Alert
              type="danger"
              message={errorMessage}
            />
          )}
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  {/*<!-- Name Field -->*/}
                  <div className="form-group col-sm-6">
                    <label htmlFor="name">Nama Period:</label>
                    <input
                      type="text"
                      value={name}
                      className="form-control"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/*<!-- Start Date Field -->*/}
                  <div className="form-group col-sm-6">
                    <label htmlFor="start_date">Start Date:</label>
                    <input
                      type="date"
                      value={start_date}
                      className="form-control"
                      onChange={(e) => setStart_date(e.target.value)}
                    />
                  </div>

                  {/*<!-- End Date Field -->*/}
                  <div className="form-group col-sm-6">
                    <label htmlFor="end_date">End Date:</label>
                    <input
                      type="date"
                      value={end_date}
                      className="form-control"
                      onChange={(e) => setEnd_date(e.target.value)}
                    />
                  </div>

                  {/*<!-- Description Field -->*/}
                  <div className="form-group col-sm-6">
                    <label htmlFor="description">Description:</label>
                    <textarea
                      type="text"
                      value={description}
                      className="form-control"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {/*<!-- Submit Field -->*/}
                  <div className="form-group col-sm-12">
                    <button
                      onClick={createPeriod}
                      className="btn btn-primary my-3"
                    >
                      Save
                    </button>
                    <Link
                      to="/periods"
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

export default PeriodsCreate;
