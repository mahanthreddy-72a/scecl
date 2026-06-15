import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username and password required');
      return;
    }

    setLoading(true);
    try {
      await loginAdmin(username, password);
      // Use window.location for navigation
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 100);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

      <style>{`
        @property --gradient-angle {syntax:"<angle>";initial-value:0deg;inherits:false;}
        @property --gradient-angle-offset {syntax:"<angle>";initial-value:0deg;inherits:false;}
        @property --gradient-percent {syntax:"<percentage>";initial-value:5%;inherits:false;}
        @property --gradient-shine {syntax:"<color>";initial-value:white;inherits:false;}
        .shiny-cta-admin {--shiny-cta-bg:#991b1b;--shiny-cta-bg-subtle:#7f1d1d;--shiny-cta-fg:#fff;--shiny-cta-highlight:#dc2626;--shiny-cta-highlight-subtle:#ef4444;--animation:gradient-angle linear infinite;--duration:3s;--shadow-size:2px;--transition:800ms cubic-bezier(0.25,1,0.5,1);isolation:isolate;position:relative;overflow:hidden;cursor:pointer;padding:1.25rem 2.5rem;font-size:1.125rem;font-weight:600;border:1px solid transparent;border-radius:0.75rem;color:var(--shiny-cta-fg);background:linear-gradient(var(--shiny-cta-bg),var(--shiny-cta-bg))padding-box,conic-gradient(from calc(var(--gradient-angle) - var(--gradient-angle-offset)),transparent,var(--shiny-cta-highlight)var(--gradient-percent),var(--gradient-shine)calc(var(--gradient-percent)*2),var(--shiny-cta-highlight)calc(var(--gradient-percent)*3),transparent calc(var(--gradient-percent)*4))border-box;box-shadow:inset 0 0 0 1px var(--shiny-cta-bg-subtle);transition:var(--transition);transition-property:--gradient-angle-offset,--gradient-percent,--gradient-shine;width:100%;}
        .shiny-cta-admin::before,.shiny-cta-admin::after,.shiny-cta-admin span::before{content:"";pointer-events:none;position:absolute;inset-inline-start:50%;inset-block-start:50%;translate:-50% -50%;z-index:-1;}
        .shiny-cta-admin:active{translate:0 1px;}
        .shiny-cta-admin::before{--size:calc(100% - var(--shadow-size)*3);--position:2px;--space:calc(var(--position)*2);width:var(--size);height:var(--size);background:radial-gradient(circle at var(--position) var(--position),white calc(var(--position)/4),transparent 0)padding-box;background-size:var(--space)var(--space);background-repeat:space;mask-image:conic-gradient(from calc(var(--gradient-angle)+45deg),black,transparent 10% 90%,black);border-radius:inherit;opacity:0.4;z-index:-1;}
        .shiny-cta-admin::after{--animation:shimmer linear infinite;width:100%;aspect-ratio:1;background:linear-gradient(-50deg,transparent,var(--shiny-cta-highlight),transparent);mask-image:radial-gradient(circle at bottom,transparent 40%,black);opacity:0.6;}
        .shiny-cta-admin span{z-index:1;}
        .shiny-cta-admin span::before{--size:calc(100% + 1rem);width:var(--size);height:var(--size);box-shadow:inset 0 -1ex 2rem 4px var(--shiny-cta-highlight);opacity:0;transition:opacity var(--transition);animation:calc(var(--duration)*1.5)breathe linear infinite;}
        .shiny-cta-admin,.shiny-cta-admin::before,.shiny-cta-admin::after{animation:var(--animation)var(--duration),var(--animation)calc(var(--duration)/0.4)reverse paused;animation-composition:add;}
        .shiny-cta-admin:is(:hover,:focus-visible){--gradient-percent:20%;--gradient-angle-offset:95deg;--gradient-shine:var(--shiny-cta-highlight-subtle);}
        .shiny-cta-admin:is(:hover,:focus-visible),.shiny-cta-admin:is(:hover,:focus-visible)::before,.shiny-cta-admin:is(:hover,:focus-visible)::after{animation-play-state:running;}
        .shiny-cta-admin:is(:hover,:focus-visible)span::before{opacity:1;}
        .shiny-cta-admin:disabled{opacity:0.5;cursor:not-allowed;}
        @keyframes gradient-angle{to{--gradient-angle:360deg;}}
        @keyframes shimmer{to{rotate:360deg;}}
        @keyframes breathe{from,to{scale:1;}50%{scale:1.2;}}
      `}</style>

      <div className="w-full max-w-md z-10">
        <div className="border-2 border-red-700/50 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm shadow-2xl space-y-8 rounded-2xl p-8 animate-fadeInUp">
          {/* Logo */}
          <div className="flex justify-center animate-slideInDown">
            <img
              src="/logo.png"
              alt="Sri Chaitanya Techno School"
              className="h-6 object-contain drop-shadow-lg"
              style={{
                imageRendering: 'auto',
                filter: 'blur(0.5px)',
                WebkitFontSmoothing: 'antialiased'
              }}
            />
          </div>

          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              🔐 Admin Panel
            </h1>
            <p className="text-slate-400 text-lg">School Elections Management</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-900/40 border-2 border-red-500/50 rounded-2xl text-red-200 text-sm font-semibold animate-wiggle">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-3">
              <label htmlFor="username" className="block text-sm font-bold text-slate-300 uppercase tracking-widest">
                👤 Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-center text-lg font-mono px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-2xl text-white placeholder-slate-500 hover:border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/50 transition-all duration-300 hover:bg-slate-700"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="block text-sm font-bold text-slate-300 uppercase tracking-widest">
                🔑 Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-center text-lg font-mono px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-2xl text-white placeholder-slate-500 hover:border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/50 transition-all duration-300 hover:bg-slate-700"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full shiny-cta-admin"
              style={{marginTop: '1.5rem'}}
            >
              <span>
                {loading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Logging in...
                  </>
                ) : (
                  '→ Login'
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="text-center space-y-2 text-xs text-slate-400 bg-red-900/20 p-4 rounded-2xl border border-red-700/30">
            <p>✓ Admin credentials required</p>
            <p>✓ For authorized administrators only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
