import { Sequelize } from "sequelize";
import User from "./user.model";
import Post from "./post.model";
import Comment from "./comment.model";

/**
 * Init all models using the connection and sync them with database tables
 * @param connection sequelize connection
 */
export async function initAndSyncModels(connection: Sequelize) {
  // init all models
  const models = [User, Post, Comment];
  models.forEach((model) => model.initModel(connection));

  // init relationships between tables
  Post.belongsTo(User, { foreignKey: "userId", as: "postedUser", onDelete: "CASCADE" });
  Post.hasMany(Comment, { foreignKey: "postId", onDelete: "CASCADE" });

  Comment.belongsTo(Post, { foreignKey: "postId", as: "post", onDelete: "CASCADE" });
  Comment.belongsTo(User, { foreignKey: "userId", as: "commentor", onDelete: "CASCADE" });

  try {
    /**
     * Flags for forced and alter
     */
    const force: boolean = false; // force will drop table every sync
    const alter: boolean = false; // will alter table based on model change

    // sync all models
    await User.sync({ force, alter });
    await Post.sync({ force, alter });
    await Comment.sync({ force, alter });
  } catch (error) {
    console.log(error);
  }
}

export { User, Post, Comment };
