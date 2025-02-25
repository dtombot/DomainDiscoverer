import { useState } from 'react';
import supabase from '../supabaseClient';

function ToolForm() {
  const [formData, setFormData] = useState({ name: '', description: '', link: '', owner_email: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('dd_tools').insert([formData]);
    alert('Tool submitted!');
    setFormData({ name: '', description: '', link: '', owner_email: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Submit Your Tool</h2>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Tool Name" required />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
      <input name="link" value={formData.link} onChange={handleChange} placeholder="Tool URL" required />
      <input name="owner_email" value={formData.owner_email} onChange={handleChange} placeholder="Your Email" required />
      <button type="submit">Submit</button>
    </form>
  );
}
export default ToolForm;
