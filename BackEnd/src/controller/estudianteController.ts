import { ControllerInterface } from "./controllerInterface.ts";
import { z } from "https://esm.sh/zod@3.22.4";
import { EstudianteSchema } from "../schemes/estudiante.ts";
import { EstudianteModel } from "../model/EstudianteModel.ts";

export type Estudiante = z.infer<typeof EstudianteSchema>;

export class EstudianteController implements ControllerInterface<Estudiante> {
  private estudianteModel: EstudianteModel;
  constructor(estudianteModel: EstudianteModel) {
    this.estudianteModel = estudianteModel;
  }

  async getAll(name: string, page: number): Promise<Estudiante[]> {
    if (!page) {
      page = 0;
      const estudiantes = await this.estudianteModel.getAll({ name, page });
      return estudiantes;
    }
    const estudiantes = this.estudianteModel.getName({ name, page });
    return estudiantes;
  }

  async getById({ id }: { id: string }): Promise<Estudiante> {
    const estudiante = await this.estudianteModel.getById({ id });
    if (!estudiante) {
      throw new Error("Estudiante no encontrada");
    }
    return estudiante;
  }

  async getByEmail({ email }: { email: string }): Promise<Estudiante> {
    const estudiante = await this.estudianteModel.getByEmail({ email });
    if (!estudiante) {
      throw new Error("Estudiante no encontrada");
    }
    return estudiante;
  }

  async getByName({ name }: { name: string }): Promise<Estudiante[]> {
    const estudiantes = await this.estudianteModel.getName({ name });
    return estudiantes;
  }

  async getByDni({ dni }: { dni: string }): Promise<Estudiante> {
    const estudiante = await this.estudianteModel.getByDni({ dni });
    if (!estudiante) {
      throw new Error("Estudiante no encontrada");
    }
    return estudiante;
  }

  async create({
    data,
  }: {
    data: z.infer<typeof EstudianteSchema>;
  }): Promise<Estudiante> {
    // Verificar por DNI (campo único)
    if (await this.estudianteModel.getByDni({ dni: data.dni })) {
      throw new Error("Ya existe un estudiante con este DNI");
    }

    // Verificar por email (opcional, si también es único)
    if (await this.estudianteModel.getByEmail({ email: data.email })) {
      throw new Error("Ya existe un estudiante con este email");
    }

    const input = EstudianteSchema.parse(data);
    return this.estudianteModel.add({ input });
  }

  async update({
    id,
    data,
  }: {
    id: string;
    data: Estudiante;
  }): Promise<Estudiante> {
    const estudiante = await this.estudianteModel.getById({ id });
    if (!estudiante) {
      throw new Error("Estudiante no encontrada");
    }
    const input = EstudianteSchema.parse(data);
    this.estudianteModel.update({ id, input });
    return input;
  }

  async delete({ id }: { id: string }): Promise<{ success: boolean }> {
    if (await this.estudianteModel.delete({ id })) {
      return { success: true };
    } else {
      return { success: false };
    }
  }
}
