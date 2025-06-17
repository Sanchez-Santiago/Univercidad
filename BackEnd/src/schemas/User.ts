import { z } from "zod";
import { PersonaSchema } from "./persona.ts";

export const UserSchema = PersonaSchema.extend({
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .max(300, { message: "La contraseña no puede superar los 300 caracteres" }),
  email: z
    .string()
    .email({ message: "Debe ser un correo electrónico válido" })
    .max(80, { message: "El email no puede superar los 80 caracteres" }),

  fotoPerfilUrl: z
    .string()
    .url({ message: "Debe ser una URL válida para la foto de perfil" })
    .max(2083, {
      message: "La URL de la foto no puede superar 2083 caracteres",
    })
    .nullable()
    .optional(),

  ultimo_login: z.string().datetime(),
  activo: z.boolean(),
});
