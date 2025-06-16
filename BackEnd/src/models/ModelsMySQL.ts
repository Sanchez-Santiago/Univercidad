import { EstudianteModel } from "./EstudianteMySQL.ts";
import { Client } from "mysql";
import { config } from "dotenv";
config({ export: true });

export class Models {
  public estudianteModel!: EstudianteModel;

  constructor() {}

  async init() {
    const url = new URL(Deno.env.get("DB_URL")!);
    const client = await new Client().connect({
      hostname: Deno.env.get("DB_HOST")!,
      username: Deno.env.get("DB_USER")!,
      password: Deno.env.get("DB_PASSWORD")!,
      db: url.pathname.substring(1), // Elimina la primera "/"
      port: parseInt(url.port),
    });

    this.estudianteModel = new EstudianteModel(client); // ✅ modelo real
  }
}
