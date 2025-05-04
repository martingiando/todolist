import { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useForm } from "react-hook-form";
import TaskItem from '@/components/tasks/TaskItem';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { FaSpinner } from "react-icons/fa";

type Task = {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
};

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<Task>();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) throw new Error("Error al obtener tareas");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Error cargando tareas:", err);
      }
    };

    fetchTasks();
  }, []);

  const openCreateModal = () => {
    reset();
    setIsEditing(false);
    setIsOpen(true);
  };

  const openEditModal = (task: Task) => {
    setIsEditing(true);
    setTaskToEdit(task);
    setValue("title", task.title);
    setValue("description", task.description || "");
    setValue("completed", task.completed);
    setIsOpen(true);
  };

  const onSubmit = async (data: Task) => {
    setIsLoading(true);
    try {
      if (isEditing && taskToEdit) {
        await updateTask(taskToEdit._id, data);
      } else {
        await createTask(data);
      }
      reset();
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (task: { title: string; description?: string }) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (!res.ok) throw new Error("Error al crear tarea");

    const newTask = await res.json();
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (!res.ok) throw new Error("Error al actualizar tarea");

    const updated = await res.json();
    setTasks((prev) => prev.map(t => t._id === id ? updated : t));
  };

  const deleteTask = async (id: string) => {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar tarea");
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const toggleTaskCompletion = async (task: Task) => {
    setTaskToComplete(task);
    setIsConfirmModalOpen(true);
  };

  const confirmToggleTaskCompletion = async () => {
    if (taskToComplete) {
      const updatedTask = { ...taskToComplete, completed: !taskToComplete.completed };
      await updateTask(taskToComplete._id, updatedTask);
      setIsConfirmModalOpen(false);
    }
  };

  const cancelToggleTaskCompletion = () => {
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black p-4">
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Mis Tareas</h1>
          <button
            onClick={openCreateModal}
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Crear tarea
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-gray-600">No hay tareas aún.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onDelete={deleteTask}
                onEdit={openEditModal}
                onToggleComplete={toggleTaskCompletion}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Modal de confirmación */}
      <Dialog open={isConfirmModalOpen} onClose={cancelToggleTaskCompletion} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded p-6 w-full max-w-md">
            <DialogTitle className="text-lg font-bold mb-4 text-black">
              Confirmar cambio de estado
            </DialogTitle>
            <p className="text-sm text-black mb-4">¿Estás seguro de que deseas cambiar el estado de esta tarea?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelToggleTaskCompletion}
                className="px-4 py-2 border rounded text-black cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmToggleTaskCompletion}
                className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Modal para crear o editar tarea */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded p-6 w-full max-w-md">
            <DialogTitle className="text-lg font-bold mb-4 text-black">
              {isEditing ? "Editar tarea" : "Nueva tarea"}
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm text-black">Título</label>
                <input
                  {...register("title", { required: true })}
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div>
                <label className="block text-sm text-black">Descripción</label>
                <textarea
                  {...register("description")}
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div className="flex items-center space-x-2 text-black">
                <input type="checkbox" {...register("completed")} />
                <label>¿Completada?</label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded text-black cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer flex items-center justify-center min-w-[100px]"
                  disabled={isLoading}
                >
                  {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                  {isEditing ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}