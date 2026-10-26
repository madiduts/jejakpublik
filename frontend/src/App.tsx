import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { InstansiDetail } from './pages/InstansiDetail';
import { Glossary } from './pages/Glossary';
import { About } from './pages/About';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/instansi/lingkungan-hidup" element={<InstansiDetail />} />
        <Route path="/istilah" element={<Glossary />} />
        <Route path="/tentang" element={<About />} />
        {/* Fallback to Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
