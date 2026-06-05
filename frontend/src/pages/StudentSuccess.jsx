import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function StudentSuccess() {
  const navigate = useNavigate();
  const { logoutStudent } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      logoutStudent().then(() => {
        navigate('/');
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card text-center space-y-6">
          {/* Success icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Vote Submitted!</h1>
            <p className="text-slate-400">Your vote has been recorded successfully.</p>
          </div>

          {/* Details */}
          <div className="bg-slate-800 rounded p-4 text-sm text-slate-300">
            <p>Thank you for participating in the school elections.</p>
            <p className="mt-2 text-xs text-slate-500">You will be logged out automatically.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
