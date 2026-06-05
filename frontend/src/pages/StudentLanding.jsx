import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function StudentLanding() {
  const [scsNo, setScsNo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginStudent } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!scsNo.trim()) {
      setError('Please enter your SCS number');
      return;
    }

    setLoading(true);
    try {
      await loginStudent(scsNo);
      navigate('/confirm');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white">School Elections</h1>
            <p className="text-slate-400">Enter your SCS number to vote</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-700 rounded text-red-200 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="scs_no" className="block text-sm font-medium text-slate-300 mb-2">
                SCS Number
              </label>
              <input
                id="scs_no"
                type="text"
                placeholder="e.g., 1023"
                value={scsNo}
                onChange={(e) => setScsNo(e.target.value)}
                className="input text-center text-xl tracking-widest"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Continue'}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center text-xs text-slate-500">
            <p>This voting system is for authorized users only.</p>
            <p className="mt-1">All votes are confidential and securely stored.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
