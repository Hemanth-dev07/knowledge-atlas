import "dotenv/config";

export const env = {
  apiPort: Number(process.env.API_PORT ?? 4000),
};
