import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";
import { FetchCheckInsHistoryUseCase } from "./fetch-ser-check-ins-history.js";
import { GetUserMetricsUseCase } from "./get-user-metrics.js";

let checkInsRepository: InMemoryCheckInRepository;
let sut: GetUserMetricsUseCase;

describe("Get User Metrics Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("should get user metrics", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-01",
      });
    }

    const { checkInCount } = await sut.execute({
      userId: "user-01",
    });

    expect(checkInCount).toBe(22);
  });
});
 