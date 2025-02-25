import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase.from('dd_blog_posts').select('*');
      setPosts(data);
    }
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: '40px 20px', background: '#FFFFFF' }}>
      <h2 style={{ color: '#000080', textAlign: 'center' }}>Blog Posts</h2>
      {posts.map((post) => (
        <div key={post.id} style={{
          border: '1px solid #C0C0C0',
          padding: '15px',
          margin: '10px auto',
          maxWidth: '600px',
          borderRadius: '5px',
          transition: 'box-shadow 0.3s',
        }}>
          <h3 style={{ color: '#4169E1' }}>{post.title}</h3>
          <p style={{ color: '#000080' }}>{post.content}</p>
          <small style={{ color: '#C0C0C0' }}>{new Date(post.created_at).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}

export default Blog;
