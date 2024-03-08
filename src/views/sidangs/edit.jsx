import { MainLayout } from "../layouts/MainLayout";
import { Link } from "react-router-dom";
import Fields from "./Fields";

const SidangEdit = () => {
  return (
    <MainLayout>
      <ol className="breadcrumb mb-0">
        <div className="col-12">
          <h3>SIDANG</h3>
          <hr className="mt-0" />
          <h6 className="mb-3">
            <Link to="/home" className="text-dark">
              BERANDA
            </Link>
            /
            <a href="{!! route('sidangs.index') !!}" className="text-dark">
              SIDANG
            </a>
          </h6>
        </div>
      </ol>

      <div className="container-fluid">
        <div className="animated fadeIn">
          {/* @include('coreui-templates::common.errors') @if
          (Session::has('error')) */}
          <div className="alert alert-danger" role="alert">
            {/*{{Session::get('error')}}*/}
          </div>
          {/* @endif */}
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="card">
                {/*{{-- */}{" "}
                <div className="card-header">
                  <i className="fa fa-edit fa-lg"></i>
                  <strong>Edit Data Sidang</strong>
                </div>
                <div className="card-body">
                  <form onSubmit={attend2}>
                    {/* Credit Field */}
                    {location.pathname == "/sidangs/create" && (
                      <>
                        <input
                          type="text"
                          name="credit_complete"
                          value={dataStudent && dataStudent.credit_complete}
                          hidden
                        />
                        <input
                          type="text"
                          name="credit_uncomplete"
                          onChange={
                            dataStudent && dataStudent.credit_uncomplete
                          }
                          hidden
                        />
                      </>
                    )}

                    {/* <!-- Period Id Field --> */}
                    <div className="form-group col-sm-12">
                      <label htmlFor="period_id">Peiod Sidang: </label>
                      {isLoading ? (
                        <Skeleton height={30} />
                      ) : roles &&
                        roles.find((role) => !["RLADM"].includes(role)) ? (
                        <select
                          name="period_id"
                          id="period_id"
                          className="select2 form-control"
                          onChange={(e) => setPeriodId(e.target.value)}
                          value={periodId}
                        >
                          <option value="">Pilih Periode</option>
                          {periods &&
                            Object.entries(periods).map(([key, value]) => (
                              <option value={key} key={key}>
                                {value}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <>
                          <select
                            name="period_id"
                            id="period_id"
                            className="select2 form-control"
                            value={periodId}
                            disabled
                          >
                            {/* <option value=""></option> */}
                            //? bingung ini kenapa disabled
                            {periods &&
                              Object.entries(periods).map(([key, value]) => (
                                <option value={key} key={key}>
                                  {value}
                                </option>
                              ))}
                          </select>
                          <input
                            type="hidden"
                            name="period_id"
                            value={sidang && sidang.period_id}
                          />
                          //? ini diambil dari database sidang walaupun
                          dicreate? API AFIF
                        </>
                      )}
                    </div>

                    {/* } <!-- Mahasiswa Id Field --> */}
                    <div className="form-group col-sm-12">
                      <label htmlFor="mahasiswa_id">NIM Mahasiswa:</label>
                      {isLoading ? (
                        <Skeleton height={30} />
                      ) : (
                        <input
                          type="number"
                          value={userInfo.nim}
                          className="form-control"
                          disabled
                        />
                      )}
                      <input
                        type="hidden"
                        name="mahasiswa_id"
                        value={userInfo.nim}
                      />
                    </div>

                    {/* <!-- Pembimbing1 Id Field --> */}
                    <div className="form-group col-sm-12">
                      <label htmlFor="pembinbing1_id">
                        Kode Dosen Pembimbing 1:
                      </label>
                      {isLoading ? (
                        <Skeleton height={30} />
                      ) : (
                        <select
                          className="form-control select2"
                          name="pembimbing1_id"
                          value={pembimbing1}
                          onChange={(e) => setPembimbing1(e.target.value)}
                        >
                          <option value="">Pilih Pembimbing 1</option>
                          {dataLecturer &&
                            dataLecturer.map((data, index) =>
                              sidang === null ? (
                                <option key={index} value={data.lecturercode}>
                                  {data.lecturercode} - {data.fullname}
                                </option>
                              ) : (
                                <option
                                  key={index}
                                  value={data.lecturercode}
                                  selected={
                                    sidang && data.id === sidang.peminatan_id
                                  }
                                >
                                  {data.lecturercode} - {data.fullname}
                                </option>
                                //? Ini Pake Lecturer ID kalau di SOFI LAmA
                              )
                            )}
                          //? Perkondisian jika sidang == null belum
                        </select>
                      )}
                    </div>

                    {/* <!-- Pembimbing2 Id Field --> */}
                    <div className="form-group col-sm-12">
                      <label htmlFor="pembimbing2_id">
                        Kode Dosen Pembimbing 2:
                      </label>
                      {isLoading ? (
                        <Skeleton height={30} />
                      ) : (
                        <select
                          className="form-control select2"
                          name="pembimbing2_id"
                          value={pembimbing2}
                          onChange={(e) => {
                            setPembimbing2(e.target.value);
                          }}
                        >
                          <option value="">Pilih Pembimbing 2</option>
                          {dataLecturer &&
                            dataLecturer.map((data, index) =>
                              sidang === null ? (
                                <option key={index} value={data.lecturercode}>
                                  {data.lecturercode} - {data.fullname}
                                </option>
                              ) : (
                                <option
                                  key={index}
                                  value={data.lecturercode}
                                  selected={
                                    sidang && data.id === sidang.peminatan_id
                                  }
                                >
                                  {data.lecturercode} - {data.fullname}
                                </option>
                                //? Ini Pake Lecturer ID kalau di SOFI LAmA
                              )
                            )}
                          //? Perkondisian jika sidang == null belum
                        </select>
                      )}
                    </div>

                    {/* <!-- Judul Field --> */}
                    <div className="form-group col-sm-12 col-lg-12">
                      <label htmlFor="judul">Judul Tugas Akhir:</label>
                      {isLoading ? (
                        <Skeleton height={85} />
                      ) : (
                        <textarea
                          name="judul"
                          id="judul"
                          cols="2"
                          rows="4"
                          onChange={(e) => {
                            setJudul(e.target.value);
                          }}
                          value={judul}
                          className="form-control"
                        />
                      )}
                    </div>

                    {/* <!-- Form Bimbingan Field --> */}
                    <div className="form-group col-sm-12">
                      <label htmlFor="form_bimbingan">Jumlah Bimbingan:</label>
                      {isLoading ? (
                        <Skeleton height={30} />
                      ) : (
                        <>
                          <input
                            type="text"
                            id="form_bimbingan1"
                            value={
                              dataStudent &&
                              dataStudent.totalguidance_advisor1 === null
                                ? 0
                                : dataStudent.totalguidance_advisor1
                            }
                            className="form-control"
                            disabled
                          />
                          <input
                            type="text"
                            id="form_bimbingan2"
                            value={
                              dataStudent &&
                              dataStudent.totalguidance_advisor2 === null
                                ? 0
                                : dataStudent.totalguidance_advisor2
                            }
                            className="form-control"
                            disabled
                          />
                        </>
                      )}
                      <input
                        type="hidden"
                        value={`${
                          dataStudent.totalguidance_advisor1 === null
                            ? 0
                            : dataStudent.totalguidance_advisor1
                        };${
                          dataStudent.totalguidance_advisor2 === null
                            ? 0
                            : dataStudent.totalguidance_advisor2
                        }`}
                      />
                    </div>

                    {/* <!-- Status Form Field --> */}
                    {location.pathname === "/sidangs/create" && (
                      <div className="form-group col-sm-12">
                        <label htmlFor="lecturer_status">
                          Status Igracias:
                        </label>
                        {isLoading ? (
                          <Skeleton height={30} />
                        ) : (
                          <input
                            type="text"
                            name="lecturer_status"
                            className="form-control"
                            value={
                              statusLog &&
                              statusLog.lecturerstatus == "APPROVED"
                                ? statusLog.lecturerstatus
                                : "BELUM APPROVED"
                            }
                            readOnly
                          />
                        )}
                      </div>
                    )}

                    {/* <!-- KK Field --> */}
                    <div className="form-group col-sm-12 col-lg-12">
                      <label htmlFor="kk">Kelompok Keahlian:</label>
                      {isLoading ? (
                        <Skeleton height={30} />
                      ) : (
                        <input
                          type="text"
                          name="form_bimbingan1"
                          className="form-control"
                          value={userInfo.kk}
                          disabled
                        />
                      )}
                    </div>

                    {/* <!-- peminatans Field --> */}
                    <div className="form-group col-sm-12">
                      <label htmlFor="peminatans">Peminatan:</label>
                      {isLoading ? (
                        <Skeleton height={30} />
                      ) : (
                        <select
                          className="form-control select2"
                          name="peminatan"
                          value={peminatanId}
                          onChange={(e) => setPeminatanId(e.target.value)}
                        >
                          <option value="">Pilih Peminatan</option>
                          //? perkondisian jika sidang == null dan
                          old('$peminatan') ? 'selected' : '' //?
                          {peminatans &&
                            peminatans.map((data, index) =>
                              sidang === null ? (
                                <option value={data.id} key={index}>
                                  {data.nama}
                                </option>
                              ) : (
                                <option
                                  value={data.id}
                                  key={index}
                                  selected={data.id === userInfo.peminatan_id}
                                >
                                  {data.nama}
                                </option>
                              )
                            )}
                        </select>
                      )}
                    </div>

                    {/* <!-- Eprt Field --> */}
                    <div className="form-group col-sm-12">
                      <label htmlFor="eprt">EPRT:</label>
                      {isLoading ? (
                        <Skeleton height={30} />
                      ) : (
                        <input
                          type="text"
                          name="eprt"
                          className="form-control"
                          value={userInfo.eprt}
                          disabled
                        />
                      )}
                      <input type="hidden" name="eprt" value={userInfo.eprt} />
                    </div>

                    {/* <!-- Tak Field --> */}
                    <div className="form-group col-sm-12">
                      <label htmlFor="tak">TAK:</label>
                      {isLoading ? (
                        <Skeleton height={30} />
                      ) : (
                        <input
                          type="text"
                          className="form-control"
                          name="tak"
                          value={userInfo.tak}
                          disabled
                        />
                      )}
                      <input type="hidden" name="tak" value={userInfo.tak} />
                    </div>

                    {roles &&
                    roles.find((role) => !["RLADM"].includes(role)) ? (
                      <>
                        {/* <!-- Dokumen Ta Field --> */}
                        <div className="form-group col-sm-12">
                          <label htmlFor="dokumen_ta">Draft Dokumen TA:</label>
                          {isLoading ? (
                            <>
                              <br />
                              <Skeleton height={30} width={90} />
                            </>
                          ) : sidang && sidang.dokumen_ta ? (
                            <p>
                              <a
                                href="/{{$dokumen_ta->file_url}}"
                                className="btn btn-primary"
                                download
                              >
                                Download
                              </a>
                            </p>
                          ) : (
                            <p>
                              <a
                                href="#"
                                target="_blank"
                                className="btn btn-primary disabled"
                              >
                                Data tidak ditemukan
                              </a>
                            </p>
                          )}
                          {isLoading ? (
                            <Skeleton height={30} />
                          ) : (
                            <input
                              type="file"
                              name="dokumen_ta"
                              value={docTA}
                              onChange={(e) => setDocTA(e.target.files[0])}
                              className="form-control"
                            />
                          )}
                        </div>

                        {/* <!-- Makalah Field -/-> */}
                        <div className="form-group col-sm-12">
                          <label htmlFor="makalah">Jurnal:</label>
                          {isLoading ? (
                            <>
                              <br />
                              <Skeleton height={30} width={90} />
                            </>
                          ) : sidang && sidang.makalah ? (
                            <p>
                              <a
                                href="/{{$makalah->file_url}}"
                                className="btn btn-primary"
                                download
                              >
                                Download
                              </a>
                            </p>
                          ) : (
                            <p>
                              <a
                                href="#"
                                target="_blank"
                                className="btn btn-primary disabled"
                              >
                                Data tidak ditemukan
                              </a>
                            </p>
                          )}

                          {isLoading ? (
                            <Skeleton height={30} />
                          ) : (
                            <input
                              type="file"
                              name="makalah"
                              value={makalah}
                              onChange={(e) => setMakalah(e.target.files[0])}
                              className="form-control"
                            />
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* <!-- Bahasa Field --> */}
                        <div className="form-group col-sm-12">
                          <label htmlFor="is_english">Bahasa:</label>
                          <select
                            name="is_english"
                            id="is_english"
                            className="select2 form-control"
                            value={isEnglish}
                            onChange={(e) => setIsEnglish(e.target.value)}
                          >
                            {languages.map((data, index) => (
                              <option value={data} key={index}>
                                {data}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* <!-- Status Field --> */}
                        <div className="form-group col-sm-12">
                          <label htmlFor="status">Status:</label>
                          <select
                            name="status"
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            <option value=""></option>
                            {Object.entries(statusList).map(([key, value]) => (
                              <option value={key} key={key}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* <!-- Komentar Field --> */}
                        <div
                          className="form-group col-sm-12"
                          id="field_komentar"
                          style={{ display: "none" }}
                        >
                          <label htmlFor="komentas">Komentar:</label>
                          <textarea
                            name="komentar"
                            id="komentar"
                            className="form-control"
                            value={komentar}
                            onChange={(e) => setKomentar(e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    {/* <!-- Submit Field --> */}
                    <div className="form-group col-sm-12">
                      <button className="btn btn-primary">Simpan</button>
                      <Link to="/home" className="btn btn-secondary">
                        Batal
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card">
                <div className="card-body">
                  <div
                    className="table-responsive-sm"
                    style={{ height: "100vh", overflowY: "scroll" }}
                  >
                    <table className="table table-striped" id="sidangs-table">
                      <thead>
                        <tr>
                          <td>Tanggal</td>
                          <td>Nama Event</td>
                          <td>Komentar</td>
                          <td>Oleh</td>
                        </tr>
                      </thead>
                      <tbody>
                        {/* @foreach($status_logs as $log) */}
                        <tr>
                          <td>
                            {/*{{ date('l, d F Y - d:m', strtotime($log->created_at)) }}*/}{" "}
                            tes
                          </td>
                          <td>{/*{{$log->name}}*/}tes</td>
                          <td>{/*{{$log->feedback}}*/}tes</td>
                          <td>{/*{{$log->user->username}}*/}tes</td>
                        </tr>
                        {/* @endforeach */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SidangEdit;
