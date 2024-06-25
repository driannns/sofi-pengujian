import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import DatatableComponent from "../../components/Datatable";
import { getSidangByPeriod, getAllSidang } from "../../store/sidangSlicer";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import Loading from "../../components/Loading";
import { format } from "date-fns";
import Alert from "../../components/Alert";

const IndexSKPenguji = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const period = queryParams.get("period");
  const dispatch = useDispatch();
  const [cookies] = useCookies("");
  const [periodNowId, setPeriodNowId] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(true);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss");
    return formattedDate;
  };

  const formatUser = async (userId) => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      const res = await axios.get(`https://sofi.my.id/api/user/${userId}`, {
        signal,
      });
      return res.data.data.nama;
    } catch (error) {
      return "-";
    }
  };

  const periodById = async (periodId) => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      const res = await axios.get(`/api/period/get/${periodId}`, { signal });
      return res.data.data.name;
    } catch (error) {
      console.error(error);
      return "-";
    }
  };

  const columns = [
    {
      name: "NIM",
      selector: (row) => row.nim,
      sortable: true,
      width: "fit-content",
    },
    {
      name: "Nama",
      cell: (row) => row.nama,
      sortable: true,
    },
    {
      name: "Judul TA",
      cell: (row) => row.judul,
      sortable: true,
      width: "40%",
    },
    {
      name: "Periode",
      cell: (row) => row.periodName,
      sortable: true,
    },
    {
      name: "Diajukan pada",
      selector: (row) => formatDate(row.created_at),
      sortable: true,
      width: "fit-content",
    },
    {
      name: "Aksi",
      selector: (row) => {
        return (
          <Link
            to={`/sidangs/${row.id}/storeSkForm`}
            className="btn btn-light w-100"
          >
            {row.sk_penguji ? "Reupload SK Penguji" : "Upload SK Penguji"}
          </Link>
        );
      },
      width: "180px",
    },
  ];

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`/api/period/check-period`, { signal });

        if (res.data.code === 200) {
          setPeriodNowId(res.data.data.id);
        }
        let data;
        if (period !== null) {
          data = await dispatch(
            getSidangByPeriod(cookies["auth-token"], period)
          );
        } else if (period == null) {
          data = await dispatch(getAllSidang(cookies["auth-token"]));
        } else {
          data = await dispatch(
            getSidangByPeriod(cookies["auth-token"], periodNowId)
          );
        }
        if (data.payload) {
          const dataSidangMHS = await Promise.all(
            data?.payload?.map(async (value) => {
              const manipulatedData = await formatUser(value.user_id);
              const periodName = await periodById(value.period_id);
              return {
                ...value,
                nama: manipulatedData,
                periodName: periodName,
              };
            })
          );
          setData(dataSidangMHS);
        }
      } catch (error) {
        console.error("error", error);
        if (error.reponse?.status !== 404) {
          localStorage.setItem("errorMessage", "Network Error");
          if (isMounted.current) navigate("/home");
          return;
        }
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

  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <ol className="breadcrumb mb-0">
            <div className="col-12">
              <h3>Daftar Sidang</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <a href="{{ route('home') }}" className="text-dark">
                  BERANDA
                </a>{" "}
                / Daftar Sidang
              </h6>
            </div>
          </ol>

          <div className="container-fluid">
            <div className="animated fadeIn">
              <Alert type="error" />
              <Alert type="success" />
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <div
                        className="table-responsive-sm"
                        style={{ overflowX: scroll }}
                      >
                        <DatatableComponent columns={columns} data={data} />
                      </div>
                      <div className="pull-right mr-3"></div>
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

export default IndexSKPenguji;
