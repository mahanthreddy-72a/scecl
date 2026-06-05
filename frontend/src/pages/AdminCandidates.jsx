import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { candidatesAPI } from '../utils/api';

export default function AdminCandidates() {
  const navigate = useNavigate();
  const { logoutAdmin } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: 'Head Boy',
    house: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const positions = [
    'Head Boy',
    'Head Girl',
    'Sports Captain',
    'Cultural Secretary',
    'House Captain',
    'House Vice Captain'
  ];

  const houses = ['', 'Spartans', 'Vikings', 'Knights', 'Samurais'];

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const res = await candidatesAPI.getAll();
      setCandidates(res.data.candidates);
      setError('');
    } catch (err) {
      setError('Failed to load candidates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Candidate name required');
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('position', formData.position);
      if (formData.house) {
        data.append('house', formData.house);
      }
      if (imageFile) {
        data.append('image', imageFile);
      }

      await candidatesAPI.create(data);
      setFormData({ name: '', position: 'Head Boy', house: '' });
      setImageFile(null);
      setShowForm(false);
      await loadCandidates();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create candidate');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this candidate?')) return;

    try {
      await candidatesAPI.delete(id);
      await loadCandidates();
    } catch (err) {
      setError('Failed to delete candidate');
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Election Dashboard</h1>
          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 py-4">
            <Link
              to="/admin/dashboard"
              className="px-4 py-2 rounded text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/candidates"
              className="px-4 py-2 rounded text-white font-medium bg-blue-600 hover:bg-blue-700"
            >
              Candidates
            </Link>
            <Link
              to="/admin/students"
              className="px-4 py-2 rounded text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Students
            </Link>
            <Link
              to="/admin/results"
              className="px-4 py-2 rounded text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Results
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded text-red-200">
            {error}
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Add Candidate</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Candidate name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Position</label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="input"
                  >
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">House (Optional)</label>
                  <select
                    name="house"
                    value={formData.house}
                    onChange={handleInputChange}
                    className="input"
                  >
                    {houses.map(house => (
                      <option key={house} value={house}>{house || 'None'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="input file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-slate-700 file:text-slate-300"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Add Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Candidates List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Candidates</h2>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                Add Candidate
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-slate-400">Loading candidates...</p>
          ) : candidates.length === 0 ? (
            <p className="text-slate-400">No candidates added yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-3 text-slate-300 font-medium">Name</th>
                    <th className="text-left py-3 px-3 text-slate-300 font-medium">Position</th>
                    <th className="text-left py-3 px-3 text-slate-300 font-medium">House</th>
                    <th className="text-center py-3 px-3 text-slate-300 font-medium">Votes</th>
                    <th className="text-center py-3 px-3 text-slate-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map(candidate => (
                    <tr key={candidate.id} className="border-b border-slate-800 hover:bg-slate-900">
                      <td className="py-3 px-3 text-white">{candidate.name}</td>
                      <td className="py-3 px-3 text-slate-400">{candidate.position}</td>
                      <td className="py-3 px-3 text-slate-400">{candidate.house || '-'}</td>
                      <td className="py-3 px-3 text-center text-white font-semibold">{candidate.vote_count || 0}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleDelete(candidate.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
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
    </div>
  );
}
