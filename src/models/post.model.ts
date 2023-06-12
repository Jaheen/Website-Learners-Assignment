import { BIGINT, InferAttributes, Model, STRING, Sequelize, TEXT } from "sequelize";
import User from "./user.model";

/**
 * Posts model to interact with Posts Table
 */
export default class Post extends Model<InferAttributes<Post>> {
  postId: number;
  title: string;
  content: string;
  userId: number;

  /**
   * Init Model attributes and relations using sequelize connection instance
   * @param connection sequelize connection
   */
  static initModel(connection: Sequelize) {
    this.init(
      {
        postId: {
          type: BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: BIGINT,
          references: { model: User },
        },
        title: {
          type: STRING(500),
          allowNull: false,
        },
        content: {
          type: TEXT,
          allowNull: false,
        },
      },
      {
        sequelize: connection,
      }
    );
  }
}
