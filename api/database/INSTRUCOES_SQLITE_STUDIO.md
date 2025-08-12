# Instruções para criar banco no SQLite Studio

## Passo a Passo

### 1. Abrir SQLite Studio
- Baixe e instale o SQLite Studio se ainda não tiver
- Abra o aplicativo

### 2. Criar novo banco de dados
1. Clique em **"Database"** → **"Add Database"**
2. Navegue até a pasta: `api/database/`
3. Digite o nome: `tarefas.db`
4. Clique em **"OK"**

### 3. Executar script SQL
1. Clique com botão direito no banco `tarefas.db`
2. Selecione **"Execute SQL"**
3. Abra o arquivo `schema.sql` que está na pasta `database/`
4. Copie todo o conteúdo do arquivo
5. Cole no editor SQL do SQLite Studio
6. Clique em **"Execute"** (ou pressione F5)

### 4. Verificar resultado
Após executar o script, você deve ver:
- ✅ Tabela `tarefas` criada
- ✅ 5 registros de exemplo inseridos
- ✅ 3 índices criados para performance

### 5. Explorar o banco
- Expanda o banco `tarefas.db`
- Expanda a tabela `tarefas`
- Clique em **"Data"** para ver os registros
- Clique em **"Structure"** para ver a estrutura

## Estrutura da Tabela

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | INTEGER | Chave primária (auto) | 1, 2, 3... |
| `titulo` | TEXT | Título da tarefa | "Estudar React" |
| `descricao` | TEXT | Descrição detalhada | "Aprender hooks e context" |
| `status` | TEXT | Status atual | pendente, em_andamento, concluida, cancelada |
| `prioridade` | TEXT | Nível de prioridade | baixa, media, alta, urgente |
| `data_criacao` | TEXT | Data de criação | "2024-01-15T10:00:00.000Z" |
| `data_atualizacao` | TEXT | Última atualização | "2024-01-15T10:00:00.000Z" |

## Dados de Exemplo Inseridos

1. **Estudar React** - pendente, alta prioridade
2. **Fazer exercícios** - em andamento, média prioridade
3. **Ler livro técnico** - concluída, baixa prioridade
4. **Organizar workspace** - pendente, média prioridade
5. **Reunião com cliente** - pendente, urgente

## Comandos Úteis para Testar

```sql
-- Listar todas as tarefas
SELECT * FROM tarefas ORDER BY data_criacao DESC;

-- Buscar tarefas por status
SELECT * FROM tarefas WHERE status = 'pendente';

-- Buscar tarefas por prioridade
SELECT * FROM tarefas WHERE prioridade = 'alta';

-- Contar tarefas por status
SELECT status, COUNT(*) as quantidade FROM tarefas GROUP BY status;

-- Buscar tarefas com filtros
SELECT * FROM tarefas 
WHERE status = 'pendente' AND prioridade = 'alta';
```

## Próximos Passos

Após criar o banco no SQLite Studio:
1. Teste a API executando: `npm run dev`
2. Acesse: `http://localhost:3001/tarefas`
3. Você deve ver os dados que inseriu no SQLite Studio

## Solução de Problemas

### Erro: "Database is locked"
- Feche o SQLite Studio
- Verifique se não há outro processo usando o banco
- Tente novamente

### Erro: "Table already exists"
- O script usa `CREATE TABLE IF NOT EXISTS`, então é seguro executar múltiplas vezes

### Erro: "Constraint failed"
- Verifique se os valores de `status` e `prioridade` estão corretos
- Use apenas os valores permitidos nas constraints 