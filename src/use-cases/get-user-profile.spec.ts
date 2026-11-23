import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";

import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { GetUserProfileUseCase } from "./get-user-profile.js";
import { ResourceNotFoundError } from "./error/resource-not-found-error.js";

let userRepository: InMemoryUserRepository;
let getUserProfileUseCase: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
  });

  it("should return the user profile", async () => {
    const createdUser = await userRepository.create({
      name: "Test",
      email: "test@gmail.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await getUserProfileUseCase.execute({
      userId: createdUser.id,
    });

    expect(user.name).toEqual("Test");
  });

  it("should not find a user profile with a non-existing id", async () => {
    await expect(
      getUserProfileUseCase.execute({
        userId: "not-existing-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
