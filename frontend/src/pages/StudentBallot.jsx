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
    const requiredPositions = positions.map(p => p.name);
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
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">School Elections</h1>
          <p className="text-slate-400">Cast Your Vote</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {positions.map(position => (
            <div key={position.name} className="card">
              <h2 className="text-2xl font-bold text-white mb-6">{position.name}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(candidates[position.name] || []).map(candidate => (
                  <label
                    key={candidate.id}
                    className="relative flex items-start p-4 border-2 border-slate-700 rounded-lg cursor-pointer hover:border-blue-600 transition-colors"
                  >
                    <input
                      type="radio"
                      name={position.name}
                      value={candidate.id}
                      checked={votes[position.name] === String(candidate.id)}
                      onChange={(e) => handleVoteChange(position.name, e.target.value)}
                      className="w-5 h-5 mt-0.5"
                    />
                    <div className="ml-4 flex-1">
                      {candidate.image_path && (
                        <img
                          src={candidate.image_path}
                          alt={candidate.name}
                          className="w-full h-40 object-cover rounded mb-2"
                        />
                      )}
                      <p className="font-semibold text-white text-lg">{candidate.name}</p>
                      {candidate.house && (
                        <p className="text-sm text-slate-400">{candidate.house}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Vote'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="flex-1 btn-secondary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
