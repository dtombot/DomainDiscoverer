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
    <div>
      <h2>Blog Posts</h2>
      {posts.map((post) => (
        <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>{new Date(post.created_at).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}
export default Blog;
