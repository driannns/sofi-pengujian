import { MainLayout } from "../layouts/MainLayout";
import Loading from "../../components/Loading";
import Alert from "../../components/Alert";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSidangById } from "../../store/sidangSlicer";
import { useCookies } from "react-cookie";

const UploadSKForm = () => {
  const dataSidang = useSelector((state) => state.sidang);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies();
  const params = useParams();
  const sidangId = params.id;
  const isMounted = useRef(true);
  const [SKPengujiFile, setSKPengujiFile] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const dataSidangAdmin = await dispatch(
          getSidangById({ authToken: cookies["auth-token"], sidangId })
        );

        if (!dataSidangAdmin.payload) {
          if (isMounted.current)
            localStorage.setItem("errorMessage", "Network Error1");
          navigate(-1);
          return;
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted.current = false;
      abortController.abort();
    };
  }, []);

  const handleSKPengujihange = (e) => {
    setSKPengujiFile(e.target.files[0]);
  };

  const stoeSKPengujiHandle = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const formData = new FormData();
      formData.append("skPenguji", SKPengujiFile);

      const res = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/pengajuan/create/sk_penguji/${sidangId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies["auth-token"]}`,
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      if (res.data.code === 201) {
        navigate("/sidangs/surat-tugas");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setSKPengujiFile(null);
    }
  };

  return (
    <MainLayout>
      {isLoading || dataSidang.loading ? (
        <Loading />
      ) : (
        <>
          <ol className="breadcrumb mb-0">
            <div className="col-12">
              <h3> PENDAFTARAN SIDANG </h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  BERANDA
                </Link>{" "}
                / PENDAFTARAN SIDANG
              </h6>
            </div>
          </ol>

          <div className="container-fluid">
            <div className="animated fadeIn">
              <Alert type="danger" />
              {location.pathname === "/sidangs/create" && (
                <div className="alert alert-warning" role="alert">
                  Setiap file yang yang diupload akan menggantikan file yang
                  sudah ada
                </div>
              )}
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <form onSubmit={stoeSKPengujiHandle}>
                        <div className="form-group col-sm-12">
                          <label htmlFor="mahasiswa_id">NIM Mahasiswa</label>
                          <input
                            id="mahasiswa_id"
                            type="number"
                            defaultValue={dataSidang?.data?.nim}
                            className="form-control"
                            disabled
                          />
                        </div>
                        <div className="form-group col-sm-12">
                          <label htmlFor="judul">Judul Tugas Akhir</label>
                          <textarea
                            id="judul"
                            defaultValue={dataSidang?.data?.judul}
                            className="form-control"
                            rows="4"
                            cols="2"
                            disabled
                          />
                        </div>
                        <div className="form-group col-sm-12">
                          <label htmlFor="sk_penguji_file">
                            Upload SK Penguji:
                          </label>
                          <input
                            id="sk_penguji_file"
                            type="file"
                            onChange={handleSKPengujihange}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group col-sm-12">
                          <input
                            type="submit"
                            value="Save"
                            className="btn btn-primary mr-1"
                          />
                          <Link
                            to="/sidangs/surat-tugas"
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
        </>
      )}
    </MainLayout>
  );
};

export default UploadSKForm;