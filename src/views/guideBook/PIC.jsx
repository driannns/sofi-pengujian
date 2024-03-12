import { MainLayout } from "../layouts/MainLayout";
import picGuideBook from "../../assets/documents/guide_book/pictauserguide.pdf";

export function GuidePIC() {
  return (
    <MainLayout>
      <ol class="breadcrumb mb-0">
        <div class="col-12">
          <h3>GUIDE BOOK</h3>
          <hr class="mt-0" />
          <h6 class="mb-3">
            <a href="{{ route('home') }}" class="text-dark">
              BERANDA
            </a>{" "}
            / GUIDE BOOK
          </h6>
          <a
            href={picGuideBook}
            download="guide_book_admin.pdf"
            type="button"
            class="btn btn-primary float-right"
          >
            Download
          </a>
        </div>
      </ol>
      <div class="container-fluid">
        <div class="animated fadeIn">
          {/* @include('flash::message') */}
          <div class="row">
            <div class="col-lg-12">
              <div class="card">
                <div class="card-header">
                  <div class="card-body">
                    <embed
                      type=""
                      src={picGuideBook}
                      height="500px"
                      width="100%"
                    />
                    <div class="pull-right mr-3"></div>
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
