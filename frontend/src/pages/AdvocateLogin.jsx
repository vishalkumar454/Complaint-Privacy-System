import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';
import './Auth.css';

const AdvocateLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login({ email, password, type: 'advocate' });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login as advocate. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card animate-fade-in" style={{ borderTop: '4px solid var(--primary)' }}>
        <div className="auth-header">
          <Shield className="logo-icon" size={40} />
          <h2>Advocate Portal</h2>
          <p className="text-muted">Login to manage your legal cases</p>
        </div>

        {error && <div className="alert alert-error mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Advocate Login'}
          </button>
        </form>

        <p className="auth-footer mt-6">
          Not registered as an advocate? <Link to="/advocate/register">Apply here</Link>
        </p>
        <p className="auth-footer mt-2" style={{fontSize: '0.8rem'}}>
          Looking for the user portal? <Link to="/login">User Login</Link>
        </p>
      </div>
    </div>
  );
};

export default AdvocateLogin;
