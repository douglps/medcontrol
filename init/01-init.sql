-- Criando roles
CREATE ROLE app_role NOLOGIN;
CREATE ROLE migrator_role NOLOGIN;

-- Criando usuários e associando às roles (Senhas batem com o .env)
CREATE USER medcontrol_app WITH PASSWORD 'app_pass_123';
GRANT app_role TO medcontrol_app;

CREATE USER medcontrol_migrator WITH PASSWORD 'migrator_pass_123';
GRANT migrator_role TO medcontrol_migrator;

-- Conectar ao banco de dados específico para aplicar as permissões nos schemas dele
\c medcontrol;

-- Garantir que as tabelas criadas no schema public no futuro herdarão as permissões
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, UPDATE ON SEQUENCES TO app_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO migrator_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO migrator_role;

-- Dar permissão de acesso ao schema
GRANT USAGE ON SCHEMA public TO app_role;
GRANT USAGE, CREATE ON SCHEMA public TO migrator_role;
