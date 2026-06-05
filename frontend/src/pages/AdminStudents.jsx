import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { studentsAPI } from '../utils/api';

export default function AdminStudents() {
  const navigate = useNavigate();
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
      setError(err.response?.data?.error || 'Failed to import students');
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
              className="px-4 py-2 rounded text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Candidates
            </Link>
            <Link
              to="/admin/students"
              className="px-4 py-2 rounded text-white font-medium bg-blue-600 hover:bg-blue-700"
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

        {importResult && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-700 rounded text-green-200">
            {importResult.message}
          </div>
        )}

        {/* Forms */}
        {showForm && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Add Student</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">SCS Number</label>
                  <input
                    type="text"
                    name="scs_no"
                    value={formData.scs_no}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="1023"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Student name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Class</label>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="10A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">House</label>
                  <select
                    name="house"
                    value={formData.house}
                    onChange={handleInputChange}
                    className="input"
                  >
                    {houses.map(house => (
                      <option key={house} value={house}>{house}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Add Student
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

        {showImport && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Bulk Import Students</h2>
            <form onSubmit={handleImport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  CSV or Excel File
                </label>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={(e) => setImportFile(e.target.files[0])}
                  className="input"
                />
                <p className="text-xs text-slate-400 mt-1">
                  File must contain columns: scs_no, name, class, house
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Import
                </button>
                <button
                  type="button"
                  onClick={() => setShowImport(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Students List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Students ({pagination?.total || 0})</h2>
            <div className="flex gap-2">
              {!showForm && !showImport && (
                <>
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                  >
                    Add Student
                  </button>
                  <button
                    onClick={() => setShowImport(true)}
                    className="btn-secondary"
                  >
                    Bulk Import
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by SCS number, name, or class..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input"
            />
          </div>

          {loading ? (
            <p className="text-slate-400">Loading students...</p>
          ) : students.length === 0 ? (
            <p className="text-slate-400">No students found</p>
          ) : (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-3 text-slate-300 font-medium">SCS #</th>
                      <th className="text-left py-3 px-3 text-slate-300 font-medium">Name</th>
                      <th className="text-left py-3 px-3 text-slate-300 font-medium">Class</th>
                      <th className="text-left py-3 px-3 text-slate-300 font-medium">House</th>
                      <th className="text-center py-3 px-3 text-slate-300 font-medium">Voted</th>
                      <th className="text-center py-3 px-3 text-slate-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id} className="border-b border-slate-800 hover:bg-slate-900">
                        <td className="py-3 px-3 text-white font-mono">{student.scs_no}</td>
                        <td className="py-3 px-3 text-white">{student.name}</td>
                        <td className="py-3 px-3 text-slate-400">{student.class}</td>
                        <td className="py-3 px-3 text-slate-400">{student.house}</td>
                        <td className="py-3 px-3 text-center">
                          {student.has_voted ? (
                            <span className="text-green-400">✓</span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleDelete(student.id)}
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

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-slate-400">
                    Page {page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next
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
