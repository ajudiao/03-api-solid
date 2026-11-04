import type { UserRepository } from "@/repositories/prisma/user-repository.js";
import type { RegisterUseCaseRequest } from "@/types/register.js";
import { hash } from "bcryptjs";

export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new Error("Email já existe");
    }

    const passwordHash = await hash(password, 6);

    await this.userRepository.create({
      name,
      email,
      password_hash: passwordHash,
    });
  }
}
