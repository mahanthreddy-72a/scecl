import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { dashboardAPI } from '../utils/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { admin, logoutAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, activityRes, logsRes] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getCurrentActivity(),
          dashboardAPI.getActivityLogs(10)
        ]);

        setStats(statsRes.data.stats);
        setActivity(activityRes.data.activity);
        setRecentLogs(logsRes.data.activityLogs);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Refresh every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

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
              className="px-4 py-2 rounded text-white font-medium bg-blue-600 hover:bg-blue-700"
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

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-slate-400 text-sm mb-2">Total Students</p>
            <p className="text-4xl font-bold text-white">{stats?.totalStudents || 0}</p>
          </div>

          <div className="card">
            <p className="text-slate-400 text-sm mb-2">Votes Cast</p>
            <p className="text-4xl font-bold text-white">{stats?.studentsVoted || 0}</p>
          </div>

          <div className="card">
            <p className="text-slate-400 text-sm mb-2">Remaining</p>
            <p className="text-4xl font-bold text-white">{stats?.remainingStudents || 0}</p>
          </div>

          <div className="card">
            <p className="text-slate-400 text-sm mb-2">Participation</p>
            <p className="text-4xl font-bold text-blue-400">{stats?.participationPercentage || 0}%</p>
          </div>
        </div>

        {/* Activity and Recent Logs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Current Activity */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">Current Activity</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-300">Logged In</span>
                <span className="text-lg font-semibold text-white">{activity?.logged_in || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-300">Viewing Ballot</span>
                <span className="text-lg font-semibold text-white">{activity?.viewing_ballot || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-300">Voting</span>
                <span className="text-lg font-semibold text-white">{activity?.voting || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                <span className="text-slate-300">Submitted</span>
                <span className="text-lg font-semibold text-green-400">{activity?.submitted || 0}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentLogs.length > 0 ? (
                recentLogs.map(log => (
                  <div key={log.id} className="p-2 bg-slate-800 rounded text-sm">
                    <p className="text-slate-300">
                      <span className="font-semibold text-white">{log.name || 'Unknown'}</span>
                      {' '}<span className="text-slate-500">({log.scs_no})</span>
                    </p>
                    <p className="text-slate-400 text-xs">
                      {log.status.replace(/_/g, ' ')} - {new Date(log.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No activity yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
