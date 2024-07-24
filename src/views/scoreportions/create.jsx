import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";

const ScorePortionsCreate = () => {
  const [studyprograms, setStudyPrograms] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const createScorePortion = async () => {
    if (
      !period_id.trim() ||
      !study_program_id.trim() ||
      !pembimbing.trim() ||
      !penguji.trim()
    ) {
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
    await axios
      .post("${import.meta.env.VITE_API_SOFILAMA}/api/scoreportion", data)
      .then(() => {
        navigate("/scoreportions", {
          state: { successMessage: "Score Portion saved successfully." },
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
            <li className="breadcrumb-item active">Create</li>
          </ol>
          <div className="container-fluid">
            <div className="animated fadeIn">
              {errorMessage && <Alert type="danger" message={errorMessage} />}
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">
                      <i className="fa fa-plus-square-o fa-lg"></i>
                      <strong>Create Score Portion</strong>
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
                          placeholder="Ex: 50.01"
                          onChange={(e) => setPembimbing(e.target.value)}
                        />
                      </div>

                      {/*<!-- Penguji Field -->*/}
                      <div className="form-group col-sm-6">
                        <label htmlFor="penguji">Penguji:</label>
                        <input
                          type="number"
                          className="select2 form-control"
                          placeholder="Ex: 50.01"
                          onChange={(e) => setPenguji(e.target.value)}
                        />
                      </div>

                      {/*<!-- Submit Field -->*/}
                      <div className="form-group col-sm-12">
                        <button
                          className="btn btn-primary my-3"
                          onClick={createScorePortion}
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

export default ScorePortionsCreate;
