import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Alert = ({ type, message }) => {
  const location = useLocation();
  const [alertMessage, setAlertMessage] = useState(null);

  const clearLocalStorage = () => {
    localStorage.removeItem("errorMessage");
    localStorage.removeItem("warningMessage");
    localStorage.removeItem("successMessage");
  };

  useEffect(() => {
    const messageType = `${type}Message`;
    const storedMessage = localStorage.getItem("errorMessage");
    if (storedMessage) {
      setAlertMessage(storedMessage);
    }

    return () => {
      if (storedMessage) {
        localStorage.removeItem("errorMessage");
      }
    };
  }, [location, type]);

  return message ? (
    <div className={`alert alert-${type}`} role="alert">
      {message}
    </div>
  ) : type === "danger" && localStorage.getItem("errorMessage") ? (
    <div className={`alert alert-${type}`} role="alert">
      {localStorage.getItem("errorMessage")}
    </div>
  ) : type === "warning" && localStorage.getItem("warningMessage") ? (
    <div className={`alert alert-${type}`} role="alert">
      {localStorage.getItem("warningMessage")}
    </div>
  ) : type === "success" && localStorage.getItem("successMessage") ? (
    <div className={`alert alert-${type}`} role="alert">
      {localStorage.getItem("successMessage")}
    </div>
  ) : null;
};

export default Alert;
