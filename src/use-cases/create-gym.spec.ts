import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository.js";
import { CreateGymUseCase } from "./create-gym.js";

let gymRepository: InMemoryGymRepository;
let sut: CreateGymUseCase; // system under test

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymRepository();
    sut = new CreateGymUseCase(gymRepository);
  });

  it("should be able to create a gym", async () => {
    const { gym } = await sut.execute({
      title: "JavaScript Gym",
        description: "Some description",
        phone: "123456789",
        latitude: -8.8265542,
        longitude: 13.2565927,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
