import PrivateRoutes from "./middleware/PrivateRoutes";
import { Routes, Route } from "react-router-dom";

import Welcome from "./views/Welcome";
import Home from "./views/Home";
import Login from "./views/auth/Login";
import LoginSSO from "./views/auth/LoginSSO";
import SidangCreate from "./views/sidangs/Create";
import SidangEdit from "./views/sidangs/edit";
import StudyProgramCreate from "./views/study_programs/create";
import StudyProgramEdit from "./views/study_programs/edit";
import StudyProgramShow from "./views/study_programs/show";
import StudyPrograms from "./views/study_programs";

const router = (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Welcome />} />
    <Route path="/login" element={<Login />} />
    <Route path="/loginsso" element={<LoginSSO />} />

    {/* Auth Routes */}
    <Route
      element={
        <PrivateRoutes
          role={["RLADM", "RLPIC", "RLMHS", "RLPBB", "RLPGJ", "RLDSN"]}
        />
      }
    >
      <Route path="/home" element={<Home />} />
    </Route>

    {/* RLMHS Routes */}
    <Route element={<PrivateRoutes role={["RLMHS"]} />}>
      <Route path="/sidangs/create" element={<SidangCreate />} />
      <Route path="/sidangs/edit" element={<SidangEdit/>} />
    </Route>

    {/* RLADM Routes */}
    <Route element={<PrivateRoutes role={["RLADM"]} />}>
      <Route path="/studyPrograms" element={<StudyPrograms/>} />
      <Route path="/studyPrograms/create" element={<StudyProgramCreate />} />
      <Route path="/studyPrograms/edit" element={<StudyProgramEdit/>} />
      <Route path="/studyPrograms/show" element={<StudyProgramShow/>}/>
    </Route>

    <Route path="*" element={<p>404 Error - Nothing here...</p>} />
  </Routes>
);

export default router;
