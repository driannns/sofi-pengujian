import { Link } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";

const StudyProgramCreate = () => {
  return (
    <MainLayout>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="{!! route('studyPrograms.index') !!}">Study Program</a>
        </li>
        <li className="breadcrumb-item active">Create</li>
      </ol>
      <div className="container-fluid">
        <div className="animated fadeIn">
          {/*@include('coreui-templates::common.errors')*/}
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <i className="fa fa-plus-square-o fa-lg"></i>
                  <strong>Create Study Program</strong>
                </div>
                <div className="card-body">
                  {/*{!! Form::open(['route' => 'studyPrograms.store']) !!}*/}
                  {/*<!-- Name Field -->*/}
                  <div className="form-group col-sm-6">
                    {/*{!! Form::label('name', 'Name:') !!}*/}
                    {/*{!! Form::text('name', null, ['className' => 'form-control','maxlength' => 255,'maxlength' => 255]) !!}*/}
                    <form>
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" className="form-control"/>
                    </form>
                  </div>

                  {/*<!-- Submit Field -->*/}
                  <div className="form-group col-sm-12">
                    {/*{!! Form::submit('Save', ['className' => 'btn btn-primary']) !!}*/}
                    <Link
                      className="btn btn-primary"
                    >
                    Save
                    </Link>
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

export default StudyProgramCreate;
