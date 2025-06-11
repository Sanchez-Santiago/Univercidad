import { z } from "https://esm.sh/zod@3.22.4";
import { PersonaSchema } from "./persona.ts";

export const EmpleadoSchema = PersonaSchema.extend({
  legajo: z.number().int().positive(), // ID del empleado
  dni: z.string().length(8),
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  fecha_nacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // formato YYYY-MM-DD
  direccion: z.string().min(1),
  email: z.string().email(),
  telefono: z.string(),
  tipo: z.enum(["administrativo", "profesor", "otro"]), // o los valores que tengas
});
