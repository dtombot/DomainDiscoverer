import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Navbar() {
  return (
    <nav className="bg-primary p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div whileHover={{ scale: 1.1 }} className="text-2xl font-bold">
          <Link to="/">DomainDiscoverer</Link>
        </motion.div>
        <div className="space-x-6">
          <Link to="/" className="hover:text-secondary">Home</Link>
          <Link to="/blog" className="hover:text-secondary">Blog</Link>
          <Link to="/submit-tool" className="hover:text-secondary">Submit Tool</Link>
          <Link to="/admin" className="hover:text-secondary">Admin</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
