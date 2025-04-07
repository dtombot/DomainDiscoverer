import { motion } from 'framer-motion';

function Login() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <p>Login functionality coming soon!</p>
    </motion.div>
  );
}

export default Login;
