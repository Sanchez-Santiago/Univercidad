import { Application } from "oak";
import estudianteRouter from "./router/estudianteRouter.ts";
import routerHome from "./router/routerHome.ts";
import { Models } from "./models/ModelsMySQL.ts";

// Instanciar los modelos
const models = new Models();
await models.init(); // 👈 MUY IMPORTANTE
const estudianteModel = models.estudianteModel;
if (
  !models.estudianteModel ||
  typeof models.estudianteModel.getAll !== "function"
) {
  throw new Error("EstudianteModel no fue inicializado correctamente");
}

const app = new Application();

// Obtener el puerto desde una variable de entorno o usar 8000 por defecto
const rawPort = Deno.env.get("PORT");
const PORT = rawPort ? parseInt(rawPort) : 8000;

// Usar los routers definidos
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.use(routerHome.routes());
app.use(routerHome.allowedMethods());

app.use(estudianteRouter(estudianteModel).routes());
app.use(estudianteRouter(estudianteModel).allowedMethods());

console.log(`Servidor corriendo en http://localhost:${PORT}`);

await app.listen({ port: PORT });
