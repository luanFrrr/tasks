import Tarefa from "../../components/tarefa/tarefa.jsx";
import "./home.css";

function Home() {
  const tarefas = [
    {
      id: 1,
      descricao: "Estudar React",
      done: false,
    },
    { id: 2, descricao: "Estudar Node", done: false },
    { id: 3, descricao: "Estudar CSS", done: false },
  ];
  return (
    <div className="container-tasks">
      <h2>Quais são os planos para hoje?</h2>

      <div className="form-tarefa">
        <input
          className="task-input"
          type="text"
          name="task"
          id="task"
          placeholder="Descreva sua tarefa"
        />
        <button className="task-btn">Inserir Tarefa</button>
      </div>
      <div className="lista-tarefa">
        {tarefas.map((task) => {
          return (
            <Tarefa id={task.id} descricao={task.descricao} done={task.done} />
          );
        })}
      </div>
    </div>
  );
}

export default Home;
