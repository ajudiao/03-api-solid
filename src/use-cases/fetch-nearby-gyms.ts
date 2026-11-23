import { UserAlreadyExistsError } from "@/use-cases/error/user-already-exists-error.js";
import type { Gym, User } from "@/generated/prisma/client.js";
import type { UserRepository } from "@/repositories/user-repository.js";
import type { RegisterUseCaseRequest } from "@/types/register.js";
import { hash } from "bcryptjs";
import type { GymsRepository } from "@/repositories/gyms-repository.js";

interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
  page: number;
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
    page,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return {
      gyms,
    };
  }
}
