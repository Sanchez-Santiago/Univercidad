import { Router } from "oak";
import { EstudianteController } from "../controllers/EstudianteController.ts";
import { ModelDB } from "../interfaces/Model.ts";
import { Estudiante, EstudianteCreateInput } from "../schemas/estudiante.ts";

// Instancia del controladorconst
function RouterEstudiante(estudianteModel: ModelDB<Estudiante>) {
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
    .get("/estudiantes/email/:email", async (ctx) => {
      const email = ctx.params.email;
      const saved = await estudiante.getByEmail({ email });
      ctx.response.status = 200;
      ctx.response.body = saved;
    })
    .get("/estudiantes/name/:name", async (ctx) => {
      const name = ctx.params.name;
      const saved = await estudiante.getByName({ name });
      ctx.response.status = 200;
      ctx.response.body = saved;
    })
    .get("/estudiantes/dni/:dni", async (ctx) => {
      const dni = ctx.params.dni;
      const saved = await estudiante.getByDni({ dni });
      ctx.response.status = 200;
      ctx.response.body = saved;
    })
    .get("/estudiantes/email/:email", async (ctx) => {
      const email = ctx.params.email;
      const saved = await estudiante.getByEmail({ email });
      ctx.response.status = 200;
      ctx.response.body = saved;
    })
    .post("/estudiantes", async (ctx) => {
      try {
        const body = ctx.request.body.json();
        const data = (await body) as EstudianteCreateInput;

        if (!data || Object.keys(data).length === 0) {
          ctx.response.status = 400;
          ctx.response.body = { error: "No hay body o está vacío" };
          return;
        }

        const saved = await estudiante.create({ data });

        ctx.response.status = 201;
        ctx.response.body = saved;
      } catch (error) {
        console.error("Error al crear estudiante:", error);
        ctx.response.status = 500;
        ctx.response.body = { error: "Internal Server Error" };
      }
    })

    .put(
      "/estudiantes/:id",
      controllerAdapter(estudiante.update.bind(estudiante), async (ctx) => {
        const id = ctx.params.id!;
        const body = await ctx.request.body({ type: "json" }).value;
        return { id, data: body };
      })
    )
    .delete(
      "/estudiantes/:id",
      controllerAdapter(estudiante.delete.bind(estudiante), (ctx) => ({
        id: ctx.params.id!,
      }))
    );
  // ).get("/estudiantes/search/:field/:value", async (ctx) => {
  //   const field = ctx.params.field;
  //   const value = ctx.params.value;
  //   const saved = await estudiante.searchByField(params: { field, value });
  //   ctx.response.status = 200;
  //   ctx.response.body = saved;
  // });

  return estudianteRouter;
}
export default RouterEstudiante;
