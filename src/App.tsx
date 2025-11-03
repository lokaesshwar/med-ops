import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { TaskBoard } from './pages/TaskBoard';
import { Patients } from './pages/Patients';
import { Appointments } from './pages/Appointments';
import { Telemedicine } from './pages/Telemedicine';
import { VideoCall } from './pages/VideoCall';
import { useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/video-call/:roomId" element={<VideoCall />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <TaskBoard />
                </ProtectedRoute>
              } />
              <Route path="/patients" element={
                <ProtectedRoute>
                  <Patients />
                </ProtectedRoute>
              } />
              <Route path="/appointments" element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              } />
              <Route path="/telemedicine" element={
                <ProtectedRoute>
                  <Telemedicine />
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;