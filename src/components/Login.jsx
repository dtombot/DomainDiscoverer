import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError('Login failed. Check your credentials.');
    }
  };

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
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-primary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Fixed: was setEmail
            className="w-full p-3 bg-primary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <button
            type="submit"
            className="w-full bg-secondary text-primary p-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300"
          >
            Log In
          </button>
        </form>
        {error && <p className="text-red-300 text-center mt-4">{error}</p>}
      </div>
    </motion.div>
  );
}

export default Login;
