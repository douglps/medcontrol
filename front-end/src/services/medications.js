import api from './api';

const mapMedication = (m) => ({
  id: m.id,
  name: m.nome,
  dosage: m.dosagem,
  form: m.forma,
  stockQty: m.estoqueQtd,
  stockAlert: m.alertaEstoque,
  active: m.ativo,
  patientId: m.patientId,
});

export const getMedicationsByPatient = async (patientId) => {
  const response = await api.get(`/pacientes/${patientId}/medicamentos`);
  return response.data.map(mapMedication);
};

export const getAllMedications = async (patients) => {
  // Busca medicamentos de todos os pacientes informados
  const results = [];
  for (const patient of patients) {
    try {
      const response = await api.get(`/pacientes/${patient.id}/medicamentos`);
      const meds = response.data.map((m) => ({
        ...mapMedication(m),
        patientName: patient.name,
      }));
      results.push(...meds);
    } catch {
      // ignora pacientes sem medicamentos
    }
  }
  return results;
};

export const createMedication = async (patientId, medicationData) => {
  const response = await api.post(`/pacientes/${patientId}/medicamentos`, {
    nome: medicationData.name,
    dosagem: medicationData.dosage,
    forma: medicationData.form || 'comprimido',
    estoqueQtd: medicationData.stockQty || 0,
    alertaEstoque: medicationData.stockAlert || 5,
  });
  return mapMedication(response.data);
};

export const createSchedule = async (medicationId, time) => {
  const response = await api.post(`/medicamentos/${medicationId}/horarios`, {
    horario: time,
    diasSemana: '[0,1,2,3,4,5,6]',
    dosesPorVez: 1,
  });
  return response.data;
};

export const updateMedication = async (id, medicationData) => {
  const response = await api.put(`/medicamentos/${id}`, {
    nome: medicationData.name,
    dosagem: medicationData.dosage,
    forma: medicationData.form,
    alertaEstoque: medicationData.stockAlert,
    ativo: medicationData.active,
  });
  return mapMedication(response.data);
};

export const deleteMedication = async (id) => {
  await api.delete(`/medicamentos/${id}`);
};
