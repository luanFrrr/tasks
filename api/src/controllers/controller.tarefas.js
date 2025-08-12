import { ServicoTarefas } from "../services/service.tarefas.js";

export class ControladorTarefas {
  constructor() {
    this.servicoTarefas = new ServicoTarefas();
  }

  // Listar todas as tarefas
  async listarTarefas(req, res) {
    try {
      const tarefas = await this.servicoTarefas.listarTodas();
      res.status(200).json({
        sucesso: true,
        dados: tarefas,
        mensagem: "Tarefas listadas com sucesso",
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao listar tarefas",
        erro: erro.message,
      });
    }
  }

  // Buscar tarefa por ID
  async buscarTarefaPorId(req, res) {
    try {
      const { id } = req.params;
      const tarefa = await this.servicoTarefas.buscarPorId(id);

      if (!tarefa) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Tarefa não encontrada",
        });
      }

      res.status(200).json({
        sucesso: true,
        dados: tarefa,
        mensagem: "Tarefa encontrada com sucesso",
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao buscar tarefa",
        erro: erro.message,
      });
    }
  }

  // Criar nova tarefa
  async criarTarefa(req, res) {
    try {
      const { descricao, status = "0" } = req.body;

      // Validação básica de formato (Controller)
      if (!descricao) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Descrição é obrigatória",
        });
      }

      // Regras de negócio ficam no Service
      const novaTarefa = await this.servicoTarefas.criar({
        descricao,
        status,
      });

      res.status(201).json({
        sucesso: true,
        dados: novaTarefa,
        mensagem: "Tarefa criada com sucesso",
      });
    } catch (erro) {
      // Usar a mensagem específica do Service
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message,
      });
    }
  }

  // Atualizar tarefa
  async atualizarTarefa(req, res) {
    try {
      const { id } = req.params;
      const { descricao, status } = req.body;

      const dadosAtualizacao = {};
      if (descricao !== undefined) dadosAtualizacao.descricao = descricao;
      if (status !== undefined) dadosAtualizacao.status = status;

      // Regras de negócio ficam no Service
      const tarefaAtualizada = await this.servicoTarefas.atualizar(
        id,
        dadosAtualizacao
      );

      if (!tarefaAtualizada) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Tarefa não encontrada",
        });
      }

      res.status(200).json({
        sucesso: true,
        dados: tarefaAtualizada,
        mensagem: "Tarefa atualizada com sucesso",
      });
    } catch (erro) {
      // Usar a mensagem específica do Service
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message,
      });
    }
  }

  // Marcar status da tarefa
  async marcarStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Campo status é obrigatório",
        });
      }

      if (typeof status !== "string") {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Campo status deve ser uma string",
        });
      }

      const tarefaAtualizada = await this.servicoTarefas.marcarStatus(
        id,
        status
      );

      if (!tarefaAtualizada) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Tarefa não encontrada",
        });
      }

      const statusTexto = status === "1" ? "concluída" : "não concluída";
      res.status(200).json({
        sucesso: true,
        dados: tarefaAtualizada,
        mensagem: `Tarefa marcada como ${statusTexto} com sucesso`,
      });
    } catch (erro) {
      // Usar a mensagem específica do Service
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message,
      });
    }
  }

  // Buscar tarefas por status
  async buscarPorStatus(req, res) {
    try {
      const { status } = req.query;

      if (!status) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Parâmetro status é obrigatório",
        });
      }

      const tarefas = await this.servicoTarefas.buscarPorStatus(status);

      const statusTexto = status === "1" ? "concluídas" : "pendentes";
      res.status(200).json({
        sucesso: true,
        dados: tarefas,
        mensagem: `Tarefas ${statusTexto} listadas com sucesso`,
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao buscar tarefas por status",
        erro: erro.message,
      });
    }
  }

  // Deletar tarefa
  async deletarTarefa(req, res) {
    try {
      const { id } = req.params;
      const tarefaDeletada = await this.servicoTarefas.deletar(id);

      if (!tarefaDeletada) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Tarefa não encontrada",
        });
      }

      res.status(200).json({
        sucesso: true,
        mensagem: "Tarefa deletada com sucesso",
      });
    } catch (erro) {
      // Usar a mensagem específica do Service
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message,
      });
    }
  }
}
