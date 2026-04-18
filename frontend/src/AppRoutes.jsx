import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdvocateDashboard from './pages/AdvocateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import LegalBot from './pages/LegalBot';
import ChatInterface from './pages/ChatInterface';
import ComplaintTracking from './pages/ComplaintTracking';
import AdvocateMarketplace from './pages/AdvocateMarketplace';
import AdvocateCases from './pages/AdvocateCases';
import AdminAdvocates from './pages/AdminAdvocates';
import AdminComplaints from './pages/AdminComplaints';
import AdvocateLogin from './pages/AdvocateLogin';
import AdvocateRegister from './pages/AdvocateRegister';

const RoleRoute = ({ children, allowedRoles }) => {
  const { userType, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userType)) return <Navigate to="/" replace />;
  return children;
};

const DashboardRouter = () => {
  const { userType } = useAuth();
  switch(userType) {
    case 'admin': return <AdminDashboard />;
    case 'advocate': return <AdvocateDashboard />;
    case 'user': return <UserDashboard />;
    default: return <Navigate to="/login" replace />;
  }
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
      <Route path="/advocate/login" element={isAuthenticated ? <Navigate to="/" /> : <AdvocateLogin />} />
      <Route path="/advocate/register" element={isAuthenticated ? <Navigate to="/" /> : <AdvocateRegister />} />
      <Route path="/home" element={isAuthenticated ? <Navigate to="/" /> : <Home />} />

      {/* Protected Layout */}
      <Route path="/" element={<MainLayout />}>
        {/* Dynamic Route based on Role */}
        <Route index element={<DashboardRouter />} />

        {/* User Specific */}
        <Route path="complaints/new" element={
          <RoleRoute allowedRoles={['user']}><SubmitComplaint /></RoleRoute>
        } />
        <Route path="complaints/track" element={
          <RoleRoute allowedRoles={['user', 'admin']}><ComplaintTracking /></RoleRoute>
        } />
        
        {/* Admin Specific */}
        <Route path="verify-advocates" element={
          <RoleRoute allowedRoles={['admin']}><AdminDashboard /></RoleRoute>
        } />
        <Route path="admin/advocates" element={
          <RoleRoute allowedRoles={['admin']}><AdminAdvocates /></RoleRoute>
        } />
        <Route path="admin/complaints" element={
          <RoleRoute allowedRoles={['admin']}><AdminComplaints /></RoleRoute>
        } />

        {/* Advocate Specific */}
        <Route path="marketplace" element={
          <RoleRoute allowedRoles={['advocate']}><AdvocateMarketplace /></RoleRoute>
        } />
        <Route path="my-cases" element={
          <RoleRoute allowedRoles={['advocate']}><AdvocateCases /></RoleRoute>
        } />

        {/* Shared Protected */}
        <Route path="chat/:id" element={<ChatInterface />} />
        <Route path="legal-bot" element={<LegalBot />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
