import { UnauthorizedResponse } from "./common.swagger";

/**
 * Properties of post in responses of create, read and update requests
 */
const postProperties = {
  postId: { type: "string", example: "12", description: "Id of the post stored in the database" },
  userId: { type: "string", example: "34", description: "Id of the user who created the post" },
  title: {
    type: "string",
    example: "Pros and Cons of ChatGPT",
    description: "Title of the post",
  },
  content: {
    type: "string",
    example: "ChatGPT is a wonderful tool to assist us in each and every tasks.",
    description: "Text content of the post",
  },
  createdAt: {
    type: "string",
    example: "2023-06-10T11:03:33.643Z",
    description: "Timestamp in ISO standard format, representing the time in which the post is created",
  },
  updatedAt: {
    type: "string",
    example: "2023-06-10T11:03:33.643Z",
    description: "Timestamp in ISO standard format, representing the time in which the post is edited recently",
  },
  postedUser: {
    type: "object",
    properties: {
      firstName: { type: "string", example: "Alex", description: "First name of the user who created the post" },
      lastName: { type: "string", example: "Bob", description: "Last name of the user who created the post" },
    },
    description: "Profile details of user who created the post",
  },
};

/**
 * Response for 404 when trying to read, update or delete the post which not exist.
 */
const postNotFoundResponse = {
  description:
    "The post with the provided <b>postId</b> was not found on server.<br>" +
    ' The response will be <code>{ error: "post-not-found" }</code>',
};

/**
 * Json paths for posts
 */
export default {
  // create single post
  "/api/posts/create-post": {
    post: {
      tags: ["Posts"],
      summary: "Create a new Post",
      description: "Create a new post with title and content.",
      requestBody: {
        description: "Properties <b>title</b> and <b>content</b> must be included in the JSON body",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  example: "Pros and Cons of ChatGPT",
                  description: "Title of the post that needs to be created",
                },
                content: {
                  type: "string",
                  example: "ChatGPT is a wonderful tool to assist us in each and every tasks.",
                  description: "Content of the post that needs to be created.",
                },
              },
              required: ["title", "content"],
            },
          },
        },
      },
      responses: {
        "201": {
          description:
            "The post had been successfully created for the currently logged user. Created post is provided in the response.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { post: { type: "object", properties: postProperties, description: "Created post" } },
              },
            },
          },
        },
        "400": {
          description:
            "The request is invalid. Required properties may not be provided in the request's JSON body. All possible responses are below:<br>" +
            '1. <code>{ error: "title-invalid" }</code> - response is provided when no value or invalid value is proivide for <b>title</b> property in JSON body.<br>' +
            '2. <code>{ error: "content-invalid" }</code> - response is provided when no value or invalid value is proivide for <b>content</b> property in JSON body',
        },
        "401": UnauthorizedResponse,
      },
      security: [{ bearerAuth: [] }],
    },
  },
  // fetch all posts with pagination
  "/api/posts/get-posts": {
    get: {
      tags: ["Posts"],
      summary: "Fetch all posts, with pagination",
      description:
        "Fetch all posts with pagination. The <b>skip</b> is an optional query parameter which is used to paginate results.<br>" +
        "Without skip or skip=0, array of size 10 containing most recent 10 posts will be returned in response," +
        " skip=10 means array of size 10 containing next 10 posts will be provided in response. Empty array if no posts further.",
      parameters: [
        {
          name: "skip",
          in: "query",
          description: "No of posts to skip before fetching",
          schema: { type: "integer", example: 0 },
        },
      ],
      responses: {
        "200": {
          description: "Posts in array of max size 10 is returned as response.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { posts: { type: "array", items: { properties: postProperties } } },
              },
            },
          },
        },
        "401": UnauthorizedResponse,
      },
      security: [{ bearerAuth: [] }],
    },
  },
  // fetch a single post
  "/api/posts/get-post/{postId}": {
    get: {
      tags: ["Posts"],
      summary: "Fetch a single post",
      description: "Fetch a single post from server. Path parameter <b>postId</b> must be included.",
      parameters: [
        {
          name: "postId",
          in: "path",
          description: "Id of the post which you want to fetch",
          required: true,
          schema: { type: "integer", example: 10 },
        },
      ],
      responses: {
        "200": {
          description: "Successfully fetched a single post from server",
          content: { "application/json": { schema: { type: "object", properties: postProperties } } },
        },
        "400": {
          description:
            'The request is invalid. The <b>postId</b> parameter is invalid or no value is provided.<br> The response will be <code>{ error: "postId-invalid" }</code>',
        },
        "401": UnauthorizedResponse,
        "404": postNotFoundResponse,
      },
      security: [{ bearerAuth: [] }],
    },
  },
  // update a single post
  "/api/posts/update-post/{postId}": {
    put: {
      tags: ["Posts"],
      summary: "Update a single Post",
      description: "Update the <b>title</b> and <b>content</b> of a specific post using <b>postId</b> path parameter.",
      parameters: [
        {
          name: "postId",
          in: "path",
          description: "Id of the post which you want to fetch",
          required: true,
          schema: { type: "integer", example: 10 },
        },
      ],
      requestBody: {
        required: true,
        description: "The properties <b>title</b> and <b>content</b> must be provided in the JSON body",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string", example: "Pros and Cons of ChatGPT", description: "New title for the post" },
                content: {
                  type: "string",
                  example: "ChatGPT is a wonderful tool to assist us in each and every tasks.",
                  description: "New content for the post",
                },
              },
              required: ["title", "content"],
            },
          },
        },
      },
      responses: {
        "200": {
          description:
            "The post was successfully updated with the provided <b>title</b> and the <b>content</b>. The response will contain the updated post.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { post: { type: "object", properties: postProperties, description: "Updated post" } },
              },
            },
          },
        },
        "400": {
          description:
            "The request is invalid. The properties or path parameters may be invalid. All possible responses are given below:<br>" +
            '1. <code>{ error: "postId-invalid" }</code> - response when no value or invalid value is provided for path parameter <b>postId</b>.<br>' +
            '2. <code>{ error: "title-invalid" }</code> - response when no value or invalid value is proivided for <b>title</b> property in JSON body.<br>' +
            '3. <code>{ error: "content-invalid" }</code> - response when no value or invalid value is proivided for <b>content</b> property in JSON body.',
        },
        "401": UnauthorizedResponse,
        "403": {
          description:
            "Forbidden. This means the post with the provided <b>postId</b> belongs to another user. So the current user cannot update it.<br>" +
            'The response will be <code>{ error: "permission-denied" }</code>',
        },
        "404": postNotFoundResponse,
      },
      security: [{ bearerAuth: [] }],
    },
  },
  // delete a single post
  "/api/posts/delete-post/{postId}": {
    delete: {
      tags: ["Posts"],
      summary: "Delete a single Post",
      description:
        "Delete a Single Post using <b>postId</b> parameter. The <b>postId</b> must be included in the path parameter<br>",
      parameters: [
        {
          name: "postId",
          in: "path",
          description: "Id of the post which you want to fetch",
          required: true,
          schema: { type: "integer", example: 10 },
        },
      ],
      responses: {
        "200": {
          description: "The post was deleted successfully.",
          content: {
            "application/json": {
              schema: { type: "object", properties: { isDeleted: { type: "boolean", example: true } } },
            },
          },
        },
        "403": {
          description:
            "Forbidden. This means the post with the provided <b>postId</b> belongs to another user. So the current user cannot delete it.<br>" +
            'The response will be <code>{ error: "permission-denied" }</code>',
        },
        "404": postNotFoundResponse,
      },
      security: [{ bearerAuth: [] }],
    },
  },
};
