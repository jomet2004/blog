import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL, useAuth } from '../App';
import { Save, Image as ImageIcon, Layout, Type } from 'lucide-react';

const CreatePost = () => {
  const { id } = useParams(); // For edit mode
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!id;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
    if (isEdit) {
      const fetchPost = async () => {
        try {
          const res = await axios.get(`${API_URL}/posts/${id}`);
          if (res.data.author !== user.username) {
            navigate('/');
          }
          setTitle(res.data.title);
          setContent(res.data.content);
          setImageUrl(res.data.image_url || '');
        } catch (err) {
          console.error('Error fetching post for edit', err);
        }
      };
      if (user) fetchPost();
    }
  }, [id, user, authLoading, navigate, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await axios.put(`${API_URL}/posts/${id}`, { title, content, image_url: imageUrl });
      } else {
        await axios.post(`${API_URL}/posts`, { title, content, image_url: imageUrl });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass" style={{ padding: '2.5rem' }}>
        <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Layout size={28} color="var(--primary)"/> {isEdit ? 'Edit Post' : 'Create New Post'}
        </h2>
        {error && <div style={{ color: '#ef4444', marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label><Type size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              placeholder="Enter a catchy title..." 
            />
          </div>
          
          <div className="input-group">
            <label><ImageIcon size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> Cover Image URL (Optional)</label>
            <input 
              type="url" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
              placeholder="https://images.unsplash.com/..." 
            />
          </div>

          <div className="input-group">
            <label>Content</label>
            <textarea 
              rows="12" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              required 
              placeholder="Write your story here..."
              style={{ fontSize: '1.1rem', lineHeight: '1.6' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
              <Save size={20}/> {loading ? 'Saving...' : (isEdit ? 'Update Post' : 'Publish Post')}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
