// Consultas de leitura sobre DoseLogs já finalizados (tomado/pulado) para
// alimentar a tela de Histórico: lista bruta de doses e cálculo de
// percentual de aderência (RF-02/RF-03).
import { Op } from "sequelize";
import Schedule from "../model/Horario.js";
import Medication from "../model/Medicamento.js";
import DoseLog from "../model/RegistroDose.js";

function validarPeriodo(inicio, fim) {
    if (!inicio || !fim) {
        throw new Error("Período (inicio e fim) é obrigatório");
    }
    if (new Date(fim) < new Date(inicio)) {
        throw new Error("Data final não pode ser anterior à data inicial");
    }
}

function filtroMedicamento(patientId, medicamentoId) {
    let where = { patientId: patientId };
    if (medicamentoId) {
        where.id = medicamentoId;
    }
    return where;
}

/**
 * Lista os DoseLogs já concluídos (tomado ou pulado) de um paciente dentro
 * de um período, opcionalmente filtrando por um medicamento específico.
 */
// @spec SPEC-20260702-006 RF-01
export async function listarHistorico(patientId, medicamentoId, inicio, fim) {
    validarPeriodo(inicio, fim);
    let doseLogs = await DoseLog.findAll({
        where: {
            status: { [Op.in]: ["tomado", "pulado"] },
            agendadoPara: { [Op.between]: [new Date(inicio + "T00:00:00"), new Date(fim + "T23:59:59")] }
        },
        include: [{
            model: Schedule,
            required: true,
            include: [{ model: Medication, where: filtroMedicamento(patientId, medicamentoId) }]
        }],
        order: [["agendadoPara", "DESC"]]
    });
    return doseLogs;
}

/**
 * Calcula a taxa de aderência (% de doses tomadas em relação ao total
 * tomado+pulado) agrupada por medicamento e por dia, dentro de um período.
 * Medicamentos sem nenhum DoseLog no período aparecem com percentual null
 * (evita divisão por zero e diferencia "sem dados" de "0% de aderência").
 */
// @spec SPEC-20260702-006 RF-02, RF-03 (valida R5)
export async function calcularAderencia(patientId, medicamentoId, inicio, fim) {
    validarPeriodo(inicio, fim);
    let medicamentos = await Medication.findAll({
        where: { ...filtroMedicamento(patientId, medicamentoId), ativo: true }
    });
    let doseLogs = await DoseLog.findAll({
        where: {
            status: { [Op.in]: ["tomado", "pulado"] },
            agendadoPara: { [Op.between]: [new Date(inicio + "T00:00:00"), new Date(fim + "T23:59:59")] }
        },
        include: [{
            model: Schedule,
            required: true,
            include: [{ model: Medication, where: filtroMedicamento(patientId, medicamentoId) }]
        }]
    });

    let porMedicamento = {};
    for (let medicamento of medicamentos) {
        porMedicamento[medicamento.id] = { medicamentoId: medicamento.id, nome: medicamento.nome, tomado: 0, pulado: 0 };
    }

    let porDia = {};
    for (let doseLog of doseLogs) {
        let medicamento = doseLog.Schedule.Medication;
        if (!porMedicamento[medicamento.id]) {
            porMedicamento[medicamento.id] = { medicamentoId: medicamento.id, nome: medicamento.nome, tomado: 0, pulado: 0 };
        }
        porMedicamento[medicamento.id][doseLog.status]++;

        let dia = new Date(doseLog.agendadoPara).toISOString().slice(0, 10);
        if (!porDia[dia]) {
            porDia[dia] = { data: dia, tomado: 0, pulado: 0 };
        }
        porDia[dia][doseLog.status]++;
    }

    function comPercentual(registro) {
        let total = registro.tomado + registro.pulado;
        registro.percentual = total > 0 ? Math.round((registro.tomado / total) * 100) : null;
        return registro;
    }

    return {
        porMedicamento: Object.values(porMedicamento).map(comPercentual),
        porDia: Object.values(porDia).map(comPercentual)
    };
}
