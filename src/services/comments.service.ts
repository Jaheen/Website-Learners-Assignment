import { Comment, Post, User } from "models";

/**
 * Service with business logic related to comments
 */
export default class CommentsService {
  static errors = {
    PostNotFound: "post-not-found",
    CommentNotFound: "comment-not-found",
    PermissionDenied: "permission-denied",
  };

  /**
   * Create a comment for a post as logged user.
   * @param userId if of the logged user
   * @param postId id of the post for which comment needs to be created
   * @param comment comment text of the comment
   * @returns created comment
   */
  static async createComment(userId: number, postId: number, comment: string): Promise<Comment> {
    // find the target post
    const post: Post = await Post.findOne({ where: { postId } });

    // if post not exist throw error
    if (!post) throw new Error(this.errors.PostNotFound);

    try {
      // if post exists create comment for it and return it
      const [createdComment, currentUser] = await Promise.all([
        Comment.create({ postId: post.postId, userId, comment }),
        User.findOne({ where: { userId }, attributes: ["firstName", "lastName"] }),
      ]);

      // add current user as commentor
      createdComment.dataValues["commentor"] = currentUser.dataValues;

      return createdComment;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Get all recent comments of a post with pagination of page size 10.
   * Use skip to find next comments.
   * @param userId id of the logged user
   * @param postId id of post for which comments need to found
   * @param skip no of records to skip
   * @returns comments
   */
  static async getComments(postId: number, skip: number, limit: number = 10): Promise<Comment[]> {
    // first find post
    const post: Post = await Post.findOne({ where: { postId } });

    if (!post) throw new Error(this.errors.PostNotFound);

    // if post was found then find comments for it
    const comments = await Comment.findAll({
      where: { postId },
      order: [["createdAt", "DESC"]],
      include: [{ model: User, as: "commentor", attributes: ["firstName", "lastName"] }],
      limit: limit,
      offset: skip,
    });

    return comments;
  }

  /**
   * Update a specific comment that belongs to the logged user.
   * @param userId id of the loggged user
   * @param commentId id of the comment which needs to be updated
   * @param comment new comment text
   * @returns comment after updation
   */
  static async updateComment(userId: number, commentId: number, comment: string): Promise<Comment> {
    // find the comment to be updated
    const targetComment = await Comment.findOne({ where: { commentId } });

    // if comment not found throw error
    if (!targetComment) throw new Error(this.errors.CommentNotFound);

    // if comment found but the comment not belongs to logged user throw error
    if (targetComment.userId !== userId) throw new Error(this.errors.PermissionDenied);

    // if comment found and belongs to logged user, update comment
    targetComment.comment = comment;

    try {
      // save it to database and get updated comment
      const [updatedComment, currentUser] = await Promise.all([
        targetComment.save(),
        User.findOne({ where: { userId }, attributes: ["firstName", "lastName"] }),
      ]);

      // add current user as commentor
      updatedComment.dataValues["commentor"] = currentUser.dataValues;

      // return the upadted comment
      return updatedComment;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Delete a specific comment that belongs to the logged user.
   * @param userId id of the logged user
   * @param commentId id of the comment to be deleted
   */
  static async deleteComment(userId: number, commentId: number): Promise<void> {
    // find the comment that needs to be deleted
    const targetComment = await Comment.findOne({ where: { commentId } });

    // if comment not found throw error
    if (!targetComment) throw Error(this.errors.CommentNotFound);

    // if comment not belong to logged user throw error
    if (targetComment.userId !== userId) throw new Error(this.errors.PermissionDenied);

    try {
      // if found and belong to user delete it
      await targetComment.destroy();
    } catch (error) {
      console.log(error);
    }
  }
}
