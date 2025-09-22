// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import CreateGroup from '../pages/CreateGroup';
import StudentInput from '../pages/StudentInput';
import SelectInfo from '../pages/SelectInfo';
import GroupCreated from '../pages/GroupCreated';
import GroupStatusEnter from '../pages/GroupStatusEnter';
import GroupStatusResult from '../pages/GroupStatusResult';
import ManageGroup from '../pages/ManageGroup';
import TeamMaker from '../pages/TeamMaker';
import TeamResult from '../pages/TeamResult';


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create" element={<CreateGroup />} />
        <Route path="/input" element={<StudentInput />} />
        <Route path="/select-info" element={<SelectInfo />} />
        <Route path="/group-created" element={<GroupCreated />} />
        <Route path="/status" element={<GroupStatusEnter />} />
        <Route path="/status/result" element={<GroupStatusResult />} />
        <Route path="/manage" element={<ManageGroup />} />
        <Route path="/team-maker" element={<TeamMaker />} />
        <Route path="/team-result" element={<TeamResult />} />
      </Routes>
    </BrowserRouter>
  );
}
