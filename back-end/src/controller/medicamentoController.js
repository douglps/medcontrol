// Camada HTTP para o CRUD de Medicamentos e reposição de estoque.
import { Router } from "express";
import * as medicationService from "../service/medicamentoService.js";
import { tratarErro } from "../utils/tratarErro.js";

const rotas = Router();

// Melhoria docs/melhorias-integracao-back-front.md, Sequência F: rota não
// tinha try/catch — uma falha no service virava erro cru sem JSON.
rotas.get("/pacientes/:id/medicamentos", async (req, res) => {
    try {
        let patientId = req.params.id;
        let retorno = await medicationService.listarMedicamentosDoPaciente(patientId);
        res.json(retorno);
    } catch (erro) {
        tratarErro(res, erro);
    }
});

rotas.post("/pacientes/:id/medicamentos", async (req, res) => {
    try {
        let patientId = req.params.id;
        let medicamentoVindoDoFront = req.body;
        let medicamentoGerado = await medicationService.cadastrarMedicamento(
            patientId,
            medicamentoVindoDoFront.nome,
            medicamentoVindoDoFront.dosagem,
            medicamentoVindoDoFront.forma,
            medicamentoVindoDoFront.estoqueQtd,
            medicamentoVindoDoFront.alertaEstoque
        );
        res.status(200);
        res.json(medicamentoGerado);
    } catch (erro) {
        tratarErro(res, erro);
    }
});

rotas.put("/medicamentos/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let dadosParaAtualizar = req.body;
        let medicamento = await medicationService.alterarMedicamento(
            id,
            dadosParaAtualizar.nome,
            dadosParaAtualizar.dosagem,
            dadosParaAtualizar.forma,
            dadosParaAtualizar.alertaEstoque,
            dadosParaAtualizar.ativo
        );
        res.json(medicamento);
    } catch (erro) {
        tratarErro(res, erro);
    }
});

rotas.delete("/medicamentos/:id", async (req, res) => {
    try {
        let id = req.params.id;
        await medicationService.apagarMedicamento(id);
        res.sendStatus(204);
    } catch (erro) {
        tratarErro(res, erro);
    }
});

rotas.patch("/medicamentos/:id/estoque", async (req, res) => {
    try {
        let id = req.params.id;
        let quantidade = req.body.quantidade;
        let medicamento = await medicationService.alterarEstoque(id, quantidade);
        res.json(medicamento);
    } catch (erro) {
        tratarErro(res, erro);
    }
});

export default rotas;
