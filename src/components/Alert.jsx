import { useEffect } from "react";

const Alert = ({ message, type }) => {
  useEffect(() => {
    const errorMessage = sessionStorage.getItem("errorMessage");
    if (errorMessage) {
      sessionStorage.removeItem("errorMessage");
    }
  }, []);

  return type === "danger" && message ? (
    <div className={`alert alert-${type}`} role="alert">
      {message}
    </div>
  ) : null;
};
//? Baru untuk danger message
export default Alert;
