import { FaTrash, FaEdit } from 'react-icons/fa'

type Task = {
  _id: string
  title: string
  description?: string
  completed: boolean
}

type TaskItemProps = {
  task: Task
  onDelete: (task: Task) => void
  onEdit: (task: Task) => void
  onToggleComplete: (task: Task) => void
}

const TaskItem = ({
  task,
  onDelete,
  onEdit,
  onToggleComplete,
}: TaskItemProps) => {
  return (
    <li className='bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4'>
      {/* Texto */}
      <div className='flex-1 break-words overflow-hidden'>
        <h2 className='font-semibold text-base break-words'>{task.title}</h2>
        {task.description && (
          <p className='text-sm text-gray-600 dark:text-gray-300 break-words'>
            {task.description}
          </p>
        )}
      </div>

      {/* Acciones */}
      <div className='flex flex-row sm:flex-col flex-shrink-0 sm:w-[100px] items-end gap-2 sm:self-end'>
        <div className='flex gap-2'>
          <button
            onClick={() => onEdit(task)}
            className='text-blue-500 p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded'
            title='Editar'
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(task)}
            className='text-red-500 p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded'
            title='Eliminar'
          >
            <FaTrash />
          </button>
        </div>
        <span
          onClick={() => onToggleComplete(task)}
          className={`text-sm px-2 py-1 rounded cursor-pointer select-none text-center whitespace-nowrap ${
            task.completed
              ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
              : 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300'
          }`}
        >
          {task.completed ? 'Completada' : 'Pendiente'}
        </span>
      </div>
    </li>
  )
}

export default TaskItem
