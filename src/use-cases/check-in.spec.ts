import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./checkin.js";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";

let checkInRepository: InMemoryCheckInRepository;
let sut: CheckInUseCase; // system under test

describe("Check In Use Case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new CheckInUseCase(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {

    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in in the same gym twice", async () => {
    // Etapas do tdd => red, green, refactor
    /*
        red => escrever o teste e ver ele falhar
        green => escrever o código para fazer o teste passar
        refactor => refatorar o código para melhorar a qualidade do código
    */

    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0)); // ANO, MES, DIA, HORA, MINUTO, SEGUNDO
    const { checkIn } =  await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
    });

    await expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-01",
      }),
    ).rejects.toBeInstanceOf(Error);
    
  });

  it("should be able to check in twice in different days", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0)); // ANO, MES, DIA, HORA, MINUTO, SEGUNDO
    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
    });

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0)); // ANO, MES, DIA, HORA, MINUTO, SEGUNDO
    const { checkIn: checkIn2 } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
    expect(checkIn2.id).toEqual(expect.any(String));
  });
});