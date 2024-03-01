import { MainLayout } from "../layouts/MainLayout";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
const tokenSSO =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiMjFjY2Y4NTU5NzdjYWM5NzA2YjIzNjBhNGY5ODg5Mzk2NDAwN2QzYzAxN2JjNDk3MWJhMzg1YTAzYWI5MDllYWRhNWZlMmU0NzVjY2RjOTkiLCJpYXQiOjE3MDkyOTY1MjgsIm5iZiI6MTcwOTI5NjUyOCwiZXhwIjoxNzA5MzgyOTI4LCJzdWIiOiJla2t5bm92cml6YWxhbSIsInNjb3BlcyI6WyJjZWxvZS1kYXNoYm9hcmQiLCJvbGQtZG9zZW4iLCJvbGQtZG9zZW4td2FsaSIsImFkbWlzc2lvbi1hZG1pbiIsImFkbWlzc2lvbi1kYXNoYm9hcmQtdXNlcnMiLCJhdHRlbmRhbmNlLWVtcGxveWVlIiwiZGFzaGJvYXJkLXVzZXIiLCJuZXctc3NvIiwib2xkLXBlZ2F3YWkiLCJzc28tb3BlbmxpYiIsInN0YWZmX3Rlc3Rfc3BzIiwib2xkLWtlbG9tcG9rLWtlYWhsaWFuIiwiZW1wbG95ZWUtc3RydWN0dXJhbCIsIm9sZC1hZG1pbi1yZWdpc3RyYXNpLWZha3VsdGFzIl19.uIjanGOC5wqwbT6P9-oEt80N9m5SXDoQDsU-xHM5XKVh-UPP12YY4YoBMpAHuOMBMsEdCXyQo9xt8pPrabYOouqIiyzibTz1YwwnfI2IHARL8L6JHZTLifk4MCMwAHmvycj3Ua2v6xrE9cMTVefB9BJBlGNk5hyLdOUtRDm-PgmjPA65zAvC7SRZ90_fZ4g0WIEjJCFGnrpW9LesX2-od8ZPJQcftuRiI6cdNGb22GBcjvMz24HM4Y52GMWHaE6eZFkzHHk57zAK6KMo9u9OHWsRdVV5tdqnqYskJH-snNjo9cWGjHoa_ygB44R1XWGZmOxYZdgZDXAbiFfBEBE-qStXtNe_P1GG1zFU709Dopz_NW5oV9hQ0madF_bIDGpKrzuUHhohSSbrhc-dKLrjAdAb7MHTtcK4qUC5d0VSwqKcctFzt4AUTPJV54eh1c0FwB6xLQm2M75IJITsE_RgcS_4l9vJBXQgaupjXcWMbfr6FHQqV6THt9iSnGlk2REQ5_pF6b_83yq7iW3H9bZkUFxoJe2xCTkXWhXxMNW7KFse8_6aJBp6_G2e7lmLr0iz8oOEX3RGdOBF1pNzfHWS1Yw7A3fkqW8gLB9Yppc_23CfOiUbWwnj-4BszTm2V4kTJ0z-atkD904xsaXnueLMQC5GJftyeMrySgyJ3jJqxlw";
const getAllLecturerAPI =
  "https://dev-gateway.telkomuniversity.ac.id/0f5efc75bbfe9f82c255d0bca87c6d69";
const getAllStudentAPI =
  "https://dev-gateway.telkomuniversity.ac.id/bf7b719639cf0e2ef94a1cf212e00ce6/2324-2"; //2324-2
const getStatusLog =
  "https://dev-gateway.telkomuniversity.ac.id/d650182722315309a25aa5a43a033303/2324-2"; //2324-2
const testLocal = "http://127.0.0.1:8000/api";
const SidangCreate = () => {
  const [cookies] = useCookies();
  const [lecturerData, setLecturerData] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [dataStudent, setDataStudent] = useState({});
  const [pembimbing1, setPembimbing1] = useState();
  const [pembimbing2, setPembimbing2] = useState();
  const [judul, setJudul] = useState();
  const jwtDecoded = jwtDecode(cookies["auth-token"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAllLecturer = await axios.get(getAllLecturerAPI, {
          headers: {
            Authorization: `Bearer ${tokenSSO} `,
          },
        });
        setLecturerData(resAllLecturer.data.data);

        const resDataUser = await axios.get(
          `${testLocal}/student/${jwtDecoded.id}`
        );
        setUserInfo(resDataUser.data.data);

        const resStudentData = await axios.get(
          `${getAllStudentAPI}/${resDataUser.data.data.nim}`,
          {
            headers: {
              Authorization: `Bearer ${tokenSSO} `,
            },
          }
        );
        setDataStudent(resStudentData.data.data[0]);

        const resStatusLog = await axios.get(getStatusLog, {
          headers: { Authorization: `Bearer ${tokenSSO}` },
        });

        const resPeminatans = await axios.post(`${testLocal}/peminatans`, {
          kk: userInfo.kk,
        });
      } catch (e) {
        console.error("Erorr fetching data:", e);
      }
    };
    fetchData();
  }, []);

  return (
    <MainLayout>
      <div>
        <ol className="breadcrumb mb-0">
          <div className="col-12">
            <h3> PENDAFTARAN SIDANG </h3>
            <hr className="mt-0" />
            <h6 className="mb-3">
              <a href="{{ route('home') }}" className="text-dark">
                BERANDA
              </a>{" "}
              / PENDAFTARAN SIDANG
            </h6>
          </div>
        </ol>

        <div className="container-fluid">
          <div className="animated fadeIn">
            {/* @include('coreui-templates::common.errors')
            @if (Session::has('error'))
            <div className="alert alert-danger" role="alert">
              {{Session::get('error')}}
            </div>
            @endif
            {/* @if(Request::is('sidangs/create')) */}
            <div className="alert alert-warning" role="alert">
              Pastikan data dibawah sudah benar, terutama status approval. Jika
              ada perbedaan data, silahkan hubungi admin sebelum submit
            </div>
            {/* @endif */}
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <form>
                      {/* <!-- credit field --> */}
                      {/* @if(Request::is('sidangs/create')) */}
                      <input
                        type="text"
                        name="credit_complete"
                        value={dataStudent.credit_complete}
                        hidden
                      />
                      <input
                        type="text"
                        name="credit_uncomplete"
                        onChange={dataStudent.credit_uncomplete}
                        hidden
                      />
                      {/* @endif */}
                      {/* <!-- Period Id Field --> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="period_id">Peiod Sidang: </label>
                        {/* @if(!Auth::user()->isSuperadmin()) */}
                        {/* {!! Form::select('period_id', $allPeriod, null, ['class' => 'select2 form-control']) !!} */}
                        {/* <select
                          name="period_id"
                          id="period_id"
                          className="select2 form-control"
                        >
                          <option value=""></option>
                        </select> */}
                        {/* @else */}
                        <select
                          name="period_id"
                          id="period_id"
                          className="select2 form-control"
                          disabled
                        >
                          <option value=""></option>
                        </select>
                        {/* <input type="hidden" name="period_id" onChange /> */}{" "}
                        // API AFIF
                        {/* @endif */}
                      </div>
                      {/* <!-- Mahasiswa Id Field --> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="mahasiswa_id">NIM Mahasiswa:</label>
                        <input
                          type="number"
                          value={userInfo.nim}
                          className="form-control"
                          disabled
                        />
                        {/* {!! Form::number('mahasiswa_id', $userInfo->nim, ['class' => 'form-control','disabled' => 'disabled']) !!} */}
                        <input
                          type="hidden"
                          name="mahasiswa_id"
                          value={userInfo.nim}
                        />
                        {/* {!! Form::hidden('mahasiswa_id', $userInfo->nim) !!} */}
                      </div>
                      {/* <!-- Pembimbing1 Id Field --> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="pembinbing1_id">
                          Kode Dosen Pembimbing 1:
                        </label>
                        <select
                          className="form-control select2"
                          name="pembimbing1_id"
                          onChange={(e) => setPembimbing1(e.target.value)}
                        >
                          <option value="">Pilih Pembimbing 1</option>

                          {lecturerData &&
                            lecturerData.map((data, index) => (
                              <option key={index} value={data.lecturercode}>
                                {data.lecturercode} - {data.fullname}
                              </option>
                            ))}
                        </select>
                      </div>
                      {/* <!-- Pembimbing2 Id Field --> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="pembimbing2_id">
                          Kode DOsen Pembimbing 2:
                        </label>

                        <select
                          className="form-control select2"
                          name="pembimbing2_id"
                          onChange={(e) => {
                            setPembimbing2(e.target.value);
                          }}
                        >
                          <option value="">Pilih Pembimbing 2</option>
                          {lecturerData &&
                            lecturerData.map((data, index) => (
                              <option key={index} value={data.lecturercode}>
                                {data.lecturercode} - {data.fullname}
                              </option>
                            ))}
                        </select>
                      </div>
                      {/* <!-- Judul Field --> */}
                      <div className="form-group col-sm-12 col-lg-12">
                        <label htmlFor="judul">Judul Tugas Akhir:</label>
                        <textarea
                          name="judul"
                          id="judul"
                          cols="2"
                          rows="4"
                          onChange={(e) => {
                            setJudul(e.target.value);
                          }}
                          className="form-control"
                        />
                      </div>
                      {/* <!-- Form Bimbingan Field --> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="form_bimbingan">
                          Jumlah Bimbingan:
                        </label>
                        <input
                          type="text"
                          id="form_bimbingan1"
                          value={dataStudent.totalguidance_advisor1}
                          className="form-control"
                          disabled
                        />
                        <input
                          type="text"
                          id="form_bimbingan2"
                          value={dataStudent.totalguidance_advisor2}
                          className="form-control"
                          disabled
                        />
                        <input
                          type="hidden"
                          value={`${dataStudent.totalguidance_advisor1};${dataStudent.totalguidance_advisor2}`}
                        />
                      </div>
                      {/* <!-- Status Form Field -->
                      @if(Request::is('sidangs/create')) */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="lecturer_status">
                          Status Igracias:
                        </label>
                        {/* {!! Form::label('lecturer_status', 'Status Igracias:') !!} */}
                        <input type="text" name="lecturer_status" />
                        {/* {!! Form::text('lecturer_status', ($lecturer_status == "APPROVED" ? $lecturer_status : "BELUM APPROVED"), ['class' => 'form-control','readonly']) !!} */}
                      </div>
                      {/* @endif */}
                      {/* <!-- KK Field --> */}
                      <div className="form-group col-sm-12 col-lg-12">
                        <label htmlFor="kk">Kelompok Keahlian</label>
                        {/* {!! Form::label('kk', 'Kelompok Keahlian:') !!} */}
                        <input
                          type="text"
                          name="form_bimbingan1"
                          className="form-control disabled"
                        />
                        {/* {!! Form::text('form_bimbingan1', $userInfo->kk, ['class' => 'form-control','disabled']) !!} */}
                      </div>
                      {/* <!-- peminatansns Field --> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="peminatans">Peminatan:</label>
                        {/* {!! Form::label('peminatans', 'Peminatan:') !!} */}
                        <select
                          className="form-control select2"
                          name="peminatan"
                        >
                          <option value="">Pilih Peminatan</option>
                          {/* @if($peminatans != null)
      @foreach($peminatans as $peminatan)
        @if($sidang == null)
        <option value="{{ $peminatan->id }}"
          {{ $peminatan->id == old('$peminatan') ? 'selected' : '' }}>
            {{ $peminatan->nama }}
        </option>
        @else
        <option value="{{ $peminatan->id }}"
          {{ $peminatan->id == $userInfo->peminatan_id ? 'selected' : '' }}>
            {{ $peminatan->nama }}
        </option>
        @endif
      @endforeach
      @endif */}
                        </select>
                      </div>
                      {/* <!-- Eprt Field --> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="eprt">EPRT:</label>
                        {/* {!! Form::label('eprt', 'EPRT:') !!} */}
                        <input
                          type="text"
                          name="eprt"
                          className="form-control disblaed"
                        />
                        {/* {!! Form::text('eprt', $userInfo->eprt, ['class' => 'form-control','disabled']) !!} */}
                        <input type="hidden" name="eprt" />
                        {/* {!! Form::hidden('eprt', $userInfo->eprt) !!} */}
                      </div>
                      {/* <!-- Tak Field --> */}
                      <div className="form-group col-sm-12">
                        {/* {!! Form::label('tak', 'TAK:') !!}
    {!! Form::text('tak', $userInfo->tak, ['class' => 'form-control','disabled']) !!}
    {!! Form::hidden('tak', $userInfo->tak) !!} */}
                      </div>
                      {/* @if(!Auth::user()->isSuperadmin()) */}
                      {/* <!-- Dokumen Ta Field --> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="dokumen_ta">Draft Dokumen TA:</label>
                        {/* {!! Form::label('dokumen_ta', 'Draft Dokumen TA:') !!} */}
                        {/* @if($sidang)
      @if($sidang->dokumen_ta) */}
                        <p>
                          <a
                            href="/{{$dokumen_ta->file_url}}"
                            className="btn btn-primary"
                            download
                          >
                            Download
                          </a>
                        </p>
                        {/* @else */}
                        <p>
                          <a
                            href="#"
                            target="_blank"
                            className="btn btn-primary disabled"
                          >
                            Data tidak ditemukan
                          </a>
                        </p>
                        {/* @endif
    @endif */}
                        <input
                          type="file"
                          name="dokumen_ta"
                          className="form-control"
                        />
                        {/* {!! Form::file('dokumen_ta', null, ['class' => 'form-control']) !!} */}
                      </div>
                      {/* <!-- Makalah Field -/-> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="makalah">Jurnal:</label>
                        {/* {!! Form::label('makalah', 'Jurnal:') !!} */}
                        {/* @if($sidang)
      @if($sidang->makalah) */}
                        <p>
                          <a
                            href="/{{$makalah->file_url}}"
                            className="btn btn-primary"
                            download
                          >
                            Download
                          </a>
                        </p>
                        {/* @else */}
                        <p>
                          <a
                            href="#"
                            target="_blank"
                            className="btn btn-primary disabled"
                          >
                            Data tidak ditemukan
                          </a>
                        </p>
                        {/* @endif
    @endif */}
                        <input
                          type="file"
                          name="makalah"
                          className="form-control"
                        />
                        {/* {!! Form::file('makalah', null, ['class' => 'form-control']) !!} */}
                      </div>
                      @else
                      {/* <!-- Bahasa Field --> */}
                      <div className="form-group col-sm-12">
                        <label htmlFor="is_english">Bahasa:</label>
                        {/* {!! Form::label('is_english', 'Bahasa:') !!} */}
                        <select name="" id=""></select>
                        {/* {!! Form::select('is_english', $languages, null, ['class' => 'select2 form-control']) !!} */}
                      </div>
                      {/* <!-- Status Field --> */}
                      <div className="form-group col-sm-12">
                        {/* {!! Form::label('status', 'Status:') !!}
    {!! Form::select('status', $status_list, null, ['class' => 'select2 form-control']) !!} */}
                      </div>
                      {/* <!-- Komentar Field --> */}
                      <div
                        className="form-group col-sm-12"
                        id="field_komentar"
                        style={{ display: "none" }}
                      >
                        {/* {!! Form::label('komentar', 'Komentar:') !!}
    {!! Form::textarea('komentar', null, ['class' => 'form-control']) !!} */}
                      </div>
                      {/* @endif */}
                      {/* <!-- Submit Field --> */}
                      <div className="form-group col-sm-12">
                        <a
                          href="javascript:attend2()"
                          className="btn btn-primary"
                        >
                          Simpan
                        </a>
                        <a
                          href="{{ route('home') }}"
                          className="btn btn-secondary"
                        >
                          Batal
                        </a>
                      </div>
                      {/* 
@push('scripts')
<script src="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/10.16.6/sweetalert2.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/10.16.6/sweetalert2.min.css">
<script>
    function attend2(link) {
        console.log(link)
        Swal.fire({
            title: 'Pastikan semua data anda benar.',
            text: 'Apakah anda yakin akan menyimpan data?',
            icon: 'info',
            showCancelButton: true,
            cancelButtonColor: '#f86c6b',
            confirmButtonColor: '#43afd6',
            cancelButtonText: 'Batal',
            confirmButtonText: 'Simpan',
            reverseButtons: true
        }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById("frm1").submit();
        } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
        }
        });
        }
</script>

@endpush */}
                    </form>
                    {/* {!! Form::open(['route' => 'sidangs.store', 'enctype' => 'multipart/form-data','id'=>'frm1']) !!}
                                   @include('sidangs.fields')
                                {!! Form::close() !!} */}
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

export default SidangCreate;
