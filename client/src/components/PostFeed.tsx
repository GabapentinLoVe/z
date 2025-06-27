import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchPosts } from '../store/postsSlice';
import PostCard from './PostCard';
import type { Post } from '../types/post';

type PostFeedProps = {
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
};

const PostFeed: React.FC<PostFeedProps> = ({ onEdit, onDelete }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error, filters } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts(filters));
  }, [dispatch, filters]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!Array.isArray(posts) || !posts.length) return <div>Постов нет</div>;

  return (
    <div className="post-feed">
      {Array.isArray(posts) && posts.map((post: Post) => (
        <PostCard key={post.id} post={post} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default PostFeed; 