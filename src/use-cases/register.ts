import { prisma } from "@/lib/prisma.js";
import { PrismaUserRepository } from "@/repositories/prisma-users-repository.js";
import type { RegisterServiceRequest } from "@/types/register.js";
import { hash } from "bcryptjs";
import { any } from "zod";




export class RegisterUseCase {
  private userRepository = any

  constructor(userRepository: any){
    this.userRepository = userRepository
  }

  async execute({
  name,
  email,
  password,
}: RegisterServiceRequest) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userWithSameEmail) {
    throw new Error("Email já existe");
  }

  const password_hash = await hash(password, 6);

  await this.userRepository.create({
    name,
    email,
    password_hash
  })

}

}
