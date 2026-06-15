import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { dashboardAPI } from '../utils/api';

export default function AdminDashboard() {
  const { logoutAdmin } = useAuth();
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
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = '/admin/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-slate-300 text-lg">
          <span className="inline-block animate-spin mr-3">⏳</span>
          Loading dashboard...
        </div>
      </div>
    );
  }

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
              📊 Election Dashboard
            </h1>
            <p className="text-slate-400 text-sm">Live monitoring and statistics</p>
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
              className="px-4 py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/50"
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Students */}
          <div className="border border-slate-700/50 bg-gradient-to-br from-blue-900/30 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 animate-slideInScale">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-semibold">👥 Total Students</p>
              <span className="text-3xl">📚</span>
            </div>
            <p className="text-5xl font-bold text-white">{stats?.totalStudents || 0}</p>
            <p className="text-xs text-slate-400 mt-4">Registered in system</p>
          </div>

          {/* Votes Cast */}
          <div className="border border-slate-700/50 bg-gradient-to-br from-green-900/30 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 animate-slideInScale" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-semibold">✅ Votes Cast</p>
              <span className="text-3xl">🗳️</span>
            </div>
            <p className="text-5xl font-bold text-green-400">{stats?.studentsVoted || 0}</p>
            <p className="text-xs text-slate-400 mt-4">Votes submitted</p>
          </div>

          {/* Remaining */}
          <div className="border border-slate-700/50 bg-gradient-to-br from-yellow-900/30 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 animate-slideInScale" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-semibold">⏳ Remaining</p>
              <span className="text-3xl">⌛</span>
            </div>
            <p className="text-5xl font-bold text-yellow-400">{stats?.remainingStudents || 0}</p>
            <p className="text-xs text-slate-400 mt-4">Yet to vote</p>
          </div>

          {/* Participation */}
          <div className="border border-slate-700/50 bg-gradient-to-br from-purple-900/30 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 animate-slideInScale" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-semibold">📊 Participation</p>
              <span className="text-3xl">📈</span>
            </div>
            <p className="text-5xl font-bold text-purple-400">{stats?.participationPercentage || 0}%</p>
            <div className="w-full bg-slate-700/50 rounded-full h-2 mt-4 border border-slate-600/30">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${stats?.participationPercentage || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Activity and Recent Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Activity */}
          <div className="border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 animate-slideInScale">
            <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-slate-700/30 flex items-center gap-2">
              🎯 Current Activity
            </h2>
            <div className="space-y-4">
              {/* Logged In */}
              <div className="bg-gradient-to-r from-blue-900/30 to-slate-900/20 border border-blue-700/30 rounded-xl p-4 hover:border-blue-600/50 transition-all">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-semibold">🔐 Logged In</span>
                  <span className="text-3xl font-bold text-blue-400">{activity?.logged_in || 0}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Students viewing ballot</p>
              </div>

              {/* Viewing Ballot */}
              <div className="bg-gradient-to-r from-cyan-900/30 to-slate-900/20 border border-cyan-700/30 rounded-xl p-4 hover:border-cyan-600/50 transition-all">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-semibold">👁️ Viewing Ballot</span>
                  <span className="text-3xl font-bold text-cyan-400">{activity?.viewing_ballot || 0}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Students on ballot page</p>
              </div>

              {/* Voting */}
              <div className="bg-gradient-to-r from-orange-900/30 to-slate-900/20 border border-orange-700/30 rounded-xl p-4 hover:border-orange-600/50 transition-all">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-semibold">🗳️ Voting</span>
                  <span className="text-3xl font-bold text-orange-400">{activity?.voting || 0}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Currently voting</p>
              </div>

              {/* Submitted */}
              <div className="bg-gradient-to-r from-green-900/30 to-slate-900/20 border border-green-700/30 rounded-xl p-4 hover:border-green-600/50 transition-all">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-semibold">✅ Submitted</span>
                  <span className="text-3xl font-bold text-green-400">{activity?.submitted || 0}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Votes submitted</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 animate-slideInScale" style={{animationDelay: '0.1s'}}>
            <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-slate-700/30 flex items-center gap-2">
              📋 Recent Activity
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {recentLogs.length > 0 ? (
                recentLogs.map((log, idx) => (
                  <div key={log.id} className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4 hover:bg-slate-700/50 transition-all animate-fadeInUp" style={{animationDelay: `${idx * 0.05}s`}}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold">{log.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-400">{log.scs_no}</p>
                      </div>
                      <span className="text-xs bg-slate-600/50 px-3 py-1 rounded-full text-slate-200 font-medium">
                        {log.status.replace(/_/g, ' ').charAt(0).toUpperCase() + log.status.replace(/_/g, ' ').slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-8">No activity yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
