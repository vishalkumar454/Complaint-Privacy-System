import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { axiosClient } from '../api/axios.client';
import { ShieldAlert, CheckCircle, Activity, Users } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [unverifiedAdvocates, setUnverifiedAdvocates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, advocatesRes] = await Promise.all([
          axiosClient.get('/admin/stats'),
          axiosClient.get('/admin/advocates/unverified')
        ]);
        setStats(statsRes.data.stats);
        setUnverifiedAdvocates(advocatesRes.data.advocates);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleVerify = async (id) => {
    try {
      await axiosClient.patch(`/admin/advocates/${id}/verify`);
      setUnverifiedAdvocates(prev => prev.filter(adv => adv._id !== id));
      setStats(prev => ({ ...prev, totalAdvocates: prev.totalAdvocates + 1 }));
    } catch (error) {
      alert('Failed to verify advocate');
    }
  };

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <h1>Admin Control Center</h1>
        <p className="text-muted">System analytics and verification queue operations.</p>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon bg-primary-light">
              <Activity size={24} className="text-primary" />
            </div>
            <div className="stat-info">
              <h3>{stats.totalComplaints}</h3>
              <p className="text-muted">Total Complaints Filed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-success-light">
              <CheckCircle size={24} className="text-success" />
            </div>
            <div className="stat-info">
              <h3>{stats.resolvedComplaints}</h3>
              <p className="text-muted">Complaints Resolved</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-warning-light">
              <ShieldAlert size={24} className="text-warning" />
            </div>
            <div className="stat-info">
              <h3>{stats.totalAdvocates}</h3>
              <p className="text-muted">Verified Advocates</p>
            </div>
          </div>
        </div>
      )}

      <div className="recent-activity card mt-8">
        <h2>Advocate Verification Queue</h2>
        {isLoading ? (
          <p>Loading queue...</p>
        ) : unverifiedAdvocates.length === 0 ? (
          <div className="empty-state py-8">
            <CheckCircle size={40} className="text-success mb-2 mx-auto" style={{ display: 'block' }}/>
            <p className="text-muted text-lg mt-2">All advocates are verified!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Bar Council ID</th>
                  <th>Specialization</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {unverifiedAdvocates.map(adv => (
                  <tr key={adv._id}>
                    <td className="font-medium">{adv.name}</td>
                    <td>{adv.email}</td>
                    <td className="font-mono">{adv.barCouncilId}</td>
                    <td>
                      <span className="badge">{adv.specialization[0] || 'General'}</span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        onClick={() => handleVerify(adv._id)}
                      >
                        Verify Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
