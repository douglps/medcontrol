// Ponto único de conexão com o Postgres via Sequelize (ORM).
// Todo model (Paciente, Medicamento, Horario, RegistroDose) importa esta
// instância para se registrar no mesmo banco/pool de conexões.
import { Sequelize } from "sequelize";
import "dotenv/config";

/**
 * Instância única do Sequelize, configurada a partir das variáveis de
 * ambiente (.env). `logging: false` evita poluir o console com o SQL
 * gerado em cada query.
 */
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: "postgres",
        logging: false
    }
);

export default sequelize;
