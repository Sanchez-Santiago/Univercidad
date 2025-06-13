import { Router } from "https://deno.land/x/oak/mod.ts";
import { EstudianteController } from "../controller/estudianteController.ts";
import { EstudianteModel } from "../models/EstudianteModel.ts";

// Instancia del controladorconst
const estudianteModel = new EstudianteModel();
const estudiante = new EstudianteController(estudianteModel);

// Adaptador genérico para métodos de controlador
function controllerAdapter<T>(
  handler: (params: T) => Promise<unknown>,
  extractParams: (ctx: any) => Promise<T> | T
) {
  return async (ctx: any) => {
    try {
      const params = await extractParams(ctx);
      const result = await handler(params);
      ctx.response.status = 200;
      ctx.response.body = result;
    } catch (error) {
      console.error("Error en controllerAdapter:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal Server Error" };
    }
  };
}

// Definición del router con middlewares compatibles
const estudianteRouter = new Router();

estudianteRouter
  .get(
    "/estudiantes",
    controllerAdapter(estudiante.getAll.bind(estudiante), (ctx) => {
      const q = ctx.request.url.searchParams;
      return {
        name: q.get("name") ?? undefined,
        page: q.has("page") ? Number(q.get("page")) : undefined,
        limit: q.has("limit") ? Number(q.get("limit")) : undefined,
        facultad: q.get("facultad") ?? undefined,
        carrera: q.get("carrera") ?? undefined,
      };
    })
  )
  .get(
    "/estudiantes/:id",
    controllerAdapter(estudiante.getById.bind(estudiante), (ctx) => ({
      id: ctx.params.id!,
    }))
  )
  .post(
    "/estudiantes",
    controllerAdapter(estudiante.create.bind(estudiante), async (ctx) => {
      const body = ctx.request.body({ type: "json" });
      const data = await body.value;
      return { data };
    })
  )
  .put(
    "/estudiantes/:id",
    controllerAdapter(estudiante.update.bind(estudiante), async (ctx) => {
      const id = ctx.params.id!;
      const body = ctx.request.body({ type: "json" });
      const data = await body.value;
      return { id, data };
    })
  )
  .delete(
    "/estudiantes/:id",
    controllerAdapter(estudiante.delete.bind(estudiante), (ctx) => ({
      id: ctx.params.id!,
    }))
  );

export default estudianteRouter;
