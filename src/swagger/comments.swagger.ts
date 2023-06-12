import { UnauthorizedResponse } from "./common.swagger";

const commentProperties = {
  commentId: { type: "string", example: "12", description: "Id of the comment" },
  postId: { type: "string", example: "34", description: "Id of the post to which this comment belongs" },
  userId: { type: "string", example: "23", description: "Id of the user who created this comment" },
  comment: {
    type: "string",
    example: "I've learnt a lot from this post. A nice one thanks.",
    descripion: "Comment text content",
  },
  createdAt: {
    type: "string",
    example: "2023-06-10T11:03:33.643Z",
    description: "Timestamp in ISO standard format, representing the time in which the comment is created",
  },
  updatedAt: {
    type: "string",
    example: "2023-06-10T11:03:33.643Z",
    description: "Timestamp in ISO standard format, representing the time in which the comment is edited recently",
  },
  commentor: {
    type: "object",
    properties: {
      firstName: {
        type: "string",
        example: "Alex",
        description: "First name of the user who created this comment",
      },
      lastName: {
        type: "string",
        example: "Bob",
        description: "Last name of the user who created the comment",
      },
    },
    description: "Profile data of the user who created the comment",
  },
};

const commentNotFoundResponse = {
  description:
    'The comment with the provided <b>commentId</b> was not found.<br> The response will be <code>{ error: "comment-not-found" }</code>',
};

export default {
  // comment on a single post
  "/api/comments/create-comment": {
    post: {
      tags: ["Comments"],
      summary: "Create a comment for a post",
      description: "Create comment for a specific post.",
      requestBody: {
        required: true,
        description: "The properties <b>postId</b> and <b>comment</b> must be included in the JSON body",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                postId: {
                  type: "integer",
                  example: 45,
                  description: "Id of the post for which the comment needs to be added",
                  required: true,
                },
                comment: {
                  type: "string",
                  example: "A good blog post. I appreciate your efforts.",
                  description: "Comment in text format",
                },
              },
              required: ["postId", "comment"],
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Comment was successfully created for a post.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  comment: { type: "object", properties: commentProperties, description: "Created comment" },
                },
              },
            },
          },
        },
        "400": {
          description:
            "The Request is invalid. The properties or parameters may be provided with invalid values. All possible responses are below:<br>" +
            '1. <code>{ error: "postId-invalid" }</code> - response when no value or invalid value is provided for <b>postId</b> property in JSON body.<br>' +
            '2. <code>{ error: "comment-invalid" }</code> - response when invalid value or no value is provided for <b>comment</b> property in JSON body.',
        },
        "401": UnauthorizedResponse,
        "404": {
          description:
            "The post with the provided <b>postId</b> was not found on server.<br>" +
            ' The response will be <code>{ error: "post-not-found" }</code>',
        },
      },
      security: [{ bearerAuth: [] }],
    },
  },
  // get comments with pagination for a single post
  "/api/comments/get-comments/{postId}": {
    get: {
      tags: ["Comments"],
      summary: "Fetch all the comments with pagination",
      description:
        "Fetch all comments with pagination. The <b>postId</b> path parameter should be provided in path.<br>" +
        "The <b>skip</b> is an optional query parameter which is used to paginate results.<br>" +
        "Without skip or skip=0, array of size 10 containing most recent 10 comments will be returned in response," +
        " skip=10 means array of size 10 containing next 10 comments will be provided in response. Empty array if no comments further.",
      parameters: [
        {
          name: "postId",
          in: "path",
          description: "Id of post, whose comments needs to be fetched",
          required: true,
          schema: { type: "integer", example: 34 },
        },
        {
          name: "skip",
          in: "query",
          description: "No of comments to skip before fetching",
          schema: { type: "integer", example: 0 },
        },
      ],
      responses: {
        "200": {
          description:
            "The comments of the post with provided <b>postId</b> were fetched from server and provided in the response as an array of max size 10.",
          content: { "application/json": { schema: { type: "array", items: { properties: commentProperties } } } },
        },
        "400": {
          description:
            'The request is invalid. The path parameter <b>postId</b> may be provided with an invalid value or no value.<br> The response will be <code>{ error: "postId-invalid" }</code>',
        },
        "401": UnauthorizedResponse,
        "404": {
          description:
            "The post with the provided <b>postId</b> was not found on server. So comments of post which not exist cannot be fetched.<br>" +
            ' The response will be <code>{ error: "post-not-found" }</code>',
        },
      },
      security: [{ bearerAuth: [] }],
    },
  },
  // update a comment
  "/api/comments/update-comment/{commentId}": {
    put: {
      tags: ["Comments"],
      summary: "Update a comment with commentId",
      description:
        "Update a single comment using commentId. The <b>commentId</b> should be provided in the path parameter",
      parameters: [
        {
          name: "commentId",
          in: "path",
          description: "Id of comment that needs to be updated",
          required: true,
          schema: { type: "integer", example: 45 },
        },
      ],
      requestBody: {
        description: "The <b>comment</b> property must be provided in the JSON body.",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { comment: { type: "string", example: "comment of updated comment" } },
              required: ["comment"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Comment was successfully updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  comment: { type: "object", properties: commentProperties, description: "Updated comment" },
                },
              },
            },
          },
        },
        "400": {
          description:
            "The request is invalid. All possible responses are below:<br>" +
            '1. <code>{ error: "commentId-invalid" }</code> - response when no value or invalid value is provided for path parameter <b>commentId</b>.<br>' +
            '2. <code>{ error: "comment-invalid" }</code> - response when no value or invalid value is provided for <b>comment</b> property in JSON body.',
        },
        "401": UnauthorizedResponse,
        "403": {
          description:
            "Forbidden. This means the comment with the provided <b>commentId</b> belongs to another user. So the current user cannot update it.<br>" +
            'The response will be <code>{ error: "permission-denied" }</code>',
        },
        "404": commentNotFoundResponse,
      },
      security: [{ bearerAuth: [] }],
    },
  },
  // delete a comment
  "/api/comments/delete-comment/{commentId}": {
    delete: {
      tags: ["Comments"],
      summary: "Delete a comment",
      description:
        "Delete a comment using <b>commentId</b> in path parameter. <b>commentId</b> should be passed in path parameter",
      parameters: [
        {
          name: "commentId",
          in: "path",
          description: "Id of the comment that needs to be deleted",
          required: true,
          schema: { type: "integer", example: 56 },
        },
      ],
      responses: {
        "200": {
          description: "The comment was deleted successfully",
          content: {
            "application/json": {
              schema: { type: "object", properties: { isDeleted: { type: "boolean", example: true } } },
            },
          },
        },
        "400": {
          description:
            "The request is invalid. The <b>commetnId</b> path parameter is provided with no value or invalid value.<br>" +
            'The response will be <code>{ error: "commentId-invalid" }</code>',
        },
        "401": UnauthorizedResponse,
        "403": {
          description:
            "Forbidden. This means the comment with the provided <b>commentId</b> belongs to another user. So the current user cannot delete it.<br>" +
            'The response will be <code>{ error: "permission-denied" }</code>',
        },
        "404": commentNotFoundResponse,
      },
      security: [{ bearerAuth: [] }],
    },
  },
};
