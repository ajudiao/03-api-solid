import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register.js";
import { compare } from "bcryptjs";

describe("Register Use Case", async () => {
  it ("shoud hash user password upon registration", async () => {
    const userRepository = new InMemoryUserRepository();
    const registerUseCase = new RegisterUseCase(userRepository);

    const { user } = await registerUseCase.execute({
      name: "Andre teste",
      email: "teste@gmail.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });
});
