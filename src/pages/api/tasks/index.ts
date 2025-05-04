import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import Cors from "cors";

// Inicializa el middleware CORS
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: '*',  // Permite todas las fuentes, cámbialo a un dominio específico si lo necesitas
});

// Función para ejecutar el middleware de CORS
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result: any) =>
      result instanceof Error ? reject(result) : resolve(result)
    );
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ejecuta el middleware de CORS
  await runMiddleware(req, res, cors);

  await dbConnect();

  try {
    if (req.method === "GET") {
      try {
        const tasks: Array<typeof Task> = await Task.find();
        res.status(200).json(tasks);
      } catch (error) {
        console.error("Error al obtener tareas:", error);
        res.status(401).json({ message: "No autorizado", error: error instanceof Error ? error.message : "Error desconocido" });
      }
    }

    if (req.method === "POST") {
      const { title, description, completed } = req.body;

      if (!title) {
        return res.status(400).json({ message: "El título es obligatorio" });
      }

      const newTask = await Task.create({
        title,
        description,
        completed: !!completed,
      });

      return res.status(201).json(newTask);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  } catch (err: any) {
    res.status(401).json({ message: "No autorizado", error: err.message });
  }
}
