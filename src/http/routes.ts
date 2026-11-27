import type { FastifyInstance } from "fastify";
import { register } from "./controllers/register.js";
import { authenticate } from "./controllers/authenticate.js";
import { getUserProfile } from "./controllers/get-user-profile.js";

export async function appRoutes(app: FastifyInstance) {
  app.get("/users/:id", getUserProfile);
  app.post("/users", register);
  app.post("/sessions", authenticate);
}
