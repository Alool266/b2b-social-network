// Made written by ali hasan
import React, { useEffect, useState } from 'react';
import { postsAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const { t } = useLanguage();
  const companyId = localStorage.getItem('company_id');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getAll();
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      await postsAPI.create(companyId, newPost);
      setNewPost('');
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm(t('common.deleteConfirm') || 'Are you sure you want to delete this post?')) {
      try {
        await postsAPI.delete(postId);
        fetchPosts();
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  return (
    <div className="feed">
      <h1>{t('nav.feed')}</h1>
      
      <div className="post-card" style={{ marginBottom: '2rem' }}>
        <h3>{t('feed.createPost')}</h3>
        <form onSubmit={handleCreatePost}>
          <div className="form-group">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={t('feed.postPlaceholder')}
              rows="3"
              required
            />
          </div>
          <button type="submit" className="btn">{t('feed.postButton')}</button>
        </form>
      </div>

      {posts.map(post => (
        <div key={post.id} className="post-card">
          <p>{post.content}</p>
          <div className="meta">
            {t('feed.companyId')}: {post.company_id} - {new Date(post.created_at).toLocaleString()}
          </div>
          {post.company_id === companyId && (
            <button onClick={() => handleDeletePost(post.id)} className="btn btn-danger" style={{ marginTop: '0.5rem', width: 'auto' }}>
              {t('common.delete')}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeedPage;
