import { UserAlreadyExistsError } from "@/error/user-already-exists-error.js";
import type { User } from "@/generated/prisma/client.js";
import type { UserRepository } from "@/repositories/user-repository.js";
import type { RegisterUseCaseRequest } from "@/types/register.js";
import { hash } from "bcryptjs";

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepository) {}
 
  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await hash(password, 6);

    const user = await this.userRepository.create({
      name,
      email,
      password_hash: passwordHash,
    });

    return {
      user,
    };
  }
}
