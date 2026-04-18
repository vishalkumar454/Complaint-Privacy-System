import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { axiosClient } from '../api/axios.client';
import { FileText, Users, Star, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const AdvocateDashboard = () => {
  const { user } = useAuth();
  if (!user?.isVerified) {
    return (
      <div className="empty-state animate-fade-in" style={{marginTop: '4rem'}}>
        <AlertCircle size={48} className="text-warning mb-4 mx-auto" style={{ margin: '0 auto', display: 'block' }}/>
        <h2>Account Pending Verification</h2>
        <p className="text-muted mt-2">
          Your advocate profile is currently under review by our administration team. 
          You will gain access to the marketplace and case management once your Bar Council ID is verified.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <h1>Advocate Workspace</h1>
        <p className="text-muted">Manage your active cases or find new clients requiring assistance.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-primary-light">
            <Users size={24} className="text-primary" />
          </div>
          <div className="stat-info">
            <h3>N/A</h3>
            <p className="text-muted">Active Cases</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-success-light">
            <FileText size={24} className="text-success" />
          </div>
          <div className="stat-info">
            <h3>{user.casesHandled || 0}</h3>
            <p className="text-muted">Total Solved</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-warning-light">
            <Star size={24} className="text-warning" />
          </div>
          <div className="stat-info">
            <h3>{user.rating?.toFixed(1) || 'N/A'}</h3>
            <p className="text-muted">Client Rating</p>
          </div>
        </div>
      </div>

      <div className="dashboard-split mt-8" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="recent-activity card text-center p-8">
           <Users size={48} className="text-primary mx-auto mb-4" />
           <h2 className="mb-2">Manage Active Cases</h2>
           <p className="text-muted mb-6">Communicate securely with your clients and close pending complaints.</p>
           <Link to="/my-cases" className="btn btn-primary">Go to My Cases</Link>
        </div>
        
        <div className="recent-activity card text-center p-8">
           <FileText size={48} className="text-secondary mx-auto mb-4" />
           <h2 className="mb-2">Open Marketplace</h2>
           <p className="text-muted mb-6">Browse the public ledger of filed complaints and select cases to handle.</p>
           <Link to="/marketplace" className="btn btn-outline">Browse New Cases</Link>
        </div>
      </div>
    </div>
  );
};

export default AdvocateDashboard;
