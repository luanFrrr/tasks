# API de Tarefas

API REST para gerenciamento de tarefas desenvolvida em Node.js com Express e SQLite.

## Estrutura do Projeto

```
api/
├── src/
│   ├── config/
│   │   └── database.config.js        # Configuração do banco de dados
│   ├── controllers/
│   │   └── controller.tarefas.js     # Controladores das requisições
│   ├── services/
│   │   └── service.tarefas.js        # Lógica de negócio
│   ├── repositories/
│   │   └── repositorio.tarefas.js    # Acesso ao banco de dados
│   ├── index.js                      # Servidor Express
│   └── routes.js                     # Definição das rotas
├── database/
│   ├── schema.sql                    # Script de criação do banco
│   ├── INSTRUCOES_SQLITE_STUDIO.md   # Instruções para SQLite Studio
│   └── tarefas.db                    # Banco SQLite (criado automaticamente)
├── scripts/
│   └── run-migration.js              # Script de migração
├── package.json
├── .env.example                      # Exemplo de variáveis de ambiente
├── .gitignore
└── README.md
```

## Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
# Configurações do Servidor
PORT=3001
NODE_ENV=development

# Configurações do Banco de Dados
DB_NAME=tarefas
DB_PATH=./database/tarefas.db
DB_TIMEOUT=5000

# Configurações da API
API_VERSION=v1
CORS_ORIGIN=http://localhost:3000

# Configurações de Log
LOG_LEVEL=info
```

3. Execute o setup completo (migração + servidor):

```bash
npm run setup
```

## Variáveis de Ambiente

### Configurações do Servidor
- `PORT` - Porta do servidor (padrão: 3001)
- `NODE_ENV` - Ambiente de execução (development/production)

### Configurações do Banco de Dados
- `DB_NAME` - Nome do banco de dados (padrão: tarefas)
- `DB_PATH` - Caminho para o arquivo do banco (padrão: ./database/tarefas.db)
- `DB_TIMEOUT` - Timeout da conexão em ms (padrão: 5000)

### Configurações da API
- `API_VERSION` - Versão da API (padrão: v1)
- `CORS_ORIGIN` - Origem permitida para CORS (padrão: http://localhost:3000)

### Configurações de Log
- `LOG_LEVEL` - Nível de log (padrão: info)

## Scripts Disponíveis

### **Setup Completo**
```bash
npm run setup
```
- Executa migração do banco
- Inicia o servidor em modo desenvolvimento

### **Apenas Migração**
```bash
npm run migrate
```
- Cria tabelas e dados iniciais
- Útil para primeira configuração

### **Desenvolvimento**
```bash
npm run dev
```
- Inicia servidor com auto-reload
- Requer banco já configurado

### **Produção**
```bash
npm start
```
- Inicia servidor em modo produção

## Banco de Dados

### SQLite - `tarefas.db`

O banco de dados SQLite será criado automaticamente na primeira execução na pasta `database/`.

#### Tabela: `tarefas`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | Chave primária (auto-incremento) |
| `descricao` | TEXT | Descrição da tarefa (obrigatório) |
| `data_criacao` | DATETIME | Data de criação (CURRENT_TIMESTAMP) |
| `data_atualizacao` | DATETIME | Data da última atualização (CURRENT_TIMESTAMP) |
| `concluido` | BOOLEAN | Status de conclusão (padrão: FALSE) |

## Endpoints da API

### Base URL: `http://localhost:3001`

### 1. Listar todas as tarefas

- **GET** `/tarefas`
- **Resposta:**

```json
{
  "sucesso": true,
  "dados": [
    {
      "id": 1,
      "descricao": "Estudar React Native",
      "data_criacao": "2025-08-01T18:00:00.000Z",
      "data_atualizacao": "2025-08-01T18:00:00.000Z",
      "concluido": false
    }
  ],
  "mensagem": "Tarefas listadas com sucesso"
}
```

### 2. Buscar tarefa por ID

- **GET** `/tarefas/:id`

### 3. Criar nova tarefa

- **POST** `/tarefas`
- **Body:**

```json
{
  "descricao": "Nova tarefa",
  "concluido": false
}
```

### 4. Atualizar tarefa

- **PUT** `/tarefas/:id`
- **Body:**

```json
{
  "descricao": "Descrição atualizada",
  "concluido": true
}
```

### 5. Marcar como concluída/não concluída

- **PATCH** `/tarefas/:id/concluido`
- **Body:**

```json
{
  "concluido": true
}
```

### 6. Buscar tarefas por status de conclusão

- **GET** `/tarefas/filtro/concluido?concluido=true` - Tarefas concluídas
- **GET** `/tarefas/filtro/concluido?concluido=false` - Tarefas pendentes

### 7. Deletar tarefa

- **DELETE** `/tarefas/:id`

## Valores Válidos

### Campo concluido
- `true` - Tarefa concluída
- `false` - Tarefa pendente

## Tratamento de Erros

A API retorna erros padronizados:

```json
{
  "sucesso": false,
  "mensagem": "Descrição do erro",
  "erro": "Detalhes técnicos do erro"
}
```

### Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

## Arquitetura

### Padrão Repository-Service-Controller

1. **Controller** (`controller.tarefas.js`): Gerencia requisições HTTP e respostas
2. **Service** (`service.tarefas.js`): Contém a lógica de negócio e validações
3. **Repository** (`repositorio.tarefas.js`): Acesso direto ao banco de dados
4. **Config** (`database.config.js`): Configuração e conexão com o banco

### Fluxo de Dados

```
Request → Controller → Service → Repository → Database
Response ← Controller ← Service ← Repository ← Database
```

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite** - Banco de dados
- **ES6 Modules** - Sistema de módulos
- **dotenv** - Gerenciamento de variáveis de ambiente

## Logs do Sistema

O sistema exibe logs informativos durante a execução:

- ✅ Conexão com banco de dados estabelecida
- ✅ Tabela tarefas já existe com dados
- ⚠️ Tabela tarefas não encontrada ou vazia
- 📝 Execute o script de migração: database/schema.sql
- 🚀 Servidor rodando na porta 3001
- 📊 Banco de dados: caminho/para/tarefas.db
- 🌐 API disponível em: http://localhost:3001
- 🔧 Ambiente: development
- 🔌 Conexão com banco de dados fechada
- 🛑 Encerrando servidor...
