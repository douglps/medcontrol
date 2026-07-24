// Ponto de entrada do backend: conecta no banco, sincroniza os models
// (cria/ajusta tabelas conforme os defines de backend/src/model/*.js) e
// registra as rotas de cada feature sob o prefixo /api.
import sequelize from "./database/database.js";
import "./model/index.js";
import express from "express";
import patientController from "./controller/pacienteController.js";
import medicationController from "./controller/medicamentoController.js";
import scheduleController from "./controller/horarioController.js";
import checklistController from "./controller/checklistController.js";
import historyController from "./controller/historicoController.js";
import authController from "./controller/authController.js";
import cors from "cors";
import "dotenv/config";

async function inicializarServidor() {
    console.log("Iniciando ...");
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso usando app_role!");
    
    // O sequelize.sync() foi removido daqui e isolado no script de migrations (sync.js)
    // para respeitar o Princípio do Menor Privilégio (a aplicação roda com permissões DML apenas).

    const app = express();
    // Melhoria docs/melhorias-integracao-back-front.md, Sequência A: CORS
    // estava totalmente aberto (qualquer origem); restrito à origem do
    // frontend local. Ajustar/adicionar origens aqui se o frontend passar
    // a rodar em outro host (ex: deploy).
    app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
    app.use(express.json());
    // pacienteController já é montado com seu próprio prefixo porque suas
    // rotas são todas "/", "/:id"; os demais controllers definem o caminho
    // completo (ex: "/medicamentos/:id") e por isso entram direto em "/api".
    app.use("/api/auth", authController);
    app.use("/api/pacientes", patientController);
    app.use("/api", medicationController);
    app.use("/api", scheduleController);
    app.use("/api", checklistController);
    app.use("/api", historyController);
    console.log("Rotas definidas com sucesso!");
    const porta = Number(process.env.EXPRESS_PORT || 3000);
    app.listen(porta, (erro) => {
        if (erro) {
            console.log("Erro ao iniciar o servidor");
            console.log(erro);
        } else {
            console.log("Servidor rodando na porta " + porta);
        }
    });
}
inicializarServidor();
