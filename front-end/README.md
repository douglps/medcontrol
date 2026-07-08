# MedControl - Frontend

Este é o frontend da aplicação MedControl, desenvolvido para permitir que cuidadores domésticos gerenciem medicamentos, pacientes e estoques através de uma interface simples, amigável e moderna.

## Tecnologias

- **Framework**: React.js
- **Build Tool**: Vite
- **Estilização**: TailwindCSS + CSS Puro (variáveis e temas customizados)
- **Roteamento**: React Router

## Como iniciar o ambiente de desenvolvimento

1. Certifique-se de que a API (Backend) esteja rodando na porta 3000 (veja o README na raiz do projeto).
2. Instale as dependências na pasta `front-end`:
   ```bash
   npm install
   ```
3. Inicie o servidor Vite:
   ```bash
   npm run dev
   ```
4. Acesse a aplicação no seu navegador: `http://localhost:5173`

## Estrutura de Pastas

- `/src/components`: Componentes reutilizáveis de UI (ex: Sidebar, Navbar).
- `/src/pages`: Páginas da aplicação.
- `/src/services`: Integração com a API do backend (fetch).
- `/src/index.css`: Estilos globais e tokens CSS da aplicação.
