import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuracion de Vite para frontend-state en el puerto 5174
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true
  }
});
