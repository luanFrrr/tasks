-- Script SQL para recriar o banco de dados de tarefas simplificado
-- Agora usando a coluna 'status' (BOOLEAN) em vez de 'concluido'

-- Dropar tabela existente para recriar com nova estrutura
DROP TABLE IF EXISTS tarefas;

CREATE TABLE IF NOT EXISTS tarefas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  descricao TEXT NOT NULL,
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  status BOOLEAN DEFAULT 0 -- 0 = pendente, 1 = concluída
);

-- Inserir algumas tarefas de exemplo
INSERT INTO tarefas (descricao, status) VALUES 
  ('Estudar React Native', 0),
  ('Fazer exercícios físicos', 0),
  ('Ler um livro', 1),
  ('Organizar o quarto', 0),
  ('Preparar o almoço', 1);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_tarefas_data_criacao ON tarefas(data_criacao);
CREATE INDEX IF NOT EXISTS idx_tarefas_data_atualizacao ON tarefas(data_atualizacao);
CREATE INDEX IF NOT EXISTS idx_tarefas_status ON tarefas(status);