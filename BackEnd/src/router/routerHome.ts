import { Router } from "https://deno.land/x/oak/mod.ts";

const routerHome = new Router();

routerHome.get("/", (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = { message: "Hola mundo" };
});

export default routerHome;
