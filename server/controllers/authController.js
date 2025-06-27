import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, nickname, email, password, confirmPassword, role } = req.body;

    if (!firstName || !lastName || !nickname || !email || !password || !confirmPassword || !role)
      return res.status(400).json({ message: 'Заполните все поля' });

    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Пароли не совпадают' });

    const userExists = await User.findOne({ $or: [{ nickname }, { email }] });
    if (userExists)
      return res.status(400).json({ message: 'Email или никнейм уже занят' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ firstName, lastName, nickname, email, password: hashed, role });

    const token = createToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: 'Регистрация успешна', user: { id: user._id, nickname: user.nickname, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const login = async (req, res) => {
  const { nickname, password } = req.body;
  const user = await User.findOne({ nickname });
  if (!user) return res.status(400).json({ message: 'Неверный никнейм или пароль' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Неверный никнейм или пароль' });

  const token = createToken(user);
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ user: { id: user._id, nickname: user.nickname, role: user.role } });
};

export const profile = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id).select('-password');
  res.json(user);
};
