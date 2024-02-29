import { MainLayout } from "../layouts/MainLayout";

const SidangCreate = () => {
  return (
    <MainLayout>
      <div>
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a href="{!! route('sidangs.index') !!}">Sidang</a>
          </li>
          <li class="breadcrumb-item active">Create</li>
        </ol>

        <ol class="breadcrumb mb-0">
          <div class="col-12">
            <h3> PENDAFTARAN SIDANG </h3>
            <hr class="mt-0" />
            <h6 class="mb-3">
              <a href="{{ route('home') }}" class="text-dark">
                BERANDA
              </a>{" "}
              / PENDAFTARAN SIDANG
            </h6>
          </div>
        </ol>

        <div class="container-fluid">
          <div class="animated fadeIn">
            {/* @include('coreui-templates::common.errors')
            @if (Session::has('error')) */}
            <div class="alert alert-danger" role="alert">
              {/* {{Session::get('error')}} */}
            </div>
            {/* @endif */}
            {/* @if(Request::is('sidangs/create')) */}
            <div class="alert alert-warning" role="alert">
              Pastikan data dibawah sudah benar, terutama status approval. Jika
              ada perbedaan data, silahkan hubungi admin sebelum submit
            </div>
            @endif
            <div class="row">
              <div class="col-lg-12">
                <div class="card">
                  <div class="card-header">
                    <i class="fa fa-plus-square-o fa-lg"></i>
                    <strong>Create Sidang</strong>
                  </div>
                  <div class="card-body">
                    <form>
                      {/* <!-- credit field --> */}
                      {/* @if(Request::is('sidangs/create')) */}
                      <input
                        type="text"
                        name="credit_complete"
                        value="{{ $sks_lulus }}"
                        hidden
                      />
                      <input
                        type="text"
                        name="credit_uncomplete"
                        value="{{ $sks_belum_lulus }}"
                        hidden
                      />
                      {/* @endif */}
                      {/* <!-- Period Id Field --> */}
                      <div class="form-group col-sm-12">
                        <label for="period_id">Peiod Sidang: </label>
                        {/* {!! Form::label('period_id', 'Period Sidang:') !!} */}
                        {/* @if(!Auth::user()->isSuperadmin()) */}
                        {/* {!! Form::select('period_id', $allPeriod, null, ['class' => 'select2 form-control']) !!} */}
                        <select
                          name="period_id"
                          id="period_id"
                          className="select2 form-control"
                        >
                          <option value=""></option>
                        </select>
                        @else
                        <select
                          name="period_id"
                          id="period_id"
                          className="select2 form-control"
                          disabled
                        >
                          <option value=""></option>
                        </select>
                        {/* {!! Form::select('period_id', $allPeriod, null, ['class' => 'select2 form-control','disabled']) !!}
    {!! Form::hidden('period_id', $sidang->period_id) !!} */}
                        <input type="hidden" name="period_id" value />
                        @endif
                      </div>
                      {/* <!-- Mahasiswa Id Field --> */}
                      <div class="form-group col-sm-12">
                        <label for="mahasiswa_id">NIM Mahasiswa:</label>
                        {/* {!! Form::label('mahasiswa_id', 'NIM Mahasiswa:') !!} */}
                        <input
                          type="number"
                          value
                          className="form-control"
                          disabled
                        />
                        {/* {!! Form::number('mahasiswa_id', $userInfo->nim, ['class' => 'form-control','disabled' => 'disabled']) !!} */}
                        <input type="hidden" name="mahasiswa_id" value />
                        {/* {!! Form::hidden('mahasiswa_id', $userInfo->nim) !!} */}
                      </div>
                      {/* <!-- Pembimbing1 Id Field --> */}
                      <div class="form-group col-sm-12">
                        {/* {!! Form::label('pembimbing1_id', 'Kode Dosen Pembimbing 1:') !!} */}
                        <label htmlFor="pembinbing1_id">
                          Kode DOsen Pembimbing 1:
                        </label>
                        <select
                          class="form-control select2"
                          name="pembimbing1_id"
                        >
                          <option value="">Pilih Pembimbing 1</option>
                          {/* @foreach($lecturers as $lecturer)
        @if($sidang == null) */}
                          {/* <option value="{{ $lecturer->id }}"
          {{ $lecturer->id == old('pembimbing1_id') ? 'selected' : '' }}>
            {{ $lecturer->code }} - {{ $lecturer->user->nama }}
        </option>
        @else */}
                          {/* <option value="{{ $lecturer->id }}"
          {{ $lecturer->id == $sidang->pembimbing1_id ? 'selected' : '' }}>
            {{ $lecturer->code }} - {{ $lecturer->user->nama }}
        </option>
        @endif
      @endforeach */}
                        </select>
                      </div>
                      {/* <!-- Pembimbing2 Id Field --> */}
                      <div class="form-group col-sm-12">
                        <label htmlFor="pembimbing2_id">
                          Kode DOsen Pembimbing 2:
                        </label>
                        {/* {!! Form::label('pembimbing2_id', 'Kode Dosen Pembimbing 2:') !!} */}
                        <select
                          class="form-control select2"
                          name="pembimbing2_id"
                        >
                          <option value="">Pilih Pembimbing 2</option>
                          @foreach($lecturers as $lecturer)
                          {/* @if($sidang == null)
        <option value="{{ $lecturer->id }}"
          {{ $lecturer->id == old('pembimbing2_id') ? 'selected' : '' }}>
            {{ $lecturer->code }} - {{ $lecturer->user->nama }}
        </option>
        @else
        <option value="{{ $lecturer->id }}"
          {{ $lecturer->id == $sidang->pembimbing2_id ? 'selected' : '' }}>
            {{ $lecturer->code }} - {{ $lecturer->user->nama }}
        </option>
        @endif
      @endforeach */}
                        </select>
                      </div>
                      {/* <!-- Judul Field --> */}
                      <div class="form-group col-sm-12 col-lg-12">
                        <label htmlFor="judul">Judul Tugas Akhir:</label>
                        {/* {!! Form::label('judul', 'Judul Tugas Akhir:') !!} */}
                        <textarea
                          name="judul"
                          id="judul"
                          cols="2"
                          rows="4"
                          className="form-control"
                        ></textarea>
                        {/* {!! Form::textarea('judul', null, ['class' => 'form-control', 'rows' => 4, 'cols' => 2]) !!} */}
                      </div>
                      {/* <!-- Form Bimbingan Field --> */}
                      <div class="form-group col-sm-12">
                        <label htmlFor="form_bimbingan">
                          Jumlah Bimbingan:
                        </label>
                        {/* {!! Form::label('form_bimbingan', 'Jumlah Bimbingan:') !!} */}
                        <input
                          type="text"
                          id="form_bimbingan1"
                          value
                          className="form-control disabled"
                        />
                        <input
                          type="text"
                          id="form_bimbingan2"
                          value
                          className="form-control disabled"
                        />
                        {/* {!! Form::text('form_bimbingan1', 'Pembimbing 1: '.$bimbingan1, ['class' => 'form-control','disabled']) !!}
    {!! Form::text('form_bimbingan2', 'Pembimbing 2: '.$bimbingan2, ['class' => 'form-control','disabled']) !!} */}
                        {/* {!! Form::hidden('form_bimbingan', $bimbingan1.";".$bimbingan2) !!} */}
                        <input type="hidden" value={`form_bimbingan`} />
                      </div>
                      {/* <!-- Status Form Field -->
@if(Request::is('sidangs/create')) */}
                      <div class="form-group col-sm-12">
                        <label htmlFor="lecturer_status">
                          Status Igracias:
                        </label>
                        {/* {!! Form::label('lecturer_status', 'Status Igracias:') !!} */}
                        <input type="text" name="lecturer_status" />
                        {/* {!! Form::text('lecturer_status', ($lecturer_status == "APPROVED" ? $lecturer_status : "BELUM APPROVED"), ['class' => 'form-control','readonly']) !!} */}
                      </div>
                      {/* @endif */}
                      {/* <!-- KK Field --> */}
                      <div class="form-group col-sm-12 col-lg-12">
                        <label htmlFor="kk">Kelompok Keahlian</label>
                        {/* {!! Form::label('kk', 'Kelompok Keahlian:') !!} */}
                        <input
                          type="text"
                          name="form_bimbingan1"
                          value
                          className="form-control disabled"
                        />
                        {/* {!! Form::text('form_bimbingan1', $userInfo->kk, ['class' => 'form-control','disabled']) !!} */}
                      </div>
                      {/* <!-- peminatansns Field --> */}
                      <div class="form-group col-sm-12">
                        <label htmlFor="peminatans">Peminatan:</label>
                        {/* {!! Form::label('peminatans', 'Peminatan:') !!} */}
                        <select class="form-control select2" name="peminatan">
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
                      <div class="form-group col-sm-12">
                        <label htmlFor="eprt">EPRT:</label>
                        {/* {!! Form::label('eprt', 'EPRT:') !!} */}
                        <input
                          type="text"
                          name="eprt"
                          value
                          className="form-control disblaed"
                        />
                        {/* {!! Form::text('eprt', $userInfo->eprt, ['class' => 'form-control','disabled']) !!} */}
                        <input type="hidden" name="eprt" value />
                        {/* {!! Form::hidden('eprt', $userInfo->eprt) !!} */}
                      </div>
                      {/* <!-- Tak Field --> */}
                      <div class="form-group col-sm-12">
                        {/* {!! Form::label('tak', 'TAK:') !!}
    {!! Form::text('tak', $userInfo->tak, ['class' => 'form-control','disabled']) !!}
    {!! Form::hidden('tak', $userInfo->tak) !!} */}
                      </div>
                      {/* @if(!Auth::user()->isSuperadmin()) */}
                      {/* <!-- Dokumen Ta Field --> */}
                      <div class="form-group col-sm-12">
                        <label htmlFor="dokumen_ta">Draft Dokumen TA:</label>
                        {/* {!! Form::label('dokumen_ta', 'Draft Dokumen TA:') !!} */}
                        {/* @if($sidang)
      @if($sidang->dokumen_ta) */}
                        <p>
                          <a
                            href="/{{$dokumen_ta->file_url}}"
                            class="btn btn-primary"
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
                            class="btn btn-primary disabled"
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
                      <div class="form-group col-sm-12">
                        <label htmlFor="makalah">Jurnal:</label>
                        {/* {!! Form::label('makalah', 'Jurnal:') !!} */}
                        {/* @if($sidang)
      @if($sidang->makalah) */}
                        <p>
                          <a
                            href="/{{$makalah->file_url}}"
                            class="btn btn-primary"
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
                            class="btn btn-primary disabled"
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
                      <div class="form-group col-sm-12">
                        <label htmlFor="is_english">Bahasa:</label>
                        {/* {!! Form::label('is_english', 'Bahasa:') !!} */}
                        <select name="" id=""></select>
                        {/* {!! Form::select('is_english', $languages, null, ['class' => 'select2 form-control']) !!} */}
                      </div>
                      {/* <!-- Status Field --> */}
                      <div class="form-group col-sm-12">
                        {/* {!! Form::label('status', 'Status:') !!}
    {!! Form::select('status', $status_list, null, ['class' => 'select2 form-control']) !!} */}
                      </div>
                      {/* <!-- Komentar Field --> */}
                      <div
                        class="form-group col-sm-12"
                        id="field_komentar"
                        style={{ display: "none" }}
                      >
                        {/* {!! Form::label('komentar', 'Komentar:') !!}
    {!! Form::textarea('komentar', null, ['class' => 'form-control']) !!} */}
                      </div>
                      {/* @endif */}
                      {/* <!-- Submit Field --> */}
                      <div class="form-group col-sm-12">
                        <a href="javascript:attend2()" class="btn btn-primary">
                          Simpan
                        </a>
                        <a href="{{ route('home') }}" class="btn btn-secondary">
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
