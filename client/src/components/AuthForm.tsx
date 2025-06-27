import React, { useState } from "react";
import InputField from "./InputField.tsx";
import RoleSelector from "./RoleSelector.tsx";
import ErrorMessage from "./ErrorMessage.tsx";
import { useDispatch } from "react-redux";
import { login, register } from "../store/userSlice";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "QA Engineer",
  "Designer",
  "Manager",
  "HR",
] as const;

type Role = (typeof roles)[number];

type Mode = "login" | "register";

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "" as Role | "",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (mode === "register") {
      if (
        !form.firstName ||
        !form.lastName ||
        !form.nickname ||
        !form.email ||
        !form.password ||
        !form.confirmPassword ||
        !form.role
      ) {
        return "Все поля обязательны";
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
        return "Некорректный email";
      }
      if (
        form.password.length < 8 ||
        !/[a-zA-Z]/.test(form.password) ||
        !/\d/.test(form.password)
      ) {
        return "Пароль должен быть не менее 8 символов и содержать буквы и цифры";
      }
      if (form.password !== form.confirmPassword) {
        return "Пароли не совпадают";
      }
    } else {
      if (!form.nickname || !form.password) {
        return "Введите никнейм и пароль";
      }
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      if (mode === "register") {
        const res = await axios.post(
          "/api/register",
          {
            firstName: form.firstName,
            lastName: form.lastName,
            nickname: form.nickname,
            email: form.email,
            password: form.password,
            confirmPassword: form.confirmPassword,
            role: form.role,
          },
          { withCredentials: true },
        );
        dispatch(register(res.data));
      } else {
        const res = await axios.post(
          "/api/login",
          {
            nickname: form.nickname,
            password: form.password,
          },
          { withCredentials: true },
        );
        dispatch(login(res.data));
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Ошибка сервера");
      }
    } finally {
      navigate("/");
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{mode === "login" ? "Вход" : "Регистрация"}</h2>
        {mode === "register" && (
          <>
            <InputField
              label="Имя"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <InputField
              label="Фамилия"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
            <InputField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              type="email"
            />
          </>
        )}
        <InputField
          label="Никнейм"
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
          required
        />
        <InputField
          label="Пароль"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          type="password"
        />
        {mode === "register" && (
          <>
            <InputField
              label="Подтверждение пароля"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              type="password"
            />
            <RoleSelector
              value={form.role}
              onChange={handleChange}
              roles={roles}
            />
          </>
        )}
        <ErrorMessage message={error} />
        <button type="submit" className="auth-btn">
          {mode === "login" ? "Войти" : "Зарегистрироваться"}
        </button>
        <div className="switch-mode">
          {mode === "login" ? (
            <span>
              Нет аккаунта?{" "}
              <button type="button" onClick={() => setMode("register")}>
                Зарегистрироваться
              </button>
            </span>
          ) : (
            <span>
              Уже есть аккаунт?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                }}
              >
                Войти
              </button>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
