import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddTransactionForm = ({ onClose, onAddTransaction, transactionToEdit }) => {
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    type: 'Income',
    amount: '',
    category: '',
  });

  useEffect(() => {
    if (transactionToEdit) {
      setNewTransaction({
        date: transactionToEdit.date,
        type: transactionToEdit.type,
        amount: transactionToEdit.amount,
        category: transactionToEdit.category,
      });
    }
  }, [transactionToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Токен авторизации не найден');
      return;
    }

    const transactionData = {
      id: transactionToEdit ? transactionToEdit.id : 0,
      date: newTransaction.date,
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
    };

    try {
      const response = await axios({
        method: transactionToEdit ? 'PUT' : 'POST',
        url: 'http://localhost:5205/api/Transactions',
        data: transactionData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onAddTransaction(response.data);
      onClose();
    } catch (error) {
      alert('Ошибка при добавлении/редактировании транзакции');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{transactionToEdit ? 'Редактировать транзакцию' : 'Добавить транзакцию'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Дата
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newTransaction.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
              Тип
            </label>
            <select
              id="type"
              name="type"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newTransaction.type}
              onChange={handleInputChange}
              required
            >
              <option value="Income">Доход</option>
              <option value="Expense">Расход</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Сумма
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newTransaction.amount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Категория
            </label>
            <input
              type="text"
              id="category"
              name="category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newTransaction.category}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionForm;
