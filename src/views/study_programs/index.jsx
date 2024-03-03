import { Link } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";

// const getstudyPrograms = "https://fakestoreapi.com/products/";
// const getstudyPrograms = "http://localhost:3000/study_programs";

const StudyPrograms = () => {
  const [studyprograms, setStudyPrograms] = useState([]);

  // pakai axios
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const resStudyPrograms = await axios.get(getstudyPrograms);
  //       setStudyPrograms(resStudyPrograms.data);
  //       console.log(resStudyPrograms.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // pakai fectch
  useEffect(function () {
    async function getstudyPrograms() {
      const request = await fetch("http://localhost:3000/study_programs");
      const response = await request.json();

      setStudyPrograms(response);
    }
    getstudyPrograms();
  }, []);

  // const handleDelete = async (id) => {
  //   try{
  //   await axios.delete(`http://localhost:3000/study_programs/${id}`);
  //   const confirm = window.confirm("Are you sure?");
  //   if (confirm) {
  //     setStudyPrograms((studyprograms) =>
  //       studyprograms.filter((studyprogram) => studyprogram.id !== id)
  //     );
  //   }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:3000/study_programs/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setStudyPrograms((prevStudyPrograms) =>
            prevStudyPrograms.filter((studyProgram) => studyProgram.id !== id)
          );
        } 
      } catch (error) {
        console.error("Gagal menghapus data:", error);
        alert("Gagal menghapus data");
      }
    }
  };
  

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
                        {studyprograms.map((studyProgram) => (
                          <tr key={studyProgram.id}>
                            <td>
                              {/*{{ $studyProgram->name }}*/}
                              {studyProgram.name}
                            </td>
                            <td>
                              {/*{!! Form::open(['route' => ['studyPrograms.destroy', $studyProgram->id], 'method' => 'delete']) !!}*/}
                              <div className="btn-group">
                                <Link
                                  // href="{{ route('studyPrograms.show', [$studyProgram->id]) }}"
                                  to={`/studyPrograms/${studyProgram.id}`}
                                  className="btn btn-ghost-success"
                                >
                                  <i className="fa fa-eye"></i>
                                </Link>
                                <Link
                                  // href="{{ route('studyPrograms.edit', [$studyProgram->id]) }}"
                                  to={`/studyPrograms/${studyProgram.id}/edit`}
                                  className="btn btn-ghost-info"
                                >
                                  <i className="fa fa-edit"></i>
                                </Link>
                                <Link
                                  // href="{{ route('studyPrograms.edit', [$studyProgram->id]) }}"
                                  className="btn btn-ghost-danger"
                                  onClick={() => handleDelete(studyProgram.id)}
                                >
                                  <i className="fa fa-trash"></i>
                                </Link>
                                {/*{!! Form::button('<i className="fa fa-trash"></i>', ['type' => 'submit', 'className' => 'btn btn-ghost-danger', 'onclick' => "return confirm('Are you sure?')"]) !!}*/}
                              </div>
                              {/*{!! Form::close() !!}*/}
                            </td>
                          </tr>
                        ))}
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
