import { useState, useEffect } from 'react';
import { axiosClient } from '../api/axios.client';
import { Activity, ShieldAlert, CheckCircle, Search } from 'lucide-react';
import { format } from 'date-fns';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axiosClient.get('/admin/complaints');
        setComplaints(res.data.complaints);
        setFilteredComplaints(res.data.complaints);
      } catch (error) {
        console.error("Failed to fetch complaints", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  useEffect(() => {
    let result = complaints;
    if (statusFilter !== 'All') {
      result = result.filter(c => c.status === statusFilter);
    }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.complaintId.toLowerCase().includes(lowerSearch) || 
        c.title.toLowerCase().includes(lowerSearch) ||
        c.category.toLowerCase().includes(lowerSearch)
      );
    }
    setFilteredComplaints(result);
  }, [searchTerm, statusFilter, complaints]);

  const getStatusBadge = (status) => {
    const statusClass = {
      'Pending': 'primary',
      'Accepted': 'warning',
      'In Progress': 'warning',
      'Resolved': 'success',
      'Closed': 'success'
    }[status] || 'primary';
    
    return <span className={`status-badge status-${statusClass}`}>{status}</span>;
  };

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <h1>All Complaints Repository</h1>
        <p className="text-muted">Global view of all complaints filed in the PrivacyShield system.</p>
      </div>

      <div className="recent-activity card mt-8">
        <div className="dashboard-filters" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="search-bar" style={{ flex: 1, position: 'relative' }}>
            <Search size={18} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by ID, Title, or Category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <select 
            className="form-input" 
            style={{ width: '200px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {isLoading ? (
          <p>Loading complaints...</p>
        ) : filteredComplaints.length === 0 ? (
          <div className="empty-state py-8">
             <p className="text-muted">No complaints match your filters.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Filed By</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map(c => (
                  <tr key={c._id}>
                    <td className="font-mono text-sm">{c.complaintId}</td>
                    <td className="text-sm">{format(new Date(c.createdDate), 'MMM dd, yyyy')}</td>
                    <td className="font-medium">{c.title}</td>
                    <td><span className="badge">{c.category}</span></td>
                    <td className="text-sm text-muted">
                      {c.isAnonymous ? 'Anonymous' : (c.userId?.name || 'Unknown')}
                    </td>
                    <td className="text-sm text-muted">
                      {c.assignedAdvocate ? c.assignedAdvocate.name : 'Unassigned'}
                    </td>
                    <td>{getStatusBadge(c.status)}</td>
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

export default AdminComplaints;
