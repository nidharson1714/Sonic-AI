// @ts-nocheck
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { GeneratePage } from './pages/GeneratePage';
import { LibraryPage } from './pages/LibraryPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/library" element={<LibraryPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
