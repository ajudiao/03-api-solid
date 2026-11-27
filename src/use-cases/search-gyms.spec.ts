import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository.js";
import { SearchGymsUseCase } from "./search-gyms.js";

let gymRepository: InMemoryGymRepository;
let sut: SearchGymsUseCase; // system under test

describe("Search Gym Use Case", () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymRepository();
    sut = new SearchGymsUseCase(gymRepository);
  });

  it("should be able to search for gyms by title", async () => {
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

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym" }),
    ]);
  });

  it("should be able to fetch paginated gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        title: `JavaScript Gym ${i}`,
        description: "Some description",
        phone: "123456789",
        latitude: -8.8265542,
        longitude: 13.2565927,
      });
    }

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym 21" }),
      expect.objectContaining({ title: "JavaScript Gym 22" }),
    ]);
  });
});
