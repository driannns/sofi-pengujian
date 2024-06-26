import { Link, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";

const ScorePortionsEdit = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [studyprograms, setStudyPrograms] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [period_id, setPeriod_id] = useState("");
  const [study_program_id, setStudy_program_id] = useState("");
  const [pembimbing, setPembimbing] = useState("");
  const [penguji, setPenguji] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const pembimbingValue = parseFloat(pembimbing);
  const pengujiValue = parseFloat(penguji);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resStudyPrograms = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/studyprogram`
        );
        setStudyPrograms(resStudyPrograms.data.data);
        console.log("Study Programs:", resStudyPrograms.data.data);

        const resPeriods = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/periods`
        );
        setPeriods(resPeriods.data.data);
        console.log("Periods:", resPeriods.data.data);

        const resScoreportion = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/scoreportion/${params.id}`
        );
        console.log(resScoreportion);
        const { period_id, study_program_id, pembimbing, penguji } =
          resScoreportion.data.data;
        setPeriod_id(period_id);
        setStudy_program_id(study_program_id);
        setPembimbing(pembimbing);
        setPenguji(penguji);
      } catch (error) {
        console.error("Failed to fetch data", error);
        navigate("/studyPrograms", {
          state: { errorMessage: "Gagal Mendapatkan Data" },
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params, navigate]);

  const EditScorePortions = () => {
    if (!period_id || !study_program_id || !pembimbing || !penguji) {
      setErrorMessage("Semua input harus diisi");
      return;
    }

    if (pembimbingValue + pengujiValue !== 100) {
      setErrorMessage("ERROR ! Porsi nilai harus 100%");
      return;
    }

    const data = {
      period_id,
      study_program_id,
      pembimbing: pembimbingValue,
      penguji: pengujiValue,
    };
    axios
      .put(
        `${import.meta.env.VITE_API_SOFILAMA}/api/scoreportion/${params.id}`,
        data
      )
      .then(() => {
        navigate("/scoreportions", {
          state: { successMessage: "Score Portion updated successfully" },
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
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/scoreportions">Score Portion</Link>
            </li>
            <li className="breadcrumb-item active">Edit</li>
          </ol>
          <div className="container-fluid">
            <div className="animated fadeIn">
              {errorMessage && <Alert type="danger" message={errorMessage} />}
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">
                      <i className="fa fa-edit fa-lg"></i>
                      <strong>Edit Score Portion</strong>
                    </div>
                    <div className="card-body">
                      <div className="form-group col-sm-6">
                        <label htmlFor="period_id">Period Sidang:</label>
                        <select
                          className="select2 form-control"
                          id="period_id"
                          value={period_id}
                          onChange={(e) => setPeriod_id(e.target.value)}
                        >
                          {periods.map((period) => (
                            <option key={period.id} value={period.id}>
                              {period.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/*<!-- Study Program Id Field -->*/}
                      <div className="form-group col-sm-6">
                        <label htmlFor="study_program_id">Program Studi:</label>
                        <select
                          className="select2 form-control"
                          id="study_program_id"
                          value={study_program_id}
                          onChange={(e) => setStudy_program_id(e.target.value)}
                        >
                          {studyprograms.map((studyprogram) => (
                            <option
                              key={studyprogram.id}
                              value={studyprogram.id}
                            >
                              {studyprogram.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/*<!-- Pembimbing Field -->*/}
                      <div className="form-group col-sm-6">
                        <label htmlFor="pembimbing">Pembimbing:</label>
                        <input
                          type="number"
                          className="select2 form-control"
                          value={pembimbing}
                          onChange={(e) => setPembimbing(e.target.value)}
                        />
                      </div>

                      {/*<!-- Penguji Field -->*/}
                      <div className="form-group col-sm-6">
                        <label htmlFor="penguji">Penguji:</label>
                        <input
                          type="number"
                          className="select2 form-control"
                          value={penguji}
                          onChange={(e) => setPenguji(e.target.value)}
                        />
                      </div>

                      {/*<!-- Submit Field -->*/}
                      <div className="form-group col-sm-12">
                        <button
                          className="btn btn-primary my-3"
                          onClick={EditScorePortions}
                        >
                          Save
                        </button>
                        <Link
                          to="/scoreportions"
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

export default ScorePortionsEdit;
