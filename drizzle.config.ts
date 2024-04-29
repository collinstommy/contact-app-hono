import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver: "libsql",
  dbCredentials: {
    url: "file:./sqlite.db",
  },
} satisfies Config;
