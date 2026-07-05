// CRUD de Pacientes. Excluir um paciente exige derrubar em cascata toda a
// árvore de dados dependente (Medicamentos -> Horarios -> DoseLogs), já
// que não há ON DELETE CASCADE configurado no banco (mesmo padrão usado
// em medicamentoService.apagarMedicamento).
import Patient from "../model/Paciente.js";
import Medication from "../model/Medicamento.js";
import Schedule from "../model/Horario.js";
import DoseLog from "../model/RegistroDose.js";

export async function listarPacientes() {
    let pacientes = await Patient.findAll();
    return pacientes;
}

// valida R9
function validarNome(nome) {
    if (!nome || typeof (nome) != "string" || nome.length == 0 || nome.length > 100) {
        throw new Error("Nome é obrigatório e deve ter até 100 caracteres");
    }
}

// @spec SPEC-20260702-001 RF-02
export async function cadastrarPaciente(nome, dataNascimento) {
    validarNome(nome);
    let paciente = await Patient.create({
        nome: nome,
        dataNascimento: dataNascimento
    });
    return paciente;
}

// @spec SPEC-20260702-001 RF-03
export async function alterarPaciente(id, nome, dataNascimento) {
    let paciente = await Patient.findByPk(id);
    if (!paciente) {
        throw new Error("Paciente não encontrado");
    }
    validarNome(nome);
    await paciente.update({
        nome: nome,
        dataNascimento: dataNascimento
    });
    return paciente;
}

// @spec SPEC-20260702-001 RF-04 (valida C1 — exclusão em cascata)
export async function apagarPaciente(id) {
    let paciente = await Patient.findByPk(id);
    if (!paciente) {
        throw new Error("Paciente não encontrado");
    }
    let medicamentos = await Medication.findAll({ where: { patientId: id } });
    for (let medicamento of medicamentos) {
        let schedules = await Schedule.findAll({ where: { medicationId: medicamento.id } });
        for (let schedule of schedules) {
            await DoseLog.destroy({ where: { scheduleId: schedule.id } });
        }
        await Schedule.destroy({ where: { medicationId: medicamento.id } });
    }
    await Medication.destroy({ where: { patientId: id } });
    await paciente.destroy();
}
