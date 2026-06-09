import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { dashboardAPI } from '../utils/api';

export default function AdminResults() {
  const { logoutAdmin } = useAuth();
  const [results, setResults] = useState({});
  const [participationByClass, setParticipationByClass] = useState([]);
  const [participationByHouse, setParticipationByHouse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [participationView, setParticipationView] = useState('class');
  const [searchQuery, setSearchQuery] = useState('');

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
    window.location.href = '/admin/login';
  };

  const positions = Object.keys(results).sort();

  const getHouseColor = (house) => {
    const colors = {
      'Spartans': 'from-red-500 to-red-600',
      'Vikings': 'from-blue-500 to-blue-600',
      'Knights': 'from-yellow-500 to-yellow-600',
      'Samurais': 'from-purple-500 to-purple-600'
    };
    return colors[house] || 'from-slate-500 to-slate-600';
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
              📊 Election Results
            </h1>
            <p className="text-slate-400 text-sm">Real-time voting statistics</p>
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
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              👨‍🎓 Students
            </Link>
            <Link
              to="/admin/results"
              className="px-4 py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/50"
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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-slate-400 text-lg">
              <span className="inline-block animate-spin mr-3">⏳</span>
              Loading results...
            </div>
          </div>
        ) : (
          <>
            {/* Election Results by Position */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-3xl font-bold text-white">🗳️ Voting Results</h2>
                <span className="text-sm text-slate-400 bg-slate-800/50 px-4 py-2 rounded-full">{positions.length} positions</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {positions.map((position, idx) => (
                  <div
                    key={position}
                    className="border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 animate-slideInScale"
                    style={{animationDelay: `${idx * 0.05}s`}}
                  >
                    <h3 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-slate-700/30">
                      {position}
                    </h3>
                    <div className="space-y-4">
                      {results[position]?.map((candidate, cidx) => {
                        const maxVotes = Math.max(...(results[position]?.map(c => c.votes) || [0]));
                        const percentage = maxVotes > 0 ? (candidate.votes / maxVotes) * 100 : 0;

                        return (
                          <div key={candidate.id} className="animate-fadeInUp" style={{animationDelay: `${cidx * 0.1}s`}}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex-1">
                                <p className="text-white font-semibold text-lg">{candidate.name}</p>
                                {candidate.house && (
                                  <p className="text-xs text-slate-400">House: {candidate.house}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-blue-400">{candidate.votes}</p>
                                <p className="text-xs text-slate-500">votes</p>
                              </div>
                            </div>
                            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-600/30">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 rounded-full shadow-lg shadow-blue-500/50"
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

            {/* Results and Participation Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Participation Panel (Right - Sticky) */}
              <div className="lg:col-span-1 order-last lg:order-last">
                <div className="sticky top-24 border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden animate-slideInScale shadow-2xl hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-300">
                  {/* Header */}
                  <div className="bg-gradient-to-br from-slate-800/80 to-purple-900/40 p-6 border-b border-slate-700/50 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-5">
                      👥 Participation Stats
                    </h3>

                    {/* Toggle Buttons */}
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => setParticipationView('class')}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 ${
                          participationView === 'class'
                            ? 'bg-gradient-to-r from-green-600/50 to-emerald-600/50 text-green-200 border-2 border-green-500/50 shadow-lg shadow-green-500/20'
                            : 'bg-slate-700/40 text-slate-300 border border-slate-600/30 hover:text-white hover:bg-slate-700/60'
                        }`}
                      >
                        📚 Class
                      </button>
                      <button
                        onClick={() => setParticipationView('house')}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 ${
                          participationView === 'house'
                            ? 'bg-gradient-to-r from-purple-600/50 to-pink-600/50 text-purple-200 border-2 border-purple-500/50 shadow-lg shadow-purple-500/20'
                            : 'bg-slate-700/40 text-slate-300 border border-slate-600/30 hover:text-white hover:bg-slate-700/60'
                        }`}
                      >
                        🏠 House
                      </button>
                    </div>

                    {/* Search Bar */}
                    <input
                      type="text"
                      placeholder="🔍 Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all text-sm font-medium hover:bg-slate-700/70"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 max-h-[600px] overflow-y-auto space-y-4">
                    {participationView === 'class' ? (
                      <div className="space-y-4">
                        {participationByClass.length === 0 ? (
                          <p className="text-slate-400 text-center py-8">No data available</p>
                        ) : (
                          participationByClass
                            .filter(item => item.class.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((item, idx) => (
                              <div key={item.class} className="animate-fadeInUp group" style={{animationDelay: `${idx * 0.05}s`}}>
                                <div className="bg-gradient-to-r from-green-900/20 to-slate-900/20 border border-green-700/30 rounded-xl p-4 hover:border-green-600/50 hover:bg-green-900/30 transition-all duration-300">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-white font-bold text-base group-hover:text-green-200 transition-colors">{item.class}</span>
                                    <span className="text-green-400 font-bold text-lg">{item.percentage}%</span>
                                  </div>
                                  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-600/30 hover:shadow-lg hover:shadow-green-500/20 transition-all">
                                    <div
                                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 rounded-full shadow-lg shadow-green-500/40"
                                      style={{ width: `${item.percentage}%` }}
                                    />
                                  </div>
                                  <p className="text-xs text-slate-400 mt-2 font-medium">{item.voted}/{item.total} students voted</p>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {participationByHouse.length === 0 ? (
                          <p className="text-slate-400 text-center py-8">No data available</p>
                        ) : (
                          participationByHouse
                            .filter(item => item.house.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((item, idx) => {
                              const houseColor = item.house === 'Spartans' ? 'from-red-900/20 to-slate-900/20' :
                                                 item.house === 'Vikings' ? 'from-blue-900/20 to-slate-900/20' :
                                                 item.house === 'Knights' ? 'from-yellow-900/20 to-slate-900/20' :
                                                 'from-purple-900/20 to-slate-900/20';
                              const borderColor = item.house === 'Spartans' ? 'border-red-700/30' :
                                                  item.house === 'Vikings' ? 'border-blue-700/30' :
                                                  item.house === 'Knights' ? 'border-yellow-700/30' :
                                                  'border-purple-700/30';

                              return (
                                <div key={item.house} className="animate-fadeInUp group" style={{animationDelay: `${idx * 0.05}s`}}>
                                  <div className={`bg-gradient-to-r ${houseColor} border ${borderColor} rounded-xl p-4 hover:border-opacity-100 hover:bg-opacity-40 transition-all duration-300`}>
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-white font-bold text-base group-hover:text-opacity-100 transition-colors">{item.house}</span>
                                      <span className="font-bold text-lg" style={{color: item.house === 'Spartans' ? '#60a5fa' : item.house === 'Vikings' ? '#34d399' : item.house === 'Knights' ? '#fbbf24' : '#a78bfa'}}>
                                        {item.percentage}%
                                      </span>
                                    </div>
                                    <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-600/30 hover:shadow-lg transition-all" style={{boxShadow: item.house === 'Spartans' ? '0 0 10px rgba(96, 165, 250, 0.2)' : item.house === 'Vikings' ? '0 0 10px rgba(52, 211, 153, 0.2)' : item.house === 'Knights' ? '0 0 10px rgba(251, 191, 36, 0.2)' : '0 0 10px rgba(167, 139, 250, 0.2)'}}>
                                      <div
                                        className={`h-full bg-gradient-to-r ${getHouseColor(item.house)} transition-all duration-500 rounded-full shadow-lg`}
                                        style={{ width: `${item.percentage}%` }}
                                      />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 font-medium">{item.voted}/{item.total} students voted</p>
                                  </div>
                                </div>
                              );
                            })
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
