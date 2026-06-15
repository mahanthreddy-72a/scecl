import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { studentsAPI } from '../utils/api';

export default function AdminStudents() {
  const { logoutAdmin } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [formData, setFormData] = useState({
    scs_no: '',
    name: '',
    class: '',
    house: 'Spartans'
  });
  const [importFile, setImportFile] = useState(null);
  const [importResult, setImportResult] = useState(null);

  const houses = ['Spartans', 'Vikings', 'Knights', 'Samurais'];

  useEffect(() => {
    loadStudents();
  }, [page, search]);

  const loadStudents = async () => {
    try {
      const res = await studentsAPI.getAll(page, 20, search);
      setStudents(res.data.students);
      setPagination(res.data.pagination);
      setError('');
    } catch (err) {
      setError('Failed to load students');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.scs_no.trim() || !formData.name.trim() || !formData.class.trim()) {
      setError('All fields required');
      return;
    }

    try {
      await studentsAPI.create(formData);
      setFormData({ scs_no: '', name: '', class: '', house: 'Spartans' });
      setShowForm(false);
      await loadStudents();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create student');
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();

    if (!importFile) {
      setError('Please select a file');
      return;
    }

    try {
      const res = await studentsAPI.bulkImport(importFile);
      setImportResult(res.data);
      setImportFile(null);
      setShowImport(false);
      await loadStudents();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to import students';
      console.error('Import error:', err.response?.data || err);
      setError(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return;

    try {
      await studentsAPI.delete(id);
      await loadStudents();
    } catch (err) {
      setError('Failed to delete student');
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
              👨‍🎓 Students
            </h1>
            <p className="text-slate-400 text-sm">Manage student enrollment</p>
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
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              👥 Candidates
            </Link>
            <Link
              to="/admin/students"
              className="px-4 py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/50"
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

        {importResult && (
          <div className="mb-8 p-6 bg-green-900/40 border-2 border-green-500/50 rounded-2xl text-green-200 font-semibold animate-slideInScale">
            ✅ {importResult.message}
          </div>
        )}

        {/* Forms */}
        {showForm && (
          <div className="border border-slate-700/50 bg-gradient-to-br from-green-900/30 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 mb-8 animate-slideInScale">
            <h2 className="text-2xl font-bold text-white mb-6">➕ Add Student</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">SCS Number</label>
                  <input
                    type="text"
                    name="scs_no"
                    value={formData.scs_no}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all"
                    placeholder="SCS1023"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Student Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all"
                    placeholder="Enter student name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Class</label>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all"
                    placeholder="10A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">House</label>
                  <select
                    name="house"
                    value={formData.house}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-lg text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all"
                  >
                    {houses.map(house => (
                      <option key={house} value={house}>{house}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50"
                >
                  ✅ Add Student
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

        {showImport && (
          <div className="border border-slate-700/50 bg-gradient-to-br from-purple-900/30 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 mb-8 animate-slideInScale">
            <h2 className="text-2xl font-bold text-white mb-6">📤 Bulk Import Students</h2>
            <form onSubmit={handleImport} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  📁 CSV or Excel File
                </label>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={(e) => setImportFile(e.target.files[0])}
                  className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-lg text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all"
                />
                <p className="text-xs text-slate-400 mt-3 bg-slate-700/30 p-3 rounded-lg">
                  ℹ️ File must contain columns: <strong>scs_no, name, class, house</strong>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
                >
                  📤 Import
                </button>
                <button
                  type="button"
                  onClick={() => setShowImport(false)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all duration-300"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Students List */}
        <div className="border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 animate-slideInScale">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">📋 Students ({pagination?.total || 0})</h2>
            <div className="flex gap-2">
              {!showForm && !showImport && (
                <>
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50"
                  >
                    ➕ Add
                  </button>
                  <button
                    onClick={() => setShowImport(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
                  >
                    📤 Import
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Search by SCS, name, or class..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <span className="inline-block animate-spin mr-3 text-2xl">⏳</span>
              <p className="text-slate-400">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <p className="text-slate-400 text-center py-12">No students found</p>
          ) : (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-700/50">
                      <th className="text-left py-4 px-4 text-slate-300 font-bold">SCS #</th>
                      <th className="text-left py-4 px-4 text-slate-300 font-bold">Name</th>
                      <th className="text-left py-4 px-4 text-slate-300 font-bold">Class</th>
                      <th className="text-left py-4 px-4 text-slate-300 font-bold">House</th>
                      <th className="text-center py-4 px-4 text-slate-300 font-bold">Voted</th>
                      <th className="text-center py-4 px-4 text-slate-300 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, idx) => (
                      <tr key={student.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-all animate-fadeInUp" style={{animationDelay: `${idx * 0.05}s`}}>
                        <td className="py-4 px-4 text-white font-mono font-bold">{student.scs_no}</td>
                        <td className="py-4 px-4 text-white font-semibold">{student.name}</td>
                        <td className="py-4 px-4 text-slate-300">{student.class}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-full text-sm font-bold bg-slate-700/50 text-slate-200">{student.house}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {student.has_voted ? (
                            <span className="text-green-400 text-xl font-bold">✓</span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleDelete(student.id)}
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

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  <span className="text-slate-400 font-bold">
                    Page <span className="text-cyan-400">{page}</span> of <span className="text-cyan-400">{pagination.pages}</span>
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                    className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
