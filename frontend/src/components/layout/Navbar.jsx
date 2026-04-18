import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, User as UserIcon, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, userType, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container flex items-center justify-between">
        <Link to="/" className="navbar-logo flex items-center gap-2">
          <Shield className="logo-icon" size={28} />
          <span className="logo-text">PrivacyShield</span>
        </Link>
        
        <div className="navbar-nav flex items-center gap-6">
          <div className="user-profile flex items-center gap-2">
            <div className="avatar">
              <UserIcon size={18} />
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role badge">{userType}</span>
            </div>
          </div>
          
          <button onClick={handleLogout} className="logout-btn flex items-center gap-2">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
