import { databaseConfig } from "../config/database.config.js";

export class RepositorioTarefas {
  constructor() {
    this.db = null;
  }

  // Inicializar repository
  async inicializar() {
    try {
      // Conectar ao banco
      await databaseConfig.conectar();

      // Inicializar tabelas
      await databaseConfig.inicializarTabelas();

      // Obter instância do banco
      this.db = databaseConfig.getDatabase();
    } catch (erro) {
      console.error("Erro ao inicializar repository:", erro);
      throw erro;
    }
  }

  // Garantir que o banco está inicializado
  async garantirInicializacao() {
    if (!this.db) {
      await this.inicializar();
    }
  }

  // Listar todas as tarefas
  async listarTodas() {
    try {
      await this.garantirInicializacao();
      const tarefas = await this.db.all(`
        SELECT * FROM tarefas 
        ORDER BY data_criacao DESC
      `);
      return tarefas;
    } catch (erro) {
      throw new Error(`Erro ao listar tarefas: ${erro.message}`);
    }
  }

  // Buscar tarefa por ID
  async buscarPorId(id) {
    try {
      await this.garantirInicializacao();
      const tarefa = await this.db.get(
        `
          SELECT * FROM tarefas 
          WHERE id = ?
        `,
        [id]
      );
      return tarefa;
    } catch (erro) {
      throw new Error(`Erro ao buscar tarefa por ID: ${erro.message}`);
    }
  }

  // Criar nova tarefa
  async criar(dadosTarefa) {
    try {
      await this.garantirInicializacao();
      const resultado = await this.db.run(
        `
          INSERT INTO tarefas (descricao, data_criacao, data_atualizacao, status)
          VALUES (?, ?, ?, ?)
        `,
        [
          dadosTarefa.descricao,
          dadosTarefa.data_criacao,
          dadosTarefa.data_atualizacao,
          dadosTarefa.status || "0",
        ]
      );

      // Buscar a tarefa criada para retornar
      const tarefaCriada = await this.buscarPorId(resultado.lastID);
      return tarefaCriada;
    } catch (erro) {
      throw new Error(`Erro ao criar tarefa: ${erro.message}`);
    }
  }

  // Atualizar tarefa
  async atualizar(id, dadosAtualizacao) {
    try {
      await this.garantirInicializacao();

      // Construir query dinamicamente baseada nos campos fornecidos
      const campos = [];
      const valores = [];

      if (dadosAtualizacao.descricao !== undefined) {
        campos.push("descricao = ?");
        valores.push(dadosAtualizacao.descricao);
      }

      if (dadosAtualizacao.status !== undefined) {
        campos.push("status = ?");
        valores.push(dadosAtualizacao.status);
      }

      if (dadosAtualizacao.data_atualizacao !== undefined) {
        campos.push("data_atualizacao = ?");
        valores.push(dadosAtualizacao.data_atualizacao);
      }

      if (campos.length === 0) {
        throw new Error("Nenhum campo válido para atualização");
      }

      valores.push(id);

      const query = `
        UPDATE tarefas 
        SET ${campos.join(", ")}
        WHERE id = ?
      `;

      const resultado = await this.db.run(query, valores);

      if (resultado.changes === 0) {
        return null; // Tarefa não encontrada
      }

      // Buscar a tarefa atualizada para retornar
      const tarefaAtualizada = await this.buscarPorId(id);
      return tarefaAtualizada;
    } catch (erro) {
      throw new Error(`Erro ao atualizar tarefa: ${erro.message}`);
    }
  }

  // Deletar tarefa
  async deletar(id) {
    try {
      await this.garantirInicializacao();
      const resultado = await this.db.run(
        `
          DELETE FROM tarefas 
          WHERE id = ?
        `,
        [id]
      );

      if (resultado.changes === 0) {
        return null; // Tarefa não encontrada
      }

      return { id, deletado: true };
    } catch (erro) {
      throw new Error(`Erro ao deletar tarefa: ${erro.message}`);
    }
  }

  // Buscar tarefas por status
  async buscarPorStatus(status) {
    try {
      await this.garantirInicializacao();
      const tarefas = await this.db.all(
        `
          SELECT * FROM tarefas 
          WHERE status = ?
          ORDER BY data_criacao DESC
        `,
        [status]
      );
      return tarefas;
    } catch (erro) {
      throw new Error(`Erro ao buscar tarefas por status: ${erro.message}`);
    }
  }

  // Fechar conexão com o banco
  async fecharConexao() {
    await databaseConfig.fecharConexao();
  }
}
