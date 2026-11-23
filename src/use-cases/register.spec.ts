import { beforeEach, describe, expect, it } from "vitest";
import { compare } from "bcryptjs";

import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { UserAlreadyExistsError } from "@/use-cases/error/user-already-exists-error.js";
import { RegisterUseCase } from "./register.js";

let userRepository: InMemoryUserRepository;
let registerUseCase: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    registerUseCase = new RegisterUseCase(userRepository);
  });

  it("should hash user password upon registration", async () => {
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
    const { user } = await registerUseCase.execute({
      name: "Andre Teste",
      email: "teste@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });
});
