import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [error, setError] = useState('');
  const [netBalance, setNetBalance] = useState(null);
  const [reports, setReports] = useState(null);

  const userLogin = localStorage.getItem('userLogin');
  const userPassword = localStorage.getItem('userPassword');

  useEffect(() => {
    const fetchNetBalance = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Токен авторизации не найден');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5205/api/Reports/net-balance', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNetBalance(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setError('Недостаточно прав для выполнения этого действия');
        } else {
          setError('Ошибка при получении данных о балансе');
        }
      }
    };

    const fetchReports = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Токен авторизации не найден');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5205/api/Reports', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReports(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setError('Недостаточно прав для выполнения этого действия');
        } else {
          setError('Ошибка при получении данных о тратах и полученных средствах');
        }
      }
    };

    fetchNetBalance();
    fetchReports();
  }, []);

  return (
    <div className="container mx-auto p-1">
      <h1 className="text-3xl font-bold mb-4">Профиль</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {userLogin && userPassword && netBalance !== null && reports !== null ? (
        <div className="border border-black p-4 rounded-lg shadow-md">
          <div className="mb-2 p-2 border-b border-gray-100">
            <p className="font-bold">Логин: {userLogin}</p>
          </div>
          <div className="mb-2 p-2 border-b border-gray-100">
            <p className="font-bold">Пароль: {userPassword}</p>
          </div>
          <div className="mb-2 p-2 border-b border-gray-100">
            <p className="font-bold">Количество трат: {reports.totalExpense}</p>
          </div>
          <div className="mb-2 p-2 border-b border-gray-100">
            <p className="font-bold">Количество полученных средств: {reports.totalIncome}</p>
          </div>
          <div className="p-2">
            <p className="font-bold">Баланс: {netBalance}</p>
          </div>
        </div>
      ) : (
        <p>Загрузка данных...</p>
      )}
    </div>
  );
};

export default ProfilePage;
