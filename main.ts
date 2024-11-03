import App from "@turquoze/turquoze";
import LibSqlCacheService from "@turquoze/cache";

const app = new App(Deno.env.get("DATABASE_URL")!, {
  sharedSecret: Deno.env.get("SHARED_SECRET")!,
  allowRunMigration: Deno.env.get("RUN_DB_MIGRATION")! == "true",
});

const libsqlCache = new LibSqlCacheService({
  libsql_url: Deno.env.get("LIBSQL_URL")!,
  libsql_auth_token: Deno.env.get("LIBSQL_AUTH_TOKEN")!,
});

app.addCache(libsqlCache);

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
