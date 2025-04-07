import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';

function Navbar() {
  const { isAdmin } = useAuth();

  return (
    <nav className="bg-blue-500 p-6">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="text-3xl font-bold text-white"
        >
          <Link to="/">DomainDiscoverer</Link>
        </motion.div>
        <div className="space-x-6 text-lg text-white">
          <Link to="/" className="hover:text-yellow-300">Home</Link>
          <Link to="/blog" className="hover:text-yellow-300">Blog</Link>
          {isAdmin && (
            <Link to="/admin" className="hover:text-yellow-300">Admin</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
