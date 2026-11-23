import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in.js";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository.js";
import { Decimal } from "@prisma/client/runtime/client.js";
import { MaxDistanceError } from "./error/max-distance-error.js";
import { MaxNumberOfCheckInsError } from "./error/max-number-of-check-ins-error.js";

let checkInRepository: InMemoryCheckInRepository;
let sut: CheckInUseCase; // system under test
let gymsRepository: InMemoryGymRepository;

describe("Check In Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    gymsRepository = new InMemoryGymRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-8.8265542),
      longitude: new Decimal(13.2565927),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    // -8.8265542,13.2565927
    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -8.8265542,
      userLongitude: 13.2565927,
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
    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -8.8265542,
      userLongitude: 13.2565927,
    });

    await expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-01",
        userLatitude: -8.8265542,
        userLongitude: 13.2565927,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice in different days", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0)); // ANO, MES, DIA, HORA, MINUTO, SEGUNDO
    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -8.8265542,
      userLongitude: 13.2565927,
    });

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0)); // ANO, MES, DIA, HORA, MINUTO, SEGUNDO
    const { checkIn: checkIn2 } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -8.8265542,
      userLongitude: 13.2565927,
    });

    expect(checkIn.id).toEqual(expect.any(String));
    expect(checkIn2.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    // -9.0297295,13.2798064
    await gymsRepository.create({
      id: "gym-02",
      title: "TypeScript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-9.0297295),
      longitude: new Decimal(13.2798064),
    });

    // -8.8265542,13.2565927
    await expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-02",
        userLatitude: -8.8265542,
        userLongitude: 13.2565927,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
