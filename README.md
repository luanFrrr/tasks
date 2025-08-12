# Tasks – Gerenciador Full Stack de Tarefas (React + Node + PostgreSQL)

Aplicação full stack para organizar tarefas com criação, edição, conclusão, (futuro) ordenação persistente e filtros. Backend em Node/Express com PostgreSQL; frontend em React com drag & drop via `@dnd-kit`.

## ✨ Principais Features

**Frontend**

- Criar, editar, excluir tarefas
- Marcar como concluída (toggle persistente via API)
- Drag & Drop para reordenar (atual: visual; persistência planejada)
- Feedback de erros da API
- Código modular (components, pages)

**Backend (API REST)**

- CRUD completo de tarefas
- Campo `status` boolean representado como '0' / '1' (string) na resposta
- Filtro por status: pendentes (`0`) e concluídas (`1`)
- Migração automática: cria tabela e migra coluna antiga (`concluido` → `status`)
- Estrutura preparada para receber persistência de ordem (coluna `ordem` opcional)

## 🗂 Estrutura (monorepo simples)

```
tasks/
  api/
    src/
      config/ (postgresql, migrations)
      controllers/
      repositories/
      services/
      routes.js
      index.js
    database/ (schema sqlite legado – hoje foco em Postgres)
    scripts/ (run-migration sqlite)
    .env (local – NÃO COMMITAR)
  src/ (frontend React)
    pages/home/
    components/
    utils/api.js
  README.md
  package.json (frontend)
```

(Se quiser separar em workspaces depois: trivial.)

## 🧠 Modelo de Dados (tabela `tarefas`)

| Campo            | Tipo      | Descrição                              |
| ---------------- | --------- | -------------------------------------- |
| id               | SERIAL PK | Identificador                          |
| descricao        | TEXT      | Texto da tarefa                        |
| status           | BOOLEAN   | false (0) / true (1)                   |
| data_criacao     | TIMESTAMP | Padrão: NOW                            |
| data_atualizacao | TIMESTAMP | Atualizado a cada modificação          |
| (ordem) opcional | INT       | Persistir ordem personalizada (futuro) |

API sempre converte `status` boolean → '0' ou '1'.

## 🚀 Executar Localmente

Pré-requisitos: Node 18+, PostgreSQL (ou usar a URL do Render), npm.

Clone:

```bash
git clone https://github.com/luanFrrr/tasks.git
cd tasks/tasks   # (se o repo ficar aninhado) ou cd tasks
```

Backend (api):

```bash
cd api
cp .env.example .env   # se existir; senão crie conforme abaixo
npm install
npm start
```

Frontend:

```bash
cd ../
npm install
npm start
```

Abra: http://localhost:3000

## 🔐 Variáveis de Ambiente (API)

Crie `api/.env` (NÃO comitar):

```
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://usuario:senha@host:5432/banco
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

Opcional futuro:

```
ENABLE_ORDERING=true
```

## 🗄 Migrações & Esquema

A API executa `migration-pg.js` no startup:

- Cria tabela se não existir.
- Migra `concluido` → `status`.
- (Você pode estender para coluna `ordem`.)

Adicionar coluna `ordem` manualmente (persistência de drag & drop futura):

```sql
ALTER TABLE tarefas ADD COLUMN IF NOT EXISTS ordem INT;
WITH base AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY data_criacao ASC) - 1 AS idx
  FROM tarefas
  WHERE ordem IS NULL
)
UPDATE tarefas t SET ordem = b.idx FROM base b WHERE t.id = b.id;
CREATE INDEX IF NOT EXISTS idx_tarefas_ordem ON tarefas(ordem);
```

Ajustar SELECT depois para:

```sql
ORDER BY ordem ASC NULLS LAST, data_criacao DESC;
```

## 🌐 Endpoints

Base: `http://localhost:3001`

| Método | Rota                            | Descrição                 | Body / Params           |
| ------ | ------------------------------- | ------------------------- | ----------------------- | ----- |
| GET    | /                               | Ping + catálogo de rotas  | —                       |
| GET    | /tarefas                        | Lista todas               | —                       |
| GET    | /tarefas/:id                    | Busca por id              | —                       |
| POST   | /tarefas                        | Cria tarefa               | { descricao }           |
| PUT    | /tarefas/:id                    | Atualiza descrição/status | { descricao?, status? } |
| PATCH  | /tarefas/:id/status             | Atualiza somente status   | { status: '0'           | '1' } |
| DELETE | /tarefas/:id                    | Remove                    | —                       |
| GET    | /tarefas/filtro/status?status=0 | Lista pendentes           | Query                   |
| GET    | /tarefas/filtro/status?status=1 | Lista concluídas          | Query                   |

### Exemplos

Criar:

```bash
curl -X POST http://localhost:3001/tarefas \
  -H "Content-Type: application/json" \
  -d '{"descricao":"Estudar Node"}'
```

Marcar concluída:

```bash
curl -X PATCH http://localhost:3001/tarefas/5/status \
  -H "Content-Type: application/json" \
  -d '{"status":"1"}'
```

Filtrar concluídas:

```bash
curl "http://localhost:3001/tarefas/filtro/status?status=1"
```

Resposta padrão (sucesso):

```json
{
  "sucesso": true,
  "dados": {
    "id": 5,
    "descricao": "Estudar Node",
    "status": "1",
    "data_criacao": "2025-08-12T13:40:22.123Z",
    "data_atualizacao": "2025-08-12T13:45:14.987Z"
  },
  "mensagem": "Tarefa criada com sucesso"
}
```

Erro:

```json
{ "sucesso": false, "mensagem": "Descrição deve ter pelo menos 5 caracteres" }
```

## 💻 Frontend – Fluxo

- Estado local `tarefas`: `{ id, descricao, done (bool), edit }`.
- Normalização de status: backend → '0'/'1' → boolean.
- Drag & Drop (dnd-kit) reordena no estado (persistência futura via rota `/tarefas/ordenacao`).
- Atualizações otimistas ao marcar concluída.

## 🧪 Possíveis Próximas Melhorias

| Ideia                              | Benefício                            |
| ---------------------------------- | ------------------------------------ |
| Persistir ordem (rota bulk)        | Experiência consistente após refresh |
| Paginação / lazy load              | Escalabilidade                       |
| Busca textual                      | UX melhor em listas grandes          |
| Autenticação (JWT)                 | Multiusuário                         |
| Testes (Jest/Supertest)            | Confiabilidade                       |
| Logs estruturados (pino/winston)   | Observabilidade                      |
| Rate limiting (express-rate-limit) | Segurança                            |
| Dockerfile + Compose               | Deploy simples                       |

## 🔒 Segurança

- Nunca comitar `.env` (já listado no `.gitignore`).
- Rotacionar senha do banco se for exposta.
- Validar inputs (já existe validação básica de descrição e status).
- Adicionar CORS dinâmico para múltiplos domínios em produção.

## 🛠 Scripts Recomendados (exemplos)

Backend (`api/package.json`):

```
"scripts": {
  "dev": "nodemon src/index.js",
  "start": "node src/index.js",
  "lint": "eslint ."
}
```

Frontend (`package.json`):

```
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build"
}
```

## 📌 Troubleshooting

| Problema                      | Causa provável            | Solução                     |
| ----------------------------- | ------------------------- | --------------------------- |
| Coluna status não existe      | Banco antigo sem migração | Rodar migração incremental  |
| Status não persiste no reload | Comparação '1' vs 1       | Normalizar string → boolean |
| CORS bloqueado                | Origin diferente          | Ajustar `CORS_ORIGIN`       |
| Erro 400 ao criar             | Descrição < 5 chars       | Enviar descrição válida     |

## 📄 Licença

Defina (MIT, Apache-2.0, etc.). Ex: MIT.

## 👤 Autor

Luan – Contato: [luanrosas@yahoo.com.br](mailto:luanrosas@yahoo.com.br)

---
