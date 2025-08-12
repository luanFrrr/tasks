import db from "./postgresql.js";

async function CreateDB() {
  let sql = `
      CREATE TABLE IF NOT EXISTS tarefas (
    id SERIAL PRIMARY KEY,
    descricao TEXT NOT NULL,
    status BOOLEAN DEFAULT false,
    data_criacao TIMESTAMP NOT NULL,
    data_atualizacao TIMESTAMP NOT NULL
);

    `;
  try {
    await db.query(sql);
  } catch (error) {
    console.error("Erro ao criar tabela de tarefas:", error);
    throw error;
  }
}
console.log("Criando tabela de tarefas...");
CreateDB();
