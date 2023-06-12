import { json } from "body-parser";
import { AuthController } from "controllers";
import { Router } from "express";

/**
 * Router for routing authentication requests to Auth Controller
 */
const AuthRouter: Router = Router();

// json middleware to parse application/json body
AuthRouter.use(json());

/**
 * Register all auth routes with respected Controller handlers
 */
AuthRouter.post("/login", AuthController.loginHandler);
AuthRouter.post("/signup", AuthController.signupHandler);

export default AuthRouter;
