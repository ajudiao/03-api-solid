import { describe, expect, it } from "vitest";
import { compare } from "bcryptjs";

import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { UserAlreadyExistsError } from "@/use-cases/error/user-already-exists-error.js";
import { RegisterUseCase } from "./register.js";
import { string } from "zod";

describe("Register Use Case", () => {
  it("should hash user password upon registration", async () => {
    const userRepository = new InMemoryUserRepository();
    const registerUseCase = new RegisterUseCase(userRepository);

    const { user } = await registerUseCase.execute({
      name: "Andre Teste",
      email: "teste@gmail.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const userRepository = new InMemoryUserRepository();
    const registerUseCase = new RegisterUseCase(userRepository);

    const email = "test@example.com";

    await registerUseCase.execute({
      name: "Andre Teste",
      email,
      password: "123456",
    });

    await expect(
      registerUseCase.execute({
        name: "Andre Teste",
        email,
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it("should be able to register", async () => {
    const userRepository = new InMemoryUserRepository();
    const registerUseCase = new RegisterUseCase(userRepository);

    const { user } = await registerUseCase.execute({
      name: "Andre Teste",
      email: "teste@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });
});
