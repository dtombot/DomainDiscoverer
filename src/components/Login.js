import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/'); // Redirect to home after login
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ padding: '40px 20px', background: '#FFFFFF', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#000080', textAlign: 'center' }}>Login</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={inputStyle}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={inputStyle}
        />
        <button type="submit" style={{
          padding: '12px',
          background: '#FFD700',
          color: '#000080',
          border: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }}>
          Login
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  border: '1px solid #C0C0C0',
  borderRadius: '5px',
  fontSize: '16px',
};

export default Login;
