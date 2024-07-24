const TabelBermasalah = () => {
  return (
    <div>
      <div className="table-responsive-sm" 
      style={{ overflowx: "scroll" }}>
        <table className="table table-striped" id="schedules-table">
          <thead>
            <tr>
              <th>NIM</th>
              <th>Nama</th>
              <th>Waktu</th>
              <th>Penguji & Pembimbing</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {/*@foreach($schedules as $schedule)*/}
            <tr>
              <td>{/*{{ $schedule->sidang->mahasiswa->nim }}*/}</td>
              <td>{/*{{ $schedule->sidang->mahasiswa->user->nama }}*/}</td>
              <td>
                {/*{{ date('d M y', strtotime($schedule->date)) }} {{ date('H:i',strtotime($schedule->time)) }}*/}
              </td>
              <td>
                {" "}
                Penguji 1 {/*{{ $schedule->detailpenguji1->user->nama }}*/}{" "}
                <br />
                Penguji 2 {/*{{ $schedule->detailpenguji2->user->nama }}*/}
                <br />
                Pembimbing 1{" "}
                {/*{{ $schedule->sidang->pembimbing1->user->nama }}*/}
                <br />
                Pembimbing 2{" "}
                {/*{{ $schedule->sidang->pembimbing2->user->nama }}*/}
              </td>
              <td>
                {/*@if (count( $schedule->masalah() ) == 0)
                            {{ 'tidak ada masalah' }}
                            @else*/}
                <ul>
                  {/*@foreach( $schedule->masalah() as $masalah )
                                <li>{{ $masalah }} </li>
                            @endforeach*/}
                </ul>
                {/*@endif*/}
              </td>
            </tr>
            {/*@endforeach*/}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelBermasalah