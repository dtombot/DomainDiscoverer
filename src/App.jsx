import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Blog from './components/Blog';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import Login from './components/Login';
import ToolDetails from './components/ToolDetails';

function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="text-center text-gray-400 pt-24">Loading...</div>;
  return isAdmin ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-primary">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route
              path="/admin"
              element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/tool/:id" element={<ToolDetails />} />
            <Route path="*" element={<div className="text-center text-gray-400 pt-24">Page Not Found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
