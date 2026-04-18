import { useState, useEffect } from 'react';
import { axiosClient } from '../api/axios.client';
import { Search, Activity, ShieldCheck } from 'lucide-react';
import './Dashboard.css';

const AdvocateMarketplace = () => {
  const [marketCases, setMarketCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        const response = await axiosClient.get('/advocates/marketplace');
        setMarketCases(response.data.complaints || []);
      } catch (error) {
        setMarketCases([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMarketplace();
  }, []);

  const handleAcceptCase = async (id) => {
    try {
      await axiosClient.post(`/advocates/complaints/${id}/accept`);
      setMarketCases(marketCases.filter(c => c._id !== id));
      alert("Case accepted successfully!");
    } catch (error) {
      alert(error.message || 'Failed to accept case');
    }
  };

  const filteredCases = marketCases.filter(c => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="marketplace-container animate-fade-in" style={{ padding: '2rem' }}>
      <div className="marketplace-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Open Marketplace</h1>
          <p className="text-muted">Browse available cases that require legal assistance.</p>
        </div>
        <div className="search-bar relative">
          <Search size={20} className="text-muted" style={{ position: 'relative', left: '28px', top: '5px' }} />
          <input
            type="text"
            className="form-input pl-10"
            style={{ paddingLeft: '2.5rem', width: '300px' }}
            placeholder="Search by keyword or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="marketplace-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {isLoading ? (
          <p>Loading marketplace data...</p>
        ) : filteredCases.length === 0 ? (
          <div className="empty-state col-span-full py-12" style={{ gridColumn: '1 / -1' }}>
            <Activity size={48} className="text-muted mb-4 mx-auto" style={{ display: 'block' }} />
            <h3>No cases found</h3>
            <p className="text-muted mt-2">There are currently no open cases matching your criteria.</p>
          </div>
        ) : (
          filteredCases.map(c => (
             <div key={c._id} className="market-item card" style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column' }}>
                <div className="flex justify-between items-start mb-3">
                   <h3 className="font-medium" style={{ margin: 0, fontSize: '1.1rem' }}>{c.title}</h3>
                </div>
                
                <div className="flex gap-2 mb-3">
                  <span className="badge">{c.category}</span>
                </div>
                
                <p className="text-sm text-muted mb-4" style={{ flexGrow: 1 }}>{c.description}</p>
                
                <button 
                  className="btn btn-primary w-full mt-auto" 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={() => handleAcceptCase(c._id)}
                >
                  <ShieldCheck size={18} />
                  Accept Case
                </button>
             </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdvocateMarketplace;
