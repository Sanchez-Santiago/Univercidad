// src/schemas/estudiante.ts
import { z } from "https://esm.sh/zod@3.22.4";
import { PersonaSchema } from "./persona.ts";

export const EstudianteSchema = PersonaSchema.extend({
  credito: z.number().int().nonnegative(),
  notaPromedio: z
    .number()
    .min(0)
    .max(10)
    .refine((n) => /^(\d+(\.\d{1,2})?)$/.test(n.toString())),
  carrera_id: z.string().uuid(),
  materiasAprobadas: z.number().int().nonnegative(),
  fechaIngreso: z
    .string()
    .refine((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .refine((d) => new Date(d) <= new Date()),
  estadoAcademico: z.enum(["ACTIVO", "EGRESADO", "REGULAR", "LIBRE"]),
  becado: z.boolean().optional(),
});

export const EstudianteCreateSchema = EstudianteSchema.omit({
  idpersona: true,
  created_at: true,
  updated_at: true,
});

export const EstudianteUpdateSchema = EstudianteCreateSchema.partial();

export type Estudiante = z.infer<typeof EstudianteSchema>;
export type EstudianteCreateInput = z.infer<typeof EstudianteCreateSchema>;
export type EstudianteUpdateInput = z.infer<typeof EstudianteUpdateSchema>;
