import { Link } from 'react-router-dom';
import { Shield, Lock, FileText, Bot } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <nav className="home-nav container flex items-center justify-between">
        <div className="logo flex items-center gap-2">
          <Shield className="logo-icon" size={32} />
          <span className="logo-text">PrivacyShield</span>
        </div>
        <div className="nav-actions flex gap-4">
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/register" className="btn btn-primary">Sign Up</Link>
        </div>
      </nav>

      <main className="home-hero container">
        <div className="hero-content">
          <h1>Secure, Anonymous Complaint Management</h1>
          <p className="hero-subtitle">
            Report incidents with complete privacy. Connect with verified advocates. 
            Get instant legal guidance from our AI assistant.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">File a Complaint Now</Link>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Lock size={24} /></div>
            <h3>Anonymous Reporting</h3>
            <p>Submit complaints without revealing your identity. We prioritize your safety.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FileText size={24} /></div>
            <h3>Verified Advocates</h3>
            <p>Get professional legal support from Bar Council certified advocates.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Bot size={24} /></div>
            <h3>AI Legal Guidance</h3>
            <p>Immediate legal assistance and references through our smart chatbot 24/7.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
