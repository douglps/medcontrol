import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  getPatientById,
  updatePatient,
  deletePatient,
} from '../services/patients';
import {
  getMedicationsByPatient,
  createMedication,
  createSchedule,
  deleteMedication,
} from '../services/medications';
import { getChecklist, updateDoseStatus } from '../services/checklist';
import {
  ArrowLeft,
  UserRound,
  CalendarDays,
  Pill,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Package,
  AlertTriangle,
} from 'lucide-react';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [medications, setMedications] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit patient modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete patient confirm
  const [isDeletePatientOpen, setIsDeletePatientOpen] = useState(false);
  const [isDeletingPatient, setIsDeletingPatient] = useState(false);

  // New medication modal
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medForm, setMedForm] = useState('comprimido');
  const [medStock, setMedStock] = useState('');
  const [medTime, setMedTime] = useState('');
  const [isMedSubmitting, setIsMedSubmitting] = useState(false);

  // Delete medication confirm
  const [isDeleteMedOpen, setIsDeleteMedOpen] = useState(false);
  const [deletingMed, setDeletingMed] = useState(null);
  const [isDeletingMed, setIsDeletingMed] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadAll();
  }, [id]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [patientData, medsData, checklistData] = await Promise.all([
        getPatientById(id),
        getMedicationsByPatient(id),
        getChecklist(today, id).catch(() => []),
      ]);
      setPatient(patientData);
      setMedications(medsData);
      setChecklist(checklistData);
    } catch (error) {
      console.error('Failed to load patient data', error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Edit patient ───
  const openEdit = () => {
    setEditName(patient.name);
    setEditBirthDate(patient.birthDate || '');
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setIsSaving(true);
    try {
      const updated = await updatePatient(id, {
        name: editName.trim(),
        birthDate: editBirthDate || null,
      });
      setPatient(updated);
      setIsEditOpen(false);
    } catch (error) {
      console.error('Failed to update patient', error);
      alert('Erro ao atualizar paciente.');
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Delete patient ───
  const handleDeletePatient = async () => {
    setIsDeletingPatient(true);
    try {
      await deletePatient(id);
      navigate('/patients');
    } catch (error) {
      console.error('Failed to delete patient', error);
      alert('Erro ao excluir paciente.');
    } finally {
      setIsDeletingPatient(false);
    }
  };

  // ─── Create medication ───
  const openMedModal = () => {
    setMedName('');
    setMedDosage('');
    setMedForm('comprimido');
    setMedStock('');
    setMedTime('');
    setIsMedModalOpen(true);
  };

  const handleCreateMed = async (e) => {
    e.preventDefault();
    if (!medName || !medDosage) return;
    setIsMedSubmitting(true);
    try {
      const newMed = await createMedication(id, {
        name: medName,
        dosage: medDosage,
        form: medForm,
        stockQty: parseInt(medStock, 10) || 0,
      });
      if (medTime) {
        await createSchedule(newMed.id, medTime);
      }
      setMedications((prev) => [...prev, newMed]);
      setIsMedModalOpen(false);
      // Reload checklist if a schedule was created
      if (medTime) {
        const checklistData = await getChecklist(today, id).catch(() => []);
        setChecklist(checklistData);
      }
    } catch (error) {
      console.error('Failed to create medication', error);
      alert('Erro ao cadastrar medicamento.');
    } finally {
      setIsMedSubmitting(false);
    }
  };

  // ─── Delete medication ───
  const openDeleteMed = (med) => {
    setDeletingMed(med);
    setIsDeleteMedOpen(true);
  };

  const handleDeleteMed = async () => {
    if (!deletingMed) return;
    setIsDeletingMed(true);
    try {
      await deleteMedication(deletingMed.id);
      setMedications((prev) => prev.filter((m) => m.id !== deletingMed.id));
      setIsDeleteMedOpen(false);
      setDeletingMed(null);
      // Reload checklist
      const checklistData = await getChecklist(today, id).catch(() => []);
      setChecklist(checklistData);
    } catch (error) {
      console.error('Failed to delete medication', error);
      alert('Erro ao excluir medicamento.');
    } finally {
      setIsDeletingMed(false);
    }
  };

  // ─── Toggle dose status ───
  const handleToggleDose = async (doseId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Tomado' ? 'Pendente' : 'Tomado';
      await updateDoseStatus(doseId, newStatus);
      setChecklist((prev) =>
        prev.map((item) =>
          item.id === doseId ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error('Failed to toggle dose', error);
    }
  };

  // ─── Helpers ───
  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const formOptions = [
    { value: 'comprimido', label: 'Comprimido' },
    { value: 'cápsula', label: 'Cápsula' },
    { value: 'líquido', label: 'Líquido' },
    { value: 'injetável', label: 'Injetável' },
    { value: 'pomada', label: 'Pomada' },
    { value: 'gotas', label: 'Gotas' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 animate-fade-in">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="animate-fade-in text-center py-32">
        <p className="text-gray-500 text-lg">Paciente não encontrado.</p>
        <button
          onClick={() => navigate('/patients')}
          className="mt-4 text-primary hover:underline font-medium"
        >
          Voltar para pacientes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate('/patients')}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary font-medium transition-colors group"
      >
        <ArrowLeft
          size={16}
          className="transition-transform group-hover:-translate-x-0.5"
        />
        Voltar para pacientes
      </button>

      {/* Patient header card */}
      <Card className="relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary/5 to-blue-100/20 rounded-full" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200/50 shrink-0">
            {getInitials(patient.name)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
              {patient.age !== null && (
                <span className="flex items-center gap-1.5">
                  <UserRound size={14} />
                  {patient.age} anos
                </span>
              )}
              {patient.birthDate && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  {new Date(patient.birthDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Pill size={14} />
                {medications.length} medicamento{medications.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={openEdit}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-amber-600 px-3 py-2 rounded-lg hover:bg-amber-50 transition-colors border border-gray-200"
            >
              <Pencil size={15} />
              Editar
            </button>
            <button
              onClick={() => setIsDeletePatientOpen(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors border border-gray-200"
            >
              <Trash2 size={15} />
              Excluir
            </button>
          </div>
        </div>
      </Card>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Medications (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Pill size={20} className="text-primary" />
              Medicamentos
            </h3>
            <button
              onClick={openMedModal}
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-primary hover:bg-blue-600 text-white px-3.5 py-2 rounded-lg transition-all hover:shadow-md hover:shadow-blue-200 active:scale-[0.98]"
            >
              <Plus size={16} />
              Novo Medicamento
            </button>
          </div>

          {medications.length === 0 ? (
            <Card>
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Pill size={40} className="mb-3 opacity-40" />
                <p className="text-sm text-gray-500">
                  Nenhum medicamento cadastrado para este paciente.
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medications.map((med) => (
                <Card
                  key={med.id}
                  className="group relative overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-4 -mt-4 z-0" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-100 text-primary rounded-lg">
                          <Pill size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">
                            {med.name}
                          </h4>
                          <p className="text-xs text-gray-400 capitalize">
                            {med.form}
                          </p>
                        </div>
                      </div>
                      {!med.active && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                          Inativo
                        </span>
                      )}
                    </div>

                    <div className="mt-3 space-y-1.5 text-sm">
                      <p>
                        <span className="text-gray-400">Dosagem:</span>{' '}
                        <span className="text-gray-700 font-medium">{med.dosage}</span>
                      </p>
                      <div className="flex items-center gap-1">
                        <Package size={13} className="text-gray-400" />
                        <span className="text-gray-400">Estoque:</span>{' '}
                        <span
                          className={`font-bold ${
                            med.stockQty <= (med.stockAlert || 5)
                              ? 'text-red-500'
                              : 'text-green-600'
                          }`}
                        >
                          {med.stockQty}
                        </span>
                        {med.stockQty <= (med.stockAlert || 5) && (
                          <AlertTriangle size={13} className="text-red-400 ml-1" />
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={() => openDeleteMed(med)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} />
                        Remover
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Daily checklist (1 col) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            Doses de Hoje
          </h3>
          {checklist.length === 0 ? (
            <Card>
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <CheckCircle2 size={32} className="mb-2 opacity-40" />
                <p className="text-sm text-gray-500 text-center">
                  Nenhuma dose agendada para hoje.
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {checklist.map((item) => (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    item.status === 'Tomado'
                      ? 'bg-green-50/50 border-green-200'
                      : ''
                  }`}
                  onClick={() => handleToggleDose(item.id, item.status)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`font-bold text-sm ${
                          item.status === 'Tomado'
                            ? 'text-green-700 line-through'
                            : 'text-gray-900'
                        }`}
                      >
                        {item.Medication?.name || 'Medicamento'}
                      </p>
                      <p className="text-xs text-primary font-medium mt-1">
                        {item.time} • {item.Medication?.dosage}
                      </p>
                    </div>
                    {item.status === 'Tomado' ? (
                      <CheckCircle2 className="text-green-500 shrink-0" size={22} />
                    ) : (
                      <Circle className="text-gray-300 shrink-0" size={22} />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit patient modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Paciente"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              required
              maxLength={100}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Nascimento
            </label>
            <input
              type="date"
              value={editBirthDate}
              onChange={(e) => setEditBirthDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </Modal>

      {/* New medication modal */}
      <Modal
        isOpen={isMedModalOpen}
        onClose={() => setIsMedModalOpen(false)}
        title="Novo Medicamento"
      >
        <form onSubmit={handleCreateMed} className="space-y-4">
          {/* Patient badge (read-only, since we're on patient detail) */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs">
              {getInitials(patient.name)}
            </div>
            <div>
              <p className="text-xs text-blue-500 font-medium">Paciente</p>
              <p className="text-sm font-bold text-blue-900">{patient.name}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Medicamento
            </label>
            <input
              type="text"
              required
              value={medName}
              onChange={(e) => setMedName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
              placeholder="Ex: Losartana"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dosagem
              </label>
              <input
                type="text"
                required
                value={medDosage}
                onChange={(e) => setMedDosage(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                placeholder="Ex: 50mg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Forma
              </label>
              <select
                value={medForm}
                onChange={(e) => setMedForm(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all bg-white"
              >
                {formOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estoque (Qtd)
              </label>
              <input
                type="number"
                min="0"
                value={medStock}
                onChange={(e) => setMedStock(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                placeholder="Ex: 30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horário (Todos os dias)
              </label>
              <input
                type="time"
                value={medTime}
                onChange={(e) => setMedTime(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsMedModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isMedSubmitting}
              className="px-5 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isMedSubmitting ? 'Salvando...' : 'Cadastrar Medicamento'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete patient confirm */}
      <ConfirmDialog
        isOpen={isDeletePatientOpen}
        onClose={() => setIsDeletePatientOpen(false)}
        onConfirm={handleDeletePatient}
        title="Excluir Paciente"
        message={`Tem certeza que deseja excluir "${patient.name}"? Todos os medicamentos, horários e registros de doses serão excluídos permanentemente.`}
        confirmLabel="Excluir Paciente"
        variant="danger"
        isLoading={isDeletingPatient}
      />

      {/* Delete medication confirm */}
      <ConfirmDialog
        isOpen={isDeleteMedOpen}
        onClose={() => {
          setIsDeleteMedOpen(false);
          setDeletingMed(null);
        }}
        onConfirm={handleDeleteMed}
        title="Remover Medicamento"
        message={`Tem certeza que deseja remover "${deletingMed?.name}"? Os horários e registros de doses serão excluídos.`}
        confirmLabel="Remover"
        variant="danger"
        isLoading={isDeletingMed}
      />
    </div>
  );
};

export default PatientDetail;
