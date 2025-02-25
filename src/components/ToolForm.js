import { useState } from 'react';
import { useAuth } from './AuthContext';
import supabase from '../supabaseClient';

function ToolForm() {
  const [formData, setFormData] = useState({ name: '', description: '', link: '', owner_email: '' });
  const { user } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a tool.');
      return;
    }
    await supabase.from('dd_tools').insert([{ ...formData, owner_email: user.email }]);
    alert('Tool submitted!');
    setFormData({ name: '', description: '', link: '', owner_email: '' });
  };

  return (
    <div style={{ padding: '40px 20px', background: '#FFFFFF', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#000080', textAlign: 'center' }}>Submit Your Tool</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tool Name"
          required
          style={inputStyle}
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
          style={{ ...inputStyle, height: '100px' }}
        />
        <input
          name="link"
          value={formData.link}
          onChange={handleChange}
          placeholder="Tool URL"
          required
          style={inputStyle}
        />
        <input
          name="owner_email"
          value={formData.owner_email}
          onChange={handleChange}
          placeholder="Your Email"
          required
          style={inputStyle}
          disabled={user} // Auto-filled with logged-in user's email
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
          Submit
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

export default ToolForm;
