import Server from "server";

/**
 * Main function (ie. entry point of the application)
 */
(async () => {
  const server: Server = new Server(parseInt(process.env.PORT) || 8080);
  //  Run server setup
  await server.setup();
  //  Start server
  server.start();
})();
