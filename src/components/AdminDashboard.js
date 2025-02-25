import { useState } from 'react';
import { useAuth } from './AuthContext';
import PostsManager from './PostsManager';
import AdsManager from './AdsManager';
import ToolsManager from './ToolsManager';
import UsersManager from './UsersManager';
import AnalyticsPanel from './AnalyticsPanel';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('posts');
  const { user } = useAuth();

  if (!user || user.email !== 'tomselfdevelopr@gmail.com') {
    return <div style={{ padding: '20px', color: '#000080' }}>Access Denied - Admin Only</div>;
  }

  return (
    <div style={{ padding: '20px', background: '#FFFFFF' }}>
      <h1 style={{ color: '#000080' }}>Admin Dashboard</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('posts')} style={tabStyle(activeTab === 'posts')}>
          Posts
        </button>
        <button onClick={() => setActiveTab('ads')} style={tabStyle(activeTab === 'ads')}>
          Advertisements
        </button>
        <button onClick={() => setActiveTab('tools')} style={tabStyle(activeTab === 'tools')}>
          Domain Tools
        </button>
        <button onClick={() => setActiveTab('users')} style={tabStyle(activeTab === 'users')}>
          Users
        </button>
        <button onClick={() => setActiveTab('analytics')} style={tabStyle(activeTab === 'analytics')}>
          Analytics
        </button>
      </div>
      {activeTab === 'posts' && <PostsManager />}
      {activeTab === 'ads' && <AdsManager />}
      {activeTab === 'tools' && <ToolsManager />}
      {activeTab === 'users' && <UsersManager />}
      {activeTab === 'analytics' && <AnalyticsPanel />}
    </div>
  );
}

const tabStyle = (isActive) => ({
  padding: '10px 20px',
  marginRight: '5px',
  background: isActive ? '#4169E1' : '#C0C0C0',
  color: isActive ? '#FFFFFF' : '#000080',
  border: 'none',
  cursor: 'pointer',
  borderRadius: '5px',
});

export default AdminDashboard;
