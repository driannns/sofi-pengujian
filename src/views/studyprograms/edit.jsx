import { Link, useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";

const StudyProgramEdit = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(
          `http://localhost:3000/study_programs/${params.id}`
        );
        console.log(data.status);
        const { name } = data.data;
        setName(name);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [params]);

  const EditProgramStudy = () => {
    const data = { name };
    axios.put(`http://localhost:3000/study_programs/${params.id}`, data)
    .then(() => {
      navigate("/studyPrograms", { state: { successMessage: 'Program study updated successfully!' } });
    })
    .catch(error => {
      console.error('Failed to update program study:', error);
    });
  };

  return (
    <MainLayout>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="{!! route('studyPrograms.index') !!}">Study Program</a>
        </li>
        <li className="breadcrumb-item active">Edit</li>
      </ol>
      <div className="container-fluid">
        <div className="animated fadeIn">
          {/*@include('coreui-templates::common.errors')*/}
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <i className="fa fa-edit fa-lg"></i>
                  <strong>Edit Study Program</strong>
                </div>
                <div className="card-body">
                  {/*{!! Form::open(['route' => 'studyPrograms.store']) !!}*/}
                  {/*<!-- Name Field -->*/}
                  <div className="col-sm-6">
                    {/*{!! Form::label('name', 'Name:') !!}*/}
                    {/*{!! Form::text('name', null, ['className' => 'form-control','maxlength' => 255,'maxlength' => 255]) !!}*/}
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      value={name}
                      // placeholder={studyprograms.name}
                      className="form-control"
                      onChange={(e) => setName(e.target.value)}
                    />
                    <button
                      onClick={EditProgramStudy}
                      className="btn btn-primary my-3"
                    >
                      Save
                    </button>
                    <Link
                      //   href="{{ route('studyPrograms.index') }}"
                      to="/studyPrograms"
                      className="btn btn-secondary ml-1"
                    >
                      Cancel
                    </Link>
                  </div>

                  {/*@include('study_programs.fields')*/}

                  {/*{!! Form::close() !!}*/}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudyProgramEdit;
