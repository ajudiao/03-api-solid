import type { CheckIn, Prisma } from "@/generated/prisma/client.js";
import { randomUUID } from "node:crypto";
import type { CheckInsRepository } from "../check-in-repository.js";
import dayjs from "dayjs";

export class InMemoryCheckInRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      created_at: new Date(),
      validated_at: data.validated_at ? new Date() : null,
      user_id: data.user_id,
      gym_id: data.gym_id,
    };

    this.checkIns.push(checkIn);
    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDate = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return checkIn.user_id === userId && isOnSameDate;
    });
    return checkInOnSameDate || null;
  }

  async findManyByUserId(userId: string, page: number) {
    return this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async countByUserId(userId: string) {
    return this.checkIns.filter((checkIn) => checkIn.user_id === userId).length;
  }

  async findById(id: string) {
    const checkIn = this.checkIns.find((checkIn) => checkIn.id === id);
    return checkIn || null;
  }

  async save(checkIn: CheckIn) {
    const index = this.checkIns.findIndex((c) => c.id === checkIn.id);
    if (index !== -1) {
      this.checkIns[index] = checkIn; 
    }
    return checkIn;
  }
}
