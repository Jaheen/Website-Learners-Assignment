import { NextFunction, Request, Response } from "express";
import { AuthService } from "services";

/**
 * Middleware to allow requests only when the user is authenticated
 * @param req HTTP request object
 * @param res HTTP response object
 * @param next next function to pass control to next middleware
 */
export default async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  // if auth header not present send unauthorized 401
  const authHeader: string = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "authHeader-invalid" });

  // if header present but token not provided send unauthorized 401
  const splitArr: Array<string> = authHeader.split("Bearer ");
  if (splitArr.length < 2) return res.status(401).json({ error: "jwt-invalid" });

  // if token present but if it is an empty string send unauthorized 401
  const jwt: string = splitArr[1];
  if (jwt.trim() === "") return res.status(401).json({ error: "jwt-invalid" });

  try {
    // verify token and get the respective user associated with it
    const user = await AuthService.verifyToken(jwt);

    // inject userId into request
    req["userId"] = user.userId;

    // pass control to next middleware or controller
    next();
  } catch (error) {
    // for any error jwt is invalid send unauthorized 401
    res.status(401).json({ error: "jwt-invalid" });
  }
}
