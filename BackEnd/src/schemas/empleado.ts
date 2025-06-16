import { z } from "zod";
import { PersonaSchema } from "./persona.ts";

export const EmpleadoSchema = PersonaSchema.extend({
  legajo: z.number().int().positive(), // ID del empleado
  cargo: z.string().min(2).max(45), // Cargo del empleado
  tipo: z.enum(["administrativo", "profesor", "otro"]), // o los valores que tengas
});
