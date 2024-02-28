export function GuestLayout(props) {
  return (
    <div className="app flex-row align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card-group">{props.children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
