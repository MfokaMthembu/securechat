import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import ResetPasswordForm from './components/forgot-password/ResetPasswordForm';
import SuperAdminDashboard from './dashboards/SuperAdminDashboard/AdminDashboard';
import UnitCommanderDashboard from './dashboards/UnitCommanderDashboard/UnitCmdDashboard';
import RegularUserDashboard from './dashboards/RegularUserDashboard/PersonnelDashboard';
import UserManagement from './dashboards/SuperAdminDashboard/ManageUsers/UserManagement';
import ManageGroupChats from './dashboards/SuperAdminDashboard/ManageUnitGroups/UnitGrpManagement';

function AppRoutes() {
  return (
    <Router>
      <Routes>
         {/* login route */}
        <Route path="/" element={<App />} />
        {/* Reset Password route */}
        <Route path="/forgot-password" element={<ResetPasswordForm />} />
        {/* Dashboard routes */}
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/subadmin/dashboard" element={<UnitCommanderDashboard />} />
        <Route path="/personnel/dashboard" element={<RegularUserDashboard />} />
        {/* User Management routes */}
        <Route path="/superadmin/manage-users" element={<UserManagement />} />

        {/* Unit Group Management routes */}
        <Route path="/superadmin/manage-group-chats" element={<ManageGroupChats />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
