import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import supabase from '../supabaseClient';

function AdminDashboard() {
  const [tools, setTools] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newTool, setNewTool] = useState({ title: '', description: '', url: '', is_featured: false });
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: toolsData } = await supabase.from('dd_tools').select('*');
    const { data: postsData } = await supabase.from('dd_posts').select('*');
    setTools(toolsData);
    setPosts(postsData);
  };

  const handleToolSubmit = async (e) => {
    e.preventDefault();
    let logoUrl = '';
    if (logoFile) {
      const { data } = await supabase.storage.from('logos').upload(`${Date.now()}-${logoFile.name}`, logoFile);
      logoUrl = supabase.storage.from('logos').getPublicUrl(data.path).data.publicUrl;
    }
    await supabase.from('dd_tools').insert({ ...newTool, logo_url: logoUrl });
    fetchData();
    setNewTool({ title: '', description: '', url: '', is_featured: false });
    setLogoFile(null);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('dd_posts').insert(newPost);
    fetchData();
    setNewPost({ title: '', content: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto pt-24 pb-12 px-6"
    >
      <h1 className="text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">
        Admin Dashboard
      </h1>

      {/* Add Tool */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6 text-secondary">Add New Tool</h2>
        <form onSubmit={handleToolSubmit} className="space-y-6 bg-accent bg-opacity-70 p-8 rounded-xl shadow-2xl">
          <input
            type="text"
            placeholder="Tool Title"
            value={newTool.title}
            onChange={(e) => setNewTool({ ...newTool, title: e.target.value })}
            className="w-full p-3 bg-primary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <textarea
            placeholder="Description"
            value={newTool.description}
            onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
            className="w-full p-3 bg-primary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <input
            type="text"
            placeholder="Tool URL"
            value={newTool.url}
            onChange={(e) => setNewTool({ ...newTool, url: e.target.value })}
            className="w-full p-3 bg-primary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <input
            type="file"
            onChange={(e) => setLogoFile(e.target.files[0])}
            className="w-full p-3 text-gray-300"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={newTool.is_featured}
              onChange={(e) => setNewTool({ ...newTool, is_featured: e.target.checked })}
              className="form-checkbox text-secondary"
            />
            <span className="text-gray-300">Featured</span>
          </label>
          <button
            type="submit"
            className="w-full bg-secondary text-primary p-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300"
          >
            Add Tool
          </button>
        </form>
      </section>

      {/* Add Blog Post */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6 text-secondary">Add New Blog Post</h2>
        <form onSubmit={handlePostSubmit} className="space-y-6 bg-accent bg-opacity-70 p-8 rounded-xl shadow-2xl">
          <input
            type="text"
            placeholder="Post Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full p-3 bg-primary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <ReactQuill
            value={newPost.content}
            onChange={(content) => setNewPost({ ...newPost, content })}
            className="bg-white text-black rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-secondary text-primary p-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300"
          >
            Add Post
          </button>
        </form>
      </section>

      {/* Tools List */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 text-secondary">Current Tools</h2>
        <ul className="space-y-4">
          {tools.map(tool => (
            <li
              key={tool.id}
              className="bg-accent bg-opacity-60 p-6 rounded-lg shadow-lg text-gray-300"
            >
              {tool.title} - {tool.is_featured ? 'Featured' : 'Regular'}
            </li>
          ))}
        </ul>
      </section>
    </motion.div>
  );
}

export default AdminDashboard;
