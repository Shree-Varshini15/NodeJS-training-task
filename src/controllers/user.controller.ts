import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  static async create(req: Request, res: Response) {
    try{
      const { name, email, password, role } = req.body.user;
      const userService = new UserService();
      const { user } = await userService.createUser(name, email, password, role);
      return res.status(201).json({
        message: "User created successfully",
        user
      });
    } catch (err) {
      return res.status(422).json({message: "Unable to create user", error: err.message});
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const userService = new UserService();
      await userService.deleteUser(id);
      return res.sendStatus(204);
    } catch (err) {
      return res.status(422).json({message: "Unable to delete user", error: err.message});
    }
  }
}