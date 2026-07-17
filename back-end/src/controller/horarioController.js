// Camada HTTP para o CRUD de Horarios de um Medicamento.
import { Router } from "express";
import * as scheduleService from "../service/horarioService.js";
import { tratarErro } from "../utils/tratarErro.js";

const rotas = Router();

// Melhoria docs/melhorias-integracao-back-front.md, Sequência F: rota não
// tinha try/catch — uma falha no service virava erro cru sem JSON.
rotas.get("/medicamentos/:id/horarios", async (req, res) => {
    try {
        let medicationId = req.params.id;
        let retorno = await scheduleService.listarHorariosDoMedicamento(medicationId);
        res.json(retorno);
    } catch (erro) {
        tratarErro(res, erro);
    }
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
        tratarErro(res, erro);
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
        tratarErro(res, erro);
    }
});

rotas.delete("/horarios/:id", async (req, res) => {
    try {
        let id = req.params.id;
        await scheduleService.apagarHorario(id);
        res.sendStatus(204);
    } catch (erro) {
        tratarErro(res, erro);
    }
});

export default rotas;
