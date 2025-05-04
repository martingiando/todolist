import { FaTrash, FaEdit } from "react-icons/fa";

type Task = {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
};

type TaskItemProps = {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
};

const TaskItem = ({ task, onDelete, onEdit, onToggleComplete }: TaskItemProps) => {
  return (
    <li
      key={task._id}
      className="bg-white p-4 rounded shadow flex justify-between items-center relative"
    >
      <button
        onClick={() => onDelete(task._id)}
        className="absolute top-6 right-1 text-red-500 p-1 hover:bg-red-100 rounded cursor-pointer"
      >
        <FaTrash />
      </button>

      <button
        onClick={() => onEdit(task)}
        className="absolute top-6 right-8 text-blue-500 p-1 hover:bg-blue-100 rounded cursor-pointer"
      >
        <FaEdit />
      </button>

      <div className="flex-grow">
        <h2 className="font-semibold">{task.title}</h2>
        {task.description && (
          <p className="text-sm text-gray-600">{task.description}</p>
        )}
      </div>

      <span
        onClick={() => onToggleComplete(task)}
        className={`text-sm px-2 py-1 rounded mr-12 cursor-pointer ${
          task.completed
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600 hover:bg-red-200"
        }`}
      >
        {task.completed ? "Completada" : "Pendiente"}
      </span>
    </li>
  );
};

export default TaskItem;