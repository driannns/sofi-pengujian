import telkomLogo from "../assets/images/telkom.png";

const Navbar = () => {
  const handleClick = () => {
    event.preventDefault();
    document.getElementById("logout-form").submit();
  };
  return (
    <header className="app-header navbar">
      <button
        className="navbar-toggler sidebar-toggler d-lg-none mr-auto"
        type="button"
        data-toggle="sidebar-show"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <a className="navbar-brand" href="/home">
        <img
          className="navbar-brand-full"
          src={telkomLogo}
          width="30"
          height="30"
          alt="InfyOm Logo"
        />
        <img
          className="navbar-brand-minimized"
          src={telkomLogo}
          width="30"
          height="30"
          alt="InfyOm Logo"
        />
      </a>
      <button
        className="navbar-toggler sidebar-toggler d-md-down-none"
        type="button"
        data-toggle="sidebar-lg-show"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <ul className="nav navbar-nav ml-auto">
        <li className="c-header-nav-item dropdown d-md-down-none mx-2">
          <a
            className="c-header-nav-link"
            data-toggle="dropdown"
            href=""
            role="button"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i className="c-icon icon-bell"></i>
            <span className="badge badge-pill badge-danger"></span>
          </a>
          <div
            className="dropdown-menu dropdown-menu-right dropdown-menu-lg pt-0"
            style={{ height: "300px", overflowY: "scroll" }}
          >
            <div className="dropdown-header bg-light">
              <strong>You have new notification</strong>
            </div>
            <a className="dropdown-item" href="{{ $notif->data['actionURL'] }}">
              <div className="message">
                <div className="py-3 mfe-3 float-left">
                  <div className="c-icon">
                    <i className="c-icon icon-bell"></i>
                  </div>
                </div>
                <div>
                  <small className="text-muted">awda </small>
                  <small className="text-muted float-right mt-1">dd</small>
                </div>
                <div className="text-truncate font-weight-bold">ada</div>
                <div className="small text-muted text-truncate">ff</div>
              </div>
            </a>
            <a
              className="dropdown-item text-center border-top"
              href="{{ Url('notification') }}"
            >
              <strong>View all notification</strong>
            </a>
          </div>
        </li>
        <li className="nav-item dropdown">
          <a
            className="nav-link font-weight-bold"
            style={{ marginRight: "40px" }}
            data-toggle="dropdown"
            href="#"
            role="button"
            aria-haspopup="true"
            aria-expanded="false"
          >
            admin
          </a>
          <div
            className="dropdown-menu dropdown-menu-right"
            style={{ marginRight: "40px" }}
          >
            <div className="dropdown-header text-center">
              <strong>Account</strong>
            </div>
            <a
              href="{{ url('/logout') }}"
              className="dropdown-item btn btn-default btn-flat"
              onClick={handleClick}
            >
              <i className="fa fa-lock"></i>Logout
            </a>
            <form
              id="logout-form"
              action="{{ url('/logout') }}"
              method="POST"
              style={{ display: "none" }}
            >
              @csrf
            </form>
          </div>
        </li>
      </ul>
    </header>
  );
};

export default Navbar;
