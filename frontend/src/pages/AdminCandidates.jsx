import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { candidatesAPI } from '../utils/api';

export default function AdminCandidates() {
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
    'Deputy Head Boy',
    'Deputy Head Girl',
    'Sports Captain',
    'Sports Vice Captain',
    'CCA Captain',
    'CCA Vice Captain',
    'Cultural Secretary',
    'Spartans House Captain',
    'Spartans House Vice Captain',
    'Vikings House Captain',
    'Vikings House Vice Captain',
    'Knights House Captain',
    'Knights House Vice Captain',
    'Samurais House Captain',
    'Samurais House Vice Captain'
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
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950" style={{background: 'linear-gradient(135deg, rgb(6, 5, 15) 0%, rgb(30, 27, 75) 50%, rgb(6, 5, 15) 100%)'}}>
      <style>{`
        @keyframes slideInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-slideInDown { animation: slideInDown 0.6s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out both; }
        .animate-slideInScale { animation: slideInScale 0.5s ease-out both; }
      `}</style>

      {/* Header */}
      <div className="border-b border-slate-700/50 sticky top-0 z-10" style={{background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 27, 75, 0.8) 100%)', backdropFilter: 'blur(10px)'}}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between animate-slideInDown">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              👥 Candidates
            </h1>
            <p className="text-slate-400 text-sm">Manage election candidates</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 py-4">
            <Link
              to="/admin/dashboard"
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              📈 Dashboard
            </Link>
            <Link
              to="/admin/candidates"
              className="px-4 py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/50"
            >
              👥 Candidates
            </Link>
            <Link
              to="/admin/students"
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              👨‍🎓 Students
            </Link>
            <Link
              to="/admin/results"
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              🎯 Results
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-8 p-6 bg-red-900/40 border-2 border-red-500/50 rounded-2xl text-red-200 font-semibold animate-slideInScale">
            ⚠️ {error}
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <div className="border border-slate-700/50 bg-gradient-to-br from-blue-900/30 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 mb-8 animate-slideInScale">
            <h2 className="text-2xl font-bold text-white mb-6">➕ Add Candidate</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Candidate Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all"
                    placeholder="Enter candidate name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Position</label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all"
                  >
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">House (Optional)</label>
                  <select
                    name="house"
                    value={formData.house}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all"
                  >
                    {houses.map(house => (
                      <option key={house} value={house}>{house || 'None'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Photo (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white file:cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50"
                >
                  ✅ Add Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all duration-300"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Candidates List */}
        <div className="border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 animate-slideInScale">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">📋 Candidates ({candidates.length})</h2>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50"
              >
                ➕ Add Candidate
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <span className="inline-block animate-spin mr-3 text-2xl">⏳</span>
              <p className="text-slate-400">Loading candidates...</p>
            </div>
          ) : candidates.length === 0 ? (
            <p className="text-slate-400 text-center py-12">No candidates added yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-700/50">
                    <th className="text-left py-4 px-4 text-slate-300 font-bold">Name</th>
                    <th className="text-left py-4 px-4 text-slate-300 font-bold">Position</th>
                    <th className="text-left py-4 px-4 text-slate-300 font-bold">House</th>
                    <th className="text-center py-4 px-4 text-slate-300 font-bold">Votes</th>
                    <th className="text-center py-4 px-4 text-slate-300 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate, idx) => (
                    <tr key={candidate.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-all animate-fadeInUp" style={{animationDelay: `${idx * 0.05}s`}}>
                      <td className="py-4 px-4 text-white font-semibold">{candidate.name}</td>
                      <td className="py-4 px-4 text-slate-300">{candidate.position}</td>
                      <td className="py-4 px-4 text-slate-400">{candidate.house || '—'}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-sm font-bold">{candidate.vote_count || 0}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleDelete(candidate.id)}
                          className="px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-300 font-bold rounded-lg transition-all"
                        >
                          🗑️ Delete
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
