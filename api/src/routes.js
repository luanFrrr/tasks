import { Router } from "express";
import { ControladorTarefas } from "./controllers/controller.tarefas.js";

const router = Router();
const controladorTarefas = new ControladorTarefas();

// Rotas de tarefas
router.get(
  "/tarefas",
  controladorTarefas.listarTarefas.bind(controladorTarefas)
);
router.get(
  "/tarefas/:id",
  controladorTarefas.buscarTarefaPorId.bind(controladorTarefas)
);
router.post(
  "/tarefas",
  controladorTarefas.criarTarefa.bind(controladorTarefas)
);
router.put(
  "/tarefas/:id",
  controladorTarefas.atualizarTarefa.bind(controladorTarefas)
);
router.delete(
  "/tarefas/:id",
  controladorTarefas.deletarTarefa.bind(controladorTarefas)
);

// Novas rotas para o campo status
router.patch(
  "/tarefas/:id/status",
  controladorTarefas.marcarStatus.bind(controladorTarefas)
);
router.get(
  "/tarefas/filtro/status",
  controladorTarefas.buscarPorStatus.bind(controladorTarefas)
);

// Rota de teste
router.get("/", (req, res) => {
  res.json({
    mensagem: "API de Tarefas funcionando!",
    rotas: {
      "GET /tarefas": "Listar todas as tarefas",
      "GET /tarefas/:id": "Buscar tarefa por ID",
      "POST /tarefas": "Criar nova tarefa",
      "PUT /tarefas/:id": "Atualizar tarefa",
      "DELETE /tarefas/:id": "Deletar tarefa",
      "PATCH /tarefas/:id/status": "Marcar status da tarefa",
      "GET /tarefas/filtro/status?status=0": "Buscar tarefas pendentes",
      "GET /tarefas/filtro/status?status=1": "Buscar tarefas concluídas",
    },
  });
});

export default router;
