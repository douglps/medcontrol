import api from './api';

const mapPatient = (p) => {
  const age = p.dataNascimento
    ? Math.floor(
        (new Date() - new Date(p.dataNascimento)) / (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;
  return {
    id: p.id,
    name: p.nome,
    birthDate: p.dataNascimento || null,
    age: age,
  };
};

export const getPatients = async () => {
  const response = await api.get('/pacientes');
  return response.data.map(mapPatient);
};

export const getPatientById = async (id) => {
  const response = await api.get(`/pacientes/${id}`);
  return mapPatient(response.data);
};

export const createPatient = async (patientData) => {
  const response = await api.post('/pacientes', {
    nome: patientData.name,
    dataNascimento: patientData.birthDate,
  });
  return mapPatient(response.data);
};

export const updatePatient = async (id, patientData) => {
  const response = await api.put(`/pacientes/${id}`, {
    nome: patientData.name,
    dataNascimento: patientData.birthDate,
  });
  return mapPatient(response.data);
};

export const deletePatient = async (id) => {
  await api.delete(`/pacientes/${id}`);
};

export const getPatientMedications = async (patientId) => {
  const response = await api.get(`/pacientes/${patientId}/medicamentos`);
  return response.data.map((m) => ({
    id: m.id,
    name: m.nome,
    dosage: m.dosagem,
    form: m.forma,
    stockQty: m.estoqueQtd,
    stockAlert: m.alertaEstoque,
    active: m.ativo,
    patientId: m.patientId,
  }));
};
