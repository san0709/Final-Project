import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import EditProfile from './pages/EditProfile';
import FriendRequests from './pages/FriendRequests';
import Search from './pages/Search';
import FriendsList from './pages/FriendsList';
import Friends from './pages/Friends';

// 🔐 Protected Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          {/* 🔓 PUBLIC ROUTES (NO LAYOUT) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* 🔒 PROTECTED ROUTES (WITH LAYOUT) */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/friend-requests" element={<FriendRequests />} />
            <Route path="/search" element={<Search />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/friends/:userId" element={<Friends />} />
            <Route path="/friends/:userId/list" element={<FriendsList />} />
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
