import App from "https://raw.githubusercontent.com/turquoze/turquoze/b26a0663197c55ba518fa66224ce3da3d4e21a48/src/app.ts";
import Container from "https://raw.githubusercontent.com/turquoze/turquoze/b26a0663197c55ba518fa66224ce3da3d4e21a48/src/services/mod.ts";
import dbClient from "https://raw.githubusercontent.com/turquoze/turquoze/b26a0663197c55ba518fa66224ce3da3d4e21a48/src/clients/db.ts";
import LibSqlCacheService from "https://raw.githubusercontent.com/turquoze/plugins/f4e21d45858c9a93d37e9d143f3344c12173b3cb/cache/libsql.ts";

if (import.meta.main) {
  const container = new Container(dbClient);
  const app = new App(container);

  await app.migrate();

  const libsqlCache = new LibSqlCacheService({
    libsql_url: Deno.env.get("LIBSQL_URL")!,
    libsql_auth_token: Deno.env.get("LIBSQL_AUTH_TOKEN")!,
  });

  app.addCache(libsqlCache);

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
