import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CourseDetail from './pages/CourseDetail';
import LessonPlayer from './pages/LessonPlayer';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import SubscribeSuccess from './pages/SubscribeSuccess';
import SubscribeCancel from './pages/SubscribeCancel';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function SubscribedRoute({ children }) {
  const { user, loading, hasSubscription } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!hasSubscription) return <Navigate to="/pricing" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Catalog />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<SubscribedRoute><LessonPlayer /></SubscribedRoute>} />
        <Route path="/dashboard" element={<SubscribedRoute><Dashboard /></SubscribedRoute>} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/subscribe/success" element={<PrivateRoute><SubscribeSuccess /></PrivateRoute>} />
        <Route path="/subscribe/cancel" element={<SubscribeCancel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}
