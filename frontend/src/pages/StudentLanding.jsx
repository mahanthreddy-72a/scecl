import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShinyButton } from '../components/ShinyButton';

export default function StudentLanding() {
  const [scsNo, setScsNo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { student, loginStudent, logoutStudent } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!scsNo.trim()) {
      setError('Please enter your SCS number');
      return;
    }

    if (scsNo.length < 4) {
      setError('SCS number must be at least 4 digits');
      return;
    }

    setLoading(true);
    try {
      // Combine "SCS" prefix with the number for database lookup
      const fullScsNo = `SCS${scsNo}`;
      await loginStudent(fullScsNo);
      setLoading(false);
    } catch (err) {
      const errorMsg = err?.response?.data?.error || err?.message || 'Login failed. Please try again.';
      setError(errorMsg);
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    window.location.href = '/ballot';
  };

  const handleBack = async () => {
    await logoutStudent();
    setScsNo('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      <style>{`
        @property --gradient-angle {syntax:"<angle>";initial-value:0deg;inherits:false;}
        @property --gradient-angle-offset {syntax:"<angle>";initial-value:0deg;inherits:false;}
        @property --gradient-percent {syntax:"<percentage>";initial-value:5%;inherits:false;}
        @property --gradient-shine {syntax:"<color>";initial-value:white;inherits:false;}
        .shiny-cta {--shiny-cta-bg:#1e40af;--shiny-cta-bg-subtle:#1e3a8a;--shiny-cta-fg:#fff;--shiny-cta-highlight:#3b82f6;--shiny-cta-highlight-subtle:#60a5fa;--animation:gradient-angle linear infinite;--duration:3s;--shadow-size:2px;--transition:800ms cubic-bezier(0.25,1,0.5,1);isolation:isolate;position:relative;overflow:hidden;cursor:pointer;padding:1.25rem 2.5rem;font-size:1.125rem;font-weight:600;border:1px solid transparent;border-radius:0.75rem;color:var(--shiny-cta-fg);background:linear-gradient(var(--shiny-cta-bg),var(--shiny-cta-bg))padding-box,conic-gradient(from calc(var(--gradient-angle) - var(--gradient-angle-offset)),transparent,var(--shiny-cta-highlight)var(--gradient-percent),var(--gradient-shine)calc(var(--gradient-percent)*2),var(--shiny-cta-highlight)calc(var(--gradient-percent)*3),transparent calc(var(--gradient-percent)*4))border-box;box-shadow:inset 0 0 0 1px var(--shiny-cta-bg-subtle);transition:var(--transition);transition-property:--gradient-angle-offset,--gradient-percent,--gradient-shine;width:100%;}
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

      {/* Animated Background Elements */}
      <div className="absolute top-10 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

      {/* Top-Left Header with Logo */}
      <div className="fixed top-6 left-6 z-20 animate-fadeInDown">
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

      {/* Main Content - Centered */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md z-10">
          {/* School Elections Title - Outside Box */}
          <div className="text-center mb-8 space-y-3 animate-fadeInDown">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              🗳️ Student Council Elections
            </h1>
            <p className="text-xl text-slate-300 font-semibold">Cast Your Vote</p>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>

          {/* Login Box */}
          <div className="border-2 border-slate-600/50 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm shadow-2xl space-y-8 animate-fadeInUp rounded-2xl p-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-900/40 border-2 border-red-500/50 rounded-2xl text-red-200 text-sm font-semibold animate-wiggle">
                  ⚠️ {error}
                </div>
              )}

              <div className="space-y-3">
                <label htmlFor="scs_no" className="block text-sm font-bold text-slate-300 uppercase tracking-widest">
                  🔑 Enter Your SCS Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-3xl font-mono font-bold text-blue-400 tracking-widest">
                    SCS
                  </span>
                  <input
                    id="scs_no"
                    type="text"
                    placeholder="1234567"
                    value={scsNo}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9]/g, '');
                      if (value.startsWith('SCS')) {
                        value = value.substring(3);
                      }
                      setScsNo(value);
                    }}
                    className="w-full text-center text-3xl font-mono tracking-widest pl-20 pr-4 py-4 bg-slate-700/50 border-2 border-slate-600 rounded-2xl text-white placeholder-slate-500 hover:border-blue-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 hover:bg-slate-700"
                    disabled={loading || !!student}
                    autoFocus
                    maxLength="20"
                  />
                </div>
                <p className="text-xs text-slate-400 text-center">Your SCS Number • Numeric only</p>
              </div>

              <button
                type="submit"
                disabled={loading || !!student}
                className="w-full shiny-cta"
                style={{marginTop: '1rem'}}
              >
                <span>
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Verifying...
                    </>
                  ) : (
                    '→ Continue'
                  )}
                </span>
              </button>
            </form>

            {/* Student Profile - Shows After Login */}
            {student && (
              <>
                <div className="border-t border-slate-600/50 pt-6 space-y-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-5 rounded-2xl border border-blue-600/30 animate-slideInUp mt-6">
                  <h3 className="text-sm font-bold text-blue-300 uppercase tracking-wider mb-4">✓ Verified Details</h3>

                  <div className="space-y-3">
                    <p className="text-sm text-slate-200"><span className="font-bold text-blue-400">👤 Name:</span> {student.name}</p>
                    <p className="text-sm text-slate-200"><span className="font-bold text-blue-400">🆔 SCS:</span> <span className="font-mono text-blue-300">{student.scs_no}</span></p>
                    <p className="text-sm text-slate-200"><span className="font-bold text-blue-400">📚 Class:</span> {student.class}</p>
                    <p className="text-sm text-slate-200"><span className="font-bold text-blue-400">🏠 House:</span> <span className="font-semibold text-purple-300">{student.house}</span></p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 animate-slideInUp">
                  <button
                    onClick={handleConfirm}
                    className="w-full btn-primary py-4 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 hover:scale-105 hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 shadow-lg"
                  >
                    ✓ Confirm & Vote
                  </button>

                  <button
                    onClick={handleBack}
                    className="w-full btn-secondary py-3 font-bold text-slate-200 bg-slate-700 hover:bg-slate-600 transition-all duration-300"
                  >
                    ← Change SCS Number
                  </button>
                </div>
              </>
            )}

            {!student && (
              <div className="text-center space-y-2 text-xs text-slate-300 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 p-4 rounded-2xl border border-cyan-700/30 animate-fadeIn">
                <p>✓ Your vote is confidential and securely stored</p>
                <p>✓ Each student can vote only once</p>
                <p>✓ Double-voting is prevented automatically</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out both;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-wiggle {
          animation: wiggle 0.3s ease-in-out;
        }

        .bg-gradient-to-r.from-blue-600.to-purple-600 {
          background: linear-gradient(to right, #2563eb, #9333ea);
        }
      `}</style>
    </div>
  );
}
