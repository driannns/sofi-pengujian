import telkomLogo from "../assets/images/telkom.png";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import { useAuth } from "../middleware/AuthContext";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ toggleSidebar, isOpen }) => {
  const { logout } = useAuth();

  const location = useLocation();
  const [cookies] = useCookies();
  const [notification, setNotification] = useState([]);
  const decodedToken = jwtDecode(cookies["auth-token"]);

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  const formatUser = async (userId) => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      const res = await axios.get(`https://sofi.my.id/api/user/${userId}`, {
        signal,
      });
      return res.data.data.username;
    } catch (error) {
      return "-";
    }
  };

  useEffect(() => {
    const fetchNotif = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/notification/user/get`,
          {
            headers: {
              Authorization: "Bearer " + cookies["auth-token"],
              "ngrok-skip-browser-warning": true,
            },
          }
        );

        const filteredNotifications = res?.data?.data?.filter(
          (notification) => notification.read_at === "0001-01-01T00:00:00Z"
        );

        if (filteredNotifications) {
          const formatNotification = await Promise.all(
            filteredNotifications?.map(async (value) => {
              const manipulatedData = await formatUser(value.createdBy);
              const formatTime = formatDate(value.created_at);
              return {
                ...value,
                createdBy: manipulatedData,
                created_at: formatTime,
              };
            })
          );
          setNotification(formatNotification);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotif();
  }, [location.pathname]);

  return (
    <header className="app-header navbar">
      <button
        className="navbar-toggler sidebar-toggler d-lg-none mr-auto"
        type="button"
        onClick={toggleSidebar}
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
        onClick={toggleSidebar}
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
            <span className="badge badge-pill badge-danger">
              {notification ? notification.length : 0}
            </span>
          </a>
          <div
            className="dropdown-menu dropdown-menu-right dropdown-menu-lg pt-0"
            style={{ height: "300px", overflowY: "scroll" }}
          >
            <div className="dropdown-header bg-light">
              <strong>You have new notification</strong>
            </div>
            {notification &&
              notification.map((data, index) => (
                <a className="dropdown-item" href={data.url} key={index}>
                  <div className="message">
                    <div className="py-3 mfe-3 float-left">
                      <div className="c-icon">
                        <i className="c-icon icon-bell"></i>
                      </div>
                    </div>
                    <div>
                      <small className="text-muted">{data.createdBy}</small>
                      <small className="text-muted float-right mt-1">
                        {data.created_at}
                      </small>
                    </div>
                    <div className="text-truncate font-weight-bold">
                      {data.title}
                    </div>
                    <div className="small text-muted text-truncate">
                      {data.message}
                    </div>
                  </div>
                </a>
              ))}
            <Link
              to="/notification"
              className="dropdown-item text-center border-top"
            >
              <strong>View all notification</strong>
            </Link>
          </div>
        </li>
        <li className="nav-item dropdown">
          <a
            className="nav-link font-weight-bold"
            style={{ marginRight: "40px", fontSize: "12px" }}
            data-toggle="dropdown"
            href="#"
            role="button"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {decodedToken.nama}
          </a>
          <div
            className="dropdown-menu dropdown-menu-right"
            style={{ marginRight: "40px" }}
          >
            <div className="dropdown-header text-center">
              <strong>Account</strong>
            </div>
            <a
              // href="{{ url('/logout') }}"
              className="dropdown-item btn btn-default btn-flat"
              onClick={handleLogout}
            >
              <i className="fa fa-lock"></i>Logout
            </a>
            <form
              id="logout-form"
              action="{{ url('/logout') }}"
              method="POST"
              style={{ display: "none" }}
            ></form>
          </div>
        </li>
      </ul>
    </header>
  );
};

export default React.memo(Navbar);
