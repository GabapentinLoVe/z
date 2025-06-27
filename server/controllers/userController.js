import User from '../models/User.js';

// Получить профиль пользователя
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка получения профиля' });
  }
};

// Обновить профиль пользователя (только владелец)
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id) return res.status(403).json({ message: 'Нет доступа' });
    const { firstName, lastName, nickname, role, description, workplace } = req.body;
    if (!firstName || !lastName) return res.status(400).json({ message: 'Имя и фамилия обязательны' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    if (nickname && nickname !== user.nickname) {
      const exists = await User.findOne({ nickname });
      if (exists) return res.status(400).json({ message: 'Никнейм уже занят' });
      user.nickname = nickname;
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.role = role;
    user.description = description;
    user.workplace = workplace;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка обновления профиля' });
  }
};

// Добавить проект в портфолио
export const addPortfolioProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id) return res.status(403).json({ message: 'Нет доступа' });
    const { title, description, links, previewImage } = req.body;
    if (!title || title.length > 100) return res.status(400).json({ message: 'Название обязательно и не более 100 символов' });
    if (links && links.some(link => !/^https?:\/\//.test(link))) return res.status(400).json({ message: 'Некорректная ссылка' });
    const user = await User.findById(id);
    user.portfolio.push({ title, description, links, previewImage });
    await user.save();
    res.status(201).json(user.portfolio[user.portfolio.length - 1]);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка добавления проекта' });
  }
};

// Обновить проект в портфолио
export const updatePortfolioProject = async (req, res) => {
  try {
    const { id, projectId } = req.params;
    if (req.user.id !== id) return res.status(403).json({ message: 'Нет доступа' });
    const { title, description, links, previewImage } = req.body;
    const user = await User.findById(id);
    const project = user.portfolio.id(projectId);
    if (!project) return res.status(404).json({ message: 'Проект не найден' });
    if (title && title.length > 100) return res.status(400).json({ message: 'Название слишком длинное' });
    if (links && links.some(link => !/^https?:\/\//.test(link))) return res.status(400).json({ message: 'Некорректная ссылка' });
    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (links !== undefined) project.links = links;
    if (previewImage !== undefined) project.previewImage = previewImage;
    await user.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка обновления проекта' });
  }
};

// Удалить проект из портфолио
export const deletePortfolioProject = async (req, res) => {
  try {
    const { id, projectId } = req.params;
    if (req.user.id !== id) return res.status(403).json({ message: 'Нет доступа' });
    const user = await User.findById(id);
    const project = user.portfolio.id(projectId);
    if (!project) return res.status(404).json({ message: 'Проект не найден' });
    project.remove();
    await user.save();
    res.json({ message: 'Проект удалён' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка удаления проекта' });
  }
}; 