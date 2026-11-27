import { ResourceNotFoundError } from "@/use-cases/error/resource-not-found-error.js";
import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getUserProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const schemaRequestId = z.object({
    id: z.uuid(),
  });

  const validation = schemaRequestId.safeParse(request.params);

  if (!validation.success) {
    return reply.status(401).send({
      error: validation.error,
      message: validation.error.issues,
    });
  }

  const { id } = validation.data;

  try {
    const userRepository = makeGetUserProfileUseCase();

    const data = await userRepository.execute({
      userId: id,
    });

    return reply.status(200).send({
        data
    })

  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      throw new ResourceNotFoundError();
    }

    throw Error();
  }
}
