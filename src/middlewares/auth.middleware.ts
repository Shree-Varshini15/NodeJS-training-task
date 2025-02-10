import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { UserRepository } from "../repositories/user.repository";
dotenv.config();

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const userRepository = new UserRepository();
    req.currentUser = await userRepository.findById(decode['id']);
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }

  next();
};