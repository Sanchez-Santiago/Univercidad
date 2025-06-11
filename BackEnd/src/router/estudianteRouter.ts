import { Router } from "https://deno.land/x/oak/mod.ts";

const estudianteRouter = new Router();

estudianteRouter.get("/estudiantes", (ctx) => {
  ctx.response.body = "estudiantes";
});

estudianteRouter.get("/estudiantes/:id", (ctx) => {
  ctx.response.body = `estudiante ${ctx.params.id}`;
});

estudianteRouter.post("/estudiantes/:id", (ctx) => {
  ctx.response.body = "estudiante creado";
});

estudianteRouter.put("/estudiantes/:id", (ctx) => {
  ctx.response.body = "estudiante actualizado";
});

estudianteRouter.delete("/estudiantes/:id", (ctx) => {
  ctx.response.body = "estudiante eliminado";
});

export default estudianteRouter;
