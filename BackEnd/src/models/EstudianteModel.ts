import { ModelDB } from "../interfaces/Model.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { Estudiante, EstudianteUpdateInput } from "../schemas/estudiante.ts";

export class EstudianteModel implements ModelDB<Estudiante> {
  connection: Client;

  constructor() {
    this.connection = new Client();
    this.connection.connect({
      hostname: Deno.env.get("DB_HOST"),
      username: Deno.env.get("DB_USER"),
      db: Deno.env.get("DB_NAME"),
      password: Deno.env.get("DB_PASSWORD"),
    });
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
  }): Promise<Estudiante[] | null> {
    try {
      const offset = page * limit;
      const results = await this.connection.query(
        `SELECT * FROM estudiantes 
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
      return results as Estudiante[];
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
  }): Promise<Estudiante[] | null> {
    try {
      const offset = page * limit;
      const results = await this.connection.query(
        "SELECT * FROM estudiantes WHERE nombre LIKE ? LIMIT ? OFFSET ?",
        [`%${name}%`, limit, offset]
      );
      return results as Estudiante[];
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
  async getById({ id }: { id: string }): Promise<Estudiante | null> {
    try {
      const [result] = await this.connection.query(
        "SELECT * FROM estudiantes WHERE id = ?",
        [id]
      );
      return result as Estudiante;
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
  async getByDni({ dni }: { dni: string }): Promise<Estudiante | null> {
    try {
      const [result] = await this.connection.query(
        "SELECT * FROM estudiantes WHERE dni = ?",
        [dni]
      );
      return result as Estudiante;
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
  async getByEmail({ email }: { email: string }): Promise<Estudiante | null> {
    try {
      const [result] = await this.connection.query(
        "SELECT * FROM estudiantes WHERE email = ?",
        [email]
      );
      return result as Estudiante;
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
  async add({ input }: { input: Estudiante }): Promise<Estudiante> {
    try {
      await this.connection.execute(
        `INSERT INTO estudiantes(
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
          input.email,
          input.password,
          input.telefono,
          input.domicilio,
          input.telefonoAlternativo,
          input.genero,
          input.discapacidad,
          input.fotoPerfilUrl,
          input.credito,
          input.notaPromedio,
          input.carrera_id,
          input.materiasAprobadas,
          input.fechaIngreso,
          input.estadoAcademico,
          input.becado,
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
    input: Partial<EstudianteUpdateInput>;
  }): Promise<Estudiante> {
    try {
      const fieldMap: Record<keyof Estudiante, string> = {
        idpersona: "idpersona",
        nombre: "nombre",
        apellido: "apellido",
        fechaNacimiento: "fecha_nacimiento",
        dni: "dni",
        email: "email",
        password: "password",
        telefono: "telefono",
        domicilio: "domicilio",
        telefonoAlternativo: "telefono_alternativo",
        genero: "genero",
        discapacidad: "discapacidad",
        fotoPerfilUrl: "foto_perfil_url",
        credito: "credito",
        notaPromedio: "nota_promedio",
        carrera_id: "carrera_id",
        materiasAprobadas: "materias_aprobadas",
        fechaIngreso: "fecha_ingreso",
        estadoAcademico: "estado_academico",
        becado: "becado",
      };

      const setClauses: string[] = [];
      const values: unknown[] = [];

      (Object.keys(input) as Array<keyof EstudianteUpdateInput>).forEach(
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

      const query = `UPDATE estudiantes SET ${setClauses.join(
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
  async searchByField<K extends keyof Estudiante>({
    field,
    value,
  }: {
    field: K;
    value: Estudiante[K];
  }): Promise<Estudiante[]> {
    try {
      const results = await this.connection.query(
        "SELECT * FROM estudiantes WHERE ?? = ?",
        [field, value]
      );
      return results as Estudiante[];
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
      await this.connection.execute("DELETE FROM estudiantes WHERE id = ?", [
        id,
      ]);
      return true;
    } catch (error) {
      console.error("Error en delete:", error);
      return false;
    }
  }
}
