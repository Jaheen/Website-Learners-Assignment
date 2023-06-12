import * as express from "express";
import { Server as HTTPServer } from "http";
import * as dotenv from "dotenv";
import Database from "database";
import { APIRouter, AuthRouter, DocsRouter } from "routers";
import { initAndSyncModels } from "models";
import { Sequelize } from "sequelize";

/**
 * Server class that orchestrates the application
 */
export default class Server {
  /**
   * PORT Number in which the server needs to be started
   */
  private PORT: number;

  /**
   * Express Application instance
   */
  private application: express.Application;

  /**
   * Http server instance that uses the application instance as handler
   */
  private httpServer: HTTPServer;

  constructor(port: number) {
    this.PORT = port;
    this.application = express();
    this.httpServer = new HTTPServer(this.application);
  }

  /**
   * Set up the server by initializing database, routers and others
   */
  async setup() {
    // active dotenv only in dev environment
    if (process.env.NODE_ENV !== "PROD") dotenv.config();

    // Initialize database
    Database.initDatabase()
      .then((_) => {
        console.log("Connected to database successfully");

        // sync Models with databse after successful database connection
        const connection: Sequelize = Database.getConnection();

        // init and sync with database
        initAndSyncModels(connection);
      })
      .catch(console.log);

    // map top level routes with router
    this.application.use("/auth", AuthRouter);
    this.application.use("/api", APIRouter);
    this.application.use("/api-docs", DocsRouter);
    // redirect index to api-docs
    this.application.get("/", (req, res) => {
      res.redirect("/api-docs");
    });
  }

  /**
   * Start the server on the specified port
   */
  async start() {
    this.httpServer.listen(this.PORT, () => {
      console.log(`Server started on port: ${this.PORT}`);
    });
  }
}
