import { z } from "https://esm.sh/zod@3.22.4";
import { PersonaSchema } from "./persona.ts";

// --------------------------------------------------------------------------------
// 2) Esquema para los datos de la tabla `estudiante`
// --------------------------------------------------------------------------------
const EstudianteSchema = PersonaSchema.extend({
  // idpersona ya viene de PersonaSchema; si es creación, puede omitirse
  // (en lectura obligamos que exista, en creación podemos usar omit)

  credito: z
    .number()
    .int({ message: "El crédito debe ser un número entero" })
    .nonnegative({ message: "El crédito no puede ser negativo" }),

  notaPromedio: z
    .number()
    .min(0, { message: "La nota promedio no puede ser menor a 0" })
    .max(10, { message: "La nota promedio no puede ser mayor a 10" })
    .refine(
      (n) => {
        // Permitir decimales con máximo 2 dígitos (p.ej. 7.25)
        return /^(\d+(\.\d{1,2})?)$/.test(n.toString());
      },
      { message: "La nota promedio debe tener hasta 2 decimales" }
    ),

  carrera_id: z
    .string()
    .uuid({ message: "El ID de la carrera debe ser un UUID válido" }),

  materiasAprobadas: z
    .number()
    .int({ message: "Las materias aprobadas deben ser un número entero" })
    .nonnegative({ message: "Las materias aprobadas no pueden ser negativas" }),

  fechaIngreso: z
    .string()
    .refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
      message: "La fecha de ingreso debe tener formato YYYY-MM-DD",
    })
    .refine(
      (date) => {
        // Validar que no sea futura (puede coincidir con hoy o ser anterior)
        const d = new Date(date);
        return d <= new Date();
      },
      { message: "La fecha de ingreso no puede ser posterior a hoy" }
    ),

  estadoAcademico: z.enum(["ACTIVO", "EGRESADO", "REGULAR", "LIBRE"], {
    errorMap: () => ({
      message:
        "El estado académico debe ser uno de: ACTIVO, EGRESADO, REGULAR, LIBRE",
    }),
  }),

  becado: z
    .boolean()
    .optional()
    .nullable()
    .transform((val) => {
      // En la base se almacena como TINYINT(1): 1 o 0.
      // Aquí permitimos booleano y convertimos a true/false.
      if (typeof val === "string") {
        // Si viene "0" o "1", convertimos
        return val === "1";
      }
      return val;
    }),
});

// --------------------------------------------------------------------------------
// 3) Esquema para la creación (omitimos campos generados por la base)
// --------------------------------------------------------------------------------
const EstudianteCreateSchema = EstudianteSchema.omit({
  idpersona: true, // Se genera UUID en la base o se asigna internamente
  created_at: true, // Campo manejado por la BD
  updated_at: true, // Campo manejado por la BD
});

// --------------------------------------------------------------------------------
// 4) Esquema para la actualización (permitimos solo ciertos campos)
// --------------------------------------------------------------------------------
const EstudianteUpdateSchema = EstudianteCreateSchema.partial({
  nombre: true,
  apellido: true,
  fechaNacimiento: true,
  dni: true,
  email: true,
  telefono: true,
  domicilio: true,
  telefonoAlternativo: true,
  genero: true,
  discapacidad: true,
  fotoPerfilUrl: true,
  credito: true,
  notaPromedio: true,
  carrera_id: true,
  materiasAprobadas: true,
  fechaIngreso: true,
  estadoAcademico: true,
  becado: true,
});

// --------------------------------------------------------------------------------
// 5) Exportar esquemas
// --------------------------------------------------------------------------------
export {
  EstudianteSchema, // Para lectura completa (incluye idpersona, created_at, updated_at)
  EstudianteCreateSchema, // Para crear nuevos registros (sin idpersona ni timestamps)
  EstudianteUpdateSchema, // Para actualizar campos parciales
};
