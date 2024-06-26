import PrivateRoutes from "./middleware/PrivateRoutes";
import { Routes, Route } from "react-router-dom";

import Welcome from "./views/Welcome";
import Error from "./views/Error";
import Home from "./views/Home";
import Notification from "./views/Notification";
import Login from "./views/auth/Login";
import LoginSSO from "./views/auth/LoginSSO";

import SidangIndex from "./views/sidangs/Index";
import IndexSKPenguji from "./views/sidangs/IndexSKPenguji";
import UploadSKForm from "./views/sidangs/UploadSKForm";
import SidangShow from "./views/sidangs/Show";
import SidangCreate from "./views/sidangs/Create";
import SidangEdit from "./views/sidangs/Edit";

import PowerPoint from "./views/sidangs/PowerPoint";

import Teams from "./views/sidangs/team/Teams";
import TeamsCreate from "./views/sidangs/team/Create";

import StudyProgramCreate from "./views/studyprograms/create";
import StudyProgramEdit from "./views/studyprograms/edit";
import StudyProgramShow from "./views/studyprograms/show";
import StudyPrograms from "./views/studyprograms";
import Peminatans from "./views/peminatans/Index";
import PeminatansCreate from "./views/peminatans/Create";
import PeminatansEdit from "./views/peminatans/Edit";
import PeminatansShow from "./views/peminatans/Show";

import Parameters from "./views/parameters";
import ParametersEdit from "./views/parameters/edit";
import ScorePortions from "./views/scoreportions";
import ScorePortionsCreate from "./views/scoreportions/create";
import ScorePortionsEdit from "./views/scoreportions/edit";
import ScorePortionsShow from "./views/scoreportions/show";
import StatusRevisi from "./views/schedules/statusrevisi";
import Periods from "./views/periods";
import PeriodsCreate from "./views/periods/create";
import PeriodsEdit from "./views/periods/edit";
import PeriodsShow from "./views/periods/show";
import VerifyDocuments from "./views/verifydocuments";
import VerifyDocumentsShow from "./views/verifydocuments/show";
import VerifyDocumentsEdit from "./views/verifydocuments/edit";
import User from "./views/users";
import UserCreate from "./views/users/create";
import UserShow from "./views/users/show";
import UserEdit from "./views/users/edit";
import Lecturers from "./views/lecturers";
import LecturersCreate from "./views/lecturers/create";
import Clos from "./views/clos";
import ClosClone from "./views/clos/clone";
import ClosCreate from "./views/clos/create";
import ClosShow from "./views/clos/show";
import ClosEdit from "./views/clos/edit";
import ClosPreview from "./views/clos/preview";

import { GuideAdmin } from "./views/guideBook/Admin";
import { GuideDosen } from "./views/guideBook/Dosen";
import { GuidePIC } from "./views/guideBook/PIC";
import { GuideStudent } from "./views/guideBook/Student";

import JadwalCreate from "./views/schedules/create";
import JadwalEdit from "./views/schedules/edit";
import JadwalIndex from "./views/schedules";
import JadwalShow from "./views/schedules/show";

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
      <Route path="/notification" element={<Notification />} />
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

    <Route element={<PrivateRoutes role={["RLMHS"]} />}>
      <Route path="/schedule/mahasiswa" element={<JadwalIndex />} />
    </Route>

    <Route
      element={<PrivateRoutes role={["RLPBM", "RLPIC", "RLADM", "RLMHS"]} />}
    >
      <Route path="/sidangs/:id" element={<SidangShow />} />
    </Route>

    {/* RLADM Routes */}
    <Route element={<PrivateRoutes role={["RLADM"]} />}>
      <Route path="/sidangs/surat-tugas" element={<IndexSKPenguji />} />
      <Route path="/sidangs/:id/storeSkForm" element={<UploadSKForm />} />
      <Route path="/studyPrograms" element={<StudyPrograms />} />
      <Route path="/studyPrograms/create" element={<StudyProgramCreate />} />
      <Route path="/studyPrograms/:id/edit" element={<StudyProgramEdit />} />
      <Route path="/studyPrograms/:id" element={<StudyProgramShow />} />
      <Route path="/peminatans" element={<Peminatans />} />
      <Route path="/peminatans/create" element={<PeminatansCreate />} />
      <Route path="/peminatans/:id/edit" element={<PeminatansEdit />} />
      <Route path="/peminatans/:id" element={<PeminatansShow />} />
      <Route path="/parameters" element={<Parameters />} />
      <Route path="/parameters/:id/edit" element={<ParametersEdit />} />
      <Route path="/scoreportions" element={<ScorePortions />} />
      <Route path="/scoreportions/create" element={<ScorePortionsCreate />} />
      <Route path="/scoreportions/:id/edit" element={<ScorePortionsEdit />} />
      <Route path="/scoreportions/:id" element={<ScorePortionsShow />} />
      <Route path="/statusrevisi" element={<StatusRevisi />} />
      <Route path="/periods" element={<Periods />} />
      <Route path="/periods/create" element={<PeriodsCreate />} />
      <Route path="/periods/:id/edit" element={<PeriodsEdit />} />
      <Route path="/periods/:id" element={<PeriodsShow />} />
      <Route path="/verifydocuments" element={<VerifyDocuments />} />
      <Route path="/verifydocuments/:id" element={<VerifyDocumentsShow />} />
      <Route
        path="/verifydocuments/:id/edit"
        element={<VerifyDocumentsEdit />}
      />
      <Route path="/users" element={<User />} />
      <Route path="/users/create" element={<UserCreate />} />
      <Route path="/users/:id" element={<UserShow />} />
      <Route path="/users/:id/edit" element={<UserEdit />} />
      <Route path="/lectures" element={<Lecturers />} />
      <Route path="/lectures/create" element={<LecturersCreate />} />
      <Route path="/cLOS" element={<Clos />} />
      <Route path="/cLOS/clone" element={<ClosClone />} />
      <Route path="/cLOS/create" element={<ClosCreate />} />
      <Route path="/cLOS/:id" element={<ClosShow />} />
      <Route path="/cLOS/:id/edit" element={<ClosEdit />} />
      <Route
        path="/clo/preview/:periodId/:studyProgramId/:role"
        element={<ClosPreview />}
      />
      <Route path="/schedule/admin-before" element={<JadwalIndex />} />
      <Route path="/schedule/bermasalah" element={<JadwalIndex />} />
      <Route path="/schedule/admin" element={<JadwalIndex />} />
    </Route>

    {/* RLPIC Routes */}
    <Route element={<PrivateRoutes role={["RLPIC"]} />}>
      <Route path="/sidangs/pic" element={<SidangIndex />} />
      <Route path="/schedule" element={<JadwalIndex />} />
      <Route path="/schedules/create/:id" element={<JadwalCreate />} />
      <Route path="/schedule/:id/edit" element={<JadwalEdit />} />
      <Route path="schedule/bukaAkses" element={<JadwalIndex />} />
    </Route>

    {/* RLPBB Routes */}
    <Route element={<PrivateRoutes role={["RLPBB"]} />}>
      <Route path="/schedule/pembimbing" element={<JadwalIndex />} />
    </Route>

    {/* RLPGJ Routes */}
    <Route element={<PrivateRoutes role={["RLPGJ"]} />}>
      <Route path="/schedule/penguji" element={<JadwalIndex />} />
    </Route>

    <Route element={<PrivateRoutes role={["RLPGJ", "RLPBB", "RLADM"]} />}>
      <Route path="/schedules/:id" element={<JadwalShow />} />
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
    <Route path="*" element={<Error />} />
  </Routes>
);

export default router;
