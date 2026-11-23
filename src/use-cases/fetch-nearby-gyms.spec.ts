import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository.js";
import { CreateGymUseCase } from "./create-gym.js";
import { SearchGymsUseCase } from "./search-gyms.js";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms.js";

let gymRepository: InMemoryGymRepository;
let sut: FetchNearbyGymsUseCase; // system under test

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymRepository();
    sut = new FetchNearbyGymsUseCase(gymRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymRepository.create({
      title: "JavaScript Gym",
      description: "Some description",
      phone: "123456789",
      latitude: -8.8265542,
      longitude: 13.2565927,
    });

    await gymRepository.create({
      title: "TypeScript Gym",
      description: "Some description",
      phone: "123456789",
      latitude: -8.8265542,
      longitude: 13.2565927,
    });
     await gymRepository.create({
      title: "Python Gym",
      description: "Some description",
      phone: "123456789",
      latitude: -20.8265542,
      longitude: 13.2565927,
    });


    const { gyms } = await sut.execute({
      userLatitude: -8.8265542,
      userLongitude: 13.2565927,
      page: 1,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym" }),
      expect.objectContaining({ title: "TypeScript Gym" }),
    ]);

  });
});
