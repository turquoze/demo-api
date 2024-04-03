import App from "https://raw.githubusercontent.com/turquoze/turquoze/5a75fcf9fe38d8d9b75bbb6236b8f5e9819723e0/src/app.ts";
import LibSqlCacheService from "https://raw.githubusercontent.com/turquoze/plugins/f4e21d45858c9a93d37e9d143f3344c12173b3cb/cache/libsql.ts";

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
