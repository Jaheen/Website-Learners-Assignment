export const UnauthorizedResponse = {
  description:
    "Unauthorized. The request needs authorization using authorization header.<br>" +
    "The <b>authorization</b> header should have value in the format <code>Bearer <jwt-token></code>" +
    " where the <jwt-token> will be replaced by actual token received as response in login or signup.<br>" +
    "All possible responses are below<br>" +
    '1. <code>{ error: "authHeader-invalid" }</code> - response when auth header is not provided.<br>' +
    '2. <code>{ error: "jwt-invalid" }</code> - response when auth header is provided but jwt token is not provided or invalid token is provided.',
};
