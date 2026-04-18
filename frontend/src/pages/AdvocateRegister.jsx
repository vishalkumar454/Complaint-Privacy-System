import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';
import './Auth.css';

const AdvocateRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: 'Criminal Law',
    barCouncilId: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { registerAdvocate } = useAuth();
  const navigate = useNavigate();

  const specializations = ['Criminal Law', 'Civil Rights', 'Cyber Law', 'Corporate Law', 'General Practice'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await registerAdvocate({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        specialization: [formData.specialization],
        barCouncilId: formData.barCouncilId
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container py-8">
      <div className="auth-card card animate-fade-in" style={{ borderTop: '4px solid var(--primary)' }}>
        <div className="auth-header">
          <Shield className="logo-icon" size={40} />
          <h2>Advocate Application</h2>
          <p className="text-muted">Register to provide legal guidance on PrivacyShield</p>
        </div>

        {error && <div className="alert alert-error mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group flex flex-col gap-4">
            
            <div>
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
            </div>

            <div>
              <label className="form-label">Bar Council ID</label>
              <input type="text" name="barCouncilId" className="form-input" placeholder="e.g. BAR/123/2026" value={formData.barCouncilId} onChange={handleChange} required />
            </div>

            <div>
              <label className="form-label">Primary Specialization</label>
              <select name="specialization" className="form-input" value={formData.specialization} onChange={handleChange}>
                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
            </div>
            
            <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required minLength={8} />
              </div>
              <div>
                <label className="form-label">Confirm Password</label>
                <input type="password" name="confirmPassword" className="form-input" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

          </div>

          <button type="submit" className="btn btn-primary w-full mt-6" disabled={isLoading}>
            {isLoading ? 'Submitting Application...' : 'Apply as Advocate'}
          </button>
        </form>

        <p className="auth-footer mt-6">
          Already applied? <Link to="/advocate/login">Login here</Link>
        </p>
        <p className="auth-footer mt-2" style={{fontSize: '0.8rem'}}>
          Looking for the user portal? <Link to="/register">User Registration</Link>
        </p>
      </div>
    </div>
  );
};

export default AdvocateRegister;
