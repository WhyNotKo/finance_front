import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const AuthPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Хэширование пароля
    const hashedPassword = CryptoJS.MD5(password).toString();

    try {
      const response = await axios.post('http://localhost:5205/api/Auth', {
        login,
        password: hashedPassword,
      });

      // Сохраняем токен и данные пользователя в localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userLogin', login);
      localStorage.setItem('userPassword', password); // Сохраняем введенный пользователем пароль

      // Перенаправляем пользователя на страницу профиля
      navigate('/profile');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError('Недостаточно прав для выполнения этого действия');
      } else {
        setError('Неверный логин или пароль');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Авторизация</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login">
              Логин
            </label>
            <input
              type="text"
              id="login"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
