import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CookiesProvider } from "react-cookie";
import { AuthProvider } from "./middleware/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <AuthProvider>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </AuthProvider>
  </Router>
);
