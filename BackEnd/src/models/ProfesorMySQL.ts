import { ModelDB } from "../interfaces/Model.ts";
import { Client } from "mysql";
import { Profesor, ProfesorUpdateInput } from "../schemas/profesor.ts";

export class ProfesorModel implements ModelDB<Profesor> {
  connection: Client;

  constructor(conection: Client) {
    this.connection = conection;
  }

  /**
   * Obtiene todos los estudiantes con opciones de filtrado y paginación
   * @param params - Parámetros de búsqueda y paginación
   * @returns Promise con array de estudiantes o null en caso de error
   */
  async getAll({
    name = "",
    page = 0,
    limit = 15,
    materia = "",
    carrera = "",
    facultad = "",
  }: {
    name?: string;
    page?: number;
    limit?: number;
    materia?: string;
    carrera?: string;
    facultad?: string;
  }): Promise<Profesor[] | null> {
    try {
      const offset = page * limit;
      const results = await this.connection.query(
        `SELECT * FROM estudiante 
         WHERE nombre LIKE ? 
         AND materias_aprobadas LIKE ? 
         AND carrera_id LIKE ? 
         AND facultad_id LIKE ? 
         LIMIT ? OFFSET ?`,
        [
          `%${name}%`,
          `%${materia}%`,
          `%${carrera}%`,
          `%${facultad}%`,
          limit,
          offset,
        ]
      );
      return results as Profesor[];
    } catch (error) {
      console.error("Error en getAll:", error);
      return null;
    }
  }

  /**
   * Busca estudiantes por nombre con paginación
   * @param params - Parámetros de búsqueda
   * @returns Promise con array de estudiantes o null en caso de error
   */
  async getName({
    name = "",
    page = 0,
    limit = 15,
  }: {
    name?: string;
    page?: number;
    limit?: number;
  }): Promise<Profesor[] | null> {
    try {
      const offset = page * limit;
      const results = await this.connection.query(
        "SELECT * FROM estudiante WHERE nombre LIKE ? LIMIT ? OFFSET ?",
        [`%${name}%`, limit, offset]
      );
      return results as Profesor[];
    } catch (error) {
      console.error("Error en getName:", error);
      return null;
    }
  }

  /**
   * Obtiene un estudiante por su ID
   * @param params - Objeto con el ID del estudiante
   * @returns Promise con el estudiante encontrado o null si no existe
   */
  async getById({ id }: { id: string }): Promise<Profesor | null> {
    try {
      const [result] = await this.connection.query(
        "SELECT * FROM estudiante WHERE id = ?",
        [id]
      );
      return result as Profesor;
    } catch (error) {
      console.error("Error en getById:", error);
      return null;
    }
  }

  /**
   * Obtiene un estudiante por su DNI
   * @param params - Objeto con el DNI del estudiante
   * @returns Promise con el estudiante encontrado o null si no existe
   */
  async getByDni({ dni }: { dni: string }): Promise<Profesor | null> {
    try {
      const [result] = await this.connection.query(
        "SELECT * FROM estudiante WHERE dni = ?",
        [dni]
      );
      return result as Profesor;
    } catch (error) {
      console.error("Error en getByDni:", error);
      return null;
    }
  }

  /**
   * Obtiene un estudiante por su email
   * @param params - Objeto con el email del estudiante
   * @returns Promise con el estudiante encontrado o null si no existe
   */
  async getByEmail({ email }: { email: string }): Promise<Profesor | null> {
    try {
      const [result] = await this.connection.query(
        "SELECT * FROM estudiante WHERE email = ?",
        [email]
      );
      return result as Profesor;
    } catch (error) {
      console.error("Error en getByEmail:", error);
      return null;
    }
  }

  /**
   * Agrega un nuevo estudiante a la base de datos
   * @param params - Objeto con los datos del estudiante
   * @returns Promise con el estudiante creado
   */
  async add({ input }: { input: Profesor }): Promise<Profesor> {
    try {
      await this.connection.execute(
        `INSERT INTO estudiante(
          id, nombre, apellido, fecha_nacimiento, dni, 
          email, password, telefono, domicilio, telefono_alternativo, 
          genero, discapacidad, foto_perfil_url, credito, 
          nota_promedio, carrera_id, materias_aprobadas, 
          fecha_ingreso, estado_academico, becado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          input.idpersona,
          input.nombre,
          input.apellido,
          input.fechaNacimiento,
          input.dni,
          input.telefono,
          input.domicilio,
          input.telefonoAlternativo,
          input.genero,
          input.discapacidad,
        ]
      );
      return input;
    } catch (error) {
      console.error("Error en add:", error);
      throw error;
    }
  }

  /**
   * Actualiza un estudiante existente
   * @param params - Objeto con ID y datos a actualizar
   * @returns Promise con el estudiante actualizado
   */
  async update({
    id,
    input,
  }: {
    id: string;
    input: Partial<ProfesorUpdateInput>;
  }): Promise<Profesor> {
    try {
      const fieldMap: Partial<Record<keyof Profesor, string>> = {
        nombre: "nombre",
        apellido: "apellido",
        fechaNacimiento: "fecha_nacimiento",
        dni: "dni",
        telefono: "telefono",
        domicilio: "domicilio",
        telefonoAlternativo: "telefono_alternativo",
        genero: "genero",
        discapacidad: "discapacidad",
        titulo: "titulo",
        departamento: "departamento",
      };

      const setClauses: string[] = [];
      const values: unknown[] = [];

      (Object.keys(input) as Array<keyof ProfesorUpdateInput>).forEach(
        (field) => {
          if (field in fieldMap && input[field] !== undefined) {
            setClauses.push(`${fieldMap[field]} = ?`);
            values.push(input[field]);
          }
        }
      );

      if (setClauses.length === 0) {
        throw new Error("No se proporcionaron campos válidos para actualizar");
      }

      const query = `UPDATE estudiante SET ${setClauses.join(
        ", "
      )} WHERE id = ?`;
      await this.connection.execute(query, [...values, id]);

      const updated = await this.getById({ id });
      if (!updated) {
        throw new Error("Estudiante no encontrado después de actualización");
      }

      return updated;
    } catch (error) {
      console.error("Error en update:", error);
      throw error;
    }
  }

  /**
   * Busca estudiantes por campo y valor específicos
   * @param params - Objeto con campo y valor a buscar
   * @returns Promise con array de estudiantes encontrados
   */
  async searchByField<K extends keyof Profesor>({
    field,
    value,
  }: {
    field: K;
    value: Profesor[K];
  }): Promise<Profesor[]> {
    try {
      const results = await this.connection.query(
        "SELECT * FROM estudiante WHERE ?? = ?",
        [field, value]
      );
      return results as Profesor[];
    } catch (error) {
      console.error("Error en searchByField:", error);
      return [];
    }
  }

  /**
   * Elimina un estudiante por su ID
   * @param params - Objeto con el ID del estudiante
   * @returns Promise que resuelve a true si se eliminó correctamente
   */
  async delete({ id }: { id: string }): Promise<boolean> {
    try {
      await this.connection.execute("DELETE FROM estudiante WHERE id = ?", [
        id,
      ]);
      return true;
    } catch (error) {
      console.error("Error en delete:", error);
      return false;
    }
  }
}
