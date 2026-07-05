// CRUD dos Horarios (quando/quantas vezes um medicamento deve ser tomado)
// vinculados a um Medicamento.
import Schedule from "../model/Horario.js";

// @spec SPEC-20260702-003 RF-06
export async function listarHorariosDoMedicamento(medicationId) {
    let horarios = await Schedule.findAll({ where: { medicationId: medicationId }, order: [["horario", "ASC"]] });
    return horarios;
}

// diasSemana chega como string JSON (ex: "[1,3,5]") vindo do front —
// aqui é decodificado só para validar que é um array não vazio.
function validarHorario(horario, diasSemana, dosesPorVez) {
    if (!horario || typeof (horario) != "string" || horario.length == 0) {
        throw new Error("Horário é obrigatório");
    }
    let dias;
    try {
        dias = JSON.parse(diasSemana);
    } catch {
        throw new Error("Dias da semana em formato inválido");
    }
    if (!Array.isArray(dias) || dias.length == 0) {
        throw new Error("Selecione ao menos um dia da semana");
    }
    if (!(dosesPorVez > 0)) {
        throw new Error("Doses por vez deve ser maior que zero");
    }
}

// @spec SPEC-20260702-003 RF-02 (valida R7)
export async function cadastrarHorario(medicationId, horario, diasSemana, dosesPorVez) {
    validarHorario(horario, diasSemana, dosesPorVez);
    let schedule = await Schedule.create({
        horario: horario,
        diasSemana: diasSemana,
        dosesPorVez: dosesPorVez,
        medicationId: medicationId
    });
    return schedule;
}

// @spec SPEC-20260702-003 RF-04
export async function alterarHorario(id, horario, diasSemana, dosesPorVez) {
    let schedule = await Schedule.findByPk(id);
    if (!schedule) {
        throw new Error("Horário não encontrado");
    }
    validarHorario(horario, diasSemana, dosesPorVez);
    await schedule.update({
        horario: horario,
        diasSemana: diasSemana,
        dosesPorVez: dosesPorVez
    });
    return schedule;
}

// @spec SPEC-20260702-003 RF-05
export async function apagarHorario(id) {
    let schedule = await Schedule.findByPk(id);
    if (!schedule) {
        throw new Error("Horário não encontrado");
    }
    await schedule.destroy();
}
