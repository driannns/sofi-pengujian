import { Link, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";

const getPeriodAcademic = "....";
const ParametersEdit = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [periodAcademic, setPeriodAcademic] = useState([]);
  const [parameterId, setParameterId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/parameter/${params.id}`
        );
        console.log(data);

        const { name, value } = data.data.data;
        setName(name);
        setValue(value);

        if (params.id === "periodAcademic") {
          const response = await axios.get(getPeriodAcademic);
          const periodeData = response.data.data;
          const formattedPeriodAcademic = periodeData.map((param) => ({
            label: param.periode,
            value: param.periode,
          }));
          setPeriodAcademic(formattedPeriodAcademic);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        navigate("/parameters", {
          state: { errorMessage: "Parameter Tidak Ada" },
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
              <h3>PARAMETERS</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  PARAMETERS
                </Link>{" "}
                / UBAH PARAMETERS
              </h6>
            </div>
          </ol>
          <div className="container-fluid">
            <div className="animated fadeIn">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      {/*<!-- nama Field -->*/}
                      <div className="form-group col-sm-6">
                        <label htmlFor="name">Nama:</label>
                        <input
                          type="text"
                          value={name}
                          className="form-control"
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      {/*<!-- value Field -->*/}
                      <div className="form-group col-sm-6">
                        <label htmlFor="name">value:</label>
                        {parameterId === "periodAcademic" ? (
                          <select
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="form-control"
                          >
                            {periodAcademic.map((periode, index) => (
                              <option key={index} value={periode}>
                                {periode}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="form-control"
                          />
                        )}
                      </div>

                      {/*<!-- Submit Field -->*/}
                      <div className="form-group col-sm-12">
                        <button
                          className="btn btn-primary my-3"
                        >
                          Save
                        </button>
                        <Link
                          to="/parameters"
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

export default ParametersEdit;
