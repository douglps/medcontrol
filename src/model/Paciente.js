import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

/**
 * Representa a pessoa que faz uso dos medicamentos cadastrados.
 * É a raiz da hierarquia de dados: Paciente -> Medicamento -> Horario -> RegistroDose.
 */
const Patient = sequelize.define("Patient", {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dataNascimento: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
});

export default Patient;
