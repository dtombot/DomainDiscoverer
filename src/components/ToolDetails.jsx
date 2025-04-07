import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import supabase from '../supabaseClient';

function ToolDetails() {
  const { id } = useParams();
  const [tool, setTool] = useState(null);

  useEffect(() => {
    const fetchTool = async () => {
      const { data } = await supabase.from('dd_tools').select('*').eq('id', id).single();
      setTool(data);
    };
    fetchTool();
  }, [id]);

  if (!tool) return <div className="text-center text-gray-400 pt-24">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto pt-24 pb-12 px-6"
    >
      <div className="bg-accent bg-opacity-80 p-8 rounded-xl shadow-2xl max-w-2xl mx-auto">
        <img
          src={tool.logo_url}
          alt={tool.title}
          className="h-32 mx-auto mb-6 rounded-full border-4 border-secondary"
        />
        <h1 className="text-4xl font-extrabold text-center mb-6 text-secondary">{tool.title}</h1>
        <p className="text-gray-300 text-center mb-6">{tool.description}</p>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-secondary text-primary py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300"
        >
          Visit Tool
        </a>
      </div>
    </motion.div>
  );
}

export default ToolDetails;
