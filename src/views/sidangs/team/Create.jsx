import { MainLayout } from "../../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Alert from "../../../components/Alert";
import Loading from "../../../components/Loading";
import ModalComponent from "../../../components/Modal";

const TeamsCreate = () => {
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [individuModal, setIndividuModal] = useState(false);

  const handleIndividual = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/team/create/individual`,
        {},
        {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      if (res.data.code === 201) {
        localStorage.setItem(
          "successMessage",
          "Berhasil Mengajukan Sidang Individu"
        );
        navigate("/teams");
      }
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIndividuModal(false);
    }
  };

  const handleTeam = async (e) => {
    try {
      setIsLoading(true);

      e.preventDefault();
      const body = {
        name: teamName,
      };
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/team/create/team`,
        body,
        {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      if (res.data.code === 201) {
        localStorage.setItem("successMessage", "Berhasil Membuat Team");
        navigate("/teams");
        return;
      }
    } catch (error) {
      setIsLoading(false);
    } finally {
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
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setIndividuModal(true)}
                      >
                        Sidang Individu
                      </button>

                      {/* {{-- MODAL SIDANG INDIVIDU  --}} */}
                      <ModalComponent
                        show={individuModal}
                        onHide={() => setIndividuModal(false)}
                      >
                        <div className="modal-dialog" style={{ margin: 0 }}>
                          <div className="modal-content">
                            {/* <!-- Modal body --> */}
                            <div className="modal-header">
                              <h4 className="modal-title">Perhatian</h4>
                              <button
                                onClick={() => setIndividuModal(false)}
                                type="button"
                                className="close"
                                data-dismiss="modal"
                              >
                                &times;
                              </button>
                            </div>
                            <div className="modal-body text-center">
                              <form onSubmit={handleIndividual}>
                                <h5>
                                  Apa anda yakin untuk memilih Sidang Individu?
                                </h5>
                                <br />
                                <button
                                  type="button"
                                  onClick={() => setIndividuModal(false)}
                                  className="btn btn-secondary mr-1"
                                >
                                  Tidak
                                </button>
                                <button
                                  type="submit"
                                  className="btn btn-primary ml-1"
                                  name="button"
                                >
                                  Iya
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </ModalComponent>
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
                          <button
                            type="submit"
                            className="btn btn-primary mr-1"
                          >
                            Simpan
                          </button>
                          <Link to="/teams" className="btn btn-secondary ml-1">
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
