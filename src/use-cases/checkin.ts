import type { UserRepository } from "@/repositories/user-repository.js";
import type { CheckIn } from "@/generated/prisma/client.js";
import type { CheckInsRepository } from "@/repositories/check-in-repository.js";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(private readonly checkinRepository: CheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkInOnSameDate = await this.checkinRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDate) {
      throw new Error("User has already checked in today.");
    }

    const checkIn = await this.checkinRepository.create({
      user_id: userId,
      gym_id: gymId,
    });
    
    return {
      checkIn,
    };
  }
}
