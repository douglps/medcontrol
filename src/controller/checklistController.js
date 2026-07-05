// Camada HTTP: só lê query/params/body, delega a regra de negócio ao
// checklistService e traduz erros de validação em respostas 400.
import { Router } from "express";
import * as checklistService from "../service/checklistService.js";

const rotas = Router();

rotas.get("/checklist", async (req, res) => {
    try {
        let pacienteId = req.query.pacienteId;
        let data = req.query.data;
        let retorno = await checklistService.buscarChecklist(pacienteId, data);
        res.json(retorno);
    } catch (erro) {
        res.status(400);
        res.json({ mensagem: erro.message });
    }
});

rotas.patch("/doselogs/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let dadosParaAtualizar = req.body;
        let doseLog = await checklistService.atualizarDoseLog(
            id,
            dadosParaAtualizar.status,
            dadosParaAtualizar.nota
        );
        res.json(doseLog);
    } catch (erro) {
        res.status(400);
        res.json({ mensagem: erro.message });
    }
});

export default rotas;
