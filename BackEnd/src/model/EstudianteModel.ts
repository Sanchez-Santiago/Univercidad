import { ModelDB } from "./modelInterface.ts";
import { Estudiante } from "./modelInterface.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";

export class EstudianteModel implements ModelDB<Estudiante> {
  connection: Client;

  constructor() {
    this.connection = new Client(); // instancia inicial
  }

  async init() {
    await this.connection.connect({
      hostname: Deno.env.get("HOST"),
      username: Deno.env.get("USER"),
      db: Deno.env.get("DB"),
      password: Deno.env.get("PASSWORD"),
    });
  }

  async getAll({
    name,
    page,
  }: {
    name?: string;
    page?: number;
  }): Promise<Estudiante[]> {
    if (name) {
      const results = await this.connection.query(
        "SELECT * FROM estudiantes WHERE nombre LIKE ?",
        [`%${name}%`]
      );
      return results as Estudiante[];
    } else {
      const offset = (page ?? 0) * 15;
      const results = await this.connection.query(
        "SELECT * FROM estudiantes LIMIT ?",
        [offset]
      );
      return results as Estudiante[];
    }
  }

  async getName({
    name,
    page,
  }: {
    name: string;
    page?: number;
  }): Promise<Estudiante[]> {
    const results = await this.connection.query(
      "SELECT * FROM estudiantes WHERE nombre LIKE ? limit 15*?",
      [`%${name}%`, page]
    );
    return results as Estudiante[];
  }

  async getById({
    id,
  }: {
    id: string;
  }): Promise<Estudiante | null | undefined> {
    try {
      const [result] = await this.connection.query(
        "SELECT * FROM estudiantes WHERE id = ?",
        [id]
      );
      return result as Estudiante;
    } catch (error) {
      console.log(error);
    }
  }

  async getByDni({
    dni,
  }: {
    dni: string | number;
  }): Promise<Estudiante | null | undefined> {
    try {
      const [result] = await this.connection.query(
        "SELECT * FROM estudiantes WHERE dni = ?",
        [dni]
      );
      return result as Estudiante;
    } catch (error) {
      console.log(error);
    }
  }

  async getByEmail({
    email,
  }: {
    email: string;
  }): Promise<Estudiante | null | undefined> {
    try {
      const [result] = await this.connection.query(
        "SELECT * FROM estudiantes WHERE email = ?",
        [email]
      );
      return result as Estudiante;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async add({ input }: { input: Estudiante }): Promise<Estudiante> {
    try {
      await this.connection.execute(
        "INSERT INTO estudiantes(nombre, apellido, email, telefono, profesor) VALUES (?, ?, ?, ?, ?)",
        [input.nombre, input.apellido, input.email, input.telefono]
      );
      return input;
    } catch (error) {
      console.log(error);
    }
    return input;
  }

  async update({
    id,
    input,
  }: {
    id: string;
    input: Estudiante;
  }): Promise<Estudiante> {
    await this.connection.execute(
      "UPDATE estudiantes SET nombre = ?, apellido = ?, email = ?, telefono = ?, profesor = ? WHERE id = ?",
      [input.nombre, input.apellido, input.email, input.telefono, id]
    );
    return input;
  }

  async delete({ id }: { id: string }): Promise<boolean> {
    await this.connection.execute("DELETE FROM estudiantes WHERE id = ?", [id]);
    return true;
  }
}
