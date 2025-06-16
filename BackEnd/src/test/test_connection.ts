import { assertEquals } from "test";
import { Client } from "mysql";
import { config } from "dotenv";
config({ export: true });

Deno.test("Prueba conexión MySQL Clever Cloud", async () => {
  console.log(`Prueba de conexión MySQL Clever Cloud:
    Lectura de variables de entorno:
    Host: ${Deno.env.get("DB_HOST")}
    Usuario: ${Deno.env.get("DB_USER")}
    Name DB: ${Deno.env.get("DB_NAME")}
    Password: ${Deno.env.get("DB_PASSWORD")}
    puerto: ${Deno.env.get("DB_PORT")}
    URL DB: ${Deno.env.get("DB_URL")}
  `);

  const client = await new Client().connect({
    hostname: Deno.env.get("DB_HOST") ?? "localhost",
    username: Deno.env.get("DB_USER") ?? "root",
    db: Deno.env.get("DB_NAME") ?? "test",
    password: Deno.env.get("DB_PASSWORD") ?? "",
    port: parseInt(Deno.env.get("DB_PORT") ?? "3306"),
  });

  try {
    const result = await client.query("SELECT 1 AS result;");
    assertEquals(result[0].result, 1);
  } finally {
    await client.close();
  }
});
