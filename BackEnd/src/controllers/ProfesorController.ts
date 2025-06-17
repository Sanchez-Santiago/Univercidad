// src/controllers/EstudianteController.ts
import { ModelDB } from "../interfaces/Model.ts";
import { ControllerInterface } from "../interfaces/Controller.ts";
import {
  Profesor,
  ProfesorCreateInput,
  ProfesorSchema,
  ProfesorUpdateInput,
} from "../schemas/profesor.ts";
import { ProfesorSrvice } from "../service/ProfesorService.ts";
/**
 * Controller para operaciones CRUD sobre Estudiante.
 * - create usa EstudianteCreateInput
 * - update usa EstudianteUpdateInput
 */
export class ProfesorController
  implements
    ControllerInterface<Profesor, ProfesorCreateInput, ProfesorUpdateInput>
{
  private estudianteSrvice: ProfesorSrvice;
  constructor(private model: ModelDB<Profesor>) {
    this.estudianteSrvice = new ProfesorSrvice(model);
  }

  /**
   * Obtener lista de estudiantes con filtros opcionales
   */
  async getAll(params: {
    name?: string;
    page?: number;
    limit?: number;
    facultad?: string;
    carrera?: string;
  }): Promise<Profesor[]> {
    try {
      const list = await this.estudianteSrvice.getAll(params);
      return list ?? [];
    } catch (err) {
      console.error("[EstudianteController#getAll]", err);
      throw new Error("Error al obtener lista de estudiantes");
    }
  }

  /**
   * Obtener estudiante por ID
   */
  async getById(params: { id: string }): Promise<Profesor> {
    try {
      const entity = await this.estudianteSrvice.getById(params);
      if (!entity) throw new Error("Estudiante no encontrado");
      return entity;
    } catch (err) {
      console.error("[EstudianteController#getById]", err);
      throw new Error("Error al buscar estudiante por ID");
    }
  }

  /**
   * Obtener estudiante por email
   */
  async getByEmail(params: { email: string }): Promise<Profesor> {
    try {
      const entity = await this.estudianteSrvice.getByEmail(params);
      if (!entity) throw new Error("Estudiante no encontrado");
      return entity;
    } catch (err) {
      console.error("[EstudianteController#getByEmail]", err);
      throw new Error("Error al buscar estudiante por email");
    }
  }

  /**
   * Buscar estudiantes por nombre con paginación
   */
  async getByName(params: {
    name: string;
    page?: number;
    limit?: number;
  }): Promise<Profesor[]> {
    try {
      const results = await this.getByName(params);
      return results ?? [];
    } catch (err) {
      console.error("[EstudianteController#getByName]", err);
      throw new Error("Error al buscar estudiantes por nombre");
    }
  }

  /**
   * Obtener estudiante por DNI
   */
  async getByDni(params: { dni: string }): Promise<Profesor> {
    try {
      const dni = params.dni;
      if (!dni) throw new Error("DNI no proporcionado");
      const saved = await this.estudianteSrvice.getByDni({ dni });
      if (!saved) throw new Error("Estudiante no encontrado");
      return saved;
    } catch (err) {
      console.error("[EstudianteController#getByDni]", err);
      throw new Error("Error al buscar estudiante por DNI");
    }
  }

  /**
   * Crear un nuevo estudiante
   * - Valida con EstudianteCreateSchema
   * - Genera idpersona y hashea contraseña
   * - Valida objeto completo con EstudianteSchema
   */
  async create(params: { data: ProfesorCreateInput }): Promise<Profesor> {
    try {
      // 1) Validar solo los campos de creación
      const validData = ProfesorSchema.parse(params.data);

      // 2) Generar UUID para idpersona y hashear contraseña
      const idpersona = crypto.randomUUID();

      // 3) Combinar con id y password, luego validar completo
      const full = ProfesorSchema.parse({
        ...validData,
        idpersona,
      });

      // 4) Chequear duplicados
      if (await this.getByDni({ dni: full.dni })) {
        throw new Error("Ya existe un estudiante con este DNI");
      }

      // 5) Guardar en la base de datos
      return await this.create(params);
    } catch (err) {
      console.error("[EstudianteController#create]", err);
      throw err;
    }
  }

  /**
   * Actualizar un estudiante existente
   * - Merge de existing + cambios parciales
   * - Validar con EstudianteSchema
   * - Hashear nueva contraseña si se provee
   */
  async update(params: {
    id: string;
    data: ProfesorUpdateInput;
  }): Promise<Profesor> {
    try {
      const existing = await this.estudianteSrvice.getById({ id: params.id });
      if (!existing) throw new Error("Estudiante no encontrado");

      // Merge datos
      const merged = { ...existing, ...params.data };
      const validated = ProfesorSchema.parse(merged);

      return await this.estudianteSrvice.update({
        id: params.id,
        data: validated,
      });
    } catch (err) {
      console.error("[EstudianteController#update]", err);
      throw new Error("Error al actualizar estudiante");
    }
  }

  /**
   * Eliminar estudiante por ID
   */
  async delete(params: { id: string }): Promise<boolean> {
    try {
      const success = await this.estudianteSrvice.delete(params);
      return success.success;
    } catch (err) {
      console.error("[EstudianteController#delete]", err);
      throw new Error("Error al eliminar estudiante");
    }
  }

  /**
   * Buscar por campo específico
   */
  async searchByField<K extends keyof Profesor>(params: {
    field: K;
    value: Profesor[K];
  }): Promise<Profesor[]> {
    try {
      return await this.model.searchByField(params);
    } catch (err) {
      console.error("[EstudianteController#searchByField]", err);
      throw new Error(`Error al buscar por campo ${params.field}`);
    }
  }
}
