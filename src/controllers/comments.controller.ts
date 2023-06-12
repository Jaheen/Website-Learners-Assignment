import { Request, Response } from "express";
import { CommentsService } from "services";

/**
 * Controller class to handle requests related to comments
 */
export default class CommentsController {
  /**
   * POST method hadnler to comment a post as loggged user.
   * Request body must contain postId and comment, If not found or empty is found will send bad request 400.
   * @param req HTTP request
   * @param res HTTP response
   */
  static async createCommentHandler(req: Request, res: Response) {
    const { postId, comment } = req.body;

    // userId injected by auth middleware
    const userId: number = req["userId"];

    // if postId not number send bad request 400
    if (typeof postId !== "number") return res.status(400).json({ error: "postId-invalid" });
    // if comment is undefined or empty string send bad request 400
    if (typeof comment !== "string" || comment.trim() === "") return res.status(400).json({ error: "comment-invalid" });

    try {
      // create comment using service
      const createdComment = await CommentsService.createComment(userId, postId, comment);

      // send 201 created
      res.status(201).json({ comment: createdComment });
    } catch (error) {
      // if post not found for which the comment needs to be created send 404
      if (error.message === CommentsService.errors.PostNotFound) res.status(404).json({ error: error.message });
    }
  }

  /**
   * GET method handler for retrieving the comments of a post with pagination.
   * Use skip query parameter to paginate.
   * @param req Http request
   * @param res HTTP response
   */
  static async getCommentsHandler(req: Request, res: Response) {
    let skip: number = 0;

    // postId from path params
    const postId: number = parseInt(req.params.postId);

    // Check path params
    // if postId path parameter is invalid, send bad request 400
    if (Number.isNaN(postId)) return res.status(400).json({ error: "postId-invalid" });

    // check query params and set with defaults
    // if skip is provided in query use it to skip records
    if (typeof req.query.skip === "string") skip = parseInt(req.query.skip) || 0;

    try {
      // fetch comments in descending order as array of size 10
      const comments = await CommentsService.getComments(postId, skip);

      res.json({ comments });
    } catch (error) {
      if (error.message === CommentsService.errors.PostNotFound) res.status(404).json({ error: error.message });
    }
  }

  /**
   * PUT method handler to update a comment.
   * commentId must be path parameter.
   * Request body should contain comment. If not found or empty is found will send bad request 400.
   * @param req HTTP request
   * @param res HTTP response
   */
  static async updateCommentHandler(req: Request, res: Response) {
    const { comment } = req.body;
    const userId: number = req["userId"];
    const commentId: number = parseInt(req.params.commentId);

    if (Number.isNaN(commentId)) return res.status(400).json({ error: "commentId-invalid" });

    if (typeof comment !== "string" || comment.trim() === "") return res.status(400).json({ error: "comment-invalid" });

    try {
      const updatedComment = await CommentsService.updateComment(userId, commentId, comment);

      res.json({ comment: updatedComment });
    } catch (error) {
      switch (error.message) {
        case CommentsService.errors.CommentNotFound:
          return res.status(404).json({ error: error.message });

        case CommentsService.errors.PermissionDenied:
          return res.status(403).json({ error: error.message });

        default:
          return console.log(error);
      }
    }
  }

  /**
   * DELETE method handler to delete a comment of the logged user.
   * commentId must be a path parameter.
   * @param req HTTP request
   * @param res HTTP response
   */
  static async deleteCommentHandler(req: Request, res: Response) {
    const userId: number = req["userId"];
    const commentId: number = parseInt(req.params.commentId);

    if (Number.isNaN(commentId)) return res.status(400).json({ error: "commentId-invalid" });

    try {
      await CommentsService.deleteComment(userId, commentId);

      res.json({ isDeleted: true });
    } catch (error) {
      switch (error.message) {
        case CommentsService.errors.CommentNotFound:
          return res.status(404).json({ error: error.message });

        case CommentsService.errors.PermissionDenied:
          return res.status(403).json({ error: error.message });

        default:
          return console.log(error);
      }
    }
  }
}
