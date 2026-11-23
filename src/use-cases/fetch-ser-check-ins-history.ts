import type { CheckIn } from "@/generated/prisma/client.js";
import type { CheckInsRepository } from "@/repositories/check-in-repository.js";
import type { GymsRepository } from "@/repositories/gyms-repository.js";

interface FetchCheckInsHistoryUseCaseRequest {
  userId: string;
  page: number;
}

interface FetchCheckInsHistoryUseCaseResponse {
  checkIn: CheckIn[];
}

export class FetchCheckInsHistoryUseCase {
  constructor(private readonly checkinRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchCheckInsHistoryUseCaseRequest): Promise<FetchCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkinRepository.findManyByUserId(
      userId,
      page,
    );

    return {
      checkIn: checkIns,
    };
  }
}
