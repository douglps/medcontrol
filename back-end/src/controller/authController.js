import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/Usuario.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { tratarErro } from "../utils/tratarErro.js";
import "dotenv/config";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_jwt_medcontrol";

/**
 * POST /api/auth/register
 * Cadastro de novo usuário do sistema.
 */
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha, cargo } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Nome, e-mail e senha são obrigatórios." });
    }

    // Verificar se o e-mail já existe
    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ erro: "E-mail já cadastrado no sistema." });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoUsuario = await User.create({
      nome,
      email,
      senha: senhaHash,
      cargo: cargo || "Farmacêutico",
    });

    const token = jwt.sign(
      { id: novoUsuario.id, email: novoUsuario.email, cargo: novoUsuario.cargo },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      token,
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        cargo: novoUsuario.cargo,
      },
    });
  } catch (error) {
    return tratarErro(res, error);
  }
});

/**
 * POST /api/auth/login
 * Autenticação de usuário e geração do token JWT.
 */
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
    }

    // Buscar usuário pelo e-mail
    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    // Gerar JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, cargo: usuario.cargo },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo,
      },
    });
  } catch (error) {
    return tratarErro(res, error);
  }
});

/**
 * GET /api/auth/me
 * Retorna os dados do usuário autenticado no momento.
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const usuario = await User.findByPk(req.user.id, {
      attributes: { exclude: ["senha"] },
    });

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    return res.json(usuario);
  } catch (error) {
    return tratarErro(res, error);
  }
});

export default router;
