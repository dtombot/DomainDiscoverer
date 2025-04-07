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
    <div className="container mx-auto pt-24 pb-12 px-6">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent"
      >
        Discover Top Domaining Tools
      </motion.h1>

      {/* Featured Tools */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-secondary">Featured Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredTools.map(tool => (
            <motion.div
              key={tool.id}
              whileHover={{ scale: 1.05 }}
              className="bg-accent bg-opacity-80 p-6 rounded-xl shadow-2xl hover:shadow-secondary/50 transition-shadow duration-300 float-animation"
            >
              <Link to={`/tool/${tool.id}`}>
                <img src={tool.logo_url} alt={tool.title} className="h-20 mx-auto mb-6 rounded-full" />
                <h3 className="text-2xl font-bold text-center mb-4">{tool.title}</h3>
                <p className="text-gray-300 text-center">{tool.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Other Tools */}
      <section>
        <h2 className="text-3xl font-semibold mb-8 text-secondary">More Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {otherTools.map(tool => (
            <motion.div
              key={tool.id}
              whileHover={{ scale: 1.05 }}
              className="bg-accent bg-opacity-60 p-6 rounded-xl shadow-lg hover:shadow-secondary/40 transition-shadow duration-300"
            >
              <Link to={`/tool/${tool.id}`}>
                <img src={tool.logo_url} alt={tool.title} className="h-16 mx-auto mb-4 rounded-full" />
                <h3 className="text-xl font-bold text-center mb-3">{tool.title}</h3>
                <p className="text-gray-300 text-center">{tool.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
