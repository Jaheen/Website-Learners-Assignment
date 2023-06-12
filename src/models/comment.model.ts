import { BIGINT, InferAttributes, Model, NonAttribute, Sequelize, TEXT } from "sequelize";
import User from "./user.model";
import Post from "./post.model";

/**
 * Comment Model to interact with comments table
 */
export default class Comment extends Model<InferAttributes<Comment>> {
  commentId: number;
  comment: string;
  postId: number;
  userId: number;

  user: NonAttribute<User>;
  post: NonAttribute<Post>;

  /**
   * Init Model attributes and relations using sequelize connection instance
   * @param connection sequelize connection
   */
  static initModel(connection: Sequelize) {
    this.init(
      {
        commentId: {
          type: BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: BIGINT,
          references: { model: User },
        },
        postId: {
          type: BIGINT,
          references: { model: Post },
        },
        comment: {
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
