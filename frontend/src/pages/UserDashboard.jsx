import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { axiosClient } from '../api/axios.client';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import './Dashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axiosClient.get('/complaints/my-complaints');
        setComplaints(response.data.complaints);
      } catch (error) {
        console.error("Failed to fetch complaints", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'warning';
      case 'Accepted': return 'primary';
      case 'Resolved': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <p className="text-muted">Here's an overview of your recent activity.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-primary-light">
            <FileText size={24} className="text-primary" />
          </div>
          <div className="stat-info">
            <h3>{complaints.length}</h3>
            <p className="text-muted">Total Complaints</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-warning-light">
            <Clock size={24} className="text-warning" />
          </div>
          <div className="stat-info">
            <h3>{complaints.filter(c => c.status === 'Pending').length}</h3>
            <p className="text-muted">Pending Review</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-success-light">
            <CheckCircle size={24} className="text-success" />
          </div>
          <div className="stat-info">
            <h3>{complaints.filter(c => c.status === 'Resolved').length}</h3>
            <p className="text-muted">Resolved Cases</p>
          </div>
        </div>
      </div>

      <div className="recent-activity card mt-8">
        <h2>Recent Complaints</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <p className="text-muted">You haven't filed any complaints yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.slice(0, 5).map(complaint => (
                  <tr key={complaint._id}>
                    <td className="font-mono">{complaint.complaintId}</td>
                    <td className="font-medium">{complaint.title}</td>
                    <td>{complaint.category}</td>
                    <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge status-${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
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

export default UserDashboard;
