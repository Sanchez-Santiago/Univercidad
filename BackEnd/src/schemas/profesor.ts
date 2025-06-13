import { z } from "https://esm.sh/zod@3.22.4";
import { EmpleadoSchema } from "./empleado.ts";

export const ProfesorSchema = EmpleadoSchema.extend({
  titulo: z.string().min(1),
  departamento: z.string().min(1),
});
