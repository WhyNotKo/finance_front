import  { useEffect, useState } from 'react';
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
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError('Ошибка при получении данных о балансе');
      }
    };

    const fetchReports = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Токен авторизации не найден');
        return;
      }

      const startDate = '2024-01-01'; // Пример начальной даты
      const endDate = '2024-12-31'; // Пример конечной даты

      try {
        const response = await axios.get(`http://localhost:5205/api/Reports?startDate=${startDate}&endDate=${endDate}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReports(response.data);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError('Ошибка при получении данных о тратах и полученных средствах');
      }
    };

    fetchNetBalance();
    fetchReports();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Профиль</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {userLogin && userPassword && netBalance !== null && reports !== null ? (
        <div>
          <p>Логин: {userLogin}</p>
          <p>Пароль: {userPassword}</p>
          <p>Количество трат: {reports.totalExpense}</p>
          <p>Количество полученных средств: {reports.totalIncome}</p>
          <p>Баланс: {netBalance}</p>
        </div>
      ) : (
        <p>Загрузка данных...</p>
      )}
    </div>
  );
};

export default ProfilePage;
