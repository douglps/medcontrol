import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Activity, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    setIsLoading(true);

    // Simula uma chamada de API
    setTimeout(() => {
      setIsLoading(false);
      // Redireciona para o Kanban
      navigate('/kanban');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] relative overflow-hidden px-4">
      {/* Orbes de Fundo Decorativos */}
      <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] md:w-[40rem] md:h-[40rem] rounded-full bg-emerald-500/10 blur-[100px] md:blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[25rem] h-[25rem] md:w-[35rem] md:h-[35rem] rounded-full bg-blue-600/10 blur-[100px] md:blur-[120px] animate-float"></div>

      {/* Card de Login Glassmorphic */}
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl shadow-2xl relative z-10">
        {/* Cabeçalho */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 mb-4 animate-bounce-slow">
            <Activity className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">MediFlow</h2>
          <p className="text-sm text-slate-400 mt-2 text-center">
            Gestão de Medicamentos & Kanban IFRS
          </p>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center">
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo E-mail */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              E-mail corporativo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 h-5 text-slate-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@ifrs.edu.br"
                disabled={isLoading}
                className="block w-full pl-10 pr-3 py-3 bg-[#0d1527] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">
                Senha de acesso
              </label>
              <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                Esqueceu a senha?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 h-5 text-slate-500" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="block w-full pl-10 pr-10 py-3 bg-[#0d1527] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 h-5" />
                ) : (
                  <Eye className="h-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Lembrar de mim */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 bg-[#0d1527] border-slate-800 text-emerald-500 rounded focus:ring-emerald-500 focus:ring-offset-0 focus:ring-offset-[#0b0f19]"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400 cursor-pointer select-none">
              Lembrar deste dispositivo
            </label>
          </div>

          {/* Botão de Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-[0_4px_20px_-4px_rgba(52,211,153,0.5)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Entrar no Painel
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
