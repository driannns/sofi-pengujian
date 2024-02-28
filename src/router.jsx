import PrivateRoutes from "./middleware/PrivateRoutes";
import { Routes, Route } from "react-router-dom";

import Welcome from "./views/Welcome";
import Home from "./views/Home";
import Login from "./views/auth/Login";
import LoginSSO from "./views/auth/LoginSSO";

const router = (
  <Routes>
    <Route path="/" element={<Welcome />} />
    <Route path="/login" element={<Login />} />
    <Route path="/loginsso" element={<LoginSSO />} />

    <Route element={<PrivateRoutes role="RLMHS" />}>
      <Route path="/home" element={<Home />} />
    </Route>

    <Route path="*" element={<p>404 Error - Nothing here...</p>} />
  </Routes>
);

export default router;
