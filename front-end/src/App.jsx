import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Kanban from './pages/Kanban';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Medications from './pages/Medications';
import History from './pages/History';
import Layout from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Login */}
        <Route path="/login" element={<Login />} />

        {/* Kanban é uma tela standalone (tema/header próprios, sem Sidebar) */}
        <Route path="/kanban" element={<Kanban />} />

        {/* Páginas internas, com Sidebar (Layout) — paths alinhados com
            components/Sidebar.jsx e com os navigate() de cada página */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/history" element={<History />} />
        </Route>

        {/* Qualquer rota desconhecida redireciona para o login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
