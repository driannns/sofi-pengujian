import { MainLayout } from "../layouts/MainLayout";
import Alert from "../../components/Alert";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { getSidangByPeriod } from "../../store/sidangSlicer";
import { jwtDecode } from "jwt-decode";

const IndexSuperAdmin = () => {
  const dataSidang = useSelector((state) => state.sidang);

  const dispatch = useDispatch();

  const [cookies] = useCookies();
  const [periodAll, setPeriodAll] = useState(null);
  const [period, setPeriod] = useState("");
  const columns = [];

  const handleFilterPeriod = (e) => {
    e.preventDefault();
    dispatch(getSidangByPeriod(period));
    setPeriod("");
  };

  useEffect(() => {
    const fetchData = async () => {
      const resPeriodNow = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/period/check-period`,
        {
          headers: { Authorization: "Bearer " + cookies["auth-token"] },
        }
      );
      console.log(resPeriodNow.data);

      const resPeriodAll = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/period/get`,
        {
          headers: { Authorization: "Bearer " + cookies["auth-token"] },
        }
      );
      console.log(resPeriodAll.data);
      setPeriodAll(resPeriodAll.data.data);
      if (period) {
        dispatch(getSidangByPeriod(period));
      } else {
        dispatch(getSidangByPeriod(resPeriodNow.data.data));
      }
    };
    fetchData();
  }, []);

  return (
    <MainLayout>
      <ol className="breadcrumb mb-0">
        <div className="col-12">
          <h3>DATA SIDANG</h3>
          <hr className="mt-0" />
          <h6 className="mb-3">
            <Link to="/home" className="text-dark">
              BERANDA
            </Link>{" "}
            / DATA SIDANG
          </h6>
        </div>
      </ol>
      <div className="container-fluid">
        <div className="animated fadeIn">
          <Alert type="danger" />
          <Alert type="warning" />
          <Alert type="success" />
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleFilterPeriod()}>
                    <div className="form-group col-sm-6">
                      <label htmlFor="period">Periode</label>
                      <select
                        name="period"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="form-control','placeholder"
                      >
                        <option value="">Pilih Periode</option>
                        {periodAll?.map((value, index) => (
                          <option value={value.id} key={index}>
                            {value.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group col-sm-12">
                      <input
                        type="submit"
                        value="Filter"
                        className="btn btn-secondary"
                      />
                    </div>
                  </form>
                  <div
                    className="table-responsive-sm"
                    style="overflow-x:scroll"
                  >
                    <DataTable
                      data={dataSidang.data ? dataSidang.data : ""}
                      columns={columns}
                      fixedHeader
                      pagination
                    />
                    {/* <table className="table table-striped" id="sidangs-table">
                                    <thead>
                                        <tr>
                                            <th>NIM</th>
                                            <th>Nama</th>
                                            <th>Judul TA</th>
                                            <th>Jumlah Bimbingan</th>
                                            <th>Periode</th>
                                            <th>Status</th>
                                            <th>Diajukan pada</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    @foreach($sidangs as $sidang)
                                        <tr>
                                            <td>{{ $sidang->mahasiswa_id }}</td>
                                            <td>{{ $sidang->mahasiswa->user->nama }}</td>
                                            <td>{{ $sidang->judul }}</td>
                                            <td><?php
                                                    $dataBimbingan = explode(";", $sidang->form_bimbingan);
                                                    if(count($dataBimbingan)>1){
                                                      $bimbingan1 = $dataBimbingan[0];
                                                      $bimbingan2 = $dataBimbingan[1];
                                                    }else
                                                    {
                                                      $bimbingan1 = "tidak ada data";
                                                      $bimbingan2 = "tidak ada data";
                                                    }
                                                    echo "Pembimbing 1: ".$bimbingan1."<br>"."Pembimbing 2: ".$bimbingan2;
                                                ?>
                                            </td>
                                            <td>{{ $sidang->period->name }}</td>
                                            <td>{{ $sidang->status }}<br>
                                                <button className='btn btn-primary' data-toggle="modal" data-target="#viewStatusLog_{{$sidang->id}}">
                                                    <i className="fa fa-list" style="color:white;"></i>
                                                    Detail
                                                </button>
                                            </td>
                                            <td>{{ $sidang->created_at }}</td>
                                            <td>
                                              <a href="{{ route('sidangs.edit', [$sidang->id]) }}" className='btn btn-ghost-info'><i className="fa fa-edit"></i></a>
                                            </td>
                                        </tr>
                                        <div className="modal fade" id="viewStatusLog_{{$sidang->id}}" tabindex="-1" role="dialog" aria-labelledby="feedbackModal" aria-hidden="true">
                                            <div className="modal-dialog" role="document">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">View Status Log</h5>
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <div className="form-group">
                                                            <ol>
                                                                <li>Nama | Dibuat pada | Dibuat oleh</li>
                                                            @foreach ($sidang->statusLogs as $status)
                                                                <li>
                                                                    {{$status->name}} | {{$status->created_at}} | {{$status->user ? $status->user->username:'anonim'}}
                                                                </li>
                                                            @endforeach
                                                            </ol>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Tutup</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    @endforeach
                                    </tbody>
                                </table> */}
                  </div>
                  <div className="pull-right mr-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default IndexSuperAdmin;
