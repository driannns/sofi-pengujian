import { Link, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";

const PeriodsEdit = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [inputEmpty, setInputEmpty] = useState("");
  const [name, setName] = useState("");
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${import.meta.env.VITE_API_PERIOD }/api/period/get/${params.id}`
        );
        console.log(data.status);
        const { name, start_date, end_date, description } = data.data.data;
        setName(name);
        setStart_date(start_date);
        setEnd_date(end_date);
        setDescription(description);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params]);

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
  
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
  
    return `${year}-${month}-${day}`; 
  };
  

  const EditPeriods = () => {
    if (
      !name.trim() ||
      !start_date.trim() ||
      !end_date.trim() ||
      !description.trim()
    ) {
      setInputEmpty("Inputan Kosong");
      return;
    }
    const data = { name, start_date, end_date, description };
    axios
      .put(
        `${import.meta.env.VITE_API_PERIOD }/api/period/update/${params.id}`,
        data
      )
      .then(() => {
        navigate("/periods", {
          state: { successMessage: "Periode Berhasil DIupdate." },
        });
      })
      .catch((error) => {
        console.error("Periode Gagal DIupdate.", error);
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
              <h3>PERIODE</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/periods" className="text-dark">
                  PERIODE
                </Link>{" "}
                / UBAH PERIODE
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
                          value={formatDateTime(start_date)}
                          className="form-control"
                          onChange={(e) => setStart_date(e.target.value)}
                        />
                      </div>

                      {/*<!-- End Date Field -->*/}
                      <div className="form-group col-sm-6">
                        <label htmlFor="end_date">End Date:</label>
                        <input
                          type="date"
                          value={formatDateTime(end_date)}
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
                          onClick={EditPeriods}
                          className="btn btn-primary my-3"
                        >
                          Save
                        </button>
                        <Link to="/periods" className="btn btn-secondary ml-1">
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

export default PeriodsEdit;
