import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Activity, ArrowRight, User as UserIcon, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargo, setCargo] = useState('Farmacêutico');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'register' && !nome.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }

    if (!email || !password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    if (password.length < 3) {
      setError('A senha deve ter pelo menos 3 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        setIsLoading(false);
        navigate('/kanban');
      } else {
        await register(nome, email, password, cargo);
        setIsLoading(false);
        setSuccessMsg('Conta criada com sucesso! Redirecionando...');
        setTimeout(() => {
          navigate('/kanban');
        }, 1000);
      }
    } catch (err) {
      setIsLoading(false);
      const mensagemErro =
        err.response?.data?.erro ||
        err.response?.data?.mensagem ||
        'Não foi possível realizar a operação. Verifique a conexão com o servidor.';
      setError(mensagemErro);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] relative overflow-hidden px-4 py-8">
      {/* Orbes de Fundo Decorativos */}
      <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] md:w-[40rem] md:h-[40rem] rounded-full bg-emerald-500/10 blur-[100px] md:blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[25rem] h-[25rem] md:w-[35rem] md:h-[35rem] rounded-full bg-blue-600/10 blur-[100px] md:blur-[120px] animate-float"></div>

      {/* Card Glassmorphic */}
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl shadow-2xl relative z-10">
        {/* Cabeçalho */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 mb-3 animate-bounce-slow">
            <Activity className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">MediFlow</h2>
          <p className="text-sm text-slate-400 mt-1 text-center">
            Gestão de Medicamentos & Kanban IFRS
          </p>
        </div>

        {/* Abas Alternadoras: Entrar vs Cadastrar */}
        <div className="flex bg-[#0d1527] p-1 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Alerta de Erro */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center">
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Alerta de Sucesso */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center">
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Nome Completo (apenas no Cadastro) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 h-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  disabled={isLoading}
                  className="block w-full pl-10 pr-3 py-3 bg-[#0d1527] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                />
              </div>
            </div>
          )}

          {/* Campo E-mail */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
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

          {/* Campo Cargo/Função (apenas no Cadastro) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Cargo / Função
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 h-5 text-slate-500" />
                </div>
                <select
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  disabled={isLoading}
                  className="block w-full pl-10 pr-3 py-3 bg-[#0d1527] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                >
                  <option value="Farmacêutico">Farmacêutico(a)</option>
                  <option value="Médico">Médico(a)</option>
                  <option value="Enfermeiro">Enfermeiro(a)</option>
                  <option value="Administrador">Administrador(a)</option>
                </select>
              </div>
            </div>
          )}

          {/* Campo Senha */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-medium text-slate-300">
                Senha de acesso
              </label>
              {mode === 'login' && (
                <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                  Esqueceu a senha?
                </a>
              )}
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

          {/* Botão de Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-[0_4px_20px_-4px_rgba(52,211,153,0.5)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                {mode === 'login' ? 'Entrar no Painel' : 'Criar minha Conta'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
