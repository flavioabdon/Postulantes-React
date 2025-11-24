import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,

    // IMPORTANTE: allowedHosts solo para Vite 6+
    allowedHosts: ['serecipeb-subnacionales.duckdns.org'],

    hmr: {
      protocol: 'wss',
      host: 'serecipeb-subnacionales.duckdns.org',
      port: 443,
      clientPort: 443          // ⭐ Evita fallback a localhost:3000
    }
  }
});
