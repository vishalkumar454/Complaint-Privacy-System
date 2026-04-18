import { useState, useEffect } from 'react';
import { axiosClient } from '../api/axios.client';
import { Activity, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const AdvocateCases = () => {
  const [myCases, setMyCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axiosClient.get('/advocates/cases');
        setMyCases(response.data.cases || []);
      } catch (error) {
        setMyCases([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCases();
  }, []);

  return (
    <div className="cases-container animate-fade-in" style={{ padding: '2rem' }}>
      <div className="cases-header mb-6">
        <h1>My Active Cases</h1>
        <p className="text-muted">Manage the legal disputes you are currently handling.</p>
      </div>

      <div className="cases-list card">
        {isLoading ? (
          <p>Loading cases...</p>
        ) : myCases.length === 0 ? (
          <div className="empty-state py-12">
             <Activity size={48} className="text-muted mb-4 mx-auto" style={{ display: 'block' }} />
             <h3>No active cases</h3>
             <p className="text-muted mt-2">You haven't accepted any cases yet. Head over to the Marketplace to browse open complaints.</p>
          </div>
        ) : (
           <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reference ID</th>
                  <th>Case Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myCases.map(c => (
                  <tr key={c._id}>
                    <td className="font-mono text-sm">{c.complaintId}</td>
                    <td className="font-medium">{c.title}</td>
                    <td>{c.category}</td>
                    <td>
                      <span className={`status-badge status-${c.status === 'Resolved' ? 'success' : 'primary'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/chat/${c._id}`} className="btn btn-primary text-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem' }}>
                        <MessageSquare size={16} /> Open Case
                      </Link>
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

export default AdvocateCases;
