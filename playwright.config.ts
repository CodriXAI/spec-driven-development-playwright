import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Carga automáticamente las variables del .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
  },
});