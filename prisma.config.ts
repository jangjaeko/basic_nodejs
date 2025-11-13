// Load environment variables from .env
// This is required because Prisma 6 does NOT automatically load .env
import "dotenv/config";

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Path to your main Prisma schema
  schema: "./prisma/schema.prisma",

  // Where migrations will be stored
  migrations: {
    path: "./prisma/migrations",
  },

  // Engine type: "classic" is fine for normal Node.js usage
  engine: "classic",

  // Datasource configuration: use DATABASE_URL from .env
  datasource: {
    url: env("DATABASE_URL"),
    // 필요하면 기본값까지 주고 싶다면:
    // url: env("DATABASE_URL", "file:./dev.db"),
  },
});
