import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./views/Welcome";
import Home from "./views/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
