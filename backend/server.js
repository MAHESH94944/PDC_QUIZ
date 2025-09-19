const dotenv = require("dotenv");
dotenv.config();

const cluster = require("cluster");
const os = require("os");
const http = require("http");

const numCPUs =
  parseInt(process.env.WEB_CONCURRENCY || os.cpus().length, 10) || 1;

// Allow libuv threadpool to be slightly larger when available
try {
  const threads = Math.max(4, Math.floor(numCPUs * 2));
  process.env.UV_THREADPOOL_SIZE = String(threads);
} catch (e) {
  // ignore
}

if (cluster.isPrimary && numCPUs > 1) {
  console.log(`Primary process ${process.pid} — forking ${numCPUs} workers`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.warn(
      `Worker ${worker.process.pid} died (code=${code} signal=${signal}). Restarting...`
    );
    cluster.fork();
  });
} else {
  // worker or single-process mode
  const app = require("./src/app");

  const PORT = process.env.PORT || 5000;
  const server = http.createServer(app);

  // keep connections alive a bit longer to help under high concurrency
  server.keepAliveTimeout = parseInt(
    process.env.KEEP_ALIVE_TIMEOUT_MS || "65000",
    10
  ); // 65s
  server.headersTimeout = parseInt(
    process.env.HEADERS_TIMEOUT_MS || "70000",
    10
  ); // 70s

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (pid=${process.pid})`);
  });
}
