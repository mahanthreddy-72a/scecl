import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function StudentConfirm() {
  const navigate = useNavigate();
  const { student, logoutStudent } = useAuth();

  const handleConfirm = () => {
    navigate('/ballot');
  };

  const handleCancel = async () => {
    await logoutStudent();
    navigate('/');
  };

  if (!student) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">Confirm Your Identity</h1>
            <p className="text-slate-400">Please verify the information below</p>
          </div>

          {/* Student Info */}
          <div className="space-y-4">
            <div className="bg-slate-800 rounded p-4">
              <p className="text-slate-400 text-sm mb-1">Name</p>
              <p className="text-lg font-semibold text-white">{student.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded p-4">
                <p className="text-slate-400 text-sm mb-1">SCS Number</p>
                <p className="text-lg font-semibold text-white">{student.scs_no}</p>
              </div>

              <div className="bg-slate-800 rounded p-4">
                <p className="text-slate-400 text-sm mb-1">Class</p>
                <p className="text-lg font-semibold text-white">{student.class}</p>
              </div>
            </div>

            <div className="bg-slate-800 rounded p-4">
              <p className="text-slate-400 text-sm mb-1">House</p>
              <p className="text-lg font-semibold text-white">{student.house}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleConfirm}
              className="btn-primary w-full py-3 font-semibold"
            >
              Confirm & Continue to Ballot
            </button>

            <button
              onClick={handleCancel}
              className="btn-secondary w-full py-3 font-semibold"
            >
              Cancel
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-slate-500">
            <p>If the information is incorrect, please contact your election officer.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
