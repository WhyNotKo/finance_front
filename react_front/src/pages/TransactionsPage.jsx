import { useEffect, useState } from 'react';
import axios from 'axios';
import AddTransactionForm from '../components/AddTransactionForm';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

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
        console.log(error);
      }
    };

    fetchTransactions();
  }, []);

  const handleAddTransaction = (newTransaction) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === newTransaction.id ? newTransaction : transaction
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
      setError('Ошибка при удалении транзакции');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Транзакции</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {transactions.length > 0 ? (
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
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b">
                <td className="py-2 px-4">{transaction.id}</td>
                <td className="py-2 px-4">{new Date(transaction.date).toLocaleDateString()}</td>
                <td className="py-2 px-4">{transaction.type}</td>
                <td className="py-2 px-4">{transaction.amount}</td>
                <td className="py-2 px-4">{transaction.category}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => {
                      setTransactionToEdit(transaction);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDeleteTransaction(transaction.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Загрузка данных...</p>
      )}
      <button
        onClick={() => {
          setTransactionToEdit(null);
          setIsModalOpen(true);
        }}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
      >
        Добавить транзакцию
      </button>
      {isModalOpen && (
        <AddTransactionForm
          onClose={() => setIsModalOpen(false)}
          onAddTransaction={handleAddTransaction}
          transactionToEdit={transactionToEdit}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
