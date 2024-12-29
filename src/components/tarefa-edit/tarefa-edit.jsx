import { useState } from "react";
import "./tarefa-edit.css";

function TarefaEdit(props) {
  const [descricao, setDescricao] = useState(props.descricao);

  return (
    <div className="tarefa-edit">
      <div>
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="task-input"
          type="text"
          name="tarefa"
          id="tarefa"
        />
      </div>
      <div className="tarefa-edit-acoes">
        <svg
          onClick={(e) => props.onClickSave(descricao, props.id)}
          className="icon icon-green"
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
        </svg>
        <svg
          onClick={(e) => props.onClickCancel(props.id)}
          className="icon icon-red"
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>
    </div>
  );
}

export default TarefaEdit;
