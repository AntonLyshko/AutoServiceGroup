import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		exclude: ['lucide-react'],
	},
	server: {
		// Добавляем или изменяем эту секцию
		host: '127.0.0.1', // Указываем Vite использовать 127.0.0.1
		// port: 5173, // Можете также указать порт, если стандартный (5173) не подходит
	},
});
