import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

/**
 * Registro de UMA dose concreta de um Horario, em uma data específica.
 * É criado automaticamente pelo checklistService (um por Horario por dia)
 * e depois atualizado quando o usuário marca a dose como tomada/pulada.
 * É a base tanto do Kanban (dia atual) quanto do Historico (dias passados).
 */
const DoseLog = sequelize.define("DoseLog", {
    // Data/hora em que a dose deveria ser tomada, segundo o Horario.
    agendadoPara: {
        type: DataTypes.DATE,
        allowNull: false
    },
    // Preenchido só quando status vira "tomado"; usado para o histórico
    // de aderência e zerado se o usuário desfizer a ação.
    tomadoEm: {
        type: DataTypes.DATE,
        allowNull: true
    },
    // "pendente" | "tomado" | "pulado" — ver checklistService.atualizarDoseLog.
    status: {
        type: DataTypes.STRING,
        defaultValue: "pendente"
    },
    // Observação livre, tipicamente usada ao pular uma dose (ex: motivo).
    nota: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

export default DoseLog;
