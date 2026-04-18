import { useState, useEffect } from 'react';
import { axiosClient } from '../api/axios.client';
import { Users, ShieldCheck } from 'lucide-react';

const AdminAdvocates = () => {
  const [advocates, setAdvocates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        const res = await axiosClient.get('/admin/advocates');
        setAdvocates(res.data.advocates);
      } catch (error) {
        console.error("Failed to fetch verified advocates", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdvocates();
  }, []);

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <h1>Verified Advocates</h1>
        <p className="text-muted">View all advocates currently active on the platform.</p>
      </div>

      <div className="recent-activity card mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 style={{margin: 0}}><Users className="inline-block mr-2 text-primary" size={24}/> Active Advocate Roster</h2>
        </div>
        
        {isLoading ? (
          <p>Loading advocates...</p>
        ) : advocates.length === 0 ? (
          <div className="empty-state py-8">
             <p className="text-muted">No verified advocates found in the system.</p>
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
                  <th>Cases Handled</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {advocates.map(adv => (
                  <tr key={adv._id}>
                    <td className="font-medium">{adv.name}</td>
                    <td>{adv.email}</td>
                    <td className="font-mono text-sm">{adv.barCouncilId}</td>
                    <td>
                      <div className="flex gap-1 flex-wrap">
                        {adv.specialization.map(s => <span key={s} className="badge" style={{fontSize: '0.7rem'}}>{s}</span>)}
                      </div>
                    </td>
                    <td className="text-center">{adv.casesHandled}</td>
                    <td className="text-center">{adv.rating.toFixed(1)}</td>
                    <td>
                       <span className="status-badge status-success" style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                         <ShieldCheck size={14} /> Verified
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

export default AdminAdvocates;
