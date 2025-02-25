import { useState } from 'react';
import PostsManager from './PostsManager';
import AdsManager from './AdsManager';
import ToolsManager from './ToolsManager';
import UsersManager from './UsersManager';
import AnalyticsPanel from './AnalyticsPanel';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
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
  background: isActive ? '#007bff' : '#e9ecef',
  color: isActive ? 'white' : 'black',
  border: 'none',
  cursor: 'pointer',
});

export default AdminDashboard;
