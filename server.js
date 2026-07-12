const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./database/connection");
const seedIfEmpty = require("./database/seedIfEmpty");
const initSocket = require("./socket");
const { port } = require("./config/env");

const startServer = async () => {
  await connectDB();

  const seedResult = await seedIfEmpty();
  if (seedResult.seeded) {
    console.log(`Auto-seeded: ${seedResult.users} users, ${seedResult.services} services`);
  } else {
    console.log(`Database ready: ${seedResult.services} services, ${seedResult.users} users`);
  }

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }
  });

  initSocket(io);

  server.listen(port, () => {
    console.log(`Smart Service Marketplace running on port ${port}`);
    console.log(`REST API: http://localhost:${port}`);
    console.log(`Socket.io: connected on same port`);
  });
};

startServer();
