import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      const authService = new AuthService();
      const { user, token } = await authService.signup(name, email, password, role) ?? {}
      return res.status(201).json({ 
          message: "User created successfully", 
          token, 
          user
        });
    } catch (err) {
      if (err instanceof Error) return res.status(422).json({message: "Internal server error", error: err.message});
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const authService = new AuthService();
      const { user, token } = await authService.login(email, password);

      return res.status(200).json({ 
        message: "Logged in successfully", token, user
      });
    } catch (err) {
      if (err instanceof Error) return res.status(400).json({message: err.message});
    }
  }
}