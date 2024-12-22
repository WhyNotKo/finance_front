import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './Auth';
import Transactions from './Transactions';

const App = () => {
  const [token, setToken] = useState('');

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/auth" element={<Auth setToken={setToken} />} />
          <Route path="/transactions" element={<Transactions token={token} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
