import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from '../services/patients';
import {
  Users,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  UserRound,
  CalendarDays,
} from 'lucide-react';

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Create/Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formName, setFormName] = useState('');
  const [formBirthDate, setFormBirthDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirm
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingPatient, setDeletingPatient] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // ─── Open create modal ───
  const openCreateModal = () => {
    setEditingPatient(null);
    setFormName('');
    setFormBirthDate('');
    setIsModalOpen(true);
  };

  // ─── Open edit modal ───
  const openEditModal = (patient) => {
    setEditingPatient(patient);
    setFormName(patient.name);
    setFormBirthDate(patient.birthDate || '');
    setIsModalOpen(true);
  };

  // ─── Submit (create or update) ───
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setIsSubmitting(true);

    try {
      if (editingPatient) {
        const updated = await updatePatient(editingPatient.id, {
          name: formName.trim(),
          birthDate: formBirthDate || null,
        });
        setPatients((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
      } else {
        const created = await createPatient({
          name: formName.trim(),
          birthDate: formBirthDate || null,
        });
        setPatients((prev) => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save patient', error);
      alert('Erro ao salvar paciente. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Delete ───
  const openDeleteConfirm = (patient) => {
    setDeletingPatient(patient);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingPatient) return;
    setIsDeleting(true);
    try {
      await deletePatient(deletingPatient.id);
      setPatients((prev) => prev.filter((p) => p.id !== deletingPatient.id));
      setIsDeleteOpen(false);
      setDeletingPatient(null);
    } catch (error) {
      console.error('Failed to delete patient', error);
      alert('Erro ao excluir paciente.');
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Filter ───
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ─── Initials avatar ───
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

  const getAvatarColor = (id) => avatarColors[id % avatarColors.length];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-primary" size={28} />
            Pacientes
          </h2>
          <p className="text-gray-500 mt-1">
            Gerencie seus pacientes e acesse seus dados.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
        >
          <Plus size={18} />
          Novo Paciente
        </button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80 pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
        />
      </div>

      {/* Patient cards grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredPatients.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <UserRound size={56} className="mb-4 opacity-40" />
            <p className="text-lg font-medium text-gray-500">
              {searchTerm
                ? 'Nenhum paciente encontrado'
                : 'Nenhum paciente cadastrado'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm
                ? 'Tente alterar o termo de busca.'
                : 'Clique em "Novo Paciente" para começar.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className="group relative overflow-hidden hover:shadow-md transition-all duration-200 hover:border-primary/30 cursor-pointer"
              onClick={() => navigate(`/patients/${patient.id}`)}
            >
              {/* Decorative circle */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary/5 to-blue-100/30 rounded-full transition-transform duration-300 group-hover:scale-125" />

              <div className="relative z-10 flex items-start gap-4">
                {/* Avatar */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarColor(patient.id)} flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0`}
                >
                  {getInitials(patient.name)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate group-hover:text-primary transition-colors">
                    {patient.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
                    {patient.age !== null && (
                      <span className="flex items-center gap-1">
                        <UserRound size={13} />
                        {patient.age} anos
                      </span>
                    )}
                    {patient.birthDate && (
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} />
                        {new Date(patient.birthDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="relative z-10 mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/patients/${patient.id}`);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary px-2.5 py-1.5 rounded-md hover:bg-primary/5 transition-colors"
                  title="Ver detalhes"
                >
                  <Eye size={14} />
                  Detalhes
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(patient);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-amber-600 px-2.5 py-1.5 rounded-md hover:bg-amber-50 transition-colors"
                  title="Editar"
                >
                  <Pencil size={14} />
                  Editar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteConfirm(patient);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-600 px-2.5 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={14} />
                  Excluir
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPatient ? 'Editar Paciente' : 'Cadastrar Novo Paciente'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              required
              maxLength={100}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
              placeholder="Ex: João da Silva"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Nascimento
            </label>
            <input
              type="date"
              value={formBirthDate}
              onChange={(e) => setFormBirthDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting
                ? 'Salvando...'
                : editingPatient
                  ? 'Salvar Alterações'
                  : 'Cadastrar Paciente'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingPatient(null);
        }}
        onConfirm={handleDelete}
        title="Excluir Paciente"
        message={`Tem certeza que deseja excluir "${deletingPatient?.name}"? Todos os medicamentos, horários e registros de doses vinculados a este paciente serão excluídos permanentemente.`}
        confirmLabel="Excluir Paciente"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Patients;
