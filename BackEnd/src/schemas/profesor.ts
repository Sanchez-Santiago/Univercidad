import { z } from "zod";
import { EmpleadoSchema } from "./empleado.ts";

export const ProfesorSchema = EmpleadoSchema.extend({
  titulo: z.string().min(1),
  departamento: z.string().min(1),
});

export const ProfesorCreateSchema = ProfesorSchema.omit({
  idpersona: true,
  created_at: true,
  updated_at: true,
});

export const EstudianteUpdateSchema = ProfesorSchema.partial();
export const ProfesorUpdateSchema = ProfesorCreateSchema.partial();

export type Profesor = z.infer<typeof ProfesorSchema>;
export type ProfesorreateInput = z.infer<typeof ProfesorCreateSchema>;
export type ProfesorUpdateInput = z.infer<typeof ProfesorUpdateSchema>;
