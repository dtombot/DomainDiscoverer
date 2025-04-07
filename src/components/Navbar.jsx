import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Navbar() {
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
          <Link to="/" className="hover:text-secondary transition-colors duration-300">Home</Link>
          <Link to="/blog" className="hover:text-secondary transition-colors duration-300">Blog</Link>
          <Link to="/admin" className="hover:text-secondary transition-colors duration-300">Admin</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
