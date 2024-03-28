import { MainLayout } from "../../layouts/MainLayout";

const TeamCreate = () => {
  return (
    <MainLayout>
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
      {/* @include('flash::message') */}
      <div className="container-fluid">
        <div className="animated fadeIn">
          {/* {{-- @include('flash::message') --}} */}
          {/* @include('coreui-templates::common.errors') */}
          <div className="row">
            <div className="col-lg-4 offset-2">
              <div className="card" style="min-height: 300px">
                <div className="card-body text-center">
                  {/* {{-- {!! Form::open(['route' => 'teams.store']) !!}

                            @include('teams.fields')

                            {!! Form::close() !!}

                            <hr>

                            <!-- individu Field -->
                            <div className="form-group col-sm-12">
                                <p>Dengan menekan button dibawah, maka anda memilih untuk sidang secara individu</p>
                                <form className="" action="{{ route('teams.individu') }}" method="post">
                            @csrf
                            <button type="submit" className="btn btn-primary" name="button"
                                onclick="return confirm('apakah anda yakin?')">Sidang Individu</button>
                            </form>
                        </div> --}} */}

                  <h3>SIDANG INDIVIDU</h3>
                  <i
                    className="fa fa-user mb-4 mt-3"
                    style="font-size: 80px"
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
                          <form
                          // action="{{ route('teams.individu') }}"
                          // method="post"
                          >
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
              <div className="card" style="min-height: 300px">
                <div className="card-body text-center">
                  <h3>SIDANG KELOMPOK</h3>
                  <i
                    className="fa fa-users mb-4 mt-3"
                    style="font-size: 80px"
                  ></i>
                  <form>
                    {/* {!! Form::open(['route' => 'teams.store']) !!}
                        @include('teams.fields')
                      {!! Form::close() !!} */}
                    {/* <!-- Name Field --> */}
                    <div className="form-group">
                      <input
                        type="text"
                        id="name"
                        name="name"
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
    </MainLayout>
  );
};

export default TeamCreate;
