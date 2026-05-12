import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL, useAuth } from '../App';
import { Edit3, Trash2, Plus, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/posts`);
        // Filter posts by current user on the client side for simplicity
        // In a real app, this would be a dedicated backend endpoint /api/posts/me
        setPosts(res.data.filter(post => post.author === user?.username));
      } catch (err) {
        console.error('Error fetching user posts', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchUserPosts();
  }, [user, authLoading, navigate]);

  const deletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`${API_URL}/posts/${id}`);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting post', err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading dashboard...</div>;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{user?.username}</span>! Manage your content below.</p>
        </div>
        <Link to="/create" className="btn btn-primary">
          <Plus size={20}/> New Post
        </Link>
      </div>

      <div className="glass" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'rgba(255, 255, 255, 0.05)', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '1.25rem 1.5rem' }}>Post Title</th>
              <th style={{ padding: '1.25rem 1.5rem' }}>Created At</th>
              <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>{post.title}</td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>{new Date(post.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <Link to={`/post/${post.id}`} title="View" style={{ color: 'var(--text-muted)' }}><ExternalLink size={18}/></Link>
                    <Link to={`/edit/${post.id}`} title="Edit" style={{ color: 'var(--primary)' }}><Edit3 size={18}/></Link>
                    <button onClick={() => deletePost(post.id)} title="Delete" style={{ background: 'transparent', color: '#ef4444' }}><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan="3" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  You haven't written any posts yet. <Link to="/create" style={{ color: 'var(--primary)' }}>Start writing now!</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
