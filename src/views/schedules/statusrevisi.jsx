import { useEffect, useState } from "react";
import { MainLayout } from "../layouts/MainLayout";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import DataTable from "react-data-table-component";

const StatusRevisi = () => {
  const [schdules, setSchdules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resSchdules = await axios.get(
          `${import.meta.env.VITE_API_SOFILAMA}/api/schedule`
        );
        setSchdules(resSchdules.data.data);
        console.log(resSchdules.data.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const filteredItems = schdules.filter((item) => {
    const searchText = filterText.toLowerCase();
    const namaMahasiswa = item.sidang.mahasiswa.user.nama.toLowerCase();
    const nimMahasiswa = item.sidang.mahasiswa.nim.toString().toLowerCase();
    const tanggalSidang = new Date(item.date)
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toLowerCase();
    const pembimbing1 = item.sidang.pembimbing1.user.nama.toLowerCase();
    const pembimbing2 = item.sidang.pembimbing2.user.nama.toLowerCase();
    const penguji1 = item.detailpenguji1.user.nama.toLowerCase();
    const penguji2 = item.detailpenguji2.user.nama.toLowerCase();

    return (
      namaMahasiswa.includes(searchText) ||
      nimMahasiswa.includes(searchText) ||
      tanggalSidang.includes(searchText) ||
      pembimbing1.includes(searchText) ||
      pembimbing2.includes(searchText) ||
      penguji1.includes(searchText) ||
      penguji2.includes(searchText)
    );
  });

  const columnsStatusRevisi = [
    {
      name: "NIM",
      selector: (row) => row.sidang.mahasiswa.nim,
      sortable: true,
    },
    {
      name: "Nama",
      selector: (row) => row.sidang.mahasiswa.user.nama,
      sortable: true,
    },
    {
      name: "Tanggal Sidang",
      selector: (row) =>
        new Date(row.date).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      sortable: true,
    },
    {
      name: "Pembimbing",
      cell: (row) => (
        <ol>
          <li>{row.sidang.pembimbing1.user.nama}</li>
          <li>{row.sidang.pembimbing2.user.nama}</li>
        </ol>
      ),
      sortable: true,
    },
    {
      name: "Penguji",
      cell: (row) => (
        <ol>
          <li>{row.detailpenguji1.user.nama}</li>
          <li>{row.detailpenguji2.user.nama}</li>
        </ol>
      ),
      sortable: true,
    },
  ];
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#20a8d8",
        color: "white",
        fontWeight: "bold",
        borderBottom: "1px solid black",
      },
    },
  };

  return (
    <MainLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <ol className="breadcrumb mb-0">
            <div className="col-12">
              <h3>STATUS REVISI MAHASISWA</h3>
              <hr className="mt-0" />
              <h6 className="mb-3">
                <Link to="/home" className="text-dark">
                  BERANDA
                </Link>{" "}
                / STATUS REVISI MAHASISWA
              </h6>
            </div>
          </ol>
          <div className="container-fluid">
            <div className="animated fadeIn">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <div
                        className="table-responsive-sm"
                        style={{ overflowX: "scroll" }}
                      >
                        <span
                          className="search-label"
                          style={{ marginRight: "0.5rem" }}
                        >
                          Search:
                        </span>
                        <input
                          type="text"
                          aria-label="Search Input"
                          value={filterText}
                          onChange={(e) => setFilterText(e.target.value)}
                          style={{
                            width: "200px",
                            marginRight: "1rem",
                            marginBottom: "1rem",
                          }}
                        />
                        <DataTable
                          columns={columnsStatusRevisi}
                          data={filteredItems}
                          customStyles={customStyles}
                          pagination
                          highlightOnHover
                          responsive
                        />
                      </div>

                      {/*@if($userInfo->isPIC() && Request::is('schedules'))
                            @if($schedules != '[]')*/}
                      <div
                        className="modal fade"
                        id="detailSidangModal"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="feedbackModal"
                        aria-hidden="true"
                      >
                        <form action="" method="post">
                          <div className="modal-dialog" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title">Detail Sidang</h5>
                                <button
                                  type="button"
                                  className="close"
                                  data-dismiss="modal"
                                  aria-label="Close"
                                >
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div className="modal-body">
                                <div className="form-group">
                                  <embed
                                    id="detail"
                                    src=""
                                    frameBorder="0"
                                    width="100%"
                                    height="400px"
                                  />
                                </div>
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  data-dismiss="modal"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
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

export default StatusRevisi;
