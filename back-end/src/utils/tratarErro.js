// Centraliza o tratamento de erro das rotas: loga o erro completo no
// servidor (para debug) e decide o que é seguro devolver ao cliente.
//
// Melhoria docs/melhorias-integracao-back-front.md, Sequência F:
// - erro de validação (lançado manualmente nos services com `throw new
//   Error(...)`) já vem com mensagem específica e segura para expor;
// - erro não previsto (ex: exceção crua do Sequelize/banco) pode conter
//   detalhes internos (nome de tabela/coluna) e não deve vazar ao cliente —
//   respondemos mensagem genérica, mas o log do servidor guarda o erro
//   completo para investigação.
export function tratarErro(res, erro) {
    console.error(erro);

    let ehErroNaoPrevisto = typeof erro.name === "string" && erro.name.startsWith("Sequelize");
    if (ehErroNaoPrevisto) {
        res.status(500).json({ mensagem: "Erro interno do servidor" });
        return;
    }
    res.status(400).json({ mensagem: erro.message });
}
