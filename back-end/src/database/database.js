import { Sequelize } from "sequelize";
import "dotenv/config";

// Verifica se estamos no modo de sincronização (via script sync.js)
const isSyncMode = process.env.SYNC_MODE === 'true';

// Usa as credenciais corretas baseado no princípio de Least Privilege
const dbUser = isSyncMode ? process.env.MIGRATOR_DB_USER : process.env.APP_DB_USER;
const dbPassword = isSyncMode ? process.env.MIGRATOR_DB_PASSWORD : process.env.APP_DB_PASSWORD;

// Melhoria docs/melhorias-integracao-back-front.md, Sequência F: havia um
// console.log aqui que imprimia dbPassword em texto plano a cada boot do
// servidor — removido. Nunca logar credenciais, nem em debug.

const sequelize = new Sequelize(
    process.env.DB_NAME,
    dbUser,
    dbPassword,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: "postgres",
        logging: false
    }
);

export default sequelize;
