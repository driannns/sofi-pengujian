import { MainLayout } from "./layouts/MainLayout";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import DatatableComponent from "../components/Datatable";

const Notification = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const [notification, setNotification] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  const formatUser = async (userId) => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      const res = await axios.get(`https://sofi.my.id/api/user/${userId}`, {
        signal,
      });
      return res.data.data.username;
    } catch (error) {
      return "-";
    }
  };

  const fetchNotif = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/notification/user/get`, {
        headers: {
          Authorization: "Bearer " + cookies["auth-token"],
          "ngrok-skip-browser-warning": true,
        },
      });

      if (res.data.data) {
        const formatNotification = await Promise.all(
          res?.data?.data?.map(async (value) => {
            const manipulatedData = await formatUser(value.createdBy);
            const formatTime = formatDate(value.created_at);
            return {
              ...value,
              createdBy: manipulatedData,
              created_at: formatTime,
            };
          })
        );
        setNotification(formatNotification);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/notification/update/${id}`);
      fetchNotif();
    } catch (error) {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      name: "Judul",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Pesan",
      cell: (row) => row.message,
      sortable: true,
    },
    {
      name: "Dibuat Oleh",
      selector: (row) => row.createdBy,
      sortable: true,
    },
    {
      name: "Dibuat pada",
      selector: (row) => row.created_at,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row.read_at === "0001-01-01T00:00:00Z"
          ? "belum dibaca"
          : "sudah dibaca",
      sortable: true,
    },
    {
      name: "Aksi",
      selector: (row) =>
        row.read_at === "0001-01-01T00:00:00Z" ? (
          <div className="btn-group">
            <button
              onClick={() => markAsRead(row.id)}
              className="btn btn-ghost-success"
            >
              Tandai sudah dibaca
            </button>
          </div>
        ) : (
          "-"
        ),
      sortable: true,
    },
  ];

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchNotif = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `/api/notification/user/get`,
          {
            headers: {
              Authorization: "Bearer " + cookies["auth-token"],
              "ngrok-skip-browser-warning": true,
            },
          },
          {
            signal,
          }
        );
        if (res.data.data) {
          const formatNotification = await Promise.all(
            res?.data?.data?.map(async (value) => {
              const manipulatedData = await formatUser(value.createdBy);
              const formatTime = formatDate(value.created_at);
              return {
                ...value,
                createdBy: manipulatedData,
                created_at: formatTime,
              };
            })
          );
          setNotification(formatNotification);
        }
      } catch (error) {
        console.error("error", error);
        if (error.message === "Network Error") {
          localStorage.setItem("errorMessage", "Network Error");
          if (isMounted.current) navigate("/home");
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotif();
  }, []);

  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <ol className="breadcrumb mb-0">
            <div className="col-12">
              <h3>NOTIFIKASI</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  BERANDA
                </Link>{" "}
                / NOTIFIKASI
              </h6>
            </div>
          </ol>

          <div className="container-fluid">
            <div className="animated fadeIn">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="table-responsive-sm">
                        <DatatableComponent
                          data={notification}
                          columns={columns}
                        />
                      </div>
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

export default Notification;
