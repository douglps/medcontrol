import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Kanban from './pages/Kanban';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rota do Kanban */}
        <Route path="/kanban" element={<Kanban />} />
        
        {/* Qualquer rota desconhecida ou a raiz redireciona para o login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
