import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query; // Obtén el ID de la tarea desde los parámetros de la URL

  try {
    await connectDB(); // Conectar a la base de datos

    // Verifica si la tarea pertenece al usuario logueado
    const task = await Task.findOne({ _id: id });
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    // Maneja la eliminación de la tarea
    if (method === "DELETE") {
      await Task.findByIdAndDelete(id); // Usar taskid en lugar de id
      return res.status(200).json({ message: "Tarea eliminada con éxito" });
    }

    if (method === "PUT") {
      const { title, description, completed } = req.body;
    
      if (title === undefined && description === undefined && completed === undefined) {
        return res.status(400).json({ message: "No se proporcionaron campos para actualizar" });
      }
    
      const updateFields: any = {};
      if (title !== undefined) updateFields.title = title;
      if (description !== undefined) updateFields.description = description;
      if (completed !== undefined) updateFields.completed = completed;
    
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        updateFields,
        { new: true }
      );
    
      return res.status(200).json(updatedTask);
    }

    return res.status(405).json({ message: "Método no permitido" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor", error });
  }
}
