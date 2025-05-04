import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../lib/mongodb";

type Data = {
  message: string;
  error?: unknown; // Optional property to include error details
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    await connectDB(); // Intentamos conectar a la base de datos
    res.status(200).json({ message: "Conexión a MongoDB exitosa" });
  } catch (error) {
    res.status(500).json({ message: "Error de conexión a MongoDB", error });
  }
}
