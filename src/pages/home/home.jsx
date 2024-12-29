import Tarefa from "../../components/tarefa/tarefa.jsx";
import TarefaEdit from "../../components/tarefa-edit/tarefa-edit.jsx";
import { useState } from "react";
import "./home.css";
import { v4 as uuid } from "uuid";

function Home() {
  const [tarefas, setTarefas] = useState([]);
  const [descricao, setDescricao] = useState("");

  function AddTarefa() {
    let tarefa = {
      id: uuid(),
      descricao: descricao,
      done: false,
      edit: false,
    };

    setTarefas([...tarefas, tarefa]);
    setDescricao("");
  }

  const DeleteTarefa = (id) => {
    const novaLista = tarefas.filter((tarefa) => {
      return tarefa.id !== id;
    });
    setTarefas(novaLista);
  };

  const EditTarefa = (id) => {
    let novaLista = [];
    tarefas.forEach((tarefa) => {
      if (tarefa.id === id) {
        tarefa.edit = true;
      }
      novaLista.push(tarefa);
    });
    setTarefas(novaLista);
  };

  return (
    <div className="container-tasks">
      <h2>Quais são os planos para hoje?</h2>

      <div className="form-tarefa">
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="task-input"
          type="text"
          name="task"
          id="task"
          placeholder="Descreva sua tarefa"
        />
        <button onClick={AddTarefa} className="task-btn">
          Inserir Tarefa
        </button>
      </div>

      <div className="lista-tarefa">
        {tarefas.map((task) => {
          return task.edit ? (
            <TarefaEdit
              id={task.id}
              descricao={task.descricao}
              done={task.done}
            />
          ) : (
            <Tarefa
              id={task.id}
              descricao={task.descricao}
              done={task.done}
              onClickDelete={DeleteTarefa}
              onClickEdit={EditTarefa}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Home;
