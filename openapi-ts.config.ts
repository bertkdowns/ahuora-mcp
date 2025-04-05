import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'db_schema.yml',
  output: 'gen_api',
  plugins: ['@hey-api/client-fetch',    'zod'],
});