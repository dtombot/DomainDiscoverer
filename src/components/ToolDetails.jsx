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

  if (!tool) return <div>Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6"
    >
      <div className="bg-accent p-6 rounded-lg shadow-lg">
        <img src={tool.logo_url} alt={tool.title} className="h-24 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">{tool.title}</h1>
        <p className="mb-4">{tool.description}</p>
        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
          Visit Tool
        </a>
      </div>
    </motion.div>
  );
}

export default ToolDetails;
