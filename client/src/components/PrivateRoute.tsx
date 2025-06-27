import React from "react";
import { Navigate } from "react-router-dom";

// Функция для извлечения значения куки по ключу
const getCookie = (name: string): string | undefined => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return undefined;
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Проверяем наличие токена в куках
  const token = getCookie("token");
  const isAuthenticated = !token; // Преобразуем в boolean
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
