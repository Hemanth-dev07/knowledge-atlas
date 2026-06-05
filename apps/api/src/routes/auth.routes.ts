import type { FastifyInstance } from "fastify";
import { fromNodeHeaders } from "better-auth/node";

export async function authRoutes(app: FastifyInstance) {
  app.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    async handler(request, reply) {
      try {
        const { auth } = await import("../auth/auth.js");

        const url = new URL(
          request.url,
          `http://${request.headers.host ?? "localhost"}`,
        );

        const headers = fromNodeHeaders(request.headers);
        const authRequest = new Request(url.toString(), {
          method: request.method,
          headers,
          ...(request.body ? { body: JSON.stringify(request.body) } : {}),
        });

        const response = await auth.handler(authRequest);

        reply.status(response.status);
        response.headers.forEach((value, key) => {
          reply.header(key, value);
        });

        return reply.send(response.body ? await response.text() : null);
      } catch (caughtError) {
        request.log.error(caughtError, "Authentication route failed");

        return reply.status(500).send({
          error: "Internal authentication error",
        });
      }
    },
  });
}
