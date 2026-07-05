import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

/**
 * Um medicamento cadastrado para um paciente (associação em model/index.js).
 * Mantém o estoque atual (`estoqueQtd`) para permitir alertas de reposição
 * e é decrementado/incrementado pelo checklistService ao marcar/desmarcar
 * uma dose como "tomado".
 */
const Medication = sequelize.define("Medication", {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dosagem: {
        type: DataTypes.STRING,
        allowNull: false
    },
    forma: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Quantidade atual em estoque (unidades, comprimidos, ml, etc.).
    estoqueQtd: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    // Limite abaixo do qual a tela exibe o alerta de "estoque baixo".
    alertaEstoque: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 5
    },
    // Medicamentos desativados somem do checklist diário mas continuam
    // no histórico (soft delete, evita perder o rastro de doses passadas).
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

export default Medication;
