import { Router } from "https://deno.land/x/oak/mod.ts";

const profesorRouter = new Router();

profesorRouter.get("/profesores", (ctx) => {
  ctx.response.body = "profesores";
});

profesorRouter.get("/profesor/:id", (ctx) => {
  ctx.response.body = `profesor ${ctx.params.id}`;
});

profesorRouter.post("/profesor/:id", (ctx) => {
  ctx.response.body = "profesor creado";
});

profesorRouter.put("/profesor/:id", (ctx) => {
  ctx.response.body = "profesor actualizado";
});

profesorRouter.delete("/profesor/:id", (ctx) => {
  ctx.response.body = "profesor eliminado";
});

export default profesorRouter;
