import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The proxy sends /api requests to the Express server, so the browser
// sees one origin and the login cookie works without CORS setup.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:5000' },
  },
});
