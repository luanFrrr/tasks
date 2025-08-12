import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabaseConfig {
  constructor() {
    // Usar variáveis de ambiente ou valores padrão
    this.dbName = process.env.DB_NAME || "tarefas";
    this.dbPath =
      process.env.DB_PATH || path.join(__dirname, "../../database/tarefas.db");
    this.dbTimeout = parseInt(process.env.DB_TIMEOUT) || 5000;
    this.db = null;
    this.isInitialized = false;
  }

  async conectar() {
    try {
      if (this.db) {
        console.log("✅ Conexão com banco de dados já estabelecida");
        return;
      }

      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database,
        mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
        timeout: this.dbTimeout,
      });

      console.log("✅ Conexão com banco de dados estabelecida");
    } catch (erro) {
      console.error("❌ Erro ao conectar ao banco:", erro);
      throw erro;
    }
  }

  async verificarTabelaExistente() {
    try {
      const resultado = await this.db.get(`
        SELECT COUNT(*) as count 
        FROM sqlite_master 
        WHERE type='table' AND name='tarefas'
      `);
      return resultado.count > 0;
    } catch (erro) {
      console.error("❌ Erro ao verificar tabela:", erro);
      return false;
    }
  }

  async inicializarTabelas() {
    try {
      const tabelaExiste = await this.verificarTabelaExistente();

      if (tabelaExiste) {
        console.log("✅ Tabela tarefas já existe com dados");
      } else {
        console.log("⚠️ Tabela tarefas não encontrada ou vazia");
        console.log("📝 Execute o script de migração: database/schema.sql");
      }

      this.isInitialized = true;
    } catch (erro) {
      console.error("❌ Erro ao inicializar tabelas:", erro);
      throw erro;
    }
  }

  getDatabase() {
    if (!this.db) {
      throw new Error("Banco de dados não está conectado");
    }
    return this.db;
  }

  estaConectado() {
    return this.db !== null;
  }

  foiInicializado() {
    return this.isInitialized;
  }

  async fecharConexao() {
    try {
      if (this.db) {
        await this.db.close();
        this.db = null;
        this.isInitialized = false;
        console.log("🔌 Conexão com banco de dados fechada");
      }
    } catch (erro) {
      console.error("❌ Erro ao fechar conexão:", erro);
      throw erro;
    }
  }

  async reiniciarConexao() {
    try {
      await this.fecharConexao();
      await this.conectar();
      await this.inicializarTabelas();
    } catch (erro) {
      console.error("❌ Erro ao reiniciar conexão:", erro);
      throw erro;
    }
  }

  getInfo() {
    return {
      dbName: this.dbName,
      dbPath: this.dbPath,
      dbTimeout: this.dbTimeout,
      isConnected: this.estaConectado(),
      isInitialized: this.foiInicializado(),
      nodeEnv: process.env.NODE_ENV || "development",
    };
  }
}

export const databaseConfig = new DatabaseConfig();
