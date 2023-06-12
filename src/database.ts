import { Sequelize } from "sequelize";

/**
 * Class that handles database connection, initialization
 */
export default class Database {
  /**
   * Singleton instance of the sequelize connection instance. Must be initialized before any database operations or model sync.
   */
  private static connection: Sequelize;

  /**
   * Initialize the singleton database connection. Must be called at initialization of the application.
   * @returns a promise that fullfils on successful connection
   */
  static async initDatabase() {
    this.connection = new Sequelize(process.env.SEQUELIZE_DATABASE_URL, {});
    return this.connection.authenticate();
  }

  /**
   * Getter to get the connection
   * @returns singleton instance of connection
   */
  static getConnection(): Sequelize {
    return this.connection;
  }
}
