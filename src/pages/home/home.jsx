import Tarefa from "../../components/tarefa/tarefa.jsx";
import TarefaEdit from "../../components/tarefa-edit/tarefa-edit.jsx";
import "./home.css";
import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import api from "../../utils/api";

function Home() {
  const [tarefas, setTarefas] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");

  // Configurar sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Função para lidar com o fim do drag & drop
  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTarefas((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function AddTarefa() {
    //criar Tarefa via api
    api
      .post("/tarefas", {
        descricao: descricao.trim(),
      })
      .then((response) => {
        console.log("Tarefa criada:", response.data);

        // Adicionar a nova tarefa ao estado local
        const novaTarefa = {
          id: response.data.dados.id,
          descricao: response.data.dados.descricao,
          done: response.data.dados.status === 1,
          edit: false,
        };

        setTarefas([novaTarefa, ...tarefas]); // Adicionar no início da lista
        setDescricao(""); // Limpar o campo de descrição
        setErro(""); // Limpar erros anteriores

        console.log("Tarefa adicionada ao estado local:", novaTarefa);
      })
      .catch((error) => {
        console.error("Erro ao criar tarefa:", error);

        if (error.response) {
          // Erro da API - usar a mensagem específica do backend
          const mensagem = error.response.data?.mensagem || "Erro desconhecido";
          setErro(mensagem);
        } else if (error.request) {
          // Erro de conexão
          setErro("Erro de conexão. Verifique se a API está rodando.");
        } else {
          // Outro erro
          setErro("Erro inesperado ao criar tarefa.");
        }
      });

    console.log(tarefas);
  }

  const DeleteTarefa = (id) => {
    // Perguntar primeiro se quer deletar
    if (!window.confirm("Você quer deletar a tarefa?")) {
      return; // Se cancelar, não faz nada
    }

    // Se confirmar, deletar via API
    api
      .delete(`/tarefas/${id}`)
      .then((response) => {
        console.log("Tarefa deletada:", response.data);

        // Remover a tarefa do estado local
        const novaLista = tarefas.filter((tarefa) => tarefa.id !== id);
        setTarefas(novaLista);

        console.log("Tarefa removida do estado local");
      })
      .catch((error) => {
        console.error("Erro ao deletar tarefa:", error);

        if (error.response) {
          // Erro da API - usar a mensagem específica do backend
          const mensagem = error.response.data?.mensagem || "Erro desconhecido";
          setErro(mensagem);
        } else if (error.request) {
          setErro("Erro de conexão. Verifique se a API está rodando.");
        } else {
          setErro("Erro inesperado ao deletar tarefa.");
        }
      });
  };

  const EditTarefa = (id) => {
    const novaLista = tarefas.map((tarefa) => {
      if (tarefa.id === id) tarefa.edit = true;
      return tarefa;
    });
    setTarefas(novaLista);
  };

  const EditTarefaConfirma = (descricao, id) => {
    api
      .put(`/tarefas/${id}`, {
        descricao: descricao.trim(),
      })
      .then((response) => {
        console.log("Tarefa atualizada:", response.data);

        // Atualizar a tarefa no estado local
        const novaLista = tarefas.map((tarefa) => {
          if (tarefa.id === id) {
            return {
              ...tarefa,
              edit: false,
              descricao: descricao.trim(),
            };
          }
          return tarefa;
        });
        setTarefas(novaLista);
        setErro(""); // Limpar erros anteriores

        console.log("Tarefa atualizada no estado local");
      })
      .catch((error) => {
        console.error("Erro ao atualizar tarefa:", error);

        if (error.response) {
          // Erro da API - usar a mensagem específica do backend
          const mensagem = error.response.data?.mensagem || "Erro desconhecido";
          setErro(mensagem);
        } else if (error.request) {
          setErro("Erro de conexão. Verifique se a API está rodando.");
        } else {
          setErro("Erro inesperado ao atualizar tarefa.");
        }
      });
  };

  const CancelarEditTarefa = (id) => {
    const novaLista = tarefas.map((tarefa) => {
      if (tarefa.id === id) tarefa.edit = false;
      return tarefa;
    });
    setTarefas(novaLista);
  };

  const TarefaConcluida = (id, done) => {
    console.log("TarefaConcluida chamada:", { id, done });
    const status = done ? "1" : "0";
    console.log("Status a ser enviado:", status);

    api
      .patch(`/tarefas/${id}/status`, {
        status,
      })
      .then((response) => {
        console.log("Status da tarefa atualizado:", response.data);

        // Atualizar o status da tarefa no estado local
        const novaLista = tarefas.map((tarefa) => {
          if (tarefa.id === id) {
            return {
              ...tarefa,
              done: done,
            };
          }
          return tarefa;
        });
        setTarefas(novaLista);

        console.log("Status da tarefa atualizado no estado local");
      })
      .catch((error) => {
        console.error("Erro ao atualizar status da tarefa:", error);

        if (error.response) {
          // Erro da API - usar a mensagem específica do backend
          const mensagem = error.response.data?.mensagem || "Erro desconhecido";
          setErro(mensagem);
        } else if (error.request) {
          setErro("Erro de conexão. Verifique se a API está rodando.");
        } else {
          setErro("Erro inesperado ao atualizar status da tarefa.");
        }
      });
  };

  //listar tarefas
  const ListarTarefas = () => {
    api
      .get("/tarefas")
      .then((response) => {
        // Converter dados da API para o formato do frontend
        const tarefasFormatadas = response.data.dados.map((tarefa) => ({
          id: tarefa.id,
          descricao: tarefa.descricao,
          done: tarefa.status === 1, // Converter status (1/0) para done (true/false)
          edit: false,
        }));
        setTarefas(tarefasFormatadas);
        console.log("Tarefas carregadas:", tarefasFormatadas);
      })
      .catch((error) => {
        console.log("Erro ao carregar tarefas:", error);
      });
  };

  useEffect(() => {
    ListarTarefas();
  }, []);

  return (
    <div className="container-tasks">
      {erro.length > 0 && <div className="error">{erro}</div>}

      <h2>Quais são os planos para hoje?</h2>

      <div className="form-tarefa">
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="task-input"
          type="text"
          name="task"
          id="task"
          placeholder="Descreva sua tarefa..."
        />
        <button onClick={AddTarefa} className="task-btn">
          Inserir Tarefa
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={tarefas} strategy={verticalListSortingStrategy}>
          <div className="lista-tarefa">
            {tarefas.map((task) => {
              return task.edit ? (
                <TarefaEdit
                  key={task.id}
                  id={task.id}
                  descricao={task.descricao}
                  done={task.done}
                  onClickSave={EditTarefaConfirma}
                  onClickCancel={CancelarEditTarefa}
                />
              ) : (
                <Tarefa
                  key={task.id}
                  id={task.id}
                  descricao={task.descricao}
                  done={task.done}
                  onClickDelete={DeleteTarefa}
                  onClickEdit={EditTarefa}
                  onClickConcluir={TarefaConcluida}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default Home;
