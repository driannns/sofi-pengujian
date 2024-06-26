import { Axios } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


const ClosPreview = () => {
  const [clos, setClos] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resClos = await Axios.get(`${import.meta.env.VITE_API_SOFILAMA}/api/clo/${params.id}`);
        setClos(resClos.data.data);
        console.log(resClos.data.data);
      } catch (err) {
        console.log(err);
        navigate('/home');
      }
    };
    fetchData();
  }, [navigate, params]);

  return (
    <div style={{ background: "white", overflowx: "hidden" }}>
      <div className="row">
        <div className="col-md-12 text-center my-3">
          <h1>Formulir Penilaian {/*{{ ucfirst($role) }}*/}</h1>
        </div>
      </div>

      <div className="table-responsive-sm m-5">
        <table className="table table-bordered table-sm">
          <thead>
            <tr className="text-center">
              <th className="text-center">No</th>
              <th className="text-center">CLO</th>
              <th>Deskripsi CLO</th>
              <th>Unsur Penilaian / Rubrikasi</th>
              <th className="text-center">Bobot</th>
              <th colSpan="5">Interval</th>
            </tr>
          </thead>
          <tbody>
            {/*@foreach($clos as $clo)*/}
            {clos.map((clo) => (
            <tr key={clo.id}>
              <td
                rowSpan="{{ $clo->components->count()+1 }}"
                className="text-center"
              >
                {/*{{ $loop->iteration }}*/}
              </td>
              <td rowSpan="{{ $clo->components->count()+1 }}">
                {/*{{ $clo->code }}*/}
                {clo.code}
              </td>
              <td rowSpan="{{ $clo->components->count()+1 }}">
                {/*{ $clo->description }}*/}
                {clo.description}
              </td>
            </tr>              
            ))}

            {/*@foreach($clo->components as $component)
        @if($role == 'penguji')
          @if($component->penguji == 1)*/}
            <tr>
              <td>{/*{!! nl2br(e($component->unsur_penilaian)) !!}*/}</td>
              <td>{/*{{ $clo->precentage }}*/}{clos.precentage}%</td>
              {/*@foreach($component->intervals->sortBy('value') as $interval)*/}
              <td className="text-center">{/*{{ $interval->value }}*/}</td>
              {/*@endforeach*/}
            </tr>
            {/*@endif
        @else
          @if($component->pembimbing == 1)*/}
            <tr>
              <td>{/*{!! nl2br(e($component->unsur_penilaian)) !!}*/}</td>
              <td>{/*{{ $clo->precentage }}*/}%</td>
              {/*@foreach($component->intervals->sortBy('value') as $interval)*/}
              <td className="text-center">{/*{{ $interval->value }}*/}</td>
              {/*@endforeach*/}
            </tr>
            {/*@endif
        @endif
        @endforeach
        @endforeach*/}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClosPreview;
