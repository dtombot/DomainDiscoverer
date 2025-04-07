import { motion } from 'framer-motion';

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-primary p-4 text-center"
    >
      <p>&copy; 2025 DomainDiscoverer. All rights reserved.</p>
    </motion.footer>
  );
}

export default Footer;
