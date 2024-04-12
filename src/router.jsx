import PrivateRoutes from "./middleware/PrivateRoutes";
import { Routes, Route } from "react-router-dom";

import Welcome from "./views/Welcome";
import Home from "./views/Home";
import Login from "./views/auth/Login";
import LoginSSO from "./views/auth/LoginSSO";

import SidangIndex from "./views/sidangs/Index";
import SidangShow from "./views/sidangs/Show";
import SidangCreate from "./views/sidangs/Create";
import SidangEdit from "./views/sidangs/Edit";

import StudyProgramCreate from "./views/studyprograms/create";
import StudyProgramEdit from "./views/studyprograms/edit";
import StudyProgramShow from "./views/studyprograms/show";
import StudyPrograms from "./views/studyprograms";

import { GuideAdmin } from "./views/guideBook/Admin";
import { GuideDosen } from "./views/guideBook/Dosen";
import { GuidePIC } from "./views/guideBook/PIC";
import { GuideStudent } from "./views/guideBook/Student";

import PowerPoint from "./views/sidangs/PowerPoint";
import Teams from "./views/sidangs/team/Teams";
import TeamsCreate from "./views/sidangs/team/Create";

const router = (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Welcome />} />

    {/* Auth Routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/loginsso" element={<LoginSSO />} />
    <Route element={<PrivateRoutes />}></Route>

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
    <Route
      element={<PrivateRoutes role={["RLMHS", "RLADM", "RLPIC", "RLPBB"]} />}
    >
      <Route path="/sidangs" element={<SidangIndex />} />
      <Route path="/sidangs/pic" element={<SidangIndex />} />
      <Route path="/sidangs/pembimbing" element={<SidangIndex />} />
      <Route path="/sidangs/create" element={<SidangCreate />} />
      <Route path="/sidangs/:id/edit" element={<SidangEdit />} />
      <Route path="/slides" element={<PowerPoint />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/teams/create" element={<TeamsCreate />} />
    </Route>

    <Route
      element={<PrivateRoutes role={["RLPBM", "RLPIC", "RLADM", "RLMHS"]} />}
    >
      <Route path="/sidangs/:id" element={<SidangShow />} />
    </Route>

    {/* RLADM Routes */}
    <Route element={<PrivateRoutes role={["RLADM"]} />}>
      <Route path="/studyPrograms" element={<StudyPrograms />} />
      <Route path="/studyPrograms/create" element={<StudyProgramCreate />} />
      <Route path="/studyPrograms/:id/edit" element={<StudyProgramEdit />} />
      <Route path="/studyPrograms/:id" element={<StudyProgramShow />} />
    </Route>

    {/* Guide Book */}
    <Route element={<PrivateRoutes role={["RLADM"]} />}>
      <Route path="/guide-book-admin" element={<GuideAdmin />} />
    </Route>
    <Route element={<PrivateRoutes role={["RLADM", "RLPIC"]} />}>
      <Route path="/guide-book-PIC" element={<GuidePIC />} />
    </Route>
    <Route element={<PrivateRoutes role={["RLADM", "RLDSN"]} />}>
      <Route path="/guide-book-pembimbing" element={<GuideDosen />} />
    </Route>
    <Route element={<PrivateRoutes role={["RLADM", "RLMHS"]} />}>
      <Route path="/guide-book-student" element={<GuideStudent />} />
    </Route>
    <Route path="*" element={<p>404 Error - Nothing here...</p>} />
  </Routes>
);

export default router;
