import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  CLIENT: z.enum(["pg", "mysql", "sqlite"]).default("pg"),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌️ Invalid environment variables", z.treeifyError(_env.error));
  process.exit(1);
}

export const env = _env.data;
