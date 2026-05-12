import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, useAuth } from '../App';
import { Calendar, User, MessageCircle, Send, Trash2 } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          axios.get(`${API_URL}/posts/${id}`),
          axios.get(`${API_URL}/comments/${id}`)
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        console.error('Error fetching post details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`${API_URL}/comments`, { post_id: id, content: newComment });
      setComments([...comments, { ...res.data, content: newComment, author: user.username, created_at: new Date().toISOString() }]);
      setNewComment('');
      // Re-fetch to get actual IDs and formatted dates
      const commentsRes = await axios.get(`${API_URL}/comments/${id}`);
      setComments(commentsRes.data);
    } catch (err) {
      console.error('Error adding comment', err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_URL}/comments/${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment', err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading post...</div>;
  if (!post) return <div style={{ textAlign: 'center', padding: '4rem' }}>Post not found.</div>;

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <article className="glass" style={{ overflow: 'hidden', marginBottom: '3rem' }}>
        {post.image_url && <img src={post.image_url} alt={post.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />}
        <div style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={18}/> {post.author}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={18}/> {new Date(post.created_at).toLocaleDateString()}</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'white', lineHeight: '1.2' }}>{post.title}</h1>
          <div style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
            {post.content}
          </div>
        </div>
      </article>

      <section className="glass" style={{ padding: '2.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <MessageCircle /> Comments ({comments.length})
        </h2>

        <form onSubmit={handleCommentSubmit} style={{ marginBottom: '2.5rem' }}>
          <div className="input-group">
            <textarea 
              rows="3" 
              placeholder={user ? "Share your thoughts..." : "Please login to comment"} 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!user}
              style={{ resize: 'none' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={!user || !newComment.trim()}>
            <Send size={18}/> Post Comment
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {comments.map(comment => (
            <div key={comment.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{comment.author}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
                <p style={{ color: 'var(--text-main)' }}>{comment.content}</p>
              </div>
              {user && (user.username === comment.author) && (
                <button onClick={() => deleteComment(comment.id)} style={{ background: 'transparent', color: '#ef4444', height: 'fit-content' }}>
                  <Trash2 size={18}/>
                </button>
              )}
            </div>
          ))}
          {comments.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No comments yet. Be the first to share your thoughts!</p>}
        </div>
      </section>
    </div>
  );
};

export default PostDetail;
