import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_jwt_medcontrol";

/**
 * Middleware para autenticação via JWT.
 * Verifica a presença e a validade do token Bearer no cabeçalho Authorization.
 */
export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token de acesso não fornecido." });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ erro: "Formato do token inválido. Esperado 'Bearer <token>'." });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}
