import PrivateRoutes from "./middleware/PrivateRoutes";
import { Routes, Route } from "react-router-dom";

import Welcome from "./views/Welcome";
import Home from "./views/Home";
import Login from "./views/auth/Login";
import LoginSSO from "./views/auth/LoginSSO";
import SidangCreate from "./views/sidangs/Create";
import SidangEdit from "./views/sidangs/edit";
import StudyProgramCreate from "./views/studyprograms/create";
import StudyProgramEdit from "./views/studyprograms/edit";
import StudyProgramShow from "./views/studyprograms/show";
import StudyPrograms from "./views/studyprograms";

import SidangEdit from "./views/sidangs/Edit";
import PowerPoint from "./views/sidangs/PowerPoint";
import Teams from "./views/sidangs/Teams";

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
      <Route path="/sidangs/edit/:id" element={<SidangEdit />} />
      <Route path="/slides" element={<PowerPoint />} />
      <Route path="/teams" element={<Teams />} />
    </Route>

    {/* RLADM Routes */}
    <Route element={<PrivateRoutes role={["RLADM"]} />}>
      <Route path="/studyPrograms" element={<StudyPrograms/>} />
      <Route path="/studyPrograms/create" element={<StudyProgramCreate />} />
      <Route path="/studyPrograms/:id/edit" element={<StudyProgramEdit/>} />
      <Route path="/studyPrograms/:id" element={<StudyProgramShow/>}/>
    </Route>

    <Route path="*" element={<p>404 Error - Nothing here...</p>} />
  </Routes>
);

export default router;
