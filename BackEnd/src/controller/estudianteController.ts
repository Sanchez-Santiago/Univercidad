// src/controllers/EstudianteController.ts
import { ModelDB } from "../interfaces/Model.ts";
import { ControllerInterface } from "../interfaces/ControllerInterface.ts";
import { EstudianteSchema } from "../schemas/estudiante.ts";
import { z } from "https://esm.sh/zod@3.22.4";

export type Estudiante = z.infer<typeof EstudianteSchema>;

export class EstudianteController implements ControllerInterface<Estudiante> {
  constructor(private model: ModelDB<Estudiante>) {}

  /**
   * Obtiene todos los estudiantes con paginación y filtrado opcional
   */
  async getAll(params: {
    name?: string;
    page?: number;
    limit?: number;
    facultad?: string;
    carrera?: string;
  }): Promise<Estudiante[]> {
    try {
      const list = await this.model.getAll(params);
      return list ?? [];
    } catch (err) {
      console.error("[EstudianteController#getAll]", err);
      throw new Error("Error al obtener lista de estudiantes");
    }
  }

  /** Obtiene un estudiante por ID */
  async getById(params: { id: string }): Promise<Estudiante> {
    try {
      const entity = await this.model.getById(params);
      if (!entity) throw new Error("Estudiante no encontrado");
      return entity;
    } catch (err) {
      console.error("[EstudianteController#getById]", err);
      throw new Error("Error al buscar estudiante por ID");
    }
  }

  /** Obtiene un estudiante por email */
  async getByEmail(params: { email: string }): Promise<Estudiante> {
    try {
      const entity = await this.model.getByEmail(params);
      if (!entity) throw new Error("Estudiante no encontrado");
      return entity;
    } catch (err) {
      console.error("[EstudianteController#getByEmail]", err);
      throw new Error("Error al buscar estudiante por email");
    }
  }

  /** Busca estudiantes por nombre con paginación */
  async getByName(params: {
    name: string;
    page?: number;
    limit?: number;
  }): Promise<Estudiante[]> {
    try {
      // Se corrige llamada al método del modelo
      const results = await this.model.getName(params);
      return results ?? [];
    } catch (err) {
      console.error("[EstudianteController#getByName]", err);
      throw new Error("Error al buscar estudiantes por nombre");
    }
  }

  /** Obtiene un estudiante por DNI */
  async getByDni({ dni }: { dni: string }): Promise<Estudiante> {
    try {
      const entity = await this.model.getByDni({ dni });
      if (!entity) throw new Error("Estudiante no encontrado");
      return entity;
    } catch (err) {
      console.error("[EstudianteController#getByDni]", err);
      throw new Error("Error al buscar estudiante por DNI");
    }
  }

  /** Crea un nuevo estudiante */
  async create(params: { data: Estudiante }): Promise<Estudiante> {
    try {
      const input = EstudianteSchema.parse(params);

      if (await this.model.getByDni({ dni: input.dni })) {
        throw new Error("Ya existe un estudiante con este DNI");
      }
      if (await this.model.getByEmail({ email: input.email })) {
        throw new Error("Ya existe un estudiante con este email");
      }

      return await this.model.add({ input });
    } catch (err) {
      console.error("[EstudianteController#create]", err);
      throw err;
    }
  }

  /** Actualiza un estudiante existente */
  async update(params: {
    id: string;
    data: Partial<Estudiante>;
  }): Promise<Estudiante> {
    try {
      const existing = await this.model.getById(params);
      if (!existing) throw new Error("Estudiante no encontrado");
      const esstudiante = EstudianteSchema.parse(params.data);
      return await this.model.update({ id: params.id, input: esstudiante });
    } catch (err) {
      console.error("[EstudianteController#update]", err);
      throw new Error("Error al actualizar estudiante");
    }
  }

  /** Elimina un estudiante */
  async delete({ id }: { id: string }): Promise<{ success: boolean }> {
    try {
      const success = await this.model.delete({ id });
      return { success };
    } catch (err) {
      console.error("[EstudianteController#delete]", err);
      throw new Error("Error al eliminar estudiante");
    }
  }

  /** Busca estudiantes por campo específico */
  async searchByField<K extends keyof Estudiante>({
    field,
    value,
  }: {
    field: K;
    value: Estudiante[K];
  }): Promise<Estudiante[]> {
    try {
      return await this.model.searchByField({ field, value });
    } catch (err) {
      console.error("[EstudianteController#searchByField]", err);
      throw new Error(`Error al buscar por campo ${field}`);
    }
  }
}
