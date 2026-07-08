import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

/**
 * Define QUANDO um medicamento deve ser tomado: um horário (ex: "08:00")
 * repetido em certos dias da semana. Cada Horario gera um RegistroDose
 * por dia agendado (ver checklistService.buscarChecklist).
 */
const Schedule = sequelize.define("Schedule", {
    // Horário do dia no formato "HH:mm".
    horario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Guardado como string JSON (ex: "[1,3,5]") porque Sequelize/SQLite-like
    // arrays nativos não são necessários aqui; é decodificado com
    // JSON.parse(...) sempre que usado (0 = domingo, ..., 6 = sábado).
    diasSemana: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Quantas doses são tomadas de uma vez neste horário (usado para
    // decrementar o estoque do medicamento).
    dosesPorVez: {
        type: DataTypes.FLOAT,
        defaultValue: 1
    }
});

export default Schedule;
