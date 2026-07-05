// Camada HTTP para o CRUD de Pacientes. Montado em "/api/pacientes"
// (ver backend/src/index.js), por isso as rotas aqui são relativas ("/").
import { Router } from "express";
import * as patientService from "../service/pacienteService.js";

const rotas = Router();

rotas.get("/", async (req, res) => {
    let retorno = await patientService.listarPacientes();
    res.json(retorno);
});

rotas.post("/", async (req, res) => {
    try {
        let pacienteVindoDoFront = req.body;
        let pacienteGerado = await patientService.cadastrarPaciente(
            pacienteVindoDoFront.nome,
            pacienteVindoDoFront.dataNascimento
        );
        res.status(200);
        res.json(pacienteGerado);
    } catch (erro) {
        res.status(400);
        res.json({ mensagem: erro.message });
    }
});

rotas.put("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let dadosParaAtualizar = req.body;
        let paciente = await patientService.alterarPaciente(
            id,
            dadosParaAtualizar.nome,
            dadosParaAtualizar.dataNascimento
        );
        res.json(paciente);
    } catch (erro) {
        res.status(400);
        res.json({ mensagem: erro.message });
    }
});

rotas.delete("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        await patientService.apagarPaciente(id);
        res.sendStatus(204);
    } catch (erro) {
        res.status(400);
        res.json({ mensagem: erro.message });
    }
});

export default rotas;
