import { useState, useEffect } from "react";

const Alert = ({ type, message }) => {
  const [error, setError] = useState(null);

  const clearLocalStorage = () => {
    localStorage.removeItem("errorMessage");
    localStorage.removeItem("warningMessage");
    localStorage.removeItem("successMessage");
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (error) {
        localStorage.setItem("errorMessage", error);
        localStorage.setItem("warningMessage", error);
        localStorage.setItem("successMessage", error);
      } else {
        clearLocalStorage();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [error]);

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
//? Baru untuk danger message
export default Alert;
