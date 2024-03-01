import { Link } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";

const StudyPrograms = () => {
  return (
    <MainLayout>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">Study Programs</li>
      </ol>
      <div className="container-fluid">
        <div className="animated fadeIn">
          {/*@include('flash::message')*/}
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <i className="fa fa-align-justify"></i>
                  StudyPrograms
                  <Link
                    className="pull-right"
                    // href="{{ route('studyPrograms.create') }}"
                    to="/studyPrograms/create"
                  >
                    <i className="fa fa-plus-square fa-lg"></i>
                  </Link>
                </div>
                <div className="card-body">
                  <div className="table-responsive-sm">
                    <table
                      className="table table-striped"
                      id="studyPrograms-table"
                    >
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th colSpan="3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/*@foreach($studyPrograms as $studyProgram)*/}
                        <tr>
                          <td>{/*{{ $studyProgram->name }}*/}S1 Sistem Informasi</td>
                          <td>
                            {/*{!! Form::open(['route' => ['studyPrograms.destroy', $studyProgram->id], 'method' => 'delete']) !!}*/}
                            <div className="btn-group">
                              <Link
                                // href="{{ route('studyPrograms.show', [$studyProgram->id]) }}"
                                to="/studyPrograms/show"
                                className="btn btn-ghost-success"
                              >
                                <i className="fa fa-eye"></i>
                              </Link>
                              <Link
                                // href="{{ route('studyPrograms.edit', [$studyProgram->id]) }}"
                                to="/studyPrograms/edit"
                                className="btn btn-ghost-info"
                              >
                                <i className="fa fa-edit"></i>
                              </Link>
                              <a
                                href="{{ route('studyPrograms.edit', [$studyProgram->id]) }}"
                                className="btn btn-ghost-danger"
                              >
                                <i className="fa fa-trash"></i>
                              </a>
                              {/*{!! Form::button('<i className="fa fa-trash"></i>', ['type' => 'submit', 'className' => 'btn btn-ghost-danger', 'onclick' => "return confirm('Are you sure?')"]) !!}*/}
                            </div>
                            {/*{!! Form::close() !!}*/}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/*@include('study_programs.table')*/}
                  <div className="pull-right mr-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudyPrograms;
