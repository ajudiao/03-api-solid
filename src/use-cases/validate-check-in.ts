import type { UserRepository } from "@/repositories/user-repository.js";
import type { CheckIn } from "@/generated/prisma/client.js";
import type { CheckInsRepository } from "@/repositories/check-in-repository.js";
import type { GymsRepository } from "@/repositories/gyms-repository.js";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinate.js";
import { MaxDistanceError } from "./error/max-distance-error.js";
import { MaxNumberOfCheckInsError } from "./error/max-number-of-check-ins-error.js";
import { ResourceNotFoundError } from "./error/resource-not-found-error.js";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./error/late-check-in-validation-error.js";

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private readonly checkinRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkinRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minutes",
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date();

    await this.checkinRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
