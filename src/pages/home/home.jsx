import Tarefa from "../../components/tarefa/tarefa.jsx";
import TarefaEdit from "../../components/tarefa-edit/tarefa-edit.jsx";
import "./home.css";
import { useState } from "react";
import { v4 as uuid } from "uuid";

function Home() {
  const [tarefas, setTarefas] = useState([]);
  const [descricao, setDescricao] = useState("");

  function AddTarefa() {
    let tarefa = {
      id: uuid(),
      descricao,
      done: false,
      edit: false,
    };

    setTarefas([...tarefas, tarefa]);
    setDescricao("");

    console.log(tarefas);
  }

  const DeleteTarefa = (id) => {
    const novaLista = tarefas.filter((tarefa) => {
      return tarefa.id != id;
    });

    setTarefas(novaLista);
  };

  const EditTarefa = (id) => {
    let novaLista = [];

    tarefas.map((tarefa) => {
      if (tarefa.id == id) tarefa.edit = true;

      novaLista.push(tarefa);
    });

    setTarefas(novaLista);
  };

  const EditTarefaConfirma = (descricao, id) => {
    let novaLista = [];

    tarefas.map((tarefa) => {
      if (tarefa.id == id) {
        tarefa.edit = false;
        tarefa.descricao = descricao;
      }

      novaLista.push(tarefa);
    });

    setTarefas(novaLista);
  };

  const CancelarEditTarefa = (id) => {
    let novaLista = [];

    tarefas.map((tarefa) => {
      if (tarefa.id == id) tarefa.edit = false;

      novaLista.push(tarefa);
    });

    setTarefas(novaLista);
  };

  const TarefaConcluida = (id, done) => {
    let novaLista = [];

    tarefas.map((tarefa) => {
      if (tarefa.id == id) tarefa.done = done;

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
          placeholder="Descreva sua tarefa..."
        />
        <button onClick={AddTarefa} className="task-btn">
          Inserir Tarefa
        </button>
      </div>

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
    </div>
  );
}

export default Home;
