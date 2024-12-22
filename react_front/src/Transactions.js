import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Transactions = ({ token }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/Transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    };

    fetchTransactions();
  }, [token]);

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Transactions</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {transactions.map((transaction) => (
          <li key={transaction.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <strong>Date:</strong> {transaction.date}<br />
            <strong>Type:</strong> {transaction.type}<br />
            <strong>Amount:</strong> {transaction.amount}<br />
            <strong>Category:</strong> {transaction.category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;
