import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository.js";
import { AuthenticateUseCase } from "../authenticate.js";

export function makeAutenticateUseCase() {
  const userRepository = new PrismaUserRepository();
  const authenticateUseCase = new AuthenticateUseCase(userRepository);

  return authenticateUseCase;
}
