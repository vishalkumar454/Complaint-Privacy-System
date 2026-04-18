import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  FileText, 
  PlusCircle, 
  MessageSquare, 
  Users, 
  Activity,
  Bot,
  ShieldCheck
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { userType } = useAuth();

  const userLinks = [
    { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/complaints/new', icon: <PlusCircle size={20} />, label: 'Submit Complaint' },
    { to: '/complaints/track', icon: <Activity size={20} />, label: 'Track Status' },
    { to: '/legal-bot', icon: <Bot size={20} />, label: 'Legal Guidance' }
  ];

  const advocateLinks = [
    { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/marketplace', icon: <FileText size={20} />, label: 'Browse Cases' },
    { to: '/my-cases', icon: <Users size={20} />, label: 'My Cases' },
    { to: '/legal-bot', icon: <Bot size={20} />, label: 'Legal References' }
  ];

  const adminLinks = [
    { to: '/', icon: <Activity size={20} />, label: 'Dashboard' },
    { to: '/admin/advocates', icon: <Users size={20} />, label: 'Manage Advocates' },
    { to: '/admin/complaints', icon: <FileText size={20} />, label: 'All Complaints' },
    { to: '/verify-advocates', icon: <ShieldCheck size={20} />, label: 'Verification Queue' }
  ];

  const getLinks = () => {
    switch (userType) {
      case 'user': return userLinks;
      case 'advocate': return advocateLinks;
      case 'admin': return adminLinks;
      default: return [];
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-nav">
        {getLinks().map((link) => (
          <NavLink 
            key={link.to} 
            to={link.to} 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{link.icon}</span>
            <span className="sidebar-label">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
