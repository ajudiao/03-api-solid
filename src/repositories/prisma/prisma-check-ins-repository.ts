import type { CheckIn, Prisma } from "@/generated/prisma/client.js";
import type { CheckInsRepository } from "../check-in-repository.js";
import { prisma } from "@/lib/prisma.js";

export class PrismaCheckInsRepository implements CheckInsRepository {
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    throw new Error("Method not implemented.");
  }
  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return checkIns;
  }
  countByUserId(userId: string): Promise<number> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<CheckIn | null> {
    throw new Error("Method not implemented.");
  }
  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    });

    return checkIn;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({
      data,
    });

    return checkIn;
  }
}
