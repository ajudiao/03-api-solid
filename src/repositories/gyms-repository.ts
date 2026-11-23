import type { Gym, Prisma } from "@/generated/prisma/client.js";


export interface GymsRepository{
    create(data: Prisma.GymCreateInput): Promise<Gym>
    findById(id: string): Promise<Gym | null>
    search({ query, page }: { query: string; page: number }): Promise<Gym[]>
    findManyNearby({ latitude, longitude }: { latitude: number; longitude: number }): Promise<Gym[]>
}