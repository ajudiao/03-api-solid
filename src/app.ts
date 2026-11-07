import fastify from "fastify";
import { appRoutes } from "./http/routes.js";
import { ZodError } from "zod";
import { env } from "./config/env.js";

export const app = fastify();

app.register(appRoutes);


app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({
            error: "Validation failed",
            message: error.issues,
        });
    }

    if (env.NODE_ENV !== "production") {
        console.error(error);
    } else {
        // TODO: Here we should log the error to an external tool like DataDog/NewRelic/Sentry
    }

    return reply.status(500).send({
        error: "Internal server error",
        message: "An unexpected error occurred.",
    }); 
});