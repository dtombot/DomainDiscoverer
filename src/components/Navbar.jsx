import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';

function Navbar() {
  const { isAdmin, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-primary to-accent p-6 shadow-xl fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="text-3xl font-extrabold text-secondary tracking-tight"
        >
          <Link to="/">DomainDiscoverer</Link>
        </motion.div>
        <div className="space-x-8 text-lg font-medium">
          <Link to="/" className="text-white hover:text-secondary transition-colors duration-300">Home</Link>
          <Link to="/blog" className="text-white hover:text-secondary transition-colors duration-300">Blog</Link>
          {isAdmin && (
            <Link to="/admin" className="text-white hover:text-secondary transition-colors duration-300">Admin</Link>
          )}
          {isAdmin && (
            <button
              onClick={logout}
              className="text-white hover:text-secondary transition-colors duration-300"
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
