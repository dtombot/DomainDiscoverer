import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav style={{
      padding: '15px 20px',
      background: '#000080',
      color: '#FFFFFF',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFD700' }}>DomainDiscoverer</div>
      <div>
        <Link to="/" style={navLinkStyle}>Home</Link>
        <Link to="/blog" style={navLinkStyle}>Blog</Link>
        <Link to="/submit-tool" style={navLinkStyle}>Submit Tool</Link>
        {user && user.email === 'tomselfdevelopr@gmail.com' && (
          <Link to="/admin" style={navLinkStyle}>Admin</Link>
        )}
        {user ? (
          <button onClick={signOut} style={navLinkStyle}>Logout</button>
        ) : (
          <Link to="/login" style={navLinkStyle}>Login</Link>
        )}
      </div>
    </nav>
  );
}

const navLinkStyle = {
  margin: '0 15px',
  color: '#FFFFFF',
  textDecoration: 'none',
  fontSize: '18px',
  transition: 'color 0.3s',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};

export default Navbar;
