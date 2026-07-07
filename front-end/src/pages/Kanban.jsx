import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Calendar, Pill, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Kanban() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const tasks = [
    { 
      id: '1', 
      name: 'Paracetamol 500mg', 
      desc: 'Lote A-203. Verificar estoque mínimo na farmácia universitária.', 
      status: 'todo', 
      priority: 'Média', 
      date: '08/07/2026',
      badgeColor: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
    },
    { 
      id: '2', 
      name: 'Amoxicilina 250mg', 
      desc: 'Solicitar reabastecimento de emergência junto ao fornecedor credenciado.', 
      status: 'progress', 
      priority: 'Alta', 
      date: '06/07/2026',
      badgeColor: 'bg-red-500/10 border-red-500/20 text-red-400'
    },
    { 
      id: '3', 
      name: 'Ibuprofeno 400mg', 
      desc: 'Estoque devidamente regularizado. Arquivar nota fiscal de entrada.', 
      status: 'done', 
      priority: 'Baixa', 
      date: '04/07/2026',
      badgeColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      {/* Header do Kanban */}
      <header className="border-b border-slate-800/80 bg-[#0d1527]/50 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Pill className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">MediFlow</h1>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
              IFRS Campus
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-white">Farmacêutico Chefe</span>
            <span className="text-xs text-slate-400">admin@ifrs.edu.br</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {/* Título e Ação Rápida */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Painel de Medicamentos</h2>
            <p className="text-sm text-slate-400 mt-1">Monitore e controle a distribuição de insumos em tempo real.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-400 text-slate-950 rounded-xl text-sm font-semibold hover:bg-emerald-300 transition-all shadow-[0_4px_20px_-4px_rgba(52,211,153,0.3)] cursor-pointer">
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Novo Medicamento</span>
          </button>
        </div>

        {/* Quadro Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna A Fazer */}
          <div className="flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                <h3 className="font-bold text-white">A Fazer</h3>
              </div>
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-semibold">1</span>
            </div>
            <div className="flex-1 space-y-4">
              {tasks.filter(t => t.status === 'todo').map(task => (
                <div key={task.id} className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all shadow-md group">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${task.badgeColor}`}>
                      Prioridade {task.priority}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors mb-2">
                    {task.name}
                  </h4>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {task.desc}
                  </p>
                  <div className="flex items-center text-slate-500 text-xs gap-1.5 border-t border-slate-800/80 pt-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Limite: {task.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna Em Progresso */}
          <div className="flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white">Em Progresso</h3>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">1</span>
            </div>
            <div className="flex-1 space-y-4">
              {tasks.filter(t => t.status === 'progress').map(task => (
                <div key={task.id} className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all shadow-md group">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${task.badgeColor}`}>
                      Prioridade {task.priority}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors mb-2">
                    {task.name}
                  </h4>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {task.desc}
                  </p>
                  <div className="flex items-center text-slate-500 text-xs gap-1.5 border-t border-slate-800/80 pt-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Limite: {task.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna Concluído */}
          <div className="flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white">Concluído</h3>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">1</span>
            </div>
            <div className="flex-1 space-y-4">
              {tasks.filter(t => t.status === 'done').map(task => (
                <div key={task.id} className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all shadow-md group">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${task.badgeColor}`}>
                      Prioridade {task.priority}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-300 text-base line-through group-hover:text-emerald-400 transition-colors mb-2">
                    {task.name}
                  </h4>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {task.desc}
                  </p>
                  <div className="flex items-center text-slate-500 text-xs gap-1.5 border-t border-slate-800/80 pt-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Limite: {task.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
