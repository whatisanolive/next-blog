import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
import path from 'path';

// Manually point to .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export default defineConfig({
  datasource: {
    url: process.env.DIRECT_URL,
  },
});

// generator client {
//   provider = "prisma-client-js"
// }

// datasource db {
//   provider  = "postgresql"
//   url       = env("DATABASE_URL")
//   directUrl = env("DIRECT_URL")
// }