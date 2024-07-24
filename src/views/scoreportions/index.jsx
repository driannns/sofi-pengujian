import { Link, useLocation, useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";
import Loading from "../../components/Loading";

const ScorePortions = () => {
  const [scoreportions, setScoreportions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resScoreportions = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/scoreportion`
        );
        setScoreportions(resScoreportions.data.data);
        console.log(resScoreportions.data.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
        navigate('/home');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (confirm) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_SOFILAMA}/api/scoreportion/${id}`
        );
        setScoreportions((scoreportions) =>
          scoreportions.filter((scoreportion) => scoreportion.id !== id)
        );
        navigate("/scoreportions", {
          state: { successMessage: "Score Portion deleted successfully." },
        });
      } catch (error) {
        console.error(error);
        navigate("/scoreportions", {
          state: { errorMessage: "Score Portion not found" },
        });
      }
    }
  };
  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">Porsi Nilai</li>
          </ol>
          <div className="container-fluid">
            <div className="animated fadeIn">
              {state && state.successMessage && (
                <Alert type="success" message={state.successMessage} />
              )}
              {state && state.errorMessage && (
                <Alert type="danger" message={state.errorMessage} />
              )}
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">
                      <i className="fa fa-align-justify"></i>
                      Porsi Nilai
                      <Link className="pull-right" to="/scoreportions/create">
                        <i className="fa fa-plus-square fa-lg"></i>
                      </Link>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive-sm">
                        <table
                          className="table table-striped"
                          id="scorePortions-table"
                        >
                          <thead>
                            <tr>
                              <th>Periode Sidang</th>
                              <th>Program Studi</th>
                              <th>Pembimbing</th>
                              <th>Penguji</th>
                              <th colSpan="3">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scoreportions.map((scoreportion) => (
                              <tr key={scoreportion.id}>
                                <td>{scoreportion.period.name}</td>
                                <td>
                                  {scoreportion.study_program
                                    ? scoreportion.study_program.name
                                    : "-"}
                                </td>
                                <td>{scoreportion.pembimbing}</td>
                                <td>{scoreportion.penguji}</td>
                                <td>
                                  <div className="btn-group">
                                    <Link
                                      className="btn btn-ghost-success"
                                      to={`/scoreportions/${scoreportion.id}`}
                                    >
                                      <i className="fa fa-eye"></i>
                                    </Link>
                                    <Link
                                      to={`/scoreportions/${scoreportion.id}/edit`}
                                      className="btn btn-ghost-info"
                                    >
                                      <i className="fa fa-edit"></i>
                                    </Link>
                                    <Link
                                      className="btn btn-ghost-danger"
                                      onClick={() =>
                                        handleDelete(scoreportion.id)
                                      }
                                    >
                                      <i className="fa fa-trash"></i>
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="pull-right mr-3"></div>
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

export default ScorePortions;
