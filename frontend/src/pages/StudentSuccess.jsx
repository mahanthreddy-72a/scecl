import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function StudentSuccess() {
  const { logoutStudent } = useAuth();
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          logoutStudent().then(() => {
            window.location.href = '/';
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGoHome = async () => {
    await logoutStudent();
    window.location.href = '/';
  };

  return (
    <div className="h-screen bg-gradient-to-br from-green-950 via-slate-900 to-blue-950 flex items-center justify-center p-3 relative overflow-hidden">
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
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-slideInDown { animation: slideInDown 0.6s ease-out; }
        .animate-slideInUp { animation: slideInUp 0.6s ease-out both; }
        .animate-fadeInScale { animation: fadeInScale 0.6s ease-out both; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
      `}</style>

      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="w-full max-w-lg z-10">
        <div className="border-2 border-green-700/50 bg-gradient-to-b from-slate-800/70 to-slate-900/70 backdrop-blur-sm shadow-2xl text-center rounded-3xl p-6 space-y-5 animate-fadeInScale">

          {/* School Logo */}
          <div className="flex justify-center animate-slideInDown">
            <img
              src="/logo.png"
              alt="Sri Chaitanya Techno School"
              className="h-12 object-contain drop-shadow-lg"
              style={{
                imageRendering: 'auto',
                filter: 'blur(0.5px)',
                WebkitFontSmoothing: 'antialiased'
              }}
            />
          </div>

          {/* Animated Success Icon */}
          <div className="flex justify-center">
            <div className="relative animate-bounce-gentle">
              <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/60">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4 animate-slideInUp" style={{animationDelay: '0.2s'}}>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                ✓ Vote Submitted!
              </h1>
              <p className="text-lg text-slate-200 font-semibold">Your vote has been recorded successfully</p>
            </div>
          </div>

          {/* Confirmation Details */}
          <div className="space-y-6 animate-slideInUp" style={{animationDelay: '0.4s'}}>
            <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-700/50 rounded-2xl p-4 space-y-2">
              <p className="text-slate-100 text-sm leading-relaxed font-medium">
                <span className="block text-lg mb-3">🔒 Your vote is protected</span>
                ✓ Confidential and securely stored in the database<br/>
                ✓ You are marked as voted in the system<br/>
                ✓ Your vote cannot be changed or duplicated
              </p>
            </div>

            {/* Thank You Message */}
            <div className="bg-gradient-to-r from-blue-900/40 to-slate-900/40 border-2 border-blue-700/50 rounded-2xl p-4">
              <p className="text-blue-200 text-lg font-semibold">
                🙏 Thank you for participating in the election!
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4 animate-slideInUp" style={{animationDelay: '0.6s'}}>
            <button
              onClick={handleGoHome}
              className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 active:scale-95"
            >
              🏠 Go to Home Instantly
            </button>

            <div className="space-y-2">
              <p className="text-slate-300 text-sm font-semibold">Auto-redirecting in {countdown} seconds...</p>
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden border border-slate-600/50">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                  style={{width: `${(countdown / 4) * 100}%`}}
                ></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
