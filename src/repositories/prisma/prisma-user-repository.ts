import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "@/lib/prisma.js";
import type { UserRepository } from "../user-repository.js";

export class PrismaUserRepository implements UserRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async findById(id: string) {
    const user = prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }
}
