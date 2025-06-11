import { z } from "https://esm.sh/zod@3.22.4";
import { EstudianteSchema } from "../schemes/estudiante.ts";
import { ProfesorSchema } from "../schemes/profesor.ts";

export type Estudiante = z.infer<typeof EstudianteSchema>;
export type Profesor = z.infer<typeof ProfesorSchema>;

export interface ModelDB<T> {
  connection: unknown;

  getAll: ({ name, page }: { name?: string; page?: number }) => Promise<T[]>;

  getName: ({ name, page }: { name: string; page?: number }) => Promise<T[]>;

  getByDni: ({ dni }: { dni: number }) => Promise<T | null | undefined>;

  getByEmail: ({ email }: { email: string }) => Promise<T | null | undefined>;

  getById: ({ id }: { id: string }) => Promise<T | null | undefined>;

  add: ({ input }: { input: T }) => Promise<T>;

  update: ({ id, input }: { id: string; input: T }) => Promise<T>;

  delete: ({ id }: { id: string }) => Promise<boolean>;
}
