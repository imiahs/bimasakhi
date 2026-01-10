import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-mock',
      configureServer(server) {
        server.middlewares.use('/api/create-lead', async (req, res, next) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
              console.log('API MOCK: Received Lead', body);
              try {
                const data = JSON.parse(body);
                // Simulate processing delay
                setTimeout(() => {
                  // Respond with success
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: true,
                    lead_id: 'MOCK_LEAD_' + Date.now(),
                    message: 'Mock Lead Created'
                  }));
                }, 800);
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Split all node_modules into a separate vendor chunk
          }
        }
      }
    }
  }
})
