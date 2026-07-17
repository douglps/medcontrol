# MedControl

MedControl é uma aplicação de controle de medicamentos para cuidadores domésticos. Permite cadastrar pacientes, seus medicamentos e horários de tomada, gerando automaticamente um checklist diário (Kanban) de doses pendentes, tomadas e puladas. Também controla o estoque de medicamentos (com alerta de reposição e previsão de duração) e mantém um histórico de doses com cálculo de aderência ao tratamento.

Este repositório contém a aplicação full-stack completa:
- **API (Backend)**: Desenvolvido com Node.js, Express e PostgreSQL.
- **Interface (Frontend)**: Desenvolvido com React, Vite e TailwindCSS.

## Documentação

Para a proposta técnica original, arquitetura e modelagem de dados, consulte a pasta de documentação:
- [Proposta Técnica e Arquitetura](./docs/medcontrol-proposta.md)

## Estrutura do Projeto

Backend e Frontend são dois projetos Node independentes, cada um com seu próprio `package.json`. O `package.json` da raiz não tem dependência de nenhum dos dois — serve só para orquestrar o ambiente local via `npm run lab`.

```text
/
├── back-end/             # API (Node.js + Express + Sequelize)
│   ├── src/
│   └── package.json
├── front-end/            # Aplicação React (Vite)
│   ├── src/
│   └── package.json
├── docs/                 # Documentação técnica e especificações
├── init/                 # Scripts de inicialização do Postgres (roles/permissões)
├── scripts/lab.js         # Orquestração do ambiente local (usado por npm run lab)
├── docker-compose.yml     # Sobe o Postgres local
├── package.json           # Dependências apenas do script de orquestração (lab)
└── README.md              # Este arquivo
```

## Como Rodar a Aplicação

### Opção rápida: `npm run lab`

Sobe o ambiente completo (banco, backend e frontend) com um único comando, a partir da raiz do projeto:

```bash
npm install
npm run lab
```

O script (`scripts/lab.js`) libera as portas `3000` e `5173` caso estejam ocupadas por uma execução anterior, sobe o Postgres via `docker compose` (usando `docker-compose.yml` + `init/01-init.sql`, que já cria as roles/usuários do banco) aguardando o healthcheck, e então inicia backend e frontend em paralelo. `Ctrl+C` encerra os dois processos; o container do banco continua rodando em background (pode ser parado com `docker compose stop db`).

**Pré-requisitos**: Node.js 18+, Docker rodando, e as dependências de `back-end/` e `front-end/` já instaladas (`npm install` dentro de cada pasta) e o `back-end/.env` configurado — ver seção "Backend" abaixo. `npm run lab` não instala dependências nem cria o `.env` automaticamente.

**Primeira execução**: como o `npm run lab` não roda migrations, é preciso sincronizar as tabelas do banco pelo menos uma vez antes (dentro de `back-end/`):

```bash
cd back-end
npm run sync
```

### 1. Backend (API)

A API roda na porta `3000` (ou conforme configurado no `.env`).

**Pré-requisitos**:
- Node.js 18+
- Docker (para o Postgres via `docker-compose.yml` da raiz)

**Passo a passo**:
1. Instale as dependências dentro da pasta do backend:
   ```bash
   cd back-end
   npm install
   ```
2. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   Ajuste as senhas se necessário — as variáveis usadas são `APP_DB_USER`/`APP_DB_PASSWORD` (role de aplicação, só DML) e `MIGRATOR_DB_USER`/`MIGRATOR_DB_PASSWORD` (role usada só pelo `npm run sync`, com permissão de criar/alterar tabelas), seguindo o Princípio do Menor Privilégio.
3. Suba o Postgres local, a partir da raiz do projeto (usa `docker-compose.yml` + `init/01-init.sql`, que já cria as roles e usuários acima):
   ```bash
   docker compose up -d db
   ```
4. Sincronize o schema (cria/ajusta as tabelas — só precisa rodar de novo se os models mudarem):
   ```bash
   npm run sync
   ```
5. Inicie o servidor:
   ```bash
   npm run dev
   ```

### 2. Frontend (Interface Web)

O frontend roda na porta `5173` e deve se comunicar com a API em `http://localhost:3000`.

> **Nota**: no momento, `front-end/src/services/api.js` ainda aponta para uma URL de exemplo, não para o backend local — é uma pendência conhecida (ver documentação interna do projeto). Até isso ser corrigido, as telas sobem normalmente mas não conseguem buscar dados reais da API.

**Passo a passo**:
1. Entre na pasta do frontend:
   ```bash
   cd front-end
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

A aplicação estará disponível em `http://localhost:5173`.
