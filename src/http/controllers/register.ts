import { UserAlreadyExistsError } from "@/use-cases/error/user-already-exists-error.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { makeRegisterUserCase } from "@/use-cases/factories/make-register-use-case.js";
import { registerBodySchema } from "@/schemas/register.js";

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
    const registerUseCase = makeRegisterUserCase();

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
