const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Error handler
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      // Parse URL
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // Health check endpoint
      if (pathname === '/health') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: process.env.NODE_ENV,
          version: process.env.npm_package_version || '1.0.0'
        }));
        return;
      }

      // Handle Next.js requests
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
      }));
    }
  });

  // Set server timeout
  server.timeout = 30000;
  server.keepAliveTimeout = 5000;
  server.headersTimeout = 6000;

  server
    .once("error", (err) => {
      console.error("Server error:", err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Environment: ${process.env.NODE_ENV}`);
      console.log(`> Process ID: ${process.pid}`);
    });
});
