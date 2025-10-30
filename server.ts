// server.ts - Next.js Standalone + Socket.IO
import { setupSocket } from '@/lib/socket';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const hostname = '127.0.0.1';
const DEFAULT_PORT = 3000;

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    // Create Next.js app
    const nextApp = next({ 
      dev,
      dir: process.cwd(),
      // In production, use the current directory where .next is located
      conf: dev ? undefined : { distDir: './.next' }
    });

    await nextApp.prepare();
    const handle = nextApp.getRequestHandler();

    // Create HTTP server that will handle both Next.js and Socket.IO
    const server = createServer((req, res) => {
      // Skip socket.io requests from Next.js handler
      if (req.url?.startsWith('/api/socketio')) {
        return;
      }
      handle(req, res);
    });

    // Setup Socket.IO
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    setupSocket(io);

    // Start the server with port probing and graceful EADDRINUSE handling
    const envPort = Number(process.env.PORT || DEFAULT_PORT);
    const maxAttempts = 5;

    async function tryListen(port: number, attempt: number): Promise<void> {
      return new Promise((resolve, reject) => {
        server.once('error', (err: any) => {
          if (err?.code === 'EADDRINUSE') {
            console.error(`Port ${port} in use (attempt ${attempt}/${maxAttempts}).`);
            if (attempt < maxAttempts) {
              const nextPort = port + 1;
              console.log(`Retrying on ${nextPort}...`);
              // Important: remove the error listener before retrying
              server.removeAllListeners('error');
              // Try again on next port
              tryListen(nextPort, attempt + 1).then(resolve).catch(reject);
            } else {
              reject(new Error(`Failed to bind after ${maxAttempts} attempts.`));
            }
          } else {
            reject(err);
          }
        });

        server.listen(port, hostname, () => {
          const url = `http://${hostname}:${port}`;
          console.log(`> Ready on ${url}`);
          console.log(`> Socket.IO server running at ws://${hostname}:${port}/api/socketio`);
          // Expose the actual port for other tools if needed
          (process as any).actualPort = port;
          resolve();
        });
      });
    }

    await tryListen(envPort, 1);

  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

// Start the server
createCustomServer();
