import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository.js";
import { GetUserProfileUseCase } from "../get-user-profile.js";


export function makeGetUserProfileUseCase() {
    const userRepository = new PrismaUserRepository();
    const getUserProfile = new GetUserProfileUseCase(userRepository);


    return getUserProfile;
}