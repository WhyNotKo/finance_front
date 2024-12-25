import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddTransactionForm from '../components/AddTransactionForm';
import EditTransactionForm from '../components/EditTransactionForm';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [searchCategory, setSearchCategory] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

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
        setFilteredTransactions(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setError('Недостаточно прав для выполнения этого действия');
        } else {
          setError('Ошибка при получении данных о транзакциях');
        }
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    if (searchCategory) {
      filtered = filtered.filter((transaction) =>
        transaction.category.toLowerCase().includes(searchCategory.toLowerCase())
      );
    }

    if (minAmount !== '') {
      filtered = filtered.filter((transaction) => transaction.amount >= parseFloat(minAmount));
    }

    if (maxAmount !== '') {
      filtered = filtered.filter((transaction) => transaction.amount <= parseFloat(maxAmount));
    }

    setFilteredTransactions(filtered);
  }, [searchCategory, minAmount, maxAmount, transactions]);

  const handleAddTransaction = (newTransaction) => {
    setTransactions([...transactions, newTransaction]);
  };

  const handleEditTransaction = (editedTransaction) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === editedTransaction.id ? editedTransaction : transaction
      )
    );
  };

  const handleDeleteTransaction = async (id) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Токен авторизации не найден');
      return;
    }

    try {
      await axios.delete(`http://localhost:5205/api/Transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== id)
      );
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError('Недостаточно прав для выполнения этого действия');
      } else {
        setError('Ошибка при удалении транзакции');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Транзакции</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Поиск по категории"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <input
          type="number"
          placeholder="Минимальная сумма"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <input
          type="number"
          placeholder="Максимальная сумма"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {filteredTransactions.length > 0 ? (
        <div className="border border-black p-4 rounded-lg">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mb-4">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Дата</th>
                <th className="py-2 px-4">Тип</th>
                <th className="py-2 px-4">Сумма</th>
                <th className="py-2 px-4">Категория</th>
                <th className="py-2 px-4">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b">
                  <td className="py-2 px-4">{transaction.id}</td>
                  <td className="py-2 px-4">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{transaction.type === 'Income' ? 'Доход' : 'Расход'}</td>
                  <td className="py-2 px-4">{transaction.amount}</td>
                  <td className="py-2 px-4">{transaction.category}</td>
                  <td className="py-2 px-4 flex justify-center">
                    <button
                      onClick={() => {
                        setTransactionToEdit(transaction);
                        setIsEditModalOpen(true);
                      }}
                      className="bg-blue-200 hover:bg-blue-300 text-blue-700 font-bold py-1 px-3 rounded mr-2"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="bg-red-200 hover:bg-red-300 text-red-700 font-bold py-1 px-3 rounded"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Загрузка данных...</p>
      )}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
      >
        Добавить транзакцию
      </button>
      {isModalOpen && (
        <AddTransactionForm
          onClose={() => setIsModalOpen(false)}
          onAddTransaction={handleAddTransaction}
        />
      )}
      {isEditModalOpen && (
        <EditTransactionForm
          onClose={() => setIsEditModalOpen(false)}
          onEditTransaction={handleEditTransaction}
          transactionToEdit={transactionToEdit}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
