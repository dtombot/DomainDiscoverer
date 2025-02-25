import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

function AnalyticsPanel() {
  const [stats, setStats] = useState({ tools: 0, posts: 0, users: 0, ads: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const [tools, posts, users, ads] = await Promise.all([
      supabase.from('dd_tools').select('id', { count: 'exact' }),
      supabase.from('dd_blog_posts').select('id', { count: 'exact' }),
      supabase.from('dd_users').select('id', { count: 'exact' }),
      supabase.from('dd_ads').select('id', { count: 'exact' }),
    ]);
    setStats({
      tools: tools.count,
      posts: posts.count,
      users: users.count,
      ads: ads.count,
    });
  }

  return (
    <div>
      <h2>Analytics</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={cardStyle}>Tools: {stats.tools}</div>
        <div style={cardStyle}>Posts: {stats.posts}</div>
        <div style={cardStyle}>Users: {stats.users}</div>
        <div style={cardStyle}>Ads: {stats.ads}</div>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: '15px',
  background: '#f1f3f5',
  borderRadius: '5px',
  textAlign: 'center',
  flex: '1',
};

export default AnalyticsPanel;
