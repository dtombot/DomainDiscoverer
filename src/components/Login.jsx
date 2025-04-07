import { motion } from 'framer-motion';

function Login() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto pt-24 pb-12 px-6"
    >
      <h1 className="text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">
        Login
      </h1>
      <div className="bg-accent bg-opacity-70 p-8 rounded-xl shadow-2xl max-w-md mx-auto">
        <p className="text-gray-300 text-center">Login functionality coming soon!</p>
      </div>
    </motion.div>
  );
}

export default Login;
