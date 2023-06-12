import { Post, User } from "models";

/**
 * Service with business logic related to posts
 */
export default class PostsService {
  // all errors that be rejected by post service
  static errors = {
    PostNotFound: "post-not-found",
    PermissionDenied: "permission-denied",
  };

  /**
   * Create a new post and return the created post
   * @param userId id of the currently logged user
   * @param title title of the new post
   * @param content content of the new post
   * @returns created post
   */
  static async createPost(userId: number, title: string, content: string): Promise<Post> {
    try {
      const [newPost, currentUser] = await Promise.all([
        // create new post as current user
        Post.create({ userId, title, content }),
        // fetch current user to add as association
        User.findOne({ where: { userId }, attributes: ["firstName", "lastName"] }),
      ]);

      // add user as a property in return value
      newPost.dataValues["postedUser"] = currentUser.dataValues;

      return newPost;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Get all recent posts with pagination, default page limit is 10
   * @param skip no of records to skip
   * @param limit no of limited records
   * @returns array of recent posts
   */
  static async getPosts(skip: number, limit: number = 10): Promise<Post[]> {
    // find recent posts with pagination
    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: skip,
      include: [{ model: User, attributes: ["firstName", "lastName"], as: "postedUser" }],
    });

    return posts;
  }

  /**
   * Get a single post along with its comments with pagination
   * @param postId id of the post to be fetched
   * @returns post
   */
  static async getPost(postId: number): Promise<Post> {
    // find the post
    const post = await Post.findOne({
      where: { postId },
      include: [{ model: User, attributes: ["firstName", "lastName"], as: "postedUser" }],
    });

    // If post not found throw error
    if (!post) throw new Error(this.errors.PostNotFound);

    return post;
  }

  /**
   * Update the post that belongs to the logged user
   * @param userId id of the logged user
   * @param postId id of the post to be updated
   * @param title new title of the post
   * @param content new content of the post
   */
  static async updatePost(userId: number, postId: number, title: string, content: string): Promise<Post> {
    // find the post
    const post = await Post.findOne({ where: { postId } });

    // if post not exists throw not found error
    if (!post) throw new Error(this.errors.PostNotFound);

    // if post not belongs to current user throw permission denied error
    if (post.userId !== userId) throw new Error(this.errors.PermissionDenied);

    // update post
    post.title = title;
    post.content = content;

    // save to database and return updated post
    try {
      // update the post and find current user
      const [updatedPost, currentUser] = await Promise.all([
        post.save(),
        User.findOne({ where: { userId }, attributes: ["firstName", "lastName"] }),
      ]);

      // add user data to updated post
      updatedPost.dataValues["postedUser"] = currentUser.dataValues;

      // return updated post
      return updatedPost;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Delete a post that belongs to the logged user
   * @param userId id of the logged user
   * @param postId if of the post to be deleted
   * @returns boolean promise
   */
  static async deletePost(userId: number, postId: number): Promise<void> {
    const post: Post = await Post.findOne({ where: { postId } });

    // if post not exists throw not found error
    if (!post) throw new Error(this.errors.PostNotFound);

    // if post not belongs to current user throw permission denied error
    if (post.userId !== userId) throw new Error(this.errors.PermissionDenied);

    // destroy the post
    await post.destroy();
  }
}
