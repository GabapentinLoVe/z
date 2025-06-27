import React, { useState } from 'react';
import type { Post } from '../types/post';
import './PostCard.scss';

interface PostCardProps {
  post: Post;
  onLike?: (id: string, liked: boolean) => void;
  onExpand?: (id: string) => void;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onExpand, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const previewText = post.content.length > 500 && !expanded
    ? post.content.slice(0, 500) + '...'
    : post.content;

  const handleExpand = () => {
    setExpanded(true);
    onExpand && onExpand(post.id);
  };

  const handleLike = () => {
    onLike && onLike(post.id, !post.isLikedByUser);
  };

  return (
    <div className="post-card">
      {post.previewImage && (
        <div className="post-card__image">
          <img src={post.previewImage} alt="preview" />
        </div>
      )}
      <div className="post-card__content">
        <div className="post-card__header">
          <span className="post-card__type">{post.type}</span>
          <span className="post-card__direction">{post.direction}</span>
        </div>
        <h2 className="post-card__title">{post.title}</h2>
        <div className="post-card__author">
          <a href={`/profile/${post.author.id}`}>{post.author.firstName} {post.author.lastName} (@{post.author.nickname})</a>
        </div>
        <div className="post-card__text">
          {previewText}
          {post.content.length > 500 && !expanded && (
            <button className="post-card__expand" onClick={handleExpand}>Развернуть</button>
          )}
        </div>
        <div className="post-card__footer">
          <button className={`post-card__like${post.isLikedByUser ? ' liked' : ''}`} onClick={handleLike}>
            ♥ {post.likes}
          </button>
          <button onClick={() => onEdit(post)}>Edit</button>
          <button onClick={() => onDelete(post.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 