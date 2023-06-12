import { Router } from "express";
import * as swaggerUI from "swagger-ui-express";
import swaggerDoc from "swagger";

const DocsRouter: Router = Router();

DocsRouter.use(swaggerUI.serve);

DocsRouter.get("/", swaggerUI.setup(swaggerDoc));

export default DocsRouter;
