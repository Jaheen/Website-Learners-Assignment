import { BIGINT, InferAttributes, Model, STRING, Sequelize } from "sequelize";

/**
 * Users model to interact with users table
 */
export default class User extends Model<InferAttributes<User>> {
  userId: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;

  /**
   * Init Model attributes asn relations using sequelize connection instance
   * @param connection sequelize connection
   */
  static initModel(connection: Sequelize) {
    this.init(
      {
        userId: {
          type: BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        firstName: {
          type: STRING,
          allowNull: false,
        },
        lastName: {
          type: STRING,
          defaultValue: "",
        },
        emailAddress: {
          type: STRING,
          unique: true,
          allowNull: false,
        },
        password: {
          type: STRING,
          allowNull: false,
        },
      },
      {
        sequelize: connection,
      }
    );
  }
}
