import { Request, Response } from "express";
import { PostsService } from "services";

/**
 * Controller to handle requests related to posts
 */
export default class PostsController {
  /**
   * POST method handler for creating a post as logged user.
   * Request body must contain non empty title and content. If not found or empty is found will send bad request 400.
   * @param req HTTP request
   * @param res HTTP response
   */
  static async createPostHandler(req: Request, res: Response) {
    const { title, content } = req.body;

    // userId injected by auth middleware
    const userId: number = req["userId"];

    // if title is not valid, send bad request 400
    if (typeof title !== "string" || title.trim() === "") return res.status(400).json({ error: "title-invalid" });
    // if content is not valid, send bad request 400
    if (typeof content !== "string" || content.trim() === "") return res.status(400).json({ error: "content-invalid" });

    // if every thing is valid then create post for currently logged user
    const post = await PostsService.createPost(userId, title, content);

    // send created post in response with 201 created
    res.status(201).json({ post });
  }

  /**
   * GET method handler for retrieving posts with pagination.
   * Use skip query parameter to pageinate posts
   * @param req HTTP request
   * @param res HTTP response
   */
  static async getPostsHandler(req: Request, res: Response) {
    let skip: number = 0;

    // if skip is provided in query use it to skip records
    if (typeof req.query.skip === "string") skip = parseInt(req.query.skip) || 0;

    // fetch posts in descending order as array of size 10
    const posts = await PostsService.getPosts(skip);

    res.json({ posts });
  }

  /**
   * GET method handler for retrieving a single post
   * @param req HTTP request
   * @param res HTTP response
   */
  static async getPostHandler(req: Request, res: Response) {
    // postId from path params
    const postId: number = parseInt(req.params.postId);

    // check postId param is a number
    if (Number.isNaN(postId)) return res.status(400).json({ error: "postId-invalid" });

    try {
      // get post using service
      const post = await PostsService.getPost(postId);

      // send response
      res.json({ post });
    } catch (error) {
      // if post not found
      if (error.message === PostsService.errors.PostNotFound) res.status(404).json({ error: error.message });
    }
  }

  /**
   * PUT method handler for updating a specific post.
   * postId must be a path parameter. If not found will send bad request 400.
   * Request body must contain non empty title and content. If not found or empty is found will send bad request 400.
   * @param req HTTP request
   * @param res HTTP response
   */
  static async updatePostHandler(req: Request, res: Response) {
    // PUT request body
    const { title, content } = req.body;

    // userId injected from auth middleware
    const userId: number = req["userId"];

    // postId from path params
    const postId: number = parseInt(req.params.postId);

    // Check path params
    // if postId path parameter is invalid, send bad request 400
    if (Number.isNaN(postId)) return res.status(400).json({ error: "postId-invalid" });

    // check request body
    // if title is invalid, send bad request 400
    if (typeof title !== "string" || title.trim() === "") return res.status(400).json({ error: "title-invalid" });
    // if content is invalid, send bad request 400.
    if (typeof content !== "string" || content.trim() === "") return res.status(400).json({ error: "content-invalid" });

    try {
      // update post using service
      const post = await PostsService.updatePost(userId, postId, title, content);

      // send the updated post in response
      res.json({ post });
    } catch (error) {
      switch (error.message) {
        // post not found 404
        case PostsService.errors.PostNotFound:
          return res.status(404).json({ error: error.message });

        // post not belong to user 403 forbidden
        case PostsService.errors.PermissionDenied:
          return res.status(403).json({ error: error.message });

        default:
          return console.log(error);
      }
    }
  }

  /**
   * DELETE method handler for deleting a specific post
   * postId must be a path parameter. If not found will send bad request 400.
   * @param req HTTP request
   * @param res HTTP response
   */
  static async deletePostHandler(req: Request, res: Response) {
    // userId injected by auth middleware
    const userId: number = req["userId"];

    // postId from path params
    const postId: number = parseInt(req.params.postId);

    // Check path params
    // check postId is number
    if (Number.isNaN(postId)) return res.json({ error: "postId-invalid" });

    try {
      // delete post using service
      await PostsService.deletePost(userId, postId);

      // send deleted response
      res.json({ isDeleted: true });
    } catch (error) {
      switch (error.message) {
        // post not found 404
        case PostsService.errors.PostNotFound:
          return res.status(404).json({ error: error.message });

        // post not belong to user 403 forbidden
        case PostsService.errors.PermissionDenied:
          return res.status(403).json({ error: error.message });

        default:
          return console.log(error);
      }
    }
  }
}
