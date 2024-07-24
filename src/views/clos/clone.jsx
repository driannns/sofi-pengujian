import { Link, useNavigate} from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";

const ClosClone = () => {
  const [periods, setPeriods] = useState([]);
  const [studyprograms, setStudyPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resPeriods = await axios.get( `${import.meta.env.VITE_API_SOFILAMA}/api/periods`);
        setPeriods(resPeriods.data.data);
        console.log(resPeriods.data.data);

        const resStudyPrograms = await axios.get(`${import.meta.env.VITE_API_SOFILAMA}/api/studyprogram`);
        setStudyPrograms(resStudyPrograms.data.data);
        console.log(resStudyPrograms.data.data);

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
          <h3>CLOS</h3>
          <hr className="mt-0" />
          <h6 className="mb-3">
            <Link
              to="/home"
              className="text-dark"
            >
              BERANDA
            </Link>{" "}
            / CLONE CLOS
          </h6>
        </div>
      </ol>
      <div className="container-fluid">
        <div className="animated fadeIn">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <form
                  >
                    <div className="form-group col-sm-6">
                      <label>Clone dari period:</label>
                      <select
                        className="form-control select2"
                        name="period"
                        id="period"
                      >
                        <option value="">Pilih period</option>
                        {periods.map((period) => (
                          <option
                            value={period.id}
                            key={period.id}
                          >
                            {period.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group col-sm-6">
                      <select
                        className="form-control select2"
                        name="prodi"
                        id="prodi"
                      >
                        <option value="">Pilih Program Studi</option>
                        {studyprograms.map((prodi) => (
                          <option
                            value={prodi.id}
                            key={prodi.id}
                          >
                            {prodi.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group col-sm-6">
                      <label>Preview period yang akan diclone:</label>
                      <br />
                      <Link
                        id="pembimbing_preview"
                        href="#"
                        target="_blank"
                        className="btn btn-warning"
                        style={{ color: "white" }}
                      >
                        Preview Pembimbing
                      </Link>
                      <Link
                        id="penguji_preview"
                        href="#"
                        target="_blank"
                        className="btn btn-warning ml-1"
                        style={{ color: "white" }}
                      >
                        Preview Penguji
                      </Link>
                    </div>
                    <div className="form-group col-sm-6">
                      <label>Ke period:</label>
                      <select className="form-control select2" name="to_period">
                        <option value="">Pilih period</option>
                        {periods.map((period) => (
                          <option
                            value={period.id}
                            key={period.id}
                          >
                            {period.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group col-sm-6">
                      <select
                        className="form-control select2"
                        name="to_prodi"
                        id="to_prodi"
                      >
                        <option value="">Pilih Program Studi</option>
                        {studyprograms.map((prodi) => (
                          <option
                            value={prodi.id}
                            key={prodi.id}
                          >
                            {prodi.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group col-sm-6">
                      <p>
                        Dengan menekan save, maka seluruh data pada period yang
                        dituju akan terhapus dan digantikan dengan hasil clone
                      </p>
                    </div>
                    <div className="form-group col-sm-12">
                      <button
                        type="submit"
                        name="button"
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                      <Link
                        to="/cLOS"
                        className="btn btn-secondary ml-1"
                      >
                        Cancel
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
</div> )} 
    </MainLayout>
  );
};

export default ClosClone;
