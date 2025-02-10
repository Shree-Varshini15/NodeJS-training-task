import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateSignup } from "../schemas/userSchema";

const Router = express.Router();

Router.post("/signup", validateSignup, AuthController.signup);
Router.post("/login", AuthController.login);

export { Router as authRouter };