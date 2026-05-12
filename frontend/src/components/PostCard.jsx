import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

const PostCard = ({ post }) => {
  return (
    <div className="glass fade-in" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {post.image_url && (
        <img src={post.image_url} alt={post.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      )}
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={14}/> {post.author}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14}/> {new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'white' }}>{post.title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineClamp: 3, WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.content}
        </p>
        <Link to={`/post/${post.id}`} className="btn btn-outline" style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
          Read More <ArrowRight size={14}/>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
