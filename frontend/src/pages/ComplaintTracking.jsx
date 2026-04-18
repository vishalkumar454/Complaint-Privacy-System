import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { axiosClient } from '../api/axios.client';
import { Activity, Search, Shield, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComplaintTracking = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Users track their own, Admins track all
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axiosClient.get(
          user.role === 'admin' ? '/admin/all-complaints' : '/complaints/my-complaints'
        );
        // Note: For fully wired app, admin routes would need the 'all-complaints' endpoint in backend.
        setComplaints(response.data.complaints || []);
      } catch (error) {
        setComplaints([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaints();
  }, [user]);

  const filteredComplaints = complaints.filter(c =>
    c.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={16} />;
      case 'Accepted': return <Shield size={16} />;
      case 'Resolved': return <CheckCircle size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Accepted': return 'primary';
      case 'Resolved': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="tracking-container animate-fade-in">
      <div className="dashboard-header flex justify-between items-center mb-8">
        <div>
          <h1>Complaint Tracker</h1>
          <p className="text-muted">Monitor the progress and status of complaints.</p>
        </div>
        <div className="search-bar relative">
          <Search size={20} className="text-muted" style={{ position: 'relative', left: '28px', top: '5px' }} />
          <input
            type="text"
            className="form-input pl-10"
            style={{ paddingLeft: '2.5rem', width: '300px' }}
            placeholder="Search by Reference ID or Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <br />
      <div className="tracking-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {isLoading ? (
          <p>Loading tracking data...</p>
        ) : filteredComplaints.length === 0 ? (
          <div className="empty-state col-span-full py-12" style={{ gridColumn: '1 / -1' }}>
            <Activity size={48} className="text-muted mb-4 mx-auto" style={{ display: 'block' }} />
            <h3>No records found</h3>
            <p className="text-muted mt-2">Try adjusting your search query or submit a new complaint.</p>
          </div>
        ) : (
          filteredComplaints.map(complaint => (
            <div key={complaint._id} className="card tracking-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-sm text-secondary tracking-widest uppercase font-bold">
                    {complaint.complaintId}
                  </span>
                  <span className={`status-badge status-${getStatusColor(complaint.status)} flex items-center gap-1`}>
                    {getStatusIcon(complaint.status)} {complaint.status}
                  </span>
                </div>

                <h3 className="mb-2" style={{ fontSize: '1.1rem' }}>{complaint.title}</h3>
                <p className="text-sm text-muted mb-4 line-clamp-2">{complaint.description}</p>

                <div className="flex gap-2 mb-4">
                  <span className="badge">{complaint.category}</span>
                  {complaint.isAnonymous && <span className="badge bg-secondary text-white">Anonymous</span>}
                </div>
              </div>

              <div className="tracking-footer pt-4 mt-auto border-t" style={{ borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-xs text-muted">Filed on: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                {complaint.status !== 'Pending' && (
                  <Link to={`/chat/${complaint._id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Shield size={14} /> Open Chat
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComplaintTracking;
