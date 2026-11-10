import { UserAlreadyExistsError } from "@/use-cases/error/user-already-exists-error.js";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository.js";
import { RegisterUseCase } from "@/use-cases/register.js";
import { registerBodySchema } from "@/validators/register.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const bodyValidation = registerBodySchema.safeParse(request.body);
  if (!bodyValidation.success) {
    return reply.status(400).send({
      error: "Formato invalido",
      message: bodyValidation.error.issues,
    });
  }

  const { name, email, password } = bodyValidation.data;

  try {
    const userRepository = new PrismaUserRepository();
    const registerUseCase = new RegisterUseCase(userRepository);

    await registerUseCase.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        error: error.name,
        message: error.message,
      });
    }

    throw error;
  }

  return reply.status(201).send();
}
