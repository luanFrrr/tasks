import express from "express";
import "dotenv/config";
import router from "./routes.js";
import cors from "cors";
import pool from "./config/postgresql.js";
import "./config/migration-pg.js"; // garante criação da tabela tarefas

const app = express();

// Configurar CORS ANTES de tudo
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Middleware para JSON
app.use(express.json());

// Rotas
app.use(router);

async function inicializarAplicacao() {
  try {
    // Teste rápido de conexão
    await pool.query("SELECT 1");

    const porta = process.env.PORT || 3001;

    app.listen(porta, () => {
      console.log("🚀 Servidor rodando na porta", porta);
      console.log("🌐 API disponível em:", `http://localhost:${porta}`);
      console.log("🔧 Ambiente:", process.env.NODE_ENV || "development");
    });
  } catch (erro) {
    console.error("❌ Erro ao inicializar aplicação:", erro);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Encerrando servidor...");
  await pool.end().catch(() => {});
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Encerrando servidor...");
  await pool.end().catch(() => {});
  process.exit(0);
});

inicializarAplicacao();

export default app;
