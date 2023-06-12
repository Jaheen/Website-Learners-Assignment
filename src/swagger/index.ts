import AuthPaths from "./auth.swagger";
import PostPaths from "./posts.swagger";
import CommentPaths from "./comments.swagger";

/**
 * Swagger documentation.
 */
export default {
  openapi: "3.0.0",
  info: {
    title: "Website Learners Assignment Project (Backend)",
    description:
      "This a simple REST API developed as a task to test my backend skills in my interview with <b>Website Learners</b> company.<br><br>I have developed it using: <br>" +
      "1. Node.js - (Platform) <br> 2. Express.js - (Backend Framework) <br> 3. Sequelize - (ORM for accessing database) <br> 4. PostgreSQL - (database) <br><br>" +
      "Below are three sections of routes: <br> 1. <b>Auth</b> - routes for login and signup (these will return a JWT token on successful auth, which is to be provided in <b>Authorize dialog</b>) <br>" +
      "2. <b>Posts</b> - routes for creating, reading, updating and deleting posts <br> 3. <b>Comments</b> - routes for Creating, reading, updating and deleting comments that belong to each post.",
    version: "1.0.0",
    contact: {
      email: "jaheenafsarsyedks@gmail.com",
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        name: "jwt",
        in: "header",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "JWT token authentication. Login or Signup with <b>auth</b> routes, the response will have a <b>token</b>. Enter the token in this box.",
      },
    },
  },
  // servers: [{ url: "http://localhost:8080/" }],
  paths: {
    ...AuthPaths,
    ...PostPaths,
    ...CommentPaths,
  },
};
