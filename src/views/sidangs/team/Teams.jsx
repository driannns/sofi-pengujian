import { MainLayout } from "../../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkSidang } from "../../../store/sidangSlicer";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

const Teams = () => {
  const { data: dataSidang } = useSelector((state) => state.sidang);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies();

  const [userInfo, setUserInfo] = useState({});
  const jwtDecoded = jwtDecode(cookies["auth-token"]);

  useEffect(() => {
    const fetchSidangData = async () => {
      try {
        await dispatch(checkSidang(cookies["auth-token"]));
        if (!dataSidang.data) {
          localStorage.setItem(
            "errorMessage",
            "Anda belum mendaftar sidang, silahkan daftar sidang terlebih dahulu"
          );
        }

        if (
          dataSidang.data.status === "sudah dijadwalkan" ||
          dataSidang.data.status === "tidak lulus (sudah dijadwalkan)"
        ) {
          localStorage.setItem(
            "errorMessage",
            "Jadwal sidang anda sudah diumumkan, tidak dapat membuat team lagi"
          );
          navigate("/schedule/mahasiswa");
        }

        if (dataSidang.data.status === "tidak lulus") {
          localStorage.setItem(
            "errorMessage",
            "Silahkan update berkas sidang ulang dan slide!"
          );
          navigate("/slides");
        }

        if (
          !dataSidang.data.status.includes([
            "telah disetujui admin",
            "belum dijadwalkan",
            "tidak lulus (sudah update dokumen)",
            "tidak lulus (belum dijadwalkan)",
          ])
        ) {
          localStorage.setItem(
            "Sidang anda belum di approve dosen pembimbing dan admin"
          );
          navigate(`/sidangs/edit/${dataSidang.data.id}`);
        }

        const resSlide = axios.get(
          "{{sofi_golang}}/api/slide/get-latest-slide",
          {
            headers: {
              "ngrok-skip-browser-warning": true,
              Authorization: `Bearer ${cookies["auth-token"]}`,
            },
          }
        );
        console.log(resSlide.data);

        if (!resSlide.data) {
          localStorage.setItem(
            "errorMessage",
            "Anda harus mengupload berkas presentasi terlebih dahulu!"
          );
          navigate("/slides");
        }

        const resUserInfo = await axios.get(
          `${testLocal}/student/${jwtDecoded.id}`
        );
        setUserInfo(resUserInfo.data.data);

        if (userInfo.team_id !== 0) {
          if (dataSidang.data.status === "tidak lulus (sudah update dokumen)") {
            navigate("/teams/create");
          }
        } else {
          navigate("/teams/create");
        }

        const resTeam = axios.get("{{sofi_golang}}/api/team/get-team", {
          headers: {
            "ngrok-skip-browser-warning": true,
            Authorization: `Bearer ${cookies["auth-token"]}`,
          },
        });
        console.log(resTeam);

        const resMembers = axios.get(
          `http://127.0.0.1:8000/api/team/get-member/${userInfo.team_id}`
        );

        const resNonMembers = axios.get(
          `http://127.0.0.1:8000/api/team/get-nonmember`
        );

        console.log(resMembers);
        console.log(resNonMembers);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSidangData();
  }, []);

  useEffect(() => {}, [dataSidang]);

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
              {/* {{-- @if(!$isIndividu && !$isSudahDijadwalkan)
              <a className="ml-2" href="{{ url('/teams/'.$team->id.'/edit') }}">
                <i className="fa fa-edit fa-lg"></i>
              </a>
              <a className="ml-2" href="{{ url('/create-member') }}">
                <i className="fa fa-plus-square fa-lg"></i>
              </a>
              @endif --}} */}
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
                    <select className="form-control select2" name="nim">
                      <option value="" readonly>
                        {" "}
                        -- Silahkan pilih nama anggota --{" "}
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
                  {/* {!! Form::submit('Tambah', ['class' => 'btn btn-primary']) !!} */}
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
              {/* <!-- Modal body --> */}
              <div className="modal-body">
                {/* <!-- Name Field --> */}
                <div className="form-group">
                  {/* {!! Form::text('name', null, ['class' => 'form-control', 'placeholder' => 'Masukan Nama Kelompok']) */}
                  {/* !!} */}
                </div>
              </div>

              {/* <!-- Modal footer --> */}
              <div className="modal-footer">
                {/* {!! Form::submit('Simpan', ['class' => 'btn btn-primary']) !!} */}
                <button data-dismiss="modal" className="btn btn-secondary">
                  Batal
                </button>
              </div>
              {/* {!! Form::close() !!} */}
            </div>
          </div>
        </div>
      </>
    </MainLayout>
  );
};

export default Teams;
