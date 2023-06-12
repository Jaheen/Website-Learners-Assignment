import { sign, verify } from "jsonwebtoken";
import { SHA512 } from "crypto-js";
import { User } from "models";

/**
 * Service with business logic related to authentication and authorization
 */
export default class AuthService {
  static errors = {
    UserNotFound: "user-not-found",
    UserAlreadyExist: "user-already-exist",
    PasswordMismatch: "password-mismatch",
    JWTInvalid: "jwt-invalid",
  };

  /**
   * Find user with email address in the database, if such user exist and password matches resolve with a jwt token, else reject with respective error.
   * @param emailAddress email address provided by the client
   * @param password password provided by the client
   * @returns jwt token
   */
  static async login(emailAddress: string, password: string): Promise<string> {
    // find the user with emailAddress
    const user: User = await User.findOne({ where: { emailAddress } });

    // if user not exist throw error
    if (!user) throw new Error(this.errors.UserNotFound);

    // if user found but password mismatch throw error
    if (user.password !== SHA512(password).toString()) throw new Error(this.errors.PasswordMismatch);

    // create JWT token
    const token: string = sign({ userId: user.userId }, process.env.JWT_SECRET);

    return token;
  }

  /**
   * Find user with email address from the database, if user not exists create one and resolve with jwt token, else reject with respective error.
   * @param firstName first name of user
   * @param lastName last name of user
   * @param emailAddress email address of new user
   * @param password password of user
   * @returns jwt token
   */
  static async signup(firstName: string, lastName: string, emailAddress: string, password: string): Promise<string> {
    // check if user with same mail address exist
    const user: User = await User.findOne({ where: { emailAddress } });

    // if exist throw error
    if (user) throw new Error(this.errors.UserAlreadyExist);

    try {
      // if not exist create user in database
      const newUser = await User.create({ firstName, lastName, emailAddress, password: SHA512(password).toString() });

      // create JWT token
      const token: string = sign({ userId: newUser.userId }, process.env.JWT_SECRET);

      return token;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Verify the jwt token for validity. if valid resolve respective user data else resolve error.
   * @param token jwt token sent from the server
   */
  static async verifyToken(token: string): Promise<User> {
    // verify token and decode payload
    const data: any = verify(token, process.env.JWT_SECRET);

    // if data not present then throw invalid JWT error
    if (!data) throw new Error(this.errors.JWTInvalid);

    // find user with userId from decoded data
    const user: User = await User.findOne({ where: { userId: data.userId } });

    // if user not found throw error
    if (!user) throw new Error(this.errors.UserNotFound);

    return user;
  }
}
