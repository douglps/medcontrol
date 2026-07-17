// Camada HTTP para o CRUD de Pacientes. Montado em "/api/pacientes"
// (ver backend/src/index.js), por isso as rotas aqui são relativas ("/").
import { Router } from "express";
import * as patientService from "../service/pacienteService.js";
import { tratarErro } from "../utils/tratarErro.js";

const rotas = Router();

// Melhoria docs/melhorias-integracao-back-front.md, Sequência F: rota não
// tinha try/catch — uma falha no service virava erro cru sem JSON.
rotas.get("/", async (req, res) => {
    try {
        let retorno = await patientService.listarPacientes();
        res.json(retorno);
    } catch (erro) {
        tratarErro(res, erro);
    }
});

// Melhoria docs/melhorias-integracao-back-front.md, Sequência B: rota de
// busca por id não existia, mas o frontend (PatientDetail) depende dela.
rotas.get("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let paciente = await patientService.buscarPacientePorId(id);
        res.json(paciente);
    } catch (erro) {
        tratarErro(res, erro);
    }
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
        tratarErro(res, erro);
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
        tratarErro(res, erro);
    }
});

rotas.delete("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        await patientService.apagarPaciente(id);
        res.sendStatus(204);
    } catch (erro) {
        tratarErro(res, erro);
    }
});

export default rotas;
