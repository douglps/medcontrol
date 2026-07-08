## Resumo 
Este documento apresenta um guia abrangente sobre bancos de dados relacionais, focando no PostgreSQL e sua implementação via Docker Compose no contexto DevOps. Abaixo estão os detalhes fundamentais para implementar esses conceitos em novos projetos:

## Fundamentos do Modelo Relacional
Estrutura de Dados: Os dados são organizados em tabelas (linhas como registros e colunas como atributos com tipos definidos) que se conectam através de números de identificação.1
Integridade: Utiliza Chaves Primárias (PK) para identificar unicamente uma linha e Chaves Estrangeiras (FK) para apontar para IDs em outras tabelas, garantindo que as relações sejam válidas.


## Tipos de Relacionamento
1:1 (Um-para-um): Raro na prática.3
1:N (Um-para-muitos): O caso mais comum (ex: um autor escreve vários livros).4
N:M (Muitos-para-muitos): Resolvido com uma tabela intermediária (ex: livros e categorias).5


## 2. Contexto DevOps e Gestão de Estado
Stateful vs Stateless: Diferente das aplicações (stateless) que podem ser facilmente destruídas e recriadas, bancos de dados são stateful (possuem estado) e contêm dados reais, exigindo cuidado extremo com migrations e backups.6
Localização: Devido à sua natureza vital, bancos costumam ficar fora de clusters de aplicação ou sob operadores especiais.7

## 3. Organização e Segurança no PostgreSQL
Hierarquia: Uma instalação (Cluster) pode conter vários Bancos de Dados (Databases), que possuem Schemas (Namespaces), onde residem as Tabelas.8
Roles e Usuários: No Postgres, USER e GROUP são tratados como roles. É possível criar roles sem login (como grupos) e associar usuários a elas para herdar permissões.910
Princípio do Menor Privilégio: Cada role deve ter apenas o acesso necessário. Exemplos:
App: SELECT, INSERT, UPDATE, DELETE (sem permissão para criar/apagar tabelas).11
Relatórios: Apenas SELECT.12
Migrations: CREATE, ALTER, DROP (uso restrito durante o deploy).13
##  4. Implementação Prática com Docker Compose
Para provisionar um ambiente reprodutível, utilize as seguintes diretrizes no seu arquivo docker-compose.yml:
Componente	Recomendação de Implementação
Imagem	Utilize versões fixas e leves (ex: postgres:16-alpine), nunca latest em produção.14
Volumes	Mapeie um volume para persistência de dados (/var/lib/postgresql/data) e a pasta ./init para scripts SQL de inicialização automática.15
Segurança	Utilize variáveis de ambiente para senhas, evitando expô-las diretamente no arquivo.16
Healthcheck	Configure o comando pg_isready para que outros serviços saibam quando o banco está pronto para conexões.17
## 5.Comandos Adminstração Essenciais (psql)
Meta-comandos: \l (lista bancos), \dt (lista tabelas), \du (lista roles) e \q (sair).18
Backup e Restore: Utilize o pg_dump para extrair o banco completo para um arquivo .sql e o redirecionament