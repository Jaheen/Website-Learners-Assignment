import { Request, Response } from "express";
import { AuthService } from "services";

const emailRegex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

/**
 * Controller class that handles requests related to authentication
 */
export default class AuthController {
  /**
   * Handler method to handle login POST request.
   */
  static async loginHandler(req: Request, res: Response) {
    const { emailAddress, password } = req.body;

    // if email address not provided or invalid is provided send unauthorized
    if (typeof emailAddress !== "string" || emailRegex.test(emailAddress))
      return res.status(400).json({ error: "emailAddress-invalid" });

    // if password not provided or empty password is provided send unauthorized
    if (typeof password !== "string" || password.trim() === "")
      return res.status(400).json({ error: "password-invalid" });

    try {
      // generate token by logging in
      const token: string = await AuthService.login(emailAddress, password);

      // send token in repsonse 200
      res.json({ token });
    } catch (error) {
      switch (error.message) {
        // if user with email address not found send not found 404
        case AuthService.errors.UserNotFound:
          return res.status(404).json({ error: error.message });

        // if user found but password mismatch send unauthorized 401
        case AuthService.errors.PasswordMismatch:
          res.status(401).json({ error: error.message });

        default:
          return console.log(error);
      }
    }
  }

  /**
   * Handler method to handler signup POST request
   */
  static async signupHandler(req: Request, res: Response) {
    let { firstName, lastName, emailAddress, password, confirmPassword } = req.body;

    // If first name is undefined or empty, send bad request 400
    if (typeof firstName !== "string" || firstName.trim() === "")
      return res.status(400).json({ error: "firstName-invalid" });

    if (!lastName) lastName = "";

    // if email address is undefined or invalid, send bad request 400
    if (typeof emailAddress !== "string" || emailRegex.test(emailAddress))
      return res.status(400).json({ error: "emailAddress-invalid" });

    // if password is undefined or empty, send bad request 400
    if (typeof password !== "string" || password.trim() === "")
      return res.status(400).json({ error: "password-invalid" });

    // if confirm password is undefined or empty, send bad request 400
    if (typeof confirmPassword !== "string" || confirmPassword.trim() === "")
      return res.status(400).json({ error: "confirmPassword-invalid" });

    // if password not provided or empty password is not same, send bad request 400
    if (password !== confirmPassword) return res.status(400).json({ error: "passwords-mismatch" });

    try {
      // signup new user
      const token: string = await AuthService.signup(firstName, lastName, emailAddress, password);

      // after creating user, send created 201 with token
      res.status(201).json({ token });
    } catch (error) {
      switch (error.message) {
        // if user already exist, send conflict 409
        case AuthService.errors.UserAlreadyExist:
          return res.status(409).json({ error: error.message });
        default:
          return console.log(error);
      }
    }
  }
}
