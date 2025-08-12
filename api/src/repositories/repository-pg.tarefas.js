// src/repositories/RepositorioTarefas.js
import pool from "../config/postgresql.js";

export class RepositorioTarefas {
  constructor() {
    this.pool = pool; // usa pool global
  }

  // Listar todas as tarefas (retorna status como '0'/'1')
  async listarTodas() {
    try {
      const { rows } = await this.pool.query(`
        SELECT 
          id,
          descricao,
          data_criacao,
          data_atualizacao,
          CASE WHEN status THEN '1' ELSE '0' END AS status
        FROM tarefas
        ORDER BY data_criacao DESC
      `);
      return rows;
    } catch (erro) {
      throw new Error(`Erro ao listar tarefas: ${erro.message}`);
    }
  }

  // Buscar tarefa por ID (retorna status como '0'/'1')
  async buscarPorId(id) {
    try {
      const { rows } = await this.pool.query(
        `
          SELECT 
            id,
            descricao,
            data_criacao,
            data_atualizacao,
            CASE WHEN status THEN '1' ELSE '0' END AS status
          FROM tarefas
          WHERE id = $1
        `,
        [id]
      );
      return rows[0] || null;
    } catch (erro) {
      throw new Error(`Erro ao buscar tarefa por ID: ${erro.message}`);
    }
  }

  // Criar nova tarefa (aceita status '0'/'1')
  async criar({ descricao, data_criacao, data_atualizacao, status = "0" }) {
    try {
      const statusBoolean = status === "1";
      const { rows } = await this.pool.query(
        `
          INSERT INTO tarefas (descricao, data_criacao, data_atualizacao, status)
          VALUES ($1, $2, $3, $4)
          RETURNING 
            id,
            descricao,
            data_criacao,
            data_atualizacao,
            CASE WHEN status THEN '1' ELSE '0' END AS status
        `,
        [descricao, data_criacao, data_atualizacao, statusBoolean]
      );
      return rows[0];
    } catch (erro) {
      throw new Error(`Erro ao criar tarefa: ${erro.message}`);
    }
  }

  // Atualizar tarefa (aceita status '0'/'1')
  async atualizar(id, dadosAtualizacao) {
    try {
      const campos = [];
      const valores = [];
      let index = 1;

      if (dadosAtualizacao.descricao !== undefined) {
        campos.push(`descricao = $${index++}`);
        valores.push(dadosAtualizacao.descricao);
      }

      if (dadosAtualizacao.status !== undefined) {
        const statusBoolean = dadosAtualizacao.status === "1";
        campos.push(`status = $${index++}`);
        valores.push(statusBoolean);
      }

      if (dadosAtualizacao.data_atualizacao !== undefined) {
        campos.push(`data_atualizacao = $${index++}`);
        valores.push(dadosAtualizacao.data_atualizacao);
      }

      if (campos.length === 0) {
        throw new Error("Nenhum campo válido para atualização");
      }

      valores.push(id);

      const query = `
        UPDATE tarefas
        SET ${campos.join(", ")}
        WHERE id = $${index}
        RETURNING 
          id,
          descricao,
          data_criacao,
          data_atualizacao,
          CASE WHEN status THEN '1' ELSE '0' END AS status;
      `;

      const { rows } = await this.pool.query(query, valores);
      return rows[0] || null;
    } catch (erro) {
      throw new Error(`Erro ao atualizar tarefa: ${erro.message}`);
    }
  }

  // Deletar tarefa
  async deletar(id) {
    try {
      const { rowCount } = await this.pool.query(
        `DELETE FROM tarefas WHERE id = $1`,
        [id]
      );

      if (rowCount === 0) {
        return null;
      }

      return { id, deletado: true };
    } catch (erro) {
      throw new Error(`Erro ao deletar tarefa: ${erro.message}`);
    }
  }

  // Buscar tarefas por status (aceita '0'/'1')
  async buscarPorStatus(status) {
    try {
      const statusBoolean = status === "1";
      const { rows } = await this.pool.query(
        `
          SELECT 
            id,
            descricao,
            data_criacao,
            data_atualizacao,
            CASE WHEN status THEN '1' ELSE '0' END AS status
          FROM tarefas 
          WHERE status = $1
          ORDER BY data_criacao DESC
        `,
        [statusBoolean]
      );
      return rows;
    } catch (erro) {
      throw new Error(`Erro ao buscar tarefas por status: ${erro.message}`);
    }
  }
}
