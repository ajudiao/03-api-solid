import { UserAlreadyExistsError } from "@/use-cases/error/user-already-exists-error.js";
import type { Gym, User } from "@/generated/prisma/client.js";
import type { UserRepository } from "@/repositories/user-repository.js";
import type { RegisterUseCaseRequest } from "@/types/register.js";
import { hash } from "bcryptjs";
import type { GymsRepository } from "@/repositories/gyms-repository.js";

interface SearchGymsUseCaseRequest {
 query: string; // Torna mais general, permitindo buscar por qualquer campo
 page: number;
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[];
}

export class SearchGymsUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    query,
    page
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.search({
      query,
      page
    });

    return {
      gyms,
    };
  }
}
    