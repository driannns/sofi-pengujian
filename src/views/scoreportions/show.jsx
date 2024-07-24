import { Link, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";

const ScorePortionsShow = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [period_id, setPeriod_id] = useState("");
  const [study_program_id, setStudy_program_id] = useState("");
  const [pembimbing, setPembimbing] = useState("");
  const [penguji, setPenguji] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/scoreportion/${params.id}`
        );
        console.log(data);
        const { period_id, study_program_id, pembimbing, penguji } =
          data.data.data;
        setPeriod_id(period_id);
        setStudy_program_id(study_program_id);
        setPembimbing(pembimbing);
        setPenguji(penguji);
      } catch (error) {
        console.error("Failed to fetch study program", error);
        navigate("/scoreportions", {
          state: { errorMessage: "Score Portion not found" },
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
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/scoreportions">Score Portion</Link>
            </li>
            <li className="breadcrumb-item active">Detail</li>
          </ol>
          <div className="container-fluid">
            <div className="animated fadeIn">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">
                      <strong>Details</strong>
                      <Link to="/scoreportions" className="btn btn-light">
                        Back
                      </Link>
                    </div>
                    <div className="card-body">
                      {/*<!-- Period Id Field -->*/}
                      <div className="form-group">
                        <label htmlFor="period_id">Period Id:</label>
                        <p>{period_id}</p>
                      </div>

                      {/*<!-- Study Program Id Field -->*/}
                      <div className="form-group">
                        <label htmlFor="study_program_id">
                          Study Program Id:
                        </label>
                        <p>{study_program_id}</p>
                      </div>

                      {/*<!-- Pembimbing Field -->*/}
                      <div className="form-group">
                        <label htmlFor="pembimbing">Pembimbing:</label>
                        <p>{pembimbing}</p>
                      </div>

                      {/* <!-- Penguji Field -->*/}
                      <div className="form-group">
                        <label htmlFor="penguji">Penguji:</label>
                        <p>{penguji}</p>
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

export default ScorePortionsShow;
