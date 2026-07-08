# MedControl

MedControl é uma aplicação de controle de medicamentos para cuidadores domésticos. Permite cadastrar pacientes, seus medicamentos e horários de tomada, gerando automaticamente um checklist diário (Kanban) de doses pendentes, tomadas e puladas. Também controla o estoque de medicamentos (com alerta de reposição e previsão de duração) e mantém um histórico de doses com cálculo de aderência ao tratamento.

Este repositório contém a aplicação full-stack completa:
- **API (Backend)**: Desenvolvido com Node.js, Express e PostgreSQL.
- **Interface (Frontend)**: Desenvolvido com React, Vite e TailwindCSS.

## Documentação

Para a proposta técnica original, arquitetura e modelagem de dados, consulte a pasta de documentação:
- [Proposta Técnica e Arquitetura](./docs/medcontrol-proposta.md)

## Estrutura do Projeto

O código do Frontend está isolado em sua própria pasta, enquanto o Backend reside no diretório raiz (temporariamente) ou utiliza a estrutura base.

```text
/
├── front-end/           # Aplicação React (Vite)
├── src/                 # Código-fonte da API (Backend Node.js)
├── docs/                # Documentação técnica e especificações
├── package.json         # Dependências do Backend
└── README.md            # Este arquivo
```

## Como Rodar a Aplicação

### 1. Backend (API)

A API roda na porta `3000` (ou conforme configurado no `.env`).

**Pré-requisitos**:
- Node.js 18+
- PostgreSQL (pode usar Docker)

**Passo a passo**:
1. Instale as dependências na raiz do projeto:
   ```bash
   npm install
   ```
2. Configure as variáveis de ambiente:
   Crie um arquivo `.env` baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Suba um banco PostgreSQL local. Exemplo com Docker:
   ```bash
   docker run -d --name medcontrol-db \
     -e POSTGRES_DB=medcontrol \
     -e POSTGRES_USER=medcontrol_app \
     -e POSTGRES_PASSWORD=troque_esta_senha \
     -p 5432:5432 \
     postgres:16-alpine
   ```
4. Inicie o servidor:
   ```bash
   npm run dev
   ```

### 2. Frontend (Interface Web)

O frontend roda na porta `5173` e se comunica com a API em `http://localhost:3000`.

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
