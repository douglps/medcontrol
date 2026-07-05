// CRUD de Medicamentos, incluindo exclusão em cascata (C1) e reposição
// manual de estoque (RF-05).
import Medication from "../model/Medicamento.js";
import Schedule from "../model/Horario.js";
import DoseLog from "../model/RegistroDose.js";

// Lista fechada de formas farmacêuticas aceitas pelo cadastro e reaproveitada
// pelo front (FormularioMedicamento) para preencher o select.
export const FORMAS_VALIDAS = ["comprimido", "cápsula", "líquido", "injeção", "pomada", "spray"];

export async function listarMedicamentosDoPaciente(patientId) {
    let medicamentos = await Medication.findAll({ where: { patientId: patientId } });
    return medicamentos;
}

function validarCamposObrigatorios(nome, dosagem, forma) {
    if (!nome || typeof (nome) != "string" || nome.length == 0 || nome.length > 100) {
        throw new Error("Nome é obrigatório e deve ter até 100 caracteres");
    }
    if (!dosagem || typeof (dosagem) != "string" || dosagem.length == 0) {
        throw new Error("Dosagem é obrigatória");
    }
    if (!FORMAS_VALIDAS.includes(forma)) {
        throw new Error("Forma inválida. Valores aceitos: " + FORMAS_VALIDAS.join(", "));
    }
}

// @spec SPEC-20260702-002 RF-02
export async function cadastrarMedicamento(patientId, nome, dosagem, forma, estoqueQtd, alertaEstoque) {
    validarCamposObrigatorios(nome, dosagem, forma);
    if (typeof (estoqueQtd) != "number" || estoqueQtd < 0) {
        throw new Error("Estoque atual não pode ser negativo");
    }
    let medicamento = await Medication.create({
        nome: nome,
        dosagem: dosagem,
        forma: forma,
        estoqueQtd: estoqueQtd,
        alertaEstoque: alertaEstoque,
        patientId: patientId
    });
    return medicamento;
}

// @spec SPEC-20260702-002 RF-04
export async function alterarMedicamento(id, nome, dosagem, forma, alertaEstoque, ativo) {
    let medicamento = await Medication.findByPk(id);
    if (!medicamento) {
        throw new Error("Medicamento não encontrado");
    }
    validarCamposObrigatorios(nome, dosagem, forma);
    await medicamento.update({
        nome: nome,
        dosagem: dosagem,
        forma: forma,
        alertaEstoque: alertaEstoque,
        ativo: ativo
    });
    return medicamento;
}

/**
 * Remove um medicamento e tudo que depende dele (Horarios e seus DoseLogs),
 * já que o banco não tem ON DELETE CASCADE configurado — a cascata é feita
 * manualmente aqui, na ordem inversa das dependências (filhos antes do pai).
 */
// @spec SPEC-20260702-002 RF-06 (valida C1 — exclusão em cascata)
export async function apagarMedicamento(id) {
    let medicamento = await Medication.findByPk(id);
    if (!medicamento) {
        throw new Error("Medicamento não encontrado");
    }
    let schedules = await Schedule.findAll({ where: { medicationId: id } });
    for (let schedule of schedules) {
        await DoseLog.destroy({ where: { scheduleId: schedule.id } });
    }
    await Schedule.destroy({ where: { medicationId: id } });
    await medicamento.destroy();
}

/**
 * Registra reposição de estoque (soma `quantidade` ao estoque atual).
 * Só aceita valores positivos — para consumo/baixa de estoque quem decide
 * é o checklistService ao marcar uma dose como tomada.
 */
// @spec SPEC-20260702-005 RF-05 (valida R3, estoque nunca negativo)
export async function alterarEstoque(id, quantidade) {
    let medicamento = await Medication.findByPk(id);
    if (!medicamento) {
        throw new Error("Medicamento não encontrado");
    }
    if (typeof (quantidade) != "number" || quantidade <= 0) {
        throw new Error("Quantidade de reposição deve ser um número maior que zero");
    }
    await medicamento.update({
        estoqueQtd: medicamento.estoqueQtd + quantidade
    });
    return medicamento;
}
