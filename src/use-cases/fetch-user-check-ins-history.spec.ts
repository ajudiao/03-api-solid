import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";
import { FetchCheckInsHistoryUseCase } from "./fetch-ser-check-ins-history.js";

let checkInsRepository: InMemoryCheckInRepository;
let sut: FetchCheckInsHistoryUseCase;

describe("Fetch Check Ins History Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInRepository();
    sut = new FetchCheckInsHistoryUseCase(checkInsRepository);
  });

  it("should fetch check-ins history for a user", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-01",
      });
    }

    const { checkIn } = await sut.execute({
      userId: "user-01",
      page: 2,
    });

    expect(checkIn).toHaveLength(2);
    expect(checkIn).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
