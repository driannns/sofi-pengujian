import { MainLayout } from "../../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkSidang } from "../../../store/sidangSlicer";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

const APISOFI = "https://5490-180-253-71-196.ngrok-free.app/api";
const testLocal = "http://127.0.0.1:8000/api";
const Teams = () => {
  const dataSidang = useSelector((state) => state.sidang);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies();

  const [userInfo, setUserInfo] = useState({});
  const jwtDecoded = jwtDecode(cookies["auth-token"]);

  useEffect(() => {
    const fetchSidangData = async () => {
      try {
        const dataSidangStudent = await dispatch(
          checkSidang(cookies["auth-token"])
        );

        if (!dataSidangStudent.payload) {
          localStorage.setItem(
            "errorMessage",
            "Anda belum mendaftar sidang, silahkan daftar sidang terlebih dahulu"
          );
          // navigate(-1);
        }

        if (
          dataSidangStudent.payload.status === "sudah dijadwalkan" ||
          dataSidangStudent.payload.status === "tidak lulus (sudah dijadwalkan)"
        ) {
          localStorage.setItem(
            "errorMessage",
            "Jadwal sidang anda sudah diumumkan, tidak dapat membuat team lagi"
          );
          // navigate("/schedule/mahasiswa"); //?Belum dibuat
        }

        if (dataSidangStudent.payload.status === "tidak lulus") {
          localStorage.setItem(
            "errorMessage",
            "Silahkan update berkas sidang ulang dan slide!"
          );
          // navigate("/slides");
        }

        if (
          !dataSidangStudent.payload.status.includes([
            "telah disetujui admin",
            "belum dijadwalkan",
            "tidak lulus (sudah update dokumen)",
            "tidak lulus (belum dijadwalkan)",
          ])
        ) {
          localStorage.setItem(
            "errorMessage",
            "Sidang anda belum di approve dosen pembimbing dan admin"
          );
          // navigate(`/sidangs/${dataSidangStudent.payload.id}/edit`);
        }

        const resSlide = axios.get(`${APISOFI}/slide/get-latest-slide`, {
          headers: {
            "ngrok-skip-browser-warning": true,
            Authorization: `Bearer ${cookies["auth-token"]}`,
          },
        });

        if (!resSlide.data) {
          localStorage.setItem(
            "errorMessage",
            "Anda harus mengupload berkas presentasi terlebih dahulu!"
          );
          // navigate("/slides");
        }

        const resUserInfo = await axios.get(
          `${testLocal}/student/${jwtDecoded.id}`
        );
        setUserInfo(resUserInfo.data.data);
        console.log(resUserInfo.data.data.team_id !== 0);

        if (resUserInfo.data.data.team_id !== 0) {
          if (
            dataSidangStudent.payload.status ===
            "tidak lulus (sudah update dokumen)"
          ) {
            // navigate("/teams/create");
          }
        } else {
          // navigate("/teams/create");
        }

        const resTeam = await axios.get(`${APISOFI}/team/get-team`, {
          headers: {
            "ngrok-skip-browser-warning": true,
            Authorization: `Bearer ${cookies["auth-token"]}`,
          },
        });
        console.log(resTeam);
        console.log("jalan");
        const resMembers = await axios.get(
          `http://127.0.0.1:8000/api/team/get-member/3`
        );

        const resNonMembers = await axios.get(
          "http://127.0.0.1:8000/api/team/get-nonmember"
        );

        console.log(resMembers);
        console.log(resNonMembers); //?Masih bingung disini
      } catch (error) {
        if (!error.response && error.response.status === 404) {
          localStorage.setItem("errorMessage", "Network error");
          navigate(-1);
        }
        console.error(error);
      }
    };
    fetchSidangData();
  }, []);

  return (
    <MainLayout>
      <>
        <ol className="breadcrumb mb-0">
          <div className="col-12">
            <h3>TIM</h3>
            <hr className="mt-0" />
            <h6 className="mb-3">
              <Link to="/home" className="text-dark">
                BERANDA
              </Link>{" "}
              / TIM
            </h6>
          </div>
        </ol>

        <div className="container-fluid">
          <div className="animated fadeIn">
            {/* @include('flash::message')
             @include('coreui-templates::common.errors') */}

            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header">
                    <i className="fa fa-align-justify"></i>
                    <span className="font-weight-bold">
                      {/* {{ strtoupper($team->name) }} */}
                    </span>
                    {/* @if(!$isIndividu && !$isSudahDijadwalkan)
                        <button className="pull-right btn btn-primary btn-sm" data-toggle="modal"
                            data-target="#modaltambah">TAMBAH ANGGOTA</button>
                        <button className="pull-right mr-2 btn btn-primary btn-sm" data-toggle="modal"
                            data-target="#modalubah">UBAH NAMA TIM</button>
                        @endif */}
                  </div>
                  <div className="card-body">
                    {/* @include('teams.table') */}
                    <div className="pull-right mr-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 
{{-- MODAL TAMBAH --}} */}
        <div className="modal fade" id="modaltambah">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              {/* <!-- Modal Header --> */}
              <div className="modal-header">
                <h4 className="modal-title">Tambah Anggota Tim</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <form className="" action="/store-member" method="post">
                @csrf
                {/* <!-- Modal body --> */}
                <div className="modal-body">
                  {/* <!-- Name Field --> */}
                  <div className="form-group col-8">
                    {/* {!! Form::label('nim', 'NIM Anggota Tim:') !!} */}
                    <label htmlFor="nim">NIM Anggota Tim:</label>
                    <select className="form-control select2" name="nim">
                      <option value="" readOnly>
                        -- Silahkan pilih nama anggota --
                      </option>
                      {/* @foreach($students as $student) */}
                      <option value="{{ $student->nim }}">
                        {/* {{ $student->nim }} - {{ $student->user->nama }} */}
                      </option>
                      {/* @endforeach */}
                    </select>
                  </div>
                </div>
                {/* <!-- Modal footer --> */}
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Tambah
                  </button>
                  <button data-dismiss="modal" className="btn btn-secondary">
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* {{-- MODAL UBAH TIM  --}} */}
        <div className="modal fade" id="modalubah">
          <div className="modal-dialog">
            <div className="modal-content">
              {/* <!-- Modal Header --> */}
              <div className="modal-header">
                <h4 className="modal-title">Ubah Nama Tim</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              {/* {!! Form::model($team, ['route' => ['teams.update', $team->id], 'method' => 'patch']) !!} */}
              <form>
                {/* <!-- Modal body --> */}
                <div className="modal-body">
                  {/* <!-- Name Field --> */}
                  <div className="form-group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      placeholder="Masukkan Nama Kelompok"
                    />
                  </div>
                </div>

                {/* <!-- Modal footer --> */}
                <div className="modal-footer">
                  {/* {!! Form::submit('Simpan', ['class' => 'btn btn-primary']) !!} */}
                  <button type="submit" className="btn btn-primary">
                    Simpan
                  </button>
                  <button data-dismiss="modal" className="btn btn-secondary">
                    Batal
                  </button>
                </div>
              </form>
              {/* {!! Form::close() !!} */}
            </div>
          </div>
        </div>
      </>
    </MainLayout>
  );
};

export default Teams;
