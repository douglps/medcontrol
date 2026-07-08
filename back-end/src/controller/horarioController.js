// Camada HTTP para o CRUD de Horarios de um Medicamento.
import { Router } from "express";
import * as scheduleService from "../service/horarioService.js";

const rotas = Router();

rotas.get("/medicamentos/:id/horarios", async (req, res) => {
    let medicationId = req.params.id;
    let retorno = await scheduleService.listarHorariosDoMedicamento(medicationId);
    res.json(retorno);
});

rotas.post("/medicamentos/:id/horarios", async (req, res) => {
    try {
        let medicationId = req.params.id;
        let horarioVindoDoFront = req.body;
        let horarioGerado = await scheduleService.cadastrarHorario(
            medicationId,
            horarioVindoDoFront.horario,
            horarioVindoDoFront.diasSemana,
            horarioVindoDoFront.dosesPorVez
        );
        res.status(200);
        res.json(horarioGerado);
    } catch (erro) {
        res.status(400);
        res.json({ mensagem: erro.message });
    }
});

rotas.put("/horarios/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let dadosParaAtualizar = req.body;
        let schedule = await scheduleService.alterarHorario(
            id,
            dadosParaAtualizar.horario,
            dadosParaAtualizar.diasSemana,
            dadosParaAtualizar.dosesPorVez
        );
        res.json(schedule);
    } catch (erro) {
        res.status(400);
        res.json({ mensagem: erro.message });
    }
});

rotas.delete("/horarios/:id", async (req, res) => {
    try {
        let id = req.params.id;
        await scheduleService.apagarHorario(id);
        res.sendStatus(204);
    } catch (erro) {
        res.status(400);
        res.json({ mensagem: erro.message });
    }
});

export default rotas;
