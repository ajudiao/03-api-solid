import { describe, expect, it } from "vitest";
import { hash } from "bcryptjs";

import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { AuthenticateUseCase } from "./authenticate.js";
import { InvalidCredentialsError } from "./error/invalid-credentials-erros.js";

describe("Authenticate Use Case", () => {
  it("should be able to authenticate", async () => {
    const userRepository = new InMemoryUserRepository();
    // const authenticateUseCase = new RegisterUseCase(userRepository);
    const sut = new AuthenticateUseCase(userRepository); // system under test

    await userRepository.create({
      name: "Test",
      email: "test@gmail.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "test@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should be not able to authenticate with wrong email", async () => {
    const userRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUseCase(userRepository);

    await expect(
      sut.execute({
        email: "testwrong@gmail.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    const userRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUseCase(userRepository);

    await userRepository.create({
      name: "Test",
      email: "test@gmail.com",
      password_hash: await hash("123456", 6),
    });

    await expect(
      sut.execute({
        email: "test@gmail.com",
        password: "123123",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
