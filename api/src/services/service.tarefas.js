import { RepositorioTarefas } from "../repositories/repository-pg.tarefas.js";

export class ServicoTarefas {
  constructor() {
    this.repositorioTarefas = new RepositorioTarefas();
  }

  // Listar todas as tarefas
  async listarTodas() {
    try {
      return await this.repositorioTarefas.listarTodas();
    } catch (erro) {
      throw new Error(`Erro no serviço ao listar tarefas: ${erro.message}`);
    }
  }

  // Buscar tarefa por ID
  async buscarPorId(id) {
    try {
      if (!id || isNaN(id)) {
        throw new Error("ID inválido");
      }
      return await this.repositorioTarefas.buscarPorId(id);
    } catch (erro) {
      throw new Error(`Erro no serviço ao buscar tarefa: ${erro.message}`);
    }
  }

  // Criar nova tarefa
  async criar(dadosTarefa) {
    try {
      // Validação básica tem que ter pelo menos 5 caracteres
      if (!dadosTarefa.descricao || dadosTarefa.descricao.trim() === "") {
        throw new Error("Descrição é obrigatória");
      }
      if (dadosTarefa.descricao.length < 5) {
        throw new Error("Descrição deve ter pelo menos 5 caracteres");
      }

      // Preparar dados para inserção
      const tarefaParaCriar = {
        descricao: dadosTarefa.descricao.trim(),
        status: dadosTarefa.status || "0",
        data_criacao: new Date().toISOString(),
        data_atualizacao: new Date().toISOString(),
      };

      return await this.repositorioTarefas.criar(tarefaParaCriar);
    } catch (erro) {
      // Propagar a mensagem original do erro
      throw erro;
    }
  }

  // Atualizar tarefa
  async atualizar(id, dadosAtualizacao) {
    try {
      if (!id || isNaN(id)) {
        throw new Error("ID inválido");
      }

      // Verificar se a tarefa existe
      const tarefaExistente = await this.repositorioTarefas.buscarPorId(id);
      if (!tarefaExistente) {
        return null;
      }

      // Validações
      if (
        dadosAtualizacao.descricao !== undefined &&
        dadosAtualizacao.descricao.trim() === ""
      ) {
        throw new Error("Descrição não pode estar vazia");
      }
      // se a descrição for fornecida e tiver menos de 5 caracteres, lança um erro
      if (
        dadosAtualizacao.descricao !== undefined &&
        dadosAtualizacao.descricao.length < 5
      ) {
        throw new Error("Descrição deve ter pelo menos 5 caracteres");
      }

      // Preparar dados para atualização
      const dadosParaAtualizar = {
        ...dadosAtualizacao,
        data_atualizacao: new Date().toISOString(),
      };

      return await this.repositorioTarefas.atualizar(id, dadosParaAtualizar);
    } catch (erro) {
      // Propagar a mensagem original do erro
      throw erro;
    }
  }

  // Marcar status da tarefa
  async marcarStatus(id, status) {
    try {
      if (!id || isNaN(id)) {
        throw new Error("ID inválido");
      }

      if (typeof status !== "string") {
        throw new Error("Campo status deve ser uma string");
      }

      // Validar valores permitidos
      const valoresPermitidos = ["0", "1"];
      if (!valoresPermitidos.includes(status)) {
        throw new Error("Status deve ser '0' (false) ou '1' (true)");
      }

      return await this.atualizar(id, { status });
    } catch (erro) {
      // Propagar a mensagem original do erro
      throw erro;
    }
  }

  // Deletar tarefa
  async deletar(id) {
    try {
      if (!id || isNaN(id)) {
        throw new Error("ID inválido");
      }

      // Verificar se a tarefa existe
      const tarefaExistente = await this.repositorioTarefas.buscarPorId(id);
      if (!tarefaExistente) {
        return null;
      }

      return await this.repositorioTarefas.deletar(id);
    } catch (erro) {
      // Propagar a mensagem original do erro
      throw erro;
    }
  }

  // Buscar tarefas por status
  async buscarPorStatus(status) {
    try {
      if (typeof status !== "string") {
        throw new Error("Parâmetro status deve ser uma string");
      }

      // Validar valores permitidos
      const valoresPermitidos = ["0", "1"];
      if (!valoresPermitidos.includes(status)) {
        throw new Error("Status deve ser '0' (false) ou '1' (true)");
      }

      return await this.repositorioTarefas.buscarPorStatus(status);
    } catch (erro) {
      // Propagar a mensagem original do erro
      throw erro;
    }
  }
}
