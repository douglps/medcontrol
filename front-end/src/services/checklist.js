import api from './api';

export const getChecklist = async (date, pacienteId) => {
  if (!pacienteId) return [];
  const params = { pacienteId };
  if (date) params.data = date;
  const response = await api.get('/checklist', { params });

  const data = response.data;
  // O backend retorna { pendente: [], tomado: [], pulado: [] }
  const flatList = [
    ...(data.pendente || []),
    ...(data.tomado || []),
    ...(data.pulado || []),
  ];

  return flatList.map((item) => ({
    id: item.id,
    time: item.Schedule?.horario,
    status:
      item.status === 'pendente'
        ? 'Pendente'
        : item.status === 'tomado'
          ? 'Tomado'
          : 'Pulado',
    Medication: {
      name: item.Schedule?.Medication?.nome,
      dosage: item.Schedule?.Medication?.dosagem,
    },
    Patient: {
      name: item.Schedule?.Medication?.Patient?.nome || 'N/A',
    },
  }));
};

export const updateDoseStatus = async (doseId, status) => {
  const backendStatus = status.toLowerCase();
  const response = await api.patch(`/doselogs/${doseId}`, {
    status: backendStatus,
  });
  return response.data;
};
