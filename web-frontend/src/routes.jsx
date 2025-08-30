import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import ResetPasswordForm from './components/forgot-password/ResetPasswordForm';
import SuperAdminDashboard from './dashboards/SuperAdminDashboard/AdminDashboard';
import UnitCommanderDashboard from './dashboards/UnitCommanderDashboard/UnitCmdDashboard';
import RegularUserDashboard from './dashboards/RegularUserDashboard/PersonnelDashboard';
import UserManagement from './dashboards/SuperAdminDashboard/ManageUsers/UserManagement';
import ManageGroupChats from './dashboards/SuperAdminDashboard/ManageUnitGroups/UnitGrpManagement';
import AssignGroupMembers from './dashboards/UnitCommanderDashboard/AssignMembers/AssignGroupMembers';
import UnitCommanderMessages from './dashboards/UnitCommanderDashboard/CommanderMessage/UnitCommanderMessages'
import PersonnelGrpMessage from './dashboards/RegularUserDashboard/PersonnelMessages/PersonnelGrpMessages';
import SubAdminAlerts from './dashboards/UnitCommanderDashboard/UnitCommanderAlerts/SubAdminAlerts';
import PersonnelAlerts from './dashboards/RegularUserDashboard/PersonnelAlerts/PersonnelAlerts';
import UnitCommanderManageAlerts from './dashboards/UnitCommanderDashboard/ManageAlerts/UnitCommanderAlertsManagement';
import RegularUserManageAlerts from './dashboards/RegularUserDashboard/PersonnelAlerts/PersonnelManageAlerts/PersonnelManageAlerts';

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
        {/* Assign Members to Groups routes */}
        <Route path="/subadmin/assign-members" element={<AssignGroupMembers />} />
        {/* Unit Commander Group Messages routes */}
        <Route path="/subadmin/view-messages" element={<UnitCommanderMessages />} />
        {/* Personnel Group Messages routes */}
        <Route path="/personnel/view-messages" element={<PersonnelGrpMessage />} />
        {/* Alerts route */}
        <Route path="subadmin/alerts" element={<SubAdminAlerts />} />
        <Route path="personnel/alerts" element={<PersonnelAlerts />} />
        <Route path="subadmin/manage-alerts" element={<UnitCommanderManageAlerts />} />
        <Route path="personnel/manage-alerts" element={<RegularUserManageAlerts />} />
        
      </Routes>
    </Router>
  );
}

export default AppRoutes;
