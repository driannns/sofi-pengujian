import { MainLayout } from "../layouts/MainLayout";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Teams = () => {
  useEffect(() => {}, []);

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
