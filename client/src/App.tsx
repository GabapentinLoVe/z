import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import PrivateRoute from "./components/PrivateRoute";
import MainPage from "./components/MainPage.tsx";
import "./Appp.scss";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthForm />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
