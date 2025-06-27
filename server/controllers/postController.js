import Post from '../models/Post.js';
import User from '../models/User.js';

// Получить все посты с фильтрами
export const getPosts = async (req, res) => {
  try {
    const { type, direction } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (direction) filter.direction = direction;
    const posts = await Post.find(filter)
      .populate('author', 'firstName lastName nickname role')
      .sort({ createdAt: -1 });
    const userId = req.user.id;
    const postsWithLike = posts.map(post => {
      const p = post.toObject();
      p.isLikedByUser = userId && p.likedBy.some((id) => id.toString() === userId);
      return p;
    });
    res.json(postsWithLike);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка получения постов' });
  }
};

// Создать пост
export const createPost = async (req, res) => {
  try {
    const { title, content, type, direction, previewImage } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Заполните все обязательные поля' });
    if (title.length > 100) return res.status(400).json({ message: 'Заголовок слишком длинный' });
    if (content.length > 20000) return res.status(400).json({ message: 'Текст слишком длинный' });
    const post = await Post.create({
      title,
      content,
      type,
      direction,
      previewImage,
      author: req.user.id,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка создания поста' });
  }
};

// Обновить пост
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Пост не найден' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Нет доступа' });
    const { title, content, type, direction, previewImage } = req.body;
    if (title && title.length > 100) return res.status(400).json({ message: 'Заголовок слишком длинный' });
    if (content && content.length > 20000) return res.status(400).json({ message: 'Текст слишком длинный' });
    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.type = type ?? post.type;
    post.direction = direction ?? post.direction;
    post.previewImage = previewImage ?? post.previewImage;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка обновления поста' });
  }
};

// Удалить пост
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Пост не найден' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Нет доступа' });
    await post.deleteOne();
    res.json({ message: 'Пост удалён' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка удаления поста' });
  }
};

// Лайкнуть пост
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Пост не найден' });
    if (post.likedBy.includes(req.user.id)) return res.status(400).json({ message: 'Уже лайкнуто' });
    post.likedBy.push(req.user.id);
    post.likes = post.likedBy.length;
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка лайка' });
  }
};

// Убрать лайк
export const unlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Пост не найден' });
    post.likedBy = post.likedBy.filter(uid => uid.toString() !== req.user.id);
    post.likes = post.likedBy.length;
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка удаления лайка' });
  }
}; 