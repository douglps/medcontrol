// Camada HTTP para o CRUD de Medicamentos e reposição de estoque.
import { Router } from "express";
import * as medicationService from "../service/medicamentoService.js";

const rotas = Router();

rotas.get("/pacientes/:id/medicamentos", async (req, res) => {
    let patientId = req.params.id;
    let retorno = await medicationService.listarMedicamentosDoPaciente(patientId);
    res.json(retorno);
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
        res.status(400);
        res.json({ mensagem: erro.message });
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
        res.status(400);
        res.json({ mensagem: erro.message });
    }
});

rotas.delete("/medicamentos/:id", async (req, res) => {
    try {
        let id = req.params.id;
        await medicationService.apagarMedicamento(id);
        res.sendStatus(204);
    } catch (erro) {
        res.status(400);
        res.json({ mensagem: erro.message });
    }
});

rotas.patch("/medicamentos/:id/estoque", async (req, res) => {
    try {
        let id = req.params.id;
        let quantidade = req.body.quantidade;
        let medicamento = await medicationService.alterarEstoque(id, quantidade);
        res.json(medicamento);
    } catch (erro) {
        res.status(400);
        res.json({ mensagem: erro.message });
    }
});

export default rotas;
