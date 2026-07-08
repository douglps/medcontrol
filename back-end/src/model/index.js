// Ponto central onde os relacionamentos entre models são declarados.
// Sequelize exige que as associações sejam definidas uma vez, depois que
// todos os models já existem — por isso ficam aqui e não dentro de cada
// arquivo de model individual.
import Patient from "./Paciente.js";
import Medication from "./Medicamento.js";
import Schedule from "./Horario.js";
import DoseLog from "./RegistroDose.js";

// Um Paciente tem vários Medicamentos (1:N).
Patient.hasMany(Medication, { foreignKey: "patientId" });
Medication.belongsTo(Patient, { foreignKey: "patientId" });

// Um Medicamento tem vários Horarios de administração (1:N).
Medication.hasMany(Schedule, { foreignKey: "medicationId" });
Schedule.belongsTo(Medication, { foreignKey: "medicationId" });

// Um Horario gera vários RegistroDose ao longo do tempo (1:N) —
// um por dia em que a dose foi/deveria ter sido tomada.
Schedule.hasMany(DoseLog, { foreignKey: "scheduleId" });
DoseLog.belongsTo(Schedule, { foreignKey: "scheduleId" });

// Cadeia completa: Paciente -> Medicamento -> Horario -> RegistroDose
export { Patient, Medication, Schedule, DoseLog };
