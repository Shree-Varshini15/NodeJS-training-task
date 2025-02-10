import express from "express";
import { UserController } from "../controllers/user.controller";
import { authentication } from "../middlewares/auth.middleware";

const Router = express.Router();

Router.post("", authentication, UserController.create);
Router.delete("/:id", authentication, UserController.delete);

export { Router as userRouter };