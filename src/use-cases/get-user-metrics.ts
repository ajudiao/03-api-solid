import type { CheckIn } from "@/generated/prisma/client.js";
import type { CheckInsRepository } from "@/repositories/check-in-repository.js";
import type { GymsRepository } from "@/repositories/gyms-repository.js";

interface GetUserMetricsUseCaseRequest {
  userId: string;
}

interface GetUserMetricsUseCaseResponse {
  checkInCount: number;
}

export class GetUserMetricsUseCase {
  constructor(private readonly checkinRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInCount = await this.checkinRepository.countByUserId(userId);

    return {
      checkInCount,
    };
  }
}
