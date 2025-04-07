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
      className="container mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-accent p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            <p className="text-sm mt-2">Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default Blog;
