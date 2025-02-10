import { Request } from "express";
import { UserEntity } from "../../databases/entity/User";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity;
    }
  }
}
