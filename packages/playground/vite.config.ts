import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // base needs to be changed for links to work in GitHub pages
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  server: {
    port: 8080,
    open: process.env.NODE_ENV !== 'production',
  }, // maintain the old webpack behavior in dev
  plugins: [react()],
  resolve: {
    preserveSymlinks: true, // Fixes https://github.com/rjsf-team/react-jsonschema-form/issues/3228
    alias: {
      '@aokiapp/rjsf-mantine-theme': path.resolve(__dirname, '../mantine/src'),
      '@aokiapp/rjsf-mantine-corporate': path.resolve(__dirname, '../mantine-corporate/src'),
    },
  },
});
