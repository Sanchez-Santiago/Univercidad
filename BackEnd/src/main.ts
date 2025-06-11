import { Application } from "https://deno.land/x/oak/mod.ts";
import profesorRouter from "./router/profesorRouter.ts";
import estudianteRouter from "./router/estudianteRouter.ts";

const app = new Application();

// Obtener el puerto desde una variable de entorno o usar 8000 por defecto
const rawPort = Deno.env.get("PORT");
const PORT = rawPort ? parseInt(rawPort) : 8000;

// Usar los routers definidos
app.use(profesorRouter.routes());
app.use(profesorRouter.allowedMethods());

app.use(estudianteRouter.routes());
app.use(estudianteRouter.allowedMethods());

console.log(`Servidor corriendo en http://localhost:${PORT}`);

await app.listen({ port: PORT });
