import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const STAGE_COLORS = {
  Applied: '#93c5fd',
  Shortlisted: '#facc15',
  Interviewed: '#f97316',
  Offered: '#a855f7',
  Hired: '#10b981',
  Rejected: '#ef4444',
};

const emptyForm = {
  name: '', email: '', phone: '', jobRole: '', department: '',
  source: 'Job Portal', stage: 'Applied', appliedDate: '',
};

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [filters, setFilters] = useState({ department: '', source: '', stage: '' });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCandidates();
  }, [filters]);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.department) params.department = filters.department;
      if (filters.source) params.source = filters.source;
      if (filters.stage) params.stage = filters.stage;

      const res = await api.get('/candidates', { params });
      setCandidates(res.data);
    } catch (err) {
      console.error('Error loading candidates', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/candidates', form);
      setForm(emptyForm);
      setShowForm(false);
      loadCandidates();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding candidate');
    }
  };

  const handleStageChange = async (id, newStage) => {
    try {
      await api.put(`/candidates/${id}`, { stage: newStage });
      loadCandidates();
    } catch (err) {
      alert('Error updating stage');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this candidate?')) return;
    try {
      await api.delete(`/candidates/${id}`);
      loadCandidates();
    } catch (err) {
      alert('Error deleting candidate');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2>Candidates</h2>
          <button className="btn" style={{ width: 'auto', padding: '10px 18px' }} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Candidate'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddCandidate} className="chart-card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label>Job Role</label>
                <input name="jobRole" value={form.jobRole} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input name="department" value={form.department} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Source</label>
                <select name="source" value={form.source} onChange={handleFormChange}>
                  <option>Referral</option>
                  <option>Job Portal</option>
                  <option>Campus</option>
                  <option>Social Media</option>
                  <option>Walk-in</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Applied Date</label>
                <input name="appliedDate" type="date" value={form.appliedDate} onChange={handleFormChange} required />
              </div>
            </div>
            <button className="btn" type="submit" style={{ marginTop: 8 }}>Save Candidate</button>
          </form>
        )}

        <div className="filters-bar">
          <select name="department" value={filters.department} onChange={handleFilterChange}>
            <option value="">All Departments</option>
            <option>Engineering</option>
            <option>Marketing</option>
            <option>Sales</option>
            <option>HR</option>
            <option>Finance</option>
          </select>
          <select name="source" value={filters.source} onChange={handleFilterChange}>
            <option value="">All Sources</option>
            <option>Referral</option>
            <option>Job Portal</option>
            <option>Campus</option>
            <option>Social Media</option>
            <option>Walk-in</option>
            <option>Other</option>
          </select>
          <select name="stage" value={filters.stage} onChange={handleFilterChange}>
            <option value="">All Stages</option>
            <option>Applied</option>
            <option>Shortlisted</option>
            <option>Interviewed</option>
            <option>Offered</option>
            <option>Hired</option>
            <option>Rejected</option>
          </select>
        </div>

        {loading ? (
          <p>Loading candidates...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Job Role</th>
                <th>Department</th>
                <th>Source</th>
                <th>Applied Date</th>
                <th>Stage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.jobRole}</td>
                  <td>{c.department}</td>
                  <td>{c.source}</td>
                  <td>{new Date(c.appliedDate).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={c.stage}
                      onChange={(e) => handleStageChange(c._id, e.target.value)}
                      style={{
                        border: 'none',
                        color: '#fff',
                        borderRadius: 12,
                        padding: '3px 8px',
                        fontSize: 11,
                        fontWeight: 600,
                        backgroundColor: STAGE_COLORS[c.stage],
                      }}
                    >
                      <option>Applied</option>
                      <option>Shortlisted</option>
                      <option>Interviewed</option>
                      <option>Offered</option>
                      <option>Hired</option>
                      <option>Rejected</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(c._id)}
                      style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 12 }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {candidates.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 20, color: '#9ca3af' }}>
                    No candidates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
