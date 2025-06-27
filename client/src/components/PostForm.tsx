import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';

const POST_TYPES = ['Контент', 'Событие', 'Вакансия'];
const DIRECTIONS = ['Frontend', 'Backend', 'QA', 'Design', 'HR', 'Manager'];

interface PostFormProps {
  initialValues?: {
    title?: string;
    content?: string;
    type?: string;
    direction?: string;
    previewImage?: string;
  };
  onSubmit?: (data: any) => void;
  isEdit?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ initialValues = {}, onSubmit, isEdit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState(initialValues.title || '');
  const [content, setContent] = useState(initialValues.content || '');
  const [type, setType] = useState(initialValues.type || POST_TYPES[0]);
  const [direction, setDirection] = useState(initialValues.direction || DIRECTIONS[0]);
  const [previewImage, setPreviewImage] = useState(initialValues.previewImage || '');
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Заполните все обязательные поля');
      return;
    }
    if (title.length > 100) {
      setError('Заголовок не должен превышать 100 символов');
      return;
    }
    if (content.length > 20000) {
      setError('Текст не должен превышать 20000 символов');
      return;
    }
    setError(null);
    const data = { title, content, type, direction, previewImage };
    onSubmit?.(data);
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Редактировать пост' : 'Создать пост'}</h2>
      {error && <div className="error-message">{error}</div>}
      <div>
        <label>Заголовок *</label>
        <input value={title} onChange={e => setTitle(e.target.value)} maxLength={100} required />
      </div>
      <div>
        <label>Текст (Markdown) *</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} maxLength={20000} required rows={8} />
      </div>
      <div>
        <label>Тип поста *</label>
        <select value={type} onChange={e => setType(e.target.value)}>
          {POST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label>Направление *</label>
        <select value={direction} onChange={e => setDirection(e.target.value)}>
          {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label>Фото-превью</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewImage && <img src={previewImage} alt="preview" style={{ maxWidth: 120, marginTop: 8 }} />}
      </div>
      <button className="auth-btn" type="submit">{isEdit ? 'Сохранить' : 'Создать'}</button>
    </form>
  );
};

export default PostForm; 