import { json } from "body-parser";
import { CommentsController, PostsController } from "controllers";
import { Router } from "express";
import { AuthMiddleware } from "middlewares";

/**
 * Router to route all other requests that require authentication. This router uses auth middleware.
 */
const APIRouter: Router = Router();

// json middleware to parse application/json body
APIRouter.use(json());
APIRouter.use(AuthMiddleware);

/**
 * Post routes
 */
APIRouter.post("/posts/create-post", PostsController.createPostHandler);
APIRouter.get("/posts/get-posts", PostsController.getPostsHandler);
APIRouter.get("/posts/get-post/:postId", PostsController.getPostHandler);
APIRouter.put("/posts/update-post/:postId", PostsController.updatePostHandler);
APIRouter.delete("/posts/delete-post/:postId", PostsController.deletePostHandler);

/**
 * Comment Routes
 */
APIRouter.post("/comments/create-comment", CommentsController.createCommentHandler);
APIRouter.get("/comments/get-comments/:postId", CommentsController.getCommentsHandler);
APIRouter.put("/comments/update-comment/:commentId", CommentsController.updateCommentHandler);
APIRouter.delete("/comments/delete-comment/:commentId", CommentsController.deleteCommentHandler);

export default APIRouter;
