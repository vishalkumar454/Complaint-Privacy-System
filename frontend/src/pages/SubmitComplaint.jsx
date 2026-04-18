import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../api/axios.client';
import { ShieldAlert, Info } from 'lucide-react';
import './SubmitComplaint.css';

const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    isAnonymous: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const categories = ['Harassment', 'Fraud', 'Cybercrime', 'Civil Rights', 'Other'];

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axiosClient.post('/complaints', formData);
      setSuccess(`Complaint submitted successfully! Reference ID: ${response.data.complaint.complaintId}`);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit complaint');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="submit-container animate-fade-in">
      <div className="submit-header">
        <h2>File a New Complaint</h2>
        <p className="text-muted">Provide details about your case. You can choose to remain anonymous.</p>
      </div>

      <div className="card submit-form-card mt-6">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <div className="privacy-notice">
          <ShieldAlert size={20} className="text-primary" />
          <div className="notice-text">
            <h4>Privacy Guarantee</h4>
            <p>Your data is encrypted. If you select anonymous mode, your identity will be hidden from advocates and the public.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="form-group">
            <label className="form-label">Complaint Title</label>
            <input 
              type="text" 
              name="title"
              className="form-input" 
              placeholder="Brief summary of the issue"
              value={formData.title}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group mt-4">
            <label className="form-label">Category</label>
            <select 
              name="category"
              className="form-input" 
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="form-group mt-4">
            <label className="form-label">Detailed Description</label>
            <textarea 
              name="description"
              className="form-input" 
              rows="6"
              placeholder="Provide all necessary details about the incident..."
              value={formData.description}
              onChange={handleChange}
              required 
            ></textarea>
          </div>

          <div className="anonymous-toggle mt-6 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="toggle-checkbox"
              />
              <span className="font-medium">Submit this complaint anonymously</span>
            </label>
            {formData.isAnonymous && (
              <p className="text-sm text-muted flex items-center gap-2 mt-2">
                <Info size={16} /> Even advocates won't see your name or email.
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
