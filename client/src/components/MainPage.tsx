import React, { useState } from 'react';
import FilterBar from './FilterBar';
import PostFeed from './PostFeed';
import PostForm from './PostForm';
import ConfirmationModal from './ConfirmationModal';
import { useDispatch } from 'react-redux';
import { createPost, updatePost, deletePost } from '../store/postsSlice';
import type { Post } from '../types/post';
import type { AppDispatch } from '../store';

const MainPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditPost(null);
    setShowForm(true);
  };
  const handleEdit = (post: Post) => {
    setEditPost(post);
    setShowForm(true);
  };
  const handleDelete = (id: string) => {
    setDeleteId(id);
  };
  const handleFormSubmit = async (data: any) => {
    if (editPost) {
      await dispatch(updatePost({ id: editPost.id, data }));
    } else {
      await dispatch(createPost(data));
    }
    setShowForm(false);
  };
  const handleConfirmDelete = async () => {
    if (deleteId) await dispatch(deletePost(deleteId));
    setDeleteId(null);
  };

  return (
    <div className="main-page">
      <div className="main-content">
        <FilterBar />
        <PostFeed onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <button
        className="fab-create-post"
        title="Создать пост"
        onClick={handleCreate}
      >
        <span>+</span>
      </button>
      {showForm && (
        <div className="modal-backdrop">
          <div className="modal-window modal-window--wide">
            <PostForm
              initialValues={editPost || {}}
              isEdit={!!editPost}
              onSubmit={handleFormSubmit}
            />
            <button className="modal-close" onClick={() => setShowForm(false)}>&times;</button>
          </div>
        </div>
      )}
      <ConfirmationModal
        open={!!deleteId}
        title="Удалить пост?"
        message="Вы уверены, что хотите удалить этот пост? Это действие необратимо."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default MainPage; 