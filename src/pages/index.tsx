import { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useForm } from "react-hook-form";
import TaskItem from "@/components/tasks/TaskItem";
import ThemeToggle from "@/components/theme/ThemeToggle";
import toast from "react-hot-toast";

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
  const [isConfirmCompleteOpen, setIsConfirmCompleteOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // 👈 Nuevo estado

  const { register, handleSubmit, reset, setValue } = useForm<Task>();

  useEffect(() => {
    const fetchTasks = async () => {
      setIsFetching(true);
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) throw new Error("Error al obtener tareas");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        toast.error("Error al cargar tareas");
      } finally {
        setIsFetching(false); // 👈 Oculta el spinner al terminar
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
    setLoading(true);
    try {
      if (isEditing && taskToEdit) {
        await updateTask(taskToEdit._id, data);
        toast.success("Tarea actualizada");
      } else {
        await createTask(data);
        toast.success("Tarea creada");
      }
      reset();
      setIsOpen(false);
    } catch {
      toast.error("Error al guardar tarea");
    } finally {
      setLoading(false);
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
    setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
  };

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar tarea");
      setTasks(tasks.filter((task) => task._id !== id));
      toast.success("Tarea eliminada");
    } catch (err) {
      toast.error("Error al eliminar tarea");
    } finally {
      setIsConfirmDeleteOpen(false);
    }
  };

  const toggleTaskCompletion = (task: Task) => {
    setTaskToComplete(task);
    setIsConfirmCompleteOpen(true);
  };

  const confirmToggleTaskCompletion = async () => {
    if (taskToComplete) {
      const updatedTask = { ...taskToComplete, completed: !taskToComplete.completed };
      await updateTask(taskToComplete._id, updatedTask);
      toast.success("Estado actualizado");
      setIsConfirmCompleteOpen(false);
    }
  };

  const confirmDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setIsConfirmDeleteOpen(true);
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

        {isFetching ? (
          <div className="flex justify-center py-8">
            <div className="loader w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-gray-600">No hay tareas aún.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onDelete={confirmDeleteTask}
                onEdit={openEditModal}
                onToggleComplete={toggleTaskCompletion}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Modal Confirmar Estado */}
      <Dialog open={isConfirmCompleteOpen} onClose={() => setIsConfirmCompleteOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded p-6 w-full max-w-md">
            <DialogTitle className="text-lg font-bold mb-4 text-black">
              Confirmar cambio de estado
            </DialogTitle>
            <p className="text-sm text-black mb-4">¿Estás seguro de cambiar el estado de esta tarea?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsConfirmCompleteOpen(false)} className="px-4 py-2 border rounded text-black">Cancelar</button>
              <button onClick={confirmToggleTaskCompletion} className="px-4 py-2 bg-blue-500 text-white rounded">Confirmar</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Modal Confirmar Eliminación */}
      <Dialog open={isConfirmDeleteOpen} onClose={() => setIsConfirmDeleteOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded p-6 w-full max-w-md">
            <DialogTitle className="text-lg font-bold mb-4 text-black">
              Confirmar eliminación
            </DialogTitle>
            <p className="text-sm text-black mb-4">¿Estás seguro de eliminar esta tarea?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsConfirmDeleteOpen(false)} className="px-4 py-2 border rounded text-black cursor-pointer">Cancelar</button>
              <button onClick={() => deleteTask(taskToDelete!._id)} className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer">Eliminar</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Modal Crear/Editar */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded p-6 w-full max-w-md">
            <DialogTitle className="text-lg font-bold mb-4 text-black">
              {isEditing ? "Editar tarea" : "Nueva tarea"}
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm text-black">Título</label>
                <input {...register("title", { required: true })} className="w-full p-2 border rounded text-black" />
              </div>
              <div>
                <label className="block text-sm text-black">Descripción</label>
                <textarea {...register("description")} className="w-full p-2 border rounded text-black" />
              </div>
              <div className="flex items-center space-x-2 text-black">
                <input type="checkbox" {...register("completed")} />
                <label>¿Completada?</label>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded text-black cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 cursor-pointer">
                  {loading && <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
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