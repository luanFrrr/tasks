import "./tarefa.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function Tarefa(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const newStatus = e.target.checked;
    console.log("Checkbox mudou:", {
      id: props.id,
      newStatus,
      currentDone: props.done,
    });
    props.onClickConcluir(props.id, newStatus);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const newStatus = !props.done;
    console.log("Checkbox clicado:", {
      id: props.id,
      newStatus,
      currentDone: props.done,
    });
    props.onClickConcluir(props.id, newStatus);
  };

  console.log("Renderizando tarefa:", {
    id: props.id,
    done: props.done,
    descricao: props.descricao,
  });

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="tarefa">
      <div className="tarefa-conteudo">
        <input
          type="checkbox"
          checked={props.done}
          onChange={handleCheckboxChange}
          onClick={handleCheckboxClick}
          className="task-checkbox"
          id={`tarefa-${props.id}`}
        />
        <span className={props.done ? "tarefa-done" : ""} {...listeners}>
          {props.descricao}
        </span>
      </div>
      <div className="tarefa-acoes">
        <svg
          onClick={(e) => {
            e.stopPropagation();
            props.onClickEdit(props.id);
          }}
          className="icon"
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" />
        </svg>
        <svg
          onClick={(e) => {
            e.stopPropagation();
            props.onClickDelete(props.id);
          }}
          className="icon"
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
        </svg>
      </div>
    </div>
  );
}

export default Tarefa;
