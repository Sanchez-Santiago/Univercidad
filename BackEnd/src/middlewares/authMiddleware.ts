// middleware/jwtMiddleware.ts
import { jwtVerify } from "jose";
import { Context } from "oak";

/**
 * Middleware que verifica el JWT desde la cookie 'access_token'.
 * Si es válido, guarda los datos del usuario en ctx.state.user
 */
export async function jwtMiddleware(
  ctx: Context,
  next: () => Promise<unknown>
) {
  const token = await ctx.cookies.get("access_token");

  if (!token) {
    ctx.state.user = null;
    return await next();
  }

  const secret = Deno.env.get("JWT_SECRET");
  if (!secret) throw new Error("JWT_SECRET no definido");

  // Convertir la clave a CryptoKey para jose
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  try {
    const { payload } = await jwtVerify(token, key);
    ctx.state.user = payload;
  } catch (error) {
    console.error("Token inválido:", error);
    ctx.state.user = null;
  }

  await next();
}
