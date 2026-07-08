// Regra de negócio do "checklist diário": para uma data e paciente, garante
// que exista um RegistroDose (DoseLog) para cada Horario ativo daquele dia
// e devolve os registros já agrupados por status, para alimentar o Kanban.
import Schedule from "../model/Horario.js";
import Medication from "../model/Medicamento.js";
import DoseLog from "../model/RegistroDose.js";

/**
 * Monta o checklist de doses de um paciente em uma data.
 * Cria (idempotentemente) os DoseLogs pendentes que ainda não existem para
 * os Horarios daquele dia da semana, e retorna tudo já separado em
 * pendente/tomado/pulado.
 * @param {string|number} pacienteId
 * @param {string} data formato "YYYY-MM-DD"
 */
// @spec SPEC-20260702-004 (valida R7, R8)
export async function buscarChecklist(pacienteId, data) {
    if (!pacienteId) {
        throw new Error("pacienteId é obrigatório");
    }
    if (!data) {
        throw new Error("data é obrigatória");
    }

    // getDay() retorna 0-6 (dom-sáb), mesmo formato usado em diasSemana do Horario.
    let diaSemana = new Date(data + "T00:00:00").getDay();

    let schedules = await Schedule.findAll({
        include: [{
            model: Medication,
            where: { patientId: pacienteId, ativo: true }
        }]
    });

    let schedulesDoDia = schedules.filter((schedule) => {
        let dias = JSON.parse(schedule.diasSemana);
        return dias.includes(diaSemana);
    });

    // valida P1 — evita N+1 queries: busca todos os DoseLogs do dia de uma vez
    let scheduleIds = schedulesDoDia.map((schedule) => schedule.id);
    let agendadosPorSchedule = new Map(
        schedulesDoDia.map((schedule) => [schedule.id, new Date(data + "T" + schedule.horario + ":00")])
    );

    let doseLogsExistentes = await DoseLog.findAll({
        where: {
            scheduleId: scheduleIds,
            agendadoPara: [...agendadosPorSchedule.values()]
        }
    });
    let scheduleIdsComDoseLog = new Set(doseLogsExistentes.map((doseLog) => doseLog.scheduleId));

    let schedulesSemDoseLog = schedulesDoDia.filter((schedule) => !scheduleIdsComDoseLog.has(schedule.id));
    if (schedulesSemDoseLog.length > 0) {
        await DoseLog.bulkCreate(schedulesSemDoseLog.map((schedule) => ({
            agendadoPara: agendadosPorSchedule.get(schedule.id),
            status: "pendente",
            scheduleId: schedule.id
        })));
    }

    let doseLogs = await DoseLog.findAll({
        where: { scheduleId: scheduleIds, agendadoPara: [...agendadosPorSchedule.values()] },
        include: [{ model: Schedule, include: [Medication] }]
    });

    let retorno = { pendente: [], tomado: [], pulado: [] };
    for (let doseLog of doseLogs) {
        if (doseLog.status == "tomado") {
            retorno.tomado.push(doseLog);
        } else if (doseLog.status == "pulado") {
            retorno.pulado.push(doseLog);
        } else {
            retorno.pendente.push(doseLog);
        }
    }
    return retorno;
}

function mesmoDia(dataA, dataB) {
    return dataA.getFullYear() == dataB.getFullYear()
        && dataA.getMonth() == dataB.getMonth()
        && dataA.getDate() == dataB.getDate();
}

/**
 * Muda o status de uma dose (pendente/tomado/pulado) e ajusta o estoque
 * do medicamento de acordo com a transição de status.
 * @param {string|number} id id do DoseLog
 * @param {"pendente"|"tomado"|"pulado"} status novo status
 * @param {string|null} nota observação opcional (ex: motivo de ter pulado)
 */
// @spec SPEC-20260702-004 (valida R1, R2, R4)
export async function atualizarDoseLog(id, status, nota) {
    let doseLog = await DoseLog.findByPk(id, {
        include: [{ model: Schedule, include: [Medication] }]
    });
    if (!doseLog) {
        throw new Error("Registro não encontrado");
    }
    if (!mesmoDia(new Date(doseLog.agendadoPara), new Date())) {
        throw new Error("Apenas doses do dia atual podem ter o status alterado");
    }

    let statusAnterior = doseLog.status;
    let medicamento = doseLog.Schedule.Medication;
    let dosesPorVez = doseLog.Schedule.dosesPorVez;

    // Estoque só é movimentado na transição DE/PARA "tomado", nunca em
    // outras combinações (ex: pendente -> pulado não mexe no estoque).
    // Isso permite desfazer uma marcação (tomado -> pendente) sem perder
    // a consistência do estoque. Math.max(0, ...) evita estoque negativo (R3).
    if (statusAnterior != "tomado" && status == "tomado") {
        await medicamento.update({ estoqueQtd: Math.max(0, medicamento.estoqueQtd - dosesPorVez) });
    } else if (statusAnterior == "tomado" && status != "tomado") {
        await medicamento.update({ estoqueQtd: medicamento.estoqueQtd + dosesPorVez });
    }

    await doseLog.update({
        status: status,
        nota: nota,
        tomadoEm: status == "tomado" ? new Date() : null
    });

    return doseLog;
}
