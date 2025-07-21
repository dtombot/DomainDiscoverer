import { motion } from 'framer-motion';

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-r from-primary to-secondary p-6 text-center shadow-inner mt-20"
    >
      <p className="text-white text-sm opacity-90">
        © 2025 DomainDiscoverer. All rights reserved.
      </p>
    </motion.footer>
  );
}

export default Footer;
