export function GuestLayout(props) {
  return (
    <div className="app flex-row align-items-center">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="card-group">{props.children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
