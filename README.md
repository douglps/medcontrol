# MedControl — Backend

## Sobre o projeto

MedControl é uma aplicação de controle de medicamentos para cuidadores domésticos. Permite cadastrar pacientes, seus medicamentos e horários de tomada, gerando automaticamente um checklist diário (Kanban) de doses pendentes, tomadas e puladas. Também controla o estoque de medicamentos (com alerta de reposição e previsão de duração) e mantém um histórico de doses com cálculo de aderência ao tratamento por medicamento e período.

É uma aplicação single-user, sem autenticação, voltada para uso doméstico/local — a prioridade é a simplicidade do registro (um clique por dose) em vez da completude de dados clínicos.

Este repositório/pasta contém apenas a **API (backend)** dessa aplicação.

## Stack

- Node.js (ESM — `"type": "module"`)
- Express 5
- Sequelize 6 (ORM)
- PostgreSQL (via `pg` / `pg-hstore`)

## Pré-requisitos

- Node.js 18 ou superior (usa `node --watch`)
- Docker (para subir o PostgreSQL) **ou** uma instância PostgreSQL própria já configurada

## Como rodar

1. Instalar as dependências:
   ```bash
   cd backend
   npm install
   ```

2. Criar o arquivo de variáveis de ambiente a partir do exemplo:
   ```bash
   cp .env.example .env
   ```
   Ajuste os valores se necessário (veja a tabela de variáveis abaixo).

3. Subir um PostgreSQL local. Se você não tiver o `docker-compose.yml` do monorepo (por exemplo, se recebeu apenas esta pasta `backend/`), pode subir um container equivalente diretamente:
   ```bash
   docker run -d --name medcontrol-db \
     -e POSTGRES_DB=medcontrol \
     -e POSTGRES_USER=medcontrol_app \
     -e POSTGRES_PASSWORD=troque_esta_senha \
     -p 5432:5432 \
     postgres:16-alpine
   ```
   Use a mesma senha que você definir em `DB_PASSWORD` no `.env`.

4. Iniciar a API em modo desenvolvimento (reinicia automaticamente a cada mudança):
   ```bash
   npm run dev
   ```
   Ao subir, a aplicação conecta no banco e sincroniza o schema automaticamente via `sequelize.sync()`.

A API sobe por padrão na porta definida em `EXPRESS_PORT` (`3000`), com as rotas em `/api/*`.

## Variáveis de ambiente (`.env`)

| Variável       | Descrição                              | Exemplo             |
|----------------|-----------------------------------------|---------------------|
| `DB_HOST`      | Host do PostgreSQL                      | `localhost`          |
| `DB_PORT`      | Porta do PostgreSQL                     | `5432`               |
| `DB_NAME`      | Nome do banco de dados                  | `medcontrol`         |
| `DB_USER`      | Usuário do banco de dados                | `medcontrol_app`     |
| `DB_PASSWORD`  | Senha do banco de dados                  | `troque_esta_senha`  |
| `EXPRESS_PORT` | Porta em que a API Express é exposta     | `3000`               |

## Estrutura de pastas

```
src/
  index.js            ponto de entrada: conecta no banco, sincroniza models e monta as rotas /api/*
  controller/          camada de rotas/HTTP (recebe requisições, chama os services)
  service/              regras de negócio
  model/                 models Sequelize (entidades do banco)
  database/
    database.js         instância única do Sequelize, configurada a partir do .env
    scripts/              scripts .sql de manutenção manual do banco (veja abaixo)
```

Fluxo de uma requisição: `controller` → `service` → `model`.

## Banco de dados

O schema **não** usa migrations formais — é gerenciado por `sequelize.sync()` no boot da aplicação, que cria tabelas e colunas novas automaticamente. Colunas removidas de um model não são apagadas do banco existente (ficam órfãs); ajustes desse tipo são feitos manualmente via scripts `.sql` em `src/database/scripts/` — veja `src/database/scripts/README.md` para detalhes.

## Scripts npm

| Script        | Comando                        | Descrição                                  |
|---------------|----------------------------------|----------------------------------------------|
| `npm run dev` | `node --watch src/index.js`     | Sobe a API em modo desenvolvimento com reload automático |
| `npm test`    | —                                 | Ainda não implementado (placeholder)         |
