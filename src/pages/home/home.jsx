import Tarefa from "../../components/tarefa/tarefa.jsx";
import TarefaEdit from "../../components/tarefa-edit/tarefa-edit.jsx";
import "./home.css";
import { useState } from "react";
import { v4 as uuid } from "uuid";

function Home() {
  const [tarefas, setTarefas] = useState([]);
  const [descricao, setDescricao] = useState("");

  const AddTarefa = () => {
    if (!descricao.trim()) {
      alert("A descrição da tarefa não pode estar vazia.");
      return;
    }

    const tarefa = { id: uuid(), descricao, done: false, edit: false };
    setTarefas([...tarefas, tarefa]);
    setDescricao("");
  };

  const UpdateTarefa = (id, updates) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, ...updates } : tarefa
      )
    );
  };

  const DeleteTarefa = (id) =>
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));

  return (
    <div className="container-tasks">
      <h2>Quais são os planos para hoje?</h2>
      <div className="form-tarefa">
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="task-input"
          type="text"
          placeholder="Descreva sua tarefa..."
        />
        <button onClick={AddTarefa} className="task-btn">
          Inserir Tarefa
        </button>
      </div>
      <div className="lista-tarefa">
        {tarefas.map((task) =>
          task.edit ? (
            <TarefaEdit
              key={task.id}
              {...task}
              onClickSave={(desc) =>
                UpdateTarefa(task.id, { descricao: desc, edit: false })
              }
              onClickCancel={() => UpdateTarefa(task.id, { edit: false })}
            />
          ) : (
            <Tarefa
              key={task.id}
              {...task}
              onClickDelete={() => DeleteTarefa(task.id)}
              onClickEdit={() => UpdateTarefa(task.id, { edit: true })}
              onClickConcluir={(done) => UpdateTarefa(task.id, { done })}
            />
          )
        )}
      </div>
    </div>
  );
}

export default Home;
