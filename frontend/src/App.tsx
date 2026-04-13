// @ts-nocheck
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { GeneratePage } from './pages/GeneratePage';
import { LibraryPage } from './pages/LibraryPage';
import { AuthPage } from './pages/AuthPage';
import { Layout } from './components/Layout';
import { useAuthStore } from './store';
import './index.css';

function App() {
  const { token } = useAuthStore();

  if (!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
