import { EstudianteModel } from "./EstudianteMySQL.ts";
import { Client } from "mysql";
import { config } from "dotenv";
config({ export: true });

export class Models {
  public estudianteModel!: EstudianteModel;

  constructor() {}

  async init() {
    const client = await new Client().connect({
      hostname: Deno.env.get("DB_HOST") ?? "localhost",
      username: Deno.env.get("DB_USER") ?? "root",
      db: Deno.env.get("DB_NAME") ?? "test",
      password: Deno.env.get("DB_PASSWORD") ?? "",
      port: parseInt(Deno.env.get("DB_PORT") ?? "3306"),
    });

    this.estudianteModel = new EstudianteModel(client); // ✅ modelo real
  }
}
