import { z } from "https://esm.sh/zod@3.22.4";

export const PersonaSchema = z.object({
  idpersona: z.string().uuid({ message: "Debe ser un UUID válido" }).optional(), // Opcional si lo genera la DB, o requerido si viene del cliente

  nombre: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(45, { message: "El nombre no puede superar los 45 caracteres" }),

  apellido: z
    .string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
    .max(45, { message: "El apellido no puede superar los 45 caracteres" }),

  fechaNacimiento: z
    .string()
    .refine(
      (date) => {
        // Validar formato YYYY-MM-DD
        return /^\d{4}-\d{2}-\d{2}$/.test(date);
      },
      { message: "La fecha de nacimiento debe tener formato YYYY-MM-DD" }
    )
    .refine(
      (date) => {
        // Validar que no sea una fecha futura
        const d = new Date(date);
        return d <= new Date();
      },
      { message: "La fecha de nacimiento no puede ser posterior a hoy" }
    ),

  dni: z
    .string()
    .transform((val) => val.trim().replace(/[-\s]/g, ""))
    .refine((val) => /^\d{7,10}$/.test(val), {
      message: "DNI inválido. Debe tener 7-10 dígitos sin guiones/espacios.",
    }),

  email: z
    .string()
    .email({ message: "Debe ser un correo electrónico válido" })
    .max(80, { message: "El email no puede superar los 80 caracteres" }),

  telefono: z.string().regex(/^\d{7,15}$/, {
    message: "El teléfono debe tener entre 7 y 15 dígitos numéricos",
  }),

  domicilio: z
    .string()
    .min(5, { message: "El domicilio debe tener al menos 5 caracteres" })
    .max(100, { message: "El domicilio no puede superar los 100 caracteres" }),

  telefonoAlternativo: z
    .string()
    .regex(/^\d{7,15}$/, {
      message:
        "El teléfono alternativo debe tener entre 7 y 15 dígitos numéricos",
    })
    .nullable()
    .optional(),

  genero: z.enum(["M", "F", "Otro"], {
    errorMap: () => ({ message: "El género debe ser 'M', 'F' o 'Otro'" }),
  }),

  discapacidad: z
    .string()
    .max(100, {
      message: "La descripción de discapacidad no puede superar 100 caracteres",
    })
    .nullable()
    .optional(),

  fotoPerfilUrl: z
    .string()
    .url({ message: "Debe ser una URL válida para la foto de perfil" })
    .max(2083, {
      message: "La URL de la foto no puede superar 2083 caracteres",
    })
    .nullable()
    .optional(),
});
