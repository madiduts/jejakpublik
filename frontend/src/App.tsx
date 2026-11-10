import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { InstansiDetail } from './pages/InstansiDetail';
import { ProgramDetail } from './pages/ProgramDetail';
import { Comparison } from './pages/Comparison';
import { Guide } from './pages/Guide';
import { GuideArticle } from './pages/GuideArticle';
import { Glossary } from './pages/Glossary';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Report } from './pages/Report';
import { CorrectionForm } from './pages/CorrectionForm';
import { MyReports } from './pages/MyReports';
import { ModeratorQueue } from './pages/ModeratorQueue';
import { ModeratorReview } from './pages/ModeratorReview';

export const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jelajahi" element={<Explore />} />
      <Route path="/instansi/:slug" element={<InstansiDetail />} />
      <Route path="/program/:slug" element={<ProgramDetail />} />
      <Route path="/perbandingan" element={<Comparison />} />
      <Route path="/panduan" element={<Guide />} />
      <Route path="/panduan/:slug" element={<GuideArticle />} />
      <Route path="/istilah" element={<Glossary />} />
      <Route path="/tentang" element={<About />} />
      <Route path="/masuk" element={<Login />} />
      <Route path="/login" element={<Navigate to="/masuk" replace />} />
      <Route path="/daftar" element={<Register />} />
      <Route path="/register" element={<Navigate to="/daftar" replace />} />
      <Route path="/lupa-password" element={<ForgotPassword />} />
      <Route path="/lupa-sandi" element={<Navigate to="/lupa-password" replace />} />
      <Route path="/lapor" element={<Report />} />
      <Route path="/koreksi/:id" element={<CorrectionForm />} />
      <Route path="/laporan-saya" element={<MyReports />} />
      <Route path="/moderator" element={<ModeratorQueue />} />
      <Route path="/moderator/:id" element={<ModeratorReview />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
