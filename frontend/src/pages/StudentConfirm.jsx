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

  const getHouseColor = (house) => {
    const colors = {
      'Spartans': { bg: 'bg-red-600', light: 'bg-red-900/30 border-red-700/50' },
      'Vikings': { bg: 'bg-blue-600', light: 'bg-blue-900/30 border-blue-700/50' },
      'Knights': { bg: 'bg-yellow-600', light: 'bg-yellow-900/30 border-yellow-700/50' },
      'Samurais': { bg: 'bg-purple-600', light: 'bg-purple-900/30 border-purple-700/50' }
    };
    return colors[house] || { bg: 'bg-slate-600', light: 'bg-slate-800' };
  };

  const houseColor = getHouseColor(student.house);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl font-bold text-white">Verify Your Identity</h1>
          <p className="text-slate-400 text-lg">Please confirm your details</p>
        </div>

        {/* Profile Card */}
        <div className={`card border-2 border-slate-700 space-y-8 p-8 bg-gradient-to-b from-slate-800 to-slate-900`}>

          {/* Profile Section */}
          <div className={`rounded-xl p-8 border-2 ${houseColor.light} space-y-6`}>

            {/* Student Name - Large & Prominent */}
            <div className="text-center space-y-2">
              <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold">Your Name</p>
              <p className="text-4xl font-bold text-white">{student.name}</p>
            </div>

            {/* House Badge */}
            <div className="flex justify-center">
              <div className={`${houseColor.bg} text-white px-8 py-3 rounded-full font-bold text-lg tracking-wide shadow-lg`}>
                🏠 {student.house}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-600/50">
              {/* SCS Number */}
              <div className="bg-slate-800/70 rounded-lg p-5 border border-slate-600/50">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3">SCS Number</p>
                <p className="text-2xl font-bold text-blue-400 font-mono">{student.scs_no}</p>
              </div>

              {/* Class */}
              <div className="bg-slate-800/70 rounded-lg p-5 border border-slate-600/50">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3">Class</p>
                <p className="text-2xl font-bold text-green-400">{student.class}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={handleConfirm}
              className="w-full btn-primary py-4 text-lg font-bold hover:scale-105 transition-transform shadow-lg"
            >
              ✓ Confirm & Vote
            </button>

            <button
              onClick={handleCancel}
              className="w-full btn-secondary py-3 font-semibold hover:opacity-80 transition"
            >
              ← Change SCS Number
            </button>
          </div>

          {/* Info Message */}
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
            <p className="text-blue-300 text-sm text-center">
              ℹ️ If the information is incorrect, click "Change SCS Number" to go back and enter again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
