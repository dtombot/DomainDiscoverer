import { motion } from 'framer-motion';

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-r from-primary to-accent p-6 text-center shadow-inner"
    >
      <p className="text-gray-300 text-sm">© 2025 DomainDiscoverer. All rights reserved.</p>
    </motion.footer>
  );
}

export default Footer;
