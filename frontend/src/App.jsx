import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Pages
import PasswordGate from './pages/PasswordGate';
import StudentLanding from './pages/StudentLanding';
import StudentConfirm from './pages/StudentConfirm';
import StudentBallot from './pages/StudentBallot';
import StudentSuccess from './pages/StudentSuccess';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminCandidates from './pages/AdminCandidates';
import AdminStudents from './pages/AdminStudents';
import AdminResults from './pages/AdminResults';

function App() {
  const { admin, student, loading, isAdminAuth, isStudentAuth } = useAuth();
  const [gateUnlocked, setGateUnlocked] = useState(false);

  useEffect(() => {
    // Check if already unlocked in localStorage
    const unlocked = localStorage.getItem('gateUnlocked') === 'true';
    setGateUnlocked(unlocked);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show password gate if not unlocked
  if (!gateUnlocked) {
    return <PasswordGate onUnlock={() => setGateUnlocked(true)} />;
  }

  return (
    <Router>
      <Routes>
        {/* Student routes */}
        <Route path="/" element={isStudentAuth ? <Navigate to="/ballot" /> : <StudentLanding />} />
        <Route path="/confirm" element={isStudentAuth ? <StudentConfirm /> : <Navigate to="/" />} />
        <Route path="/ballot" element={isStudentAuth ? <StudentBallot /> : <Navigate to="/" />} />
        <Route path="/success" element={isStudentAuth ? <StudentSuccess /> : <Navigate to="/" />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={isAdminAuth ? <Navigate to="/admin/dashboard" /> : <AdminLogin />} />
        <Route path="/admin/dashboard" element={isAdminAuth ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/candidates" element={isAdminAuth ? <AdminCandidates /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/students" element={isAdminAuth ? <AdminStudents /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/results" element={isAdminAuth ? <AdminResults /> : <Navigate to="/admin/login" />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
