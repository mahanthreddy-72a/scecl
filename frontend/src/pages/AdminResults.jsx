import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { dashboardAPI } from '../utils/api';

export default function AdminResults() {
  const navigate = useNavigate();
  const { logoutAdmin } = useAuth();
  const [results, setResults] = useState({});
  const [participationByClass, setParticipationByClass] = useState([]);
  const [participationByHouse, setParticipationByHouse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const [resRes, classRes, houseRes] = await Promise.all([
        dashboardAPI.getResults(),
        dashboardAPI.getParticipationByClass(),
        dashboardAPI.getParticipationByHouse()
      ]);

      setResults(resRes.data.results);
      setParticipationByClass(classRes.data.results);
      setParticipationByHouse(houseRes.data.results);
    } catch (err) {
      setError('Failed to load results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  const positions = Object.keys(results).sort();

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
              className="px-4 py-2 rounded text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Students
            </Link>
            <Link
              to="/admin/results"
              className="px-4 py-2 rounded text-white font-medium bg-blue-600 hover:bg-blue-700"
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

        {loading ? (
          <p className="text-slate-400">Loading results...</p>
        ) : (
          <>
            {/* Election Results by Position */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Election Results</h2>
              <div className="space-y-6">
                {positions.map(position => (
                  <div key={position} className="card">
                    <h3 className="text-xl font-bold text-white mb-4">{position}</h3>
                    <div className="space-y-3">
                      {results[position]?.map(candidate => {
                        const maxVotes = Math.max(...(results[position]?.map(c => c.votes) || [0]));
                        const percentage = maxVotes > 0 ? (candidate.votes / maxVotes) * 100 : 0;

                        return (
                          <div key={candidate.id}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white font-medium">{candidate.name}</span>
                              <span className="text-slate-400 text-sm">{candidate.votes} votes</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Participation Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* By Class */}
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Participation by Class</h3>
                <div className="space-y-3">
                  {participationByClass.map(item => (
                    <div key={item.class}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-medium">{item.class}</span>
                        <span className="text-slate-400 text-sm">{item.voted}/{item.total}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{item.percentage}%</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* By House */}
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Participation by House</h3>
                <div className="space-y-3">
                  {participationByHouse.map(item => (
                    <div key={item.house}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-medium">{item.house}</span>
                        <span className="text-slate-400 text-sm">{item.voted}/{item.total}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{item.percentage}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
