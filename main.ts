import App from "https://raw.githubusercontent.com/turquoze/turquoze/36d26023cc9b2d0791b2fc0367eba36337a2df59/src/app.ts";
import Container from "https://raw.githubusercontent.com/turquoze/turquoze/36d26023cc9b2d0791b2fc0367eba36337a2df59/src/services/mod.ts";
import dbClient from "https://raw.githubusercontent.com/turquoze/turquoze/36d26023cc9b2d0791b2fc0367eba36337a2df59/src/clients/db.ts";

export const container = new Container(dbClient);
const app = new App(container);

await app.migrate();

if (import.meta.main) {
  Deno.serve({
    hostname: "127.0.0.1",
    port: 8080,
    onListen: ({ hostname, port }) => {
      console.log(`Listening on: http://${hostname}:${port}`);
    },
    onError: (error) => {
      console.log(`error: ${JSON.stringify(error)}`);
      return new Response("Server error", {
        status: 500,
      });
    },
  }, app.router().fetch);
}
