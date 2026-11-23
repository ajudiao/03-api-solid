import type { UserRepository } from "@/repositories/user-repository.js";
import type { CheckIn } from "@/generated/prisma/client.js";
import type { CheckInsRepository } from "@/repositories/check-in-repository.js";
import type { GymsRepository } from "@/repositories/gyms-repository.js";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinate.js";
import { MaxDistanceError } from "./error/max-distance-error.js";
import { MaxNumberOfCheckInsError } from "./error/max-number-of-check-ins-error.js";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private readonly checkinRepository: CheckInsRepository,
    private readonly gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new MaxDistanceError();
    }

    // calculate the distance between the user and the gym
    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1; // 100 meters

    if(distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDate = await this.checkinRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError();
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
