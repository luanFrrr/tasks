import "./tarefa-edit.css";

function TarefaEdit(props) {
  return (
    <div className="tarefa-edit">
      <div>
        <input
          className="task-input"
          type="text"
          name="tarefa"
          id="tarefa"
          value={props.descricao}
        />
      </div>
      <div className="tarefa-edit-acoes">
        <svg
          className="icon icon-green"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="undefined"
        >
          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
        </svg>
        <svg
          className="icon icon-red"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="undefined"
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>
    </div>
  );
}

export default TarefaEdit;
