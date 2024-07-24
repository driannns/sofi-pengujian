import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import Alert from "../../components/Alert";

const ClosCreate = () => {
  const [periods, setPeriods] = useState([]);
  const [studyprograms, setStudyPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [intervals, setIntervals] = useState([]);
  const [cLO, setCLO] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resPeriods = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/periods`
        );
        setPeriods(resPeriods.data.data);
        console.log(resPeriods.data.data);

        const resStudyPrograms = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/studyprogram`
        );
        setStudyPrograms(resStudyPrograms.data.data);
        console.log(resStudyPrograms.data.data);
      } catch (err) {
        console.log(err);
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const addInterval = () => {
    const newInterval = {
      id: intervals.length + 1,
      value: "",
      scale: "",
    };
    setIntervals([...intervals, newInterval]);
  };

  const deleteInterval = (id) => {
    setIntervals(intervals.filter(interval => interval.id !== id));
  };

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
                <Link to="/home" className="text-dark">
                  CLOS
                </Link>{" "}
                / TAMBAH CLOS
              </h6>
            </div>
          </ol>
          <div className="container-fluid">
            <div className="animated fadeIn">
              <Alert type="danger" />
              <Alert type="success" />
              <div className="row">
                <div className="col-sm-6">
                  <div className="card">
                    <div className="card-header">
                      <i className="fa fa-plus-square-o fa-lg"></i>
                      <strong>Create C L O</strong>
                    </div>
                    <div className="card-body">
                      <div className="form-group col-sm-12">
                        <label>Program Studi:</label>
                        <select
                          className="form-control"
                          id="study_program_id"
                          onChange={(e) => setStudyPrograms(e.target.value)}
                        >
                          {studyprograms.map((studyprogram) => (
                            <option
                              value={studyprogram.id}
                              key={studyprogram.id}
                            >
                              {studyprogram.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group col-sm-12">
                        <label>Period Sidang:</label>
                        <select
                          className="form-control"
                          id="period_id"
                        >
                          {periods.map((period) => (
                            <option value={period.id} key={period.id}>
                              {period.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group col-sm-12">
                        <label>Code / Nama CLO:</label>
                        <input
                          className="form-control"
                          type="text"
                          id="code"
                          name="code"
                          placeholder="Ex: CLO1"
                        />
                      </div>

                      {/*<!-- Precentage Field -->*/}
                      <div className="form-group col-sm-12">
                        <label>Precentage (%):</label>
                        <input
                          className="form-control"
                          type="number"
                          name="precentage"
                          placeholder="EX: 50"
                        />
                      </div>

                      {/*<!-- Description Field -->*/}
                      <div className="form-group col-sm-12">
                        <label>Description:</label>
                        <textarea
                          className="form-control"
                          type="text"
                          name="description"
                          placeholder="Ex: Mampu menemukan GAP antara kebutuhan/permasalahan dengan kondisi eksisting organisasi/per businesses"
                        />
                      </div>

                      {/*<!-- rubrikasi Field -->*/}
                      <div className="form-group col-sm-12">
                        <label>Rubrikasi:</label>
                        <textarea
                          id="rubrikasi"
                          className="form-control"
                          name="rubrikasi"
                          placeholder="Ex:
                      1. GAP antara kebutuhan/permasalahan dengan kondisi eksisting tidak terdefinisikan dengan baik
                      2. GAP antara kebutuhan/permasalahan dengan kondisi eksisting terdefinisikan dengan baik"
                        ></textarea>
                      </div>

                      {/*<!-- Pembimbing and penguji Field -->*/}
                      <div className="form-group col-sm-12">
                        {cLO === null ? (
                          <div>
                            <label className="checkbox-inline pr-2">
                              Pembimbing:
                              <input type="checkbox" name="pembimbing" />
                            </label>
                            <label className="checkbox-inline">
                              Penguji:
                              <input type="checkbox" name="penguji" />
                            </label>
                          </div>
                        ) : (
                          <div>
                            <label className="checkbox-inline pr-2">
                              Pembimbing:
                              <input
                                type="checkbox"
                                name="pembimbing"
                                defaultChecked={
                                  cLO.components &&
                                  cLO.components[0] &&
                                  cLO.components[0].pembimbing
                                }
                              />
                            </label>
                            <label className="checkbox-inline">
                              Penguji:
                              <input
                                type="checkbox"
                                name="penguji"
                                defaultChecked={
                                  cLO.components &&
                                  cLO.components[0] &&
                                  cLO.components[0].penguji
                                }
                              />
                            </label>
                          </div>
                        )}
                      </div>

                      {/*<!-- Submit Field -->*/}
                      <div className="form-group col-sm-12">
                        <button className="btn btn-primary">save</button>
                        <Link to="/cLOS" className="btn btn-secondary ml-1">
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card">
                    <div className="card-header">
                      <i className="fa fa-plus-square-o fa-lg"></i>
                      <strong> Setting Interval</strong>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="form-group col-sm-8">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={addInterval}
                          >
                            Tambah Interval
                          </button>
                        </div>
                      </div>
                      <table className="table table-responsive-lg table-bordered">
                        <thead>
                          <tr>
                            <th>Interval</th>
                            <th>Ekuivalensi (Skala 100)</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {intervals.map((interval) => (
                            <tr key={interval.id}>
                              <td>
                                <div className="form-group col-sm-12">
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={interval.value}
                                    placeholder="Ex: 1"
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="form-group col-sm-12">
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={interval.scale}
                                    placeholder="Ex: 20.01"
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="form-group col-sm-12">
                                  <button
                                    type="button"
                                    className="btn btn-danger w-100"
                                    onClick={() => deleteInterval(interval.id)}
                                  >
                                    Hapus Baris
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

export default ClosCreate;
