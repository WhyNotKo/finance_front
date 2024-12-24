import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Токен авторизации не найден');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5205/api/Transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        setError('Ошибка при получении данных о транзакциях');
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Транзакции</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {transactions.length > 0 ? (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Дата</th>
              <th className="py-2 px-4">Тип</th>
              <th className="py-2 px-4">Сумма</th>
              <th className="py-2 px-4">Категория</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b">
                <td className="py-2 px-4">{transaction.id}</td>
                <td className="py-2 px-4">{new Date(transaction.date).toLocaleDateString()}</td>
                <td className="py-2 px-4">{transaction.type}</td>
                <td className="py-2 px-4">{transaction.amount}</td>
                <td className="py-2 px-4">{transaction.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Загрузка данных...</p>
      )}
    </div>
  );
};

export default TransactionsPage;
