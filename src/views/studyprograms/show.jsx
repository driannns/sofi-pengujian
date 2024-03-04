import { Link, useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";
const StudyProgramShow = () => {
  const params = useParams();
  const [studyprograms, setStudyPrograms] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(
          `http://localhost:3000/study_programs/${params.id}`
        );
        console.log(data.status);
        setStudyPrograms(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [params]);

  return (
    <MainLayout>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/studyPrograms">Study Program</Link>
        </li>
        <li className="breadcrumb-item active">Detail</li>
      </ol>
      <div className="container-fluid">
        <div className="animated fadeIn">
          {/*@include('coreui-templates::common.errors')*/}
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <strong>Details</strong>
                  <Link
                    // href="{{ route('studyPrograms.index') }}"
                    to="/studyPrograms"
                    className="btn btn-light"
                  >
                    Back
                  </Link>
                </div>
                <div className="card-body">
                  {/*<!-- Name Field -->*/}
                    <div className="form-group">
                      {/*{!! Form::label('name', 'Name:') !!}*/}
                      <form>
                        <label htmlFor="name">Name:</label>
                      </form>
                      <p>
                        {/*{{ $studyProgram->name }}*/}
                        {studyprograms.name}
                      </p>
                    </div>
                  {/*@include('study_programs.show_fields')*/}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudyProgramShow;
