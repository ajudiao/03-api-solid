import type { CheckIn, Prisma } from "@/generated/prisma/client.js";
import { randomUUID } from "node:crypto";
import type { CheckInsRepository } from "../check-in-repository.js";

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
    const checkInOnSameDate = this.checkIns.find(
      (checkIn) =>
        checkIn.user_id === userId &&
        checkIn.created_at.toDateString() === date.toDateString(),
    );
    return checkInOnSameDate || null;
  }
}
