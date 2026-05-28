import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../../../../.env"),
});

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

export const env = {
  apiPort: Number(process.env.API_PORT ?? 4000),
  databaseUrl,
};
