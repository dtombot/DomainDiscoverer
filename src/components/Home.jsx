import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import supabase from '../supabaseClient';

function Home() {
  const [featuredTools, setFeaturedTools] = useState([]);
  const [otherTools, setOtherTools] = useState([]);

  useEffect(() => {
    const fetchTools = async () => {
      const { data } = await supabase.from('dd_tools').select('*');
      setFeaturedTools(data.filter(tool => tool.is_featured));
      setOtherTools(data.filter(tool => !tool.is_featured));
    };
    fetchTools();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        Discover Top Domaining Tools
      </motion.h1>

      {/* Featured Tools */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTools.map(tool => (
            <motion.div
              key={tool.id}
              whileHover={{ scale: 1.05 }}
              className="bg-accent p-4 rounded-lg shadow-lg float-animation"
            >
              <Link to={`/tool/${tool.id}`}>
                <img src={tool.logo_url} alt={tool.title} className="h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold">{tool.title}</h3>
                <p>{tool.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Other Tools */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">More Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherTools.map(tool => (
            <motion.div
              key={tool.id}
              whileHover={{ scale: 1.05 }}
              className="bg-accent p-4 rounded-lg shadow-lg"
            >
              <Link to={`/tool/${tool.id}`}>
                <img src={tool.logo_url} alt={tool.title} className="h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold">{tool.title}</h3>
                <p>{tool.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
