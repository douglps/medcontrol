// Camada HTTP para consultas de histórico e aderência; toda a lógica de
// cálculo mora em historicoService.
import { Router } from "express";
import * as historyService from "../service/historicoService.js";
import { tratarErro } from "../utils/tratarErro.js";

const rotas = Router();

rotas.get("/pacientes/:id/historico", async (req, res) => {
    try {
        let patientId = req.params.id;
        let { medicamentoId, inicio, fim } = req.query;
        let retorno = await historyService.listarHistorico(patientId, medicamentoId, inicio, fim);
        res.json(retorno);
    } catch (erro) {
        tratarErro(res, erro);
    }
});

rotas.get("/pacientes/:id/aderencia", async (req, res) => {
    try {
        let patientId = req.params.id;
        let { medicamentoId, inicio, fim } = req.query;
        let retorno = await historyService.calcularAderencia(patientId, medicamentoId, inicio, fim);
        res.json(retorno);
    } catch (erro) {
        tratarErro(res, erro);
    }
});

export default rotas;
