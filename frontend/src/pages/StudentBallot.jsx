import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { votingAPI } from '../utils/api';

export default function StudentBallot() {
  const navigate = useNavigate();
  const { student, logoutStudent } = useAuth();
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState({});
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showHouseElections, setShowHouseElections] = useState(false);
  const [selectedTeacherHouse, setSelectedTeacherHouse] = useState(null);
  const [showTeacherHouseSelection, setShowTeacherHouseSelection] = useState(false);

  const houses = [
    { name: 'Spartans', color: '#3b82f6', bgColor: 'from-blue-900/50 to-blue-800/50', borderColor: 'border-blue-500/50', emoji: '⚔️' },
    { name: 'Vikings', color: '#eab308', bgColor: 'from-yellow-900/50 to-yellow-800/50', borderColor: 'border-yellow-500/50', emoji: '🛡️' },
    { name: 'Knights', color: '#22c55e', bgColor: 'from-green-900/50 to-green-800/50', borderColor: 'border-green-500/50', emoji: '🏰' },
    { name: 'Samurais', color: '#a855f7', bgColor: 'from-purple-900/50 to-purple-800/50', borderColor: 'border-purple-500/50', emoji: '⚡' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const posResponse = await votingAPI.getPositions();
        setPositions(posResponse.data.positions);

        // Load candidates for each position
        const candData = {};
        for (const pos of posResponse.data.positions) {
          const candResponse = await votingAPI.getCandidates(pos.name);
          candData[pos.name] = candResponse.data.candidates;
        }
        setCandidates(candData);

        // Log activity
        await votingAPI.logActivity('viewing_ballot');
      } catch (err) {
        setError('Failed to load ballot data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleVoteChange = (position, candidateId) => {
    setVotes(prev => ({
      ...prev,
      [position]: candidateId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all positions have votes
    let requiredPositions;

    if (student?.isTeacher && selectedTeacherHouse) {
      // Teachers: common positions + selected house positions only
      requiredPositions = positions
        .filter(p => p.common || (p.house === selectedTeacherHouse))
        .map(p => p.name);
    } else {
      // Students: common positions + their own house positions
      requiredPositions = positions.map(p => p.name);
    }

    const selectedPositions = Object.keys(votes);
    const missingVotes = requiredPositions.filter(pos => !selectedPositions.includes(pos));

    if (missingVotes.length > 0) {
      setError(`Please vote for: ${missingVotes.join(', ')}`);
      return;
    }

    setSubmitting(true);
    try {
      const votesList = Object.entries(votes).map(([position, candidateId]) => ({
        position,
        candidateId: parseInt(candidateId)
      }));

      await votingAPI.logActivity('voting');
      await votingAPI.submitVotes(votesList);
      await votingAPI.logActivity('submitted');

      navigate('/success');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit votes');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    await logoutStudent();
    navigate('/');
  };

  const getCommonPositions = () => {
    return positions.filter(p => p.common);
  };

  const getHousePositions = () => {
    if (!selectedTeacherHouse) return [];
    return positions.filter(p => !p.common && p.house === selectedTeacherHouse);
  };

  const areCommonPositionsDone = () => {
    const commonPos = getCommonPositions();
    return commonPos.every(p => votes[p.name]);
  };

  const handleHouseSelection = (houseName) => {
    setSelectedTeacherHouse(houseName);
    setShowTeacherHouseSelection(false);
    setShowHouseElections(true);
  };

  const handleBackToHouseSelection = () => {
    setSelectedTeacherHouse(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading ballot...</div>
      </div>
    );
  }

  if (!student) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

      <style>{`
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slideInDown { animation: slideInDown 0.6s ease-out; }
        .animate-slideInUp { animation: slideInUp 0.6s ease-out both; }
        .animate-fadeInScale { animation: fadeInScale 0.5s ease-out both; }
        .candidate-card { transition: all 0.3s ease; }
        .candidate-card:hover { transform: translateY(-5px); }

        @property --gradient-angle {syntax:"<angle>";initial-value:0deg;inherits:false;}
        @property --gradient-angle-offset {syntax:"<angle>";initial-value:0deg;inherits:false;}
        @property --gradient-percent {syntax:"<percentage>";initial-value:5%;inherits:false;}
        @property --gradient-shine {syntax:"<color>";initial-value:white;inherits:false;}
        .shiny-cta {--shiny-cta-bg:#1e40af;--shiny-cta-bg-subtle:#1e3a8a;--shiny-cta-fg:#fff;--shiny-cta-highlight:#3b82f6;--shiny-cta-highlight-subtle:#60a5fa;--animation:gradient-angle linear infinite;--duration:3s;--shadow-size:2px;--transition:800ms cubic-bezier(0.25,1,0.5,1);isolation:isolate;position:relative;overflow:hidden;cursor:pointer;padding:1.25rem 2.5rem;font-size:1.125rem;font-weight:600;border:1px solid transparent;border-radius:0.75rem;color:var(--shiny-cta-fg);background:linear-gradient(var(--shiny-cta-bg),var(--shiny-cta-bg))padding-box,conic-gradient(from calc(var(--gradient-angle) - var(--gradient-angle-offset)),transparent,var(--shiny-cta-highlight)var(--gradient-percent),var(--gradient-shine)calc(var(--gradient-percent)*2),var(--shiny-cta-highlight)calc(var(--gradient-percent)*3),transparent calc(var(--gradient-percent)*4))border-box;box-shadow:inset 0 0 0 1px var(--shiny-cta-bg-subtle);transition:var(--transition);transition-property:--gradient-angle-offset,--gradient-percent,--gradient-shine;flex:1;}
        .shiny-cta::before,.shiny-cta::after,.shiny-cta span::before{content:"";pointer-events:none;position:absolute;inset-inline-start:50%;inset-block-start:50%;translate:-50% -50%;z-index:-1;}
        .shiny-cta:active{translate:0 1px;}
        .shiny-cta::before{--size:calc(100% - var(--shadow-size)*3);--position:2px;--space:calc(var(--position)*2);width:var(--size);height:var(--size);background:radial-gradient(circle at var(--position) var(--position),white calc(var(--position)/4),transparent 0)padding-box;background-size:var(--space)var(--space);background-repeat:space;mask-image:conic-gradient(from calc(var(--gradient-angle)+45deg),black,transparent 10% 90%,black);border-radius:inherit;opacity:0.4;z-index:-1;}
        .shiny-cta::after{--animation:shimmer linear infinite;width:100%;aspect-ratio:1;background:linear-gradient(-50deg,transparent,var(--shiny-cta-highlight),transparent);mask-image:radial-gradient(circle at bottom,transparent 40%,black);opacity:0.6;}
        .shiny-cta span{z-index:1;}
        .shiny-cta span::before{--size:calc(100% + 1rem);width:var(--size);height:var(--size);box-shadow:inset 0 -1ex 2rem 4px var(--shiny-cta-highlight);opacity:0;transition:opacity var(--transition);animation:calc(var(--duration)*1.5)breathe linear infinite;}
        .shiny-cta,.shiny-cta::before,.shiny-cta::after{animation:var(--animation)var(--duration),var(--animation)calc(var(--duration)/0.4)reverse paused;animation-composition:add;}
        .shiny-cta:is(:hover,:focus-visible){--gradient-percent:20%;--gradient-angle-offset:95deg;--gradient-shine:var(--shiny-cta-highlight-subtle);}
        .shiny-cta:is(:hover,:focus-visible),.shiny-cta:is(:hover,:focus-visible)::before,.shiny-cta:is(:hover,:focus-visible)::after{animation-play-state:running;}
        .shiny-cta:is(:hover,:focus-visible)span::before{opacity:1;}
        .shiny-cta:disabled{opacity:0.5;cursor:not-allowed;}
        @keyframes gradient-angle{to{--gradient-angle:360deg;}}
        @keyframes shimmer{to{rotate:360deg;}}
        @keyframes breathe{from,to{scale:1;}50%{scale:1.2;}}
      `}</style>

    <div className="relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logout */}
        <div className="mb-12 animate-slideInDown">
          <div className="flex justify-between items-center mb-8 hover:opacity-95 transition-opacity">
            {/* Left: School Logo */}
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Sri Chaitanya Techno School"
                className="h-8 object-contain drop-shadow-lg"
                style={{
                  imageRendering: 'auto',
                  filter: 'blur(0.5px)',
                  WebkitFontSmoothing: 'antialiased'
                }}
              />
            </div>

            {/* Center: Title */}
            <div className="flex-1 text-center space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                🗳️ Student Council Elections
              </h1>
              <p className="text-sm text-slate-500">Vote for {positions.filter(p => p.common).length} school + 2 house positions = {positions.length} total</p>
            </div>

            {/* Right: Student Info & Logout */}
            <div className="flex items-center gap-6">
              {/* Student Info - Minimal */}
              <div className="hidden md:flex flex-col items-end gap-2 text-xs border-r border-slate-600/50 pr-6">
                <div className="flex items-center gap-2">
                  <p className="text-slate-300 font-semibold">{student?.name}</p>
                  {student?.isTeacher && (
                    <span className="bg-purple-600/50 text-purple-300 px-2 py-0.5 rounded-full text-xs font-bold border border-purple-500/50">
                      👨‍🏫 Staff
                    </span>
                  )}
                </div>
                <p className="text-slate-500">Class: {student?.class} | SCS: {student?.scs_no}</p>
              </div>

              {/* Logout Button */}
              <button
                onClick={async () => {
                  await logoutStudent();
                  window.location.href = '/';
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-md whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/30 border-l-4 border-red-500 rounded text-red-200 animate-pulse">
            <p className="font-semibold">⚠️ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* TEACHER HOUSE SELECTION SCREEN */}
          {student?.isTeacher && showTeacherHouseSelection && !selectedTeacherHouse ? (
            <div className="space-y-8">
              <div className="text-center py-8">
                <h2 className="text-4xl font-bold text-white mb-3">🏠 Pick Your House</h2>
                <p className="text-slate-400 text-lg">Select which house you want to vote for</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {houses.map(house => (
                  <button
                    key={house.name}
                    type="button"
                    onClick={() => handleHouseSelection(house.name)}
                    className={`bg-gradient-to-br ${house.bgColor} border-2 ${house.borderColor} rounded-2xl p-8 text-center hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-2xl animate-fadeInScale`}
                  >
                    <div className="text-5xl mb-4">{house.emoji}</div>
                    <h3 className="text-3xl font-bold text-white mb-2">{house.name}</h3>
                    <p className="text-slate-300">
                      {house.name} House Captain<br/>
                      & Vice Captain
                    </p>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={() => setShowTeacherHouseSelection(false)}
                  className="flex-1 py-4 text-lg font-bold bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
                >
                  ← Back
                </button>
              </div>
            </div>
          ) : !showHouseElections ? (
            <>
              {/* SECTION 1: Common Positions */}
              <div className="space-y-8">
                <div className="text-center py-4 border-b-2 border-blue-700/30">
                  <h2 className="text-2xl font-bold text-blue-300 uppercase tracking-wider">School Level Elections</h2>
                  <p className="text-sm text-slate-400 mt-2">Vote for school-wide positions</p>
                </div>

                {positions.filter(p => !p.common === false).map((position, idx) => (
            <div key={position.name} className="card border border-slate-700/50 shadow-xl animate-fadeInScale hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 px-8 py-10 min-h-[330px]">
              {/* Position Header */}
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-700/30">
                <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-bold text-sm">
                  {idx + 1}
                </span>
                <h2 className="text-3xl font-bold text-white">{position.name}</h2>
              </div>

              {/* Candidates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 justify-center max-w-2xl mx-auto">
                {(candidates[position.name] || []).map(candidate => (
                  <label
                    key={candidate.id}
                    className={`flex flex-col items-center p-4 rounded-xl border-3 cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                      votes[position.name] === String(candidate.id)
                        ? 'border-blue-500 bg-gradient-to-b from-blue-900/40 to-blue-800/20 shadow-lg shadow-blue-500/20'
                        : 'border-slate-600 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10'
                    }`}
                  >
                    {/* Image Container */}
                    <div className="w-full mb-4 relative">
                      {candidate.image_path ? (
                        <img
                          src={candidate.image_path}
                          alt={candidate.name}
                          className="w-full h-40 object-cover rounded-lg shadow-md"
                          onError={(e) => {
                            console.error('Image failed to load:', candidate.image_path);
                            e.target.style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('Image loaded:', candidate.image_path);
                          }}
                        />
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center border border-slate-600">
                          <div className="text-center">
                            <span className="text-4xl mb-2">📸</span>
                            <p className="text-slate-400 text-xs">No Photo</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <p className="font-bold text-white text-center text-base mb-2 line-clamp-2 h-10 flex items-center">
                      {candidate.name}
                    </p>

                    {/* House Badge */}
                    {candidate.house && (
                      <span className="inline-block px-3 py-1 bg-slate-700/50 rounded-full text-xs font-semibold text-slate-200 mb-3">
                        {candidate.house}
                      </span>
                    )}

                    {/* Radio Button */}
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-500 mt-2">
                      <input
                        type="radio"
                        name={position.name}
                        value={candidate.id}
                        checked={votes[position.name] === String(candidate.id)}
                        onChange={(e) => handleVoteChange(position.name, e.target.value)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>
                ))}
              </div>

              {/* Navigation Buttons - School Level */}
              <div className="flex gap-4 pt-8 border-t border-slate-700/30">
                <button
                  type="button"
                  onClick={() => {
                    if (student?.isTeacher) {
                      setShowTeacherHouseSelection(true);
                    } else {
                      setShowHouseElections(true);
                    }
                  }}
                  disabled={!areCommonPositionsDone()}
                  className="flex-1 py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  → {student?.isTeacher ? 'Select House' : 'Next (House Elections)'}
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await logoutStudent();
                    window.location.href = '/';
                  }}
                  disabled={submitting}
                  className="flex-1 py-4 text-lg font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {/* SECTION 2: House-Specific Positions */}
              <div className="space-y-8">
                {(() => {
                  const displayHouse = student?.isTeacher ? selectedTeacherHouse : student?.house;
                  const houseConfig = houses.find(h => h.name === displayHouse);
                  return (
                    <div className={`text-center py-4 border-b-2 bg-gradient-to-r ${houseConfig?.bgColor}`} style={{ borderColor: houseConfig?.color }}>
                      <h2 className="text-2xl font-bold text-white uppercase tracking-wider">{houseConfig?.emoji} {displayHouse} House Elections</h2>
                      <p className="text-sm text-slate-400 mt-2">Vote for {displayHouse} House positions (2 roles)</p>
                    </div>
                  );
                })()}

                {(() => {
                  const displayHouse = student?.isTeacher ? selectedTeacherHouse : student?.house;
                  const housePositions = positions.filter(p => !p.common && p.house === displayHouse);
                  return housePositions.map((position, idx) => (
                    <div key={position.name} className="card border border-slate-700/50 shadow-xl animate-fadeInScale hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 px-8 py-10 min-h-[330px]">
                      {/* Position Header */}
                      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-700/30">
                        <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold text-sm">
                          {idx + 1}
                        </span>
                        <h2 className="text-3xl font-bold text-white">{position.name}</h2>
                      </div>

                      {/* Candidates Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 justify-center max-w-2xl mx-auto">
                        {(candidates[position.name] || []).map(candidate => (
                          <label
                            key={candidate.id}
                            className={`flex flex-col items-center p-4 rounded-xl border-3 cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                              votes[position.name] === String(candidate.id)
                                ? 'border-purple-500 bg-gradient-to-b from-purple-900/40 to-purple-800/20 shadow-lg shadow-purple-500/20'
                                : 'border-slate-600 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10'
                            }`}
                          >
                            {/* Image Container */}
                            <div className="w-full mb-4 relative">
                              {candidate.image_path ? (
                                <img
                                  src={candidate.image_path}
                                  alt={candidate.name}
                                  className="w-full h-40 object-cover rounded-lg shadow-md"
                                  onError={(e) => {
                                    console.error('Image failed to load:', candidate.image_path);
                                    e.target.style.display = 'none';
                                  }}
                                  onLoad={() => {
                                    console.log('Image loaded:', candidate.image_path);
                                  }}
                                />
                              ) : (
                                <div className="w-full h-40 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center border border-slate-600">
                                  <div className="text-center">
                                    <span className="text-4xl mb-2">📸</span>
                                    <p className="text-slate-400 text-xs">No Photo</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Name */}
                            <p className="font-bold text-white text-center text-base mb-2 line-clamp-2 h-10 flex items-center">
                              {candidate.name}
                            </p>

                            {/* House Badge */}
                            {candidate.house && (
                              <span className="inline-block px-3 py-1 bg-slate-700/50 rounded-full text-xs font-semibold text-slate-200 mb-3">
                                {candidate.house}
                              </span>
                            )}

                            {/* Radio Button */}
                            <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-500 mt-2">
                              <input
                                type="radio"
                                name={position.name}
                                value={candidate.id}
                                checked={votes[position.name] === String(candidate.id)}
                                onChange={(e) => handleVoteChange(position.name, e.target.value)}
                                className="w-4 h-4 cursor-pointer"
                              />
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>

              {/* Navigation Buttons - House Level */}
              <div className="flex gap-4 pt-8 border-t border-slate-700/30">
                <button
                  type="button"
                  onClick={() => {
                    if (student?.isTeacher) {
                      setSelectedTeacherHouse(null);
                      setShowTeacherHouseSelection(true);
                    } else {
                      setShowHouseElections(false);
                    }
                  }}
                  className="flex-1 py-4 text-lg font-bold bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-300"
                >
                  ← {student?.isTeacher ? 'Change House' : 'Back'}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="shiny-cta"
                >
                  <span>{submitting ? '⏳ Submitting...' : '✓ Submit Your Vote'}</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
    </div>
  );
}
