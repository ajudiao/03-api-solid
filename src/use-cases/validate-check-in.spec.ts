import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";
import { ValidateCheckInUseCase } from "./validate-check-in.js";
import { ResourceNotFoundError } from "./error/resource-not-found-error.js";

let checkInRepository: InMemoryCheckInRepository;
let sut: ValidateCheckInUseCase;

describe("Validate Check-in Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new ValidateCheckInUseCase(checkInRepository);
  });

  it("should be able to validate a check-in", async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(createdCheckIn.validated_at).toEqual(expect.any(Date));

  });

  it("should not be able to validate an inexistent check-in", async () => {
    await expect(() =>
      sut.execute({
        checkInId: "inexistent-check-in-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
