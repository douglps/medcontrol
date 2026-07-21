import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

/**
 * Representa um usuário do sistema (farmacêutico, administrador, etc.).
 * Utilizado para controle de autenticação e permissões via JWT.
 */
const User = sequelize.define("User", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cargo: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Farmacêutico",
  },
});

export default User;
