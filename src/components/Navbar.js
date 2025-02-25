import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '10px', background: '#f8f9fa' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Home</Link> | 
      <Link to="/blog" style={{ marginRight: '10px' }}>Blog</Link> | 
      <Link to="/submit-tool" style={{ marginRight: '10px' }}>Submit Tool</Link> | 
      <Link to="/admin">Admin</Link>
    </nav>
  );
}
export default Navbar;
