// Define a variável de ambiente ANTES de importar o banco dinamicamente
process.env.SYNC_MODE = 'true';

async function runSync() {
  // Import dinâmico garante que process.env.SYNC_MODE já está 'true' quando database.js for lido
  const { default: sequelize } = await import("../database.js");
  await import("../../model/index.js"); // Garante que os modelos estão registrados

  try {
    console.log("Iniciando sincronização (Migration) usando role migrator_role...");
    await sequelize.authenticate();
    console.log("Conectado ao banco de dados com sucesso como MIGRATOR!");
    
    // Executa o sync para criar as tabelas
    await sequelize.sync({ force: false }); 
    
    // Garante que o usuário da aplicação (app_role) tenha permissão nas tabelas recém-criadas
    console.log("Concedendo permissões para app_role...");
    await sequelize.query('GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_role;');
    await sequelize.query('GRANT SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO app_role;');
    
    console.log("Tabelas sincronizadas com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("Erro na sincronização:", error);
    process.exit(1);
  }
}

runSync();
