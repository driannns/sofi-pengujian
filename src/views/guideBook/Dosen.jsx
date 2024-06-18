import { MainLayout } from "../layouts/MainLayout";
import dosenGuideBook from "../../assets/documents/guide_book/pengujipembimbingguide.pdf";
import { Link } from "react-router-dom";

export function GuideDosen() {
  return (
    <MainLayout>
      <ol className="breadcrumb mb-0">
        <div className="col-12">
          <h3>GUIDE BOOK</h3>
          <hr className="mt-0" />
          <h6 className="mb-3">
            <Link to="home" className="text-dark">
              BERANDA
            </Link>{" "}
            / GUIDE BOOK
          </h6>
          <a
            href={dosenGuideBook}
            download="guide_book_admin.pdf"
            type="button"
            className="btn btn-primary float-right"
          >
            Download
          </a>
        </div>
      </ol>
      <div className="container-fluid">
        <div className="animated fadeIn">
          {/* @include('flash::message') */}
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <div className="card-body">
                    <embed
                      type=""
                      src={dosenGuideBook}
                      height="500px"
                      width="100%"
                    />
                    <div className="pull-right mr-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
