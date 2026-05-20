import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import GamesPage from './pages/GamesPage';
import ServerPage from './pages/ServerPage';
import AdminPage from './pages/AdminPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/games" element={
            <PrivateRoute><GamesPage /></PrivateRoute>
          } />
          <Route path="/servers/:game" element={
            <PrivateRoute><ServerPage /></PrivateRoute>
          } />
          <Route path="/admin" element={
            <PrivateRoute><AdminPage /></PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;