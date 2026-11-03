import { prisma } from "@/lib/prisma.js";
import { PrismaUserRepository } from "@/repositories/prisma-users-repository.js";
import { RegisterUseCase } from "@/use-cases/register.js";
import { registerBodySchema } from "@/validators/register.js";
import { hash } from "bcryptjs";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const validation = registerBodySchema.safeParse(request.body);
  if (!validation.success) {
    return reply.status(400).send({
      error: "Formato invalido",
      message: validation.error.issues,
    });
  }

  const { name, email, password } = validation.data;
  const prismaUserRepository = new PrismaUserRepository()
  const registerUseCase= new RegisterUseCase(prismaUserRepository)

  try {
    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (error) {
    return reply.status(409).send()
  }

}
