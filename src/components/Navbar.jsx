import telkomLogo from "../assets/images/telkom.png";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import { useAuth } from "../middleware/AuthContext";
import axios from "axios";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const [cookies] = useCookies();
  const [notification, setNotification] = useState([]);
  const previousNotificationRef = useRef([]);
  const decodedToken = jwtDecode(cookies["auth-token"]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLogOutOpen, setIsLogOutOpen] = useState(false);
  const notifRef = useRef(null);
  const logoutRef = useRef(null);

  const handleToggleisNotifOpen = () => {
    setIsNotifOpen(!isNotifOpen);
    setIsLogOutOpen(false);
  };

  const handleToggleisLogoutOpen = () => {
    setIsLogOutOpen(!isLogOutOpen);
    setIsNotifOpen(false);
  };

  const handleClickOutside = (event) => {
    if (
      notifRef.current &&
      !notifRef.current.contains(event.target) &&
      logoutRef.current &&
      !logoutRef.current.contains(event.target)
    ) {
      setIsNotifOpen(false);
      setIsLogOutOpen(false);
    }
  };

  useEffect(() => {
    if (isNotifOpen || isLogOutOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotifOpen, isLogOutOpen]);

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
      if (userId === "-" || userId === 0) {
        return "-";
      }
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
        const res = await axios.get(`/api/notification/user/get`, {
          headers: {
            Authorization: "Bearer " + cookies["auth-token"],
            "ngrok-skip-browser-warning": true,
          },
        });

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
          if (
            JSON.stringify(previousNotificationRef.current) !==
            JSON.stringify(formatNotification)
          ) {
            setNotification(formatNotification);
            previousNotificationRef.current = formatNotification;
          }
        }
      } catch (error) {
        // console.error(error);
      }
    };

    fetchNotif();
  }, [location.pathname, cookies["auth-token"]]);

  const notificationCount = useMemo(
    () => (notification ? notification.length : 0),
    [notification]
  );

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
        <li
          className={`c-header-nav-item dropdown d-md-down-none mx-2 ${
            isNotifOpen ? "show" : ""
          }`}
          ref={notifRef}
        >
          <div
            className="c-header-nav-link"
            data-toggle="dropdown"
            style={{ cursor: "pointer" }}
            role="button"
            aria-haspopup="true"
            aria-expanded={isNotifOpen ? "true" : "false"}
            onClick={handleToggleisNotifOpen}
          >
            <i className="c-icon icon-bell"></i>
            <span className="badge badge-pill badge-danger">
              {notificationCount}
            </span>
          </div>
          <div
            className={`dropdown-menu dropdown-menu-right dropdown-menu-lg pt-0 ${
              isNotifOpen ? "show" : ""
            }`}
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
        <li className={`nav-item dropdown ${isLogOutOpen ? "show" : ""}`}>
          <div
            className="nav-link font-weight-bold"
            style={{ marginRight: "40px", fontSize: "12px", cursor: "pointer" }}
            data-toggle="dropdown"
            role="button"
            href="#"
            aria-haspopup="true"
            ref={logoutRef}
            aria-expanded={isLogOutOpen ? "true" : "false"}
            onClick={handleToggleisLogoutOpen}
          >
            {decodedToken.nama}
          </div>
          <div
            className={`dropdown-menu dropdown-menu-right ${
              isLogOutOpen ? "show" : ""
            }`}
            style={{ marginRight: "40px" }}
          >
            <div className="dropdown-header text-center">
              <strong>Account</strong>
            </div>
            <a
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
