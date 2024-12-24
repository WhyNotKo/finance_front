import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import TransactionsPage from './pages/TransactionsPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  return (
    <Router>
      <Header />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
