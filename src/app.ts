import fastify from "fastify";
import z from "zod";
import { prisma } from "./lib/prisma.js";

export const app = fastify();

app.post("/users", async (request, reply) => {
  const registerBodyShema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  });
  const validation = registerBodyShema.safeParse(request.body);
  if (!validation.success) {
    return reply.status(400).send({
      error: "Formato invalido",
      messge: validation.error.issues,
    });
  }

  const { name, email, password } = validation.data;

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password,
    },
  });

  return reply.status(201).send();
});
