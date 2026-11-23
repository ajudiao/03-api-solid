import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { authenticateSchema } from "@/validators/authencate.js";
import { AuthenticateUseCase } from "@/use-cases/authenticate.js";
import { InvalidCredentialsError } from "@/use-cases/error/invalid-credentials-erros.js";
import { makeAutenticateUseCase } from "@/use-cases/factories/make-authentica-use-case.js";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodyValidation = authenticateSchema.safeParse(request.body);
  if (!bodyValidation.success) {
    return reply.status(400).send({
      error: "Formato invalido",
      message: bodyValidation.error.issues,
    });
  }

  const { email, password } = bodyValidation.data;

  try {
    const registerUseCase = makeAutenticateUseCase();

    await registerUseCase.execute({
      email,
      password,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({
        error: error.name,
        message: error.message,
      });
    }

    throw error;
  }

  return reply.status(200).send();
}
