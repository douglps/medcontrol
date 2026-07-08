import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { getPatients } from '../services/patients';
import { Users, Activity, AlertCircle, ArrowRight, UserRound } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error('Failed to load patients', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const avatarColors = [
    'from-blue-500 to-cyan-400',
    'from-violet-500 to-purple-400',
    'from-emerald-500 to-teal-400',
    'from-amber-500 to-orange-400',
    'from-rose-500 to-pink-400',
    'from-indigo-500 to-blue-400',
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Visão geral do sistema.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group"
          onClick={() => navigate('/patients')}
        >
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-105 transition-transform">
            <Users size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Total Pacientes</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '…' : patients.length}
            </p>
          </div>
          <ArrowRight size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Adesão Média</p>
            <p className="text-2xl font-bold text-gray-900">85%</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Alertas</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
        </Card>
      </div>

      {/* Quick access: recent patients */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Pacientes Recentes</h3>
          <button
            onClick={() => navigate('/patients')}
            className="text-sm font-medium text-primary hover:text-blue-700 transition-colors inline-flex items-center gap-1"
          >
            Ver todos
            <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <UserRound size={40} className="mb-3 opacity-40" />
            <p className="text-sm text-gray-500">Nenhum paciente cadastrado.</p>
            <button
              onClick={() => navigate('/patients')}
              className="mt-3 text-sm font-medium text-primary hover:underline"
            >
              Cadastrar primeiro paciente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {patients.slice(0, 6).map((patient) => (
              <div
                key={patient.id}
                onClick={() => navigate(`/patients/${patient.id}`)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group border border-transparent hover:border-gray-200"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColors[patient.id % avatarColors.length]} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm`}
                >
                  {getInitials(patient.name)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate group-hover:text-primary transition-colors">
                    {patient.name}
                  </p>
                  {patient.age !== null && (
                    <p className="text-xs text-gray-400">{patient.age} anos</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
