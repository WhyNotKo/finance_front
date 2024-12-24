import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userLogin');
    localStorage.removeItem('userPassword');
    navigate('/auth');
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <div className="text-2xl font-bold">Контроль Трат</div>
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/auth"
              className={`hover:text-gray-300 transition duration-300 ${isAuthenticated ? 'pointer-events-none opacity-50' : ''}`}
            >
              Авторизация
            </Link>
          </li>
          <li>
            <Link
              to="/transactions"
              className={`hover:text-gray-300 transition duration-300 ${!isAuthenticated ? 'pointer-events-none opacity-50' : ''}`}
            >
              Транзакции
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={`hover:text-gray-300 transition duration-300 ${!isAuthenticated ? 'pointer-events-none opacity-50' : ''}`}
            >
              Профиль
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <button
                onClick={handleLogout}
                className="hover:text-gray-300 transition duration-300"
              >
                Выйти
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;