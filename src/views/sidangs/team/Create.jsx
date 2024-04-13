import { MainLayout } from "../../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isLoadingTrue, isLoadingFalse } from "../../../store/loadingSlicer";
import Alert from "../../../components/Alert";
import Loading from "../../../components/Loading";

const TeamsCreate = () => {
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [teamName, setTeamName] = useState("");
  const isLoading = useSelector((state) => state.loading.loading);

  const handleIndividual = async (e) => {
    try {
      dispatch(isLoadingTrue());
      e.preventDefault();
      console.log(cookies["auth-token"]);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/team/create-individual`,
        {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
          },
        }
      );
      console.log(res.data);
      if (res.data.status === 200) {
        localStorage.setItem(
          "successMessage",
          "Berhasil Mengajukan Sidang Individu"
        );
        navigate("/teams");
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(isLoadingFalse());
    }
  };

  const handleTeam = async (e) => {
    try {
      dispatch(isLoadingTrue());

      e.preventDefault();
      const body = {
        name: teamName,
      };
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/team/create-team`,
        body,
        {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
          },
        }
      );
      if (res.data.code === 201) {
        localStorage.setItem("successMessage", "Berhasil Membuat Team");
        navigate("/teams");
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(isLoadingFalse());
      setTeamName("");
    }
  };

  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <ol className="breadcrumb mb-0">
            <div className="col-12">
              <h3>TIM</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <a href="{!! route('teams.index') !!}" className="text-dark">
                  TIM
                </a>{" "}
                / BUAT TIM
              </h6>
            </div>
          </ol>

          <div className="container-fluid">
            <div className="animated fadeIn">
              {/* @include('coreui-templates::common.errors') */}
              <Alert type="danger" />
              <Alert type="success" />
              <Alert type="warning" />
              <div className="row">
                <div className="col-lg-4 offset-2">
                  <div className="card" style={{ minHeight: "300px" }}>
                    <div className="card-body text-center">
                      <h3>SIDANG INDIVIDU</h3>
                      <i
                        className="fa fa-user mb-4 mt-3"
                        style={{ fontSize: "80px" }}
                      ></i>

                      <p>
                        Dengan menekan button dibawah, maka anda memilih untuk
                        sidang secara individu
                      </p>

                      <button
                        className="btn btn-primary"
                        name="button"
                        data-toggle="modal"
                        data-target="#individu"
                      >
                        Sidang Individu
                      </button>

                      {/* {{-- MODAL SIDANG INDIVIDU  --}} */}
                      <div className="modal fade" id="individu">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            {/* <!-- Modal body --> */}
                            <div className="modal-header">
                              <h4 className="modal-title">Perhatian</h4>
                              <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                              >
                                &times;
                              </button>
                            </div>
                            <div className="modal-body text-center">
                              <form onSubmit={handleIndividual}>
                                {" "}
                                //Individu
                                <h5>
                                  Apa anda yakin untuk memilih Sidang Individu?
                                </h5>
                                <br />
                                <button
                                  data-dismiss="modal"
                                  className="btn btn-secondary"
                                >
                                  Tidak
                                </button>
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                  name="button"
                                >
                                  Iya
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card" style={{ minHeight: "300px" }}>
                    <div className="card-body text-center">
                      <h3>SIDANG KELOMPOK</h3>
                      <i
                        className="fa fa-users mb-4 mt-3"
                        style={{ fontSize: "80px" }}
                      ></i>
                      <form onSubmit={handleTeam}>
                        <div className="form-group">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Masukkan Nama Kelompok"
                            className="form-control"
                          />
                        </div>
                        {/* <!-- Submit Field --> */}
                        <div className="form-group col-sm-12">
                          <button type="submit" className="btn btn-primary">
                            Simpan
                          </button>
                          <Link to="/teams" className="btn btn-secondary">
                            Batal
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default TeamsCreate;
