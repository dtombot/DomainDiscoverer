import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';

function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-primary to-secondary p-5 shadow-xl fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
        >
          <Link to="/" className="hover:text-accent transition">DomainDiscoverer</Link>
        </motion.div>
        <div className="space-x-4 sm:space-x-8 text-base sm:text-lg font-medium flex items-center">
          <Link to="/" className="text-white hover:text-accent transition">Home</Link>
          {user && role === "admin" && (
            <Link to="/admin" className="text-accent font-bold hover:text-white transition">Admin</Link>
          )}
          {!user && (
            <>
              <Link to="/login" className="text-white hover:text-accent transition">Login</Link>
              <Link to="/signup" className="text-white hover:text-accent transition">Sign Up</Link>
            </>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="bg-secondary text-primary px-4 py-2 rounded-xl ml-2 font-bold hover:bg-primary hover:text-secondary border border-secondary transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
