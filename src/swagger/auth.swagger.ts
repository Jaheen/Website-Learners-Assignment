/**'
 * Json paths for Auth
 */
export default {
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login as existing user",
      description: "Login into the application using email address and password.",
      requestBody: {
        required: true,
        description: "The <b>emailAddress</b> and <b>password</b> properties must be passed in the JSON request body.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                emailAddress: { type: "string", example: "alexbob@gmail.com", description: "User's mail address" },
                password: { type: "string", example: "123456", description: "password to login" },
              },
              required: ["emailAddress", "password"],
            },
          },
        },
      },
      responses: {
        "200": {
          description:
            "A user with provided email address was found and the provided password matches with user's password. A jwt token is provided in the response.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    example:
                      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                    description:
                      "JWT token which should be passed in auth header for requests that require authorization.",
                  },
                },
              },
            },
          },
        },
        "400": {
          description:
            "The request is Invalid. Request body is not provided with required properties. All possible error responses are below: <br>" +
            '1. <code>{ error: "emailAddress-invalid" }</code> - response when <b>emailAddress</b> is not provided or provided an invalid value.<br>' +
            '2. <code>{ error:"password-invalid" }</code> - response when <b>password</b> is not provided or provided an invalid value',
        },
        "401": {
          description:
            "The user is unauthorized. This means a user with the provided email address was found, but the user's password doesn't match with the provided password.<br>" +
            'The response will be <code>{ error: "password-mismatch" }</code>',
        },
        "404": {
          description:
            'User with the provided email address not found. The response will be <code>{ error: "user-not-found" }</code>',
        },
      },
    },
  },
  "/auth/signup": {
    post: {
      tags: ["Auth"],
      summary: "Signup as new user",
      description:
        "Signup as new user into the application using firstName,lastName, emailAddress, password and confirmPassword.",
      requestBody: {
        required: true,
        description:
          "The <b>firstName</b>, <b>emailAddress</b>, <b>password</b>, <b>confirmPassword</b> properties must be passed in the JSON body.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                firstName: { type: "string", example: "Alex", description: "User's firstname" },
                lastName: { type: "string", example: "Bob", description: "User's lastname" },
                emailAddress: { type: "string", example: "alexbob@gmail.com", description: "User's mail address" },
                password: { type: "string", example: "123456", description: "New password for signup" },
                confirmPassword: {
                  type: "string",
                  example: "123456",
                  description: "Confirm password same as new password.",
                },
              },
              required: ["firstName", "emailAddress", "password", "confirmPassword"],
            },
          },
        },
      },
      responses: {
        "201": {
          description:
            "The user has successfully signed up and account was created. A JWT token will be provided in the response which should be used in auth header for requests that require authorization",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    example:
                      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                    description:
                      "JWT token which should be passed in auth header for requests that require authorization.",
                  },
                },
              },
            },
          },
        },
        "400": {
          description:
            "The request is Invalid. The request body may be not provided with required properties. All possible error responses are below:<br>" +
            '1. <code>{ error: "firstName-invalid" }</code> - response when <b>firstName</b> is not provided or an invalid value is provided.<br>' +
            '2. <code>{ error: "emailAddress-invalid" }</code> - response when <b>emailAddress</b> is not provided or invalid value is provided.<br>' +
            '3. <code>{ error: "password-invalid" }</code> - response when <b>password</b> is not provided or invalid value is provided.<br>' +
            '4. <code>{ error: "confirmPassword-invalid" }</code> - response when <b>confirmPassword</b> is not provided or invalid value is provided.<br>' +
            '5. <code>{ error: "passwords-mismatch" }</code> - response when <b>password</b> and <b>confirmPassword</b> doesn\'t match.',
        },
        "409": {
          description:
            "Conflict. This means a user with the provided email address already exists. Thus cannot create another user using same email address.<br>" +
            'The response will be <code>{ error: "user-already-exist" }</code>',
        },
      },
    },
  },
};
