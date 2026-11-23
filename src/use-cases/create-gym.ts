import { UserAlreadyExistsError } from "@/use-cases/error/user-already-exists-error.js";
import type { Gym, User } from "@/generated/prisma/client.js";
import type { UserRepository } from "@/repositories/user-repository.js";
import type { RegisterUseCaseRequest } from "@/types/register.js";
import { hash } from "bcryptjs";
import type { GymsRepository } from "@/repositories/gyms-repository.js";

interface CreateGymUseCaseRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymUseCaseResponse {
  gym: Gym;
}

export class CreateGymUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return {
      gym,
    };
  }
}
