import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { getPatients } from '../services/patients';
import {
  getAllMedications,
  createMedication,
  createSchedule,
  deleteMedication,
} from '../services/medications';
import { Pill, Plus, Trash2, Package, AlertTriangle, UserRound } from 'lucide-react';

const Medications = () => {
  const [medications, setMedications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newForm, setNewForm] = useState('comprimido');
  const [newStock, setNewStock] = useState('');
  const [newTime, setNewTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirm
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingMed, setDeletingMed] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const patientsData = await getPatients();
      setPatients(patientsData);
      const medsData = await getAllMedications(patientsData);
      setMedications(medsData);
    } catch (error) {
      console.error('Failed to load data', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedPatientId(patients.length > 0 ? String(patients[0].id) : '');
    setNewName('');
    setNewDosage('');
    setNewForm('comprimido');
    setNewStock('');
    setNewTime('');
    setIsModalOpen(true);
  };

  const handleCreateMedication = async (e) => {
    e.preventDefault();
    if (!newName || !newDosage || !selectedPatientId) return;

    setIsSubmitting(true);
    try {
      const newMed = await createMedication(selectedPatientId, {
        name: newName,
        dosage: newDosage,
        form: newForm,
        stockQty: parseInt(newStock, 10) || 0,
      });

      if (newTime) {
        await createSchedule(newMed.id, newTime);
      }

      // Add patient name to the medication for display
      const patient = patients.find((p) => p.id === parseInt(selectedPatientId));
      setMedications((prev) => [
        ...prev,
        { ...newMed, patientName: patient?.name || 'N/A' },
      ]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create medication', error);
      alert('Erro ao cadastrar medicamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteConfirm = (med) => {
    setDeletingMed(med);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingMed) return;
    setIsDeleting(true);
    try {
      await deleteMedication(deletingMed.id);
      setMedications((prev) => prev.filter((m) => m.id !== deletingMed.id));
      setIsDeleteOpen(false);
      setDeletingMed(null);
    } catch (error) {
      console.error('Failed to delete medication', error);
      alert('Erro ao excluir medicamento.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formOptions = [
    { value: 'comprimido', label: 'Comprimido' },
    { value: 'cápsula', label: 'Cápsula' },
    { value: 'líquido', label: 'Líquido' },
    { value: 'injetável', label: 'Injetável' },
    { value: 'pomada', label: 'Pomada' },
    { value: 'gotas', label: 'Gotas' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Pill className="text-primary" size={28} />
            Medicamentos
          </h2>
          <p className="text-gray-500 mt-1">
            Gerencie todos os medicamentos de seus pacientes.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={patients.length === 0}
          className="inline-flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          Novo Medicamento
        </button>
      </div>

      {patients.length === 0 && !loading && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Cadastre ao menos um paciente antes de adicionar medicamentos.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : medications.length === 0 ? (
          <Card className="col-span-3">
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Pill size={48} className="mb-4 opacity-40" />
              <p className="text-lg font-medium text-gray-500">
                Nenhum medicamento cadastrado
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Clique em &quot;Novo Medicamento&quot; para começar.
              </p>
            </div>
          </Card>
        ) : (
          medications.map((med) => (
            <Card
              key={med.id}
              className="group relative overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-4 -mt-4 z-0" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-100 text-primary rounded-lg">
                      <Pill size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{med.name}</h3>
                      <p className="text-xs text-gray-400 capitalize">{med.form}</p>
                    </div>
                  </div>
                  {!med.active && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                      Inativo
                    </span>
                  )}
                </div>

                {/* Patient badge */}
                {med.patientName && (
                  <div className="flex items-center gap-1.5 mb-3 px-2.5 py-1.5 bg-gray-50 rounded-md w-fit">
                    <UserRound size={13} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-600">
                      {med.patientName}
                    </span>
                  </div>
                )}

                <div className="space-y-1.5 mb-4 flex-1 text-sm">
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

                <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    onClick={() => openDeleteConfirm(med)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} />
                    Remover
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Medication Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Novo Medicamento"
      >
        <form onSubmit={handleCreateMedication} className="space-y-4">
          {/* Patient selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paciente <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all bg-white"
            >
              <option value="" disabled>
                Selecione um paciente
              </option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Medicamento
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
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
                value={newDosage}
                onChange={(e) => setNewDosage(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                placeholder="Ex: 50mg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Forma
              </label>
              <select
                value={newForm}
                onChange={(e) => setNewForm(e.target.value)}
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
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
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
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
              />
            </div>
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
              {isSubmitting ? 'Salvando...' : 'Salvar Medicamento'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingMed(null);
        }}
        onConfirm={handleDelete}
        title="Remover Medicamento"
        message={`Tem certeza que deseja remover "${deletingMed?.name}"? Os horários e registros de doses vinculados serão excluídos.`}
        confirmLabel="Remover"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Medications;
