import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import supabase from '../supabaseClient';

function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from('dd_posts').select('*').order('created_at', { ascending: false });
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto pt-24 pb-12 px-6"
    >
      <h1 className="text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">
        Blog
      </h1>
      <div className="space-y-10">
        {posts.map(post => (
          <div
            key={post.id}
            className="bg-accent bg-opacity-70 p-8 rounded-xl shadow-2xl hover:shadow-secondary/50 transition-shadow duration-300"
          >
            <h2 className="text-3xl font-semibold mb-4 text-secondary">{post.title}</h2>
            <div className="text-gray-300" dangerouslySetInnerHTML={{ __html: post.content }} />
            <p className="text-sm mt-4 text-gray-400">
              Posted on: {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default Blog;
