import { useState, useEffect } from 'react';
import Card from '../components/Card';
import { getChecklist, updateDoseStatus } from '../services/checklist';
import { getPatients } from '../services/patients';
import { CheckCircle2, Circle, Clock, UserRound } from 'lucide-react';

const Kanban = () => {
  const [checklist, setChecklist] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Simulating today's date for the query, back-end expects YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      loadChecklist();
    } else {
      setChecklist([]);
      setLoading(false);
    }
  }, [selectedPatientId]);

  const loadPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
      if (data.length > 0) {
        setSelectedPatientId(String(data[0].id));
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to load patients', error);
      setLoading(false);
    }
  };

  const loadChecklist = async () => {
    setLoading(true);
    try {
      const data = await getChecklist(today, selectedPatientId);
      setChecklist(data);
    } catch (error) {
      console.error('Failed to load checklist', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Tomado' ? 'Pendente' : 'Tomado';
      await updateDoseStatus(id, newStatus);
      // Optimistic update
      setChecklist(prev => 
        prev.map(item => item.id === id ? { ...item, status: newStatus } : item)
      );
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const timeSlots = [
    { key: 'morning', label: 'Manhã (06:00 - 12:00)' },
    { key: 'afternoon', label: 'Tarde (12:00 - 18:00)' },
    { key: 'night', label: 'Noite (18:00 - 00:00)' },
  ];

  // Helper to categorize times
  const getSlot = (timeString) => {
    if (!timeString) return 'morning';
    const hour = parseInt(timeString.split(':')[0], 10);
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'night';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Checklist Diário</h2>
          <p className="text-gray-500 mt-1">Acompanhe as doses agendadas para hoje ({new Date(today + 'T00:00:00').toLocaleDateString('pt-BR')}).</p>
        </div>
        
        {/* Patient selector */}
        <div className="flex items-center gap-2">
          <UserRound size={18} className="text-gray-400" />
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            disabled={patients.length === 0}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all bg-white text-sm"
          >
            {patients.length === 0 ? (
              <option value="">Nenhum paciente cadastrado</option>
            ) : (
              patients.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))
            )}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : patients.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <UserRound size={48} className="mb-4 opacity-40" />
            <p className="text-lg font-medium text-gray-500">Nenhum paciente cadastrado</p>
            <p className="text-sm text-gray-400 mt-1">Cadastre um paciente e seus medicamentos para ver o checklist.</p>
          </div>
        </Card>
      ) : checklist.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <CheckCircle2 size={48} className="mb-4 opacity-40" />
            <p className="text-lg font-medium text-gray-500">Nenhuma dose agendada para hoje.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {timeSlots.map(slot => {
            const slotItems = checklist.filter(item => getSlot(item.time) === slot.key);
            return (
              <div key={slot.key} className="space-y-4">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                  <Clock size={18} className="text-primary" />
                  {slot.label}
                </h3>
                {slotItems.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">Nenhum medicamento</p>
                ) : (
                  slotItems.map(item => (
                    <Card 
                      key={item.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${item.status === 'Tomado' ? 'bg-green-50/50 border-green-200' : ''}`}
                      onClick={() => handleToggleStatus(item.id, item.status)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`font-bold ${item.status === 'Tomado' ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                            {item.Medication?.name || 'Medicamento'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Paciente: {item.Patient?.name || 'N/A'}
                          </p>
                          <p className="text-xs font-medium text-primary mt-2">
                            {item.time} • Dose: {item.Medication?.dosage}
                          </p>
                        </div>
                        <div>
                          {item.status === 'Tomado' ? (
                            <CheckCircle2 className="text-green-500" size={24} />
                          ) : (
                            <Circle className="text-gray-300" size={24} />
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Kanban;
