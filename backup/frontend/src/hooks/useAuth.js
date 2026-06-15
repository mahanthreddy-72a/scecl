import { useState, useCallback, useEffect } from 'react';
import { authAPI } from '../utils/api';

export const useAuth = () => {
  const [admin, setAdmin] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        try {
          const response = await authAPI.adminStatus();
          setAdmin(response.data.admin);
        } catch (e) {
          // Not admin
        }

        try {
          const response = await authAPI.studentStatus();
          setStudent(response.data.student);
        } catch (e) {
          // Not student
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  const loginAdmin = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.adminLogin(username, password);
      setAdmin(response.data.admin);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginStudent = useCallback(async (scs_no) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.studentLogin(scs_no);
      setStudent(response.data.student);
      setLoading(false);
      return { success: true, ...response.data };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const logoutAdmin = useCallback(async () => {
    try {
      await authAPI.adminLogout();
      setAdmin(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }, []);

  const logoutStudent = useCallback(async () => {
    try {
      await authAPI.studentLogout();
      setStudent(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }, []);

  return {
    admin,
    student,
    loading,
    error,
    loginAdmin,
    loginStudent,
    logoutAdmin,
    logoutStudent,
    isAdminAuth: !!admin,
    isStudentAuth: !!student
  };
};
