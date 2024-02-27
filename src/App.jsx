import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./views/Welcome";
import Home from "./views/Home";
import Login from "./views/auth/Login";
import LoginSSO from "./views/auth/LoginSSO";
import MateriPresentasi from "./views/powerpoints/MateriPresentasi";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="home" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="loginsso" element={<LoginSSO />} />
        <Route path="slides" element={<MateriPresentasi />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
