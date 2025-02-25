import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

function PostsManager() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data } = await supabase.from('dd_blog_posts').select('*');
    setPosts(data);
  }

  async function addPost() {
    await supabase.from('dd_blog_posts').insert([newPost]);
    setNewPost({ title: '', content: '' });
    fetchPosts();
  }

  async function deletePost(id) {
    await supabase.from('dd_blog_posts').delete().eq('id', id);
    fetchPosts();
  }

  return (
    <div>
      <h2>Manage Posts</h2>
      <input
        value={newPost.title}
        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        placeholder="Post Title"
        style={{ display: 'block', margin: '10px 0' }}
      />
      <textarea
        value={newPost.content}
        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        placeholder="Post Content"
        style={{ display: 'block', margin: '10px 0' }}
      />
      <button onClick={addPost}>Add Post</button>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title} - <button onClick={() => deletePost(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default PostsManager;
