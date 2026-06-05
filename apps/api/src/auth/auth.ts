import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "../config/env.js";
import { db } from "../db/client.js";
import * as schema from "../db/schema.js";

function getAuthSecret() {
  if (!env.betterAuthSecret) {
    throw new Error("BETTER_AUTH_SECRET is not configured");
  }

  return env.betterAuthSecret;
}

export const auth = betterAuth({
  secret: getAuthSecret(),
  baseURL: env.betterAuthUrl,
  trustedOrigins: [env.webAppUrl],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
