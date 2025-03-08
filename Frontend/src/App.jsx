import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect, createContext } from 'react';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Jobs from './pages/Jobs';
import PostJob from './pages/PostJob';
import { getCurrentUser } from './services/authService';
import ProtectedRoute from './components/ProtectedRoute';
import Apply from './pages/Apply';
import MyApplications from './pages/MyApplications';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import { SocketProvider } from './context/SocketContext';
import AdminDashboard from './pages/AdminDashboard';
import AuthCallback from './pages/AuthCallback';
import SavedJobs from './pages/SavedJobs';
import UpdateProfile from './pages/UpdateProfile';
import Profile from './pages/Profile';
import CommunityChat from './components/CommunityChat';

export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUser(user);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <SocketProvider>
        <BrowserRouter>
        <div><Toaster/></div> 
          
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route 
                path="/post-job" 
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <PostJob />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/apply/:jobId" 
                element={
                  <ProtectedRoute allowedRoles={['job_seeker']}>
                    <Apply />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-applications" 
                element={
                  <ProtectedRoute allowedRoles={['job_seeker']}>
                    <MyApplications />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['job_seeker']}>
                    <JobSeekerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/employer/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route 
                path="/saved-jobs" 
                element={
                  <ProtectedRoute allowedRoles={['job_seeker']}>
                    <SavedJobs />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/update-profile" 
                element={
                  <ProtectedRoute allowedRoles={['job_seeker']}>
                    <UpdateProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute allowedRoles={['job_seeker']}>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/community" 
                element={
                  <ProtectedRoute allowedRoles={['job_seeker']}>
                    <CommunityChat />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </BrowserRouter>
      </SocketProvider>
    </AuthContext.Provider>
  );
}

export default App;
