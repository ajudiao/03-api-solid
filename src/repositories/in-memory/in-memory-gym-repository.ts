import { type Gym, Prisma } from "@/generated/prisma/client.js";
import type { GymsRepository } from "../gyms-repository.js";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinate.js";

export class InMemoryGymRepository implements GymsRepository {
  public items: Gym[] = [];

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? crypto.randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    };

    this.items.push(gym);

    return gym;
  }
  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id);

    if (!gym) {
      return null;
    }
    return gym;
  }

  async search({
    query,
    page,
  }: {
    query: string;
    page: number;
  }): Promise<Gym[]> {
    const gyms = this.items.filter((gym) => {
      return gym.title.toLowerCase().includes(query.toLowerCase());
    });

    const startIndex = (page - 1) * 20;
    const endIndex = page * 20;

    return gyms.slice(startIndex, endIndex);
  }

  async findManyNearby({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }): Promise<Gym[]> {
    // Implement logic to find gyms nearby based on latitude and longitude
    // For simplicity, this example returns all gyms without filtering by distance

    return this.items.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
       {latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()}, {latitude: latitude, longitude: longitude}
      );
      return distance <= 10; // Example threshold for nearby gyms
    });
  }
}
