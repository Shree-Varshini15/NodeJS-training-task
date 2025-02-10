import 'reflect-metadata'
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../databases/entity/User";
import { validate } from "class-validator";
import { encrypt } from "../helpers/encrypt";

export class UserRepository {
  [x: string]: any;
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }
  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } })
  }

  async findAll(): Promise<User[] | null> {
    return this.repository.find()
  }

  async save(name: string, email: string, password: string, role: string): Promise<User | null>{
    const encryptedPassword = await encrypt.encryptPassword(password);

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = encryptedPassword;
    user.role = role;

    const errors = await validate(user);
    if (errors.length > 0) {
      throw new Error("Validation failed: " + errors.map(e => e.toString()).join(", "));
    }
    return this.repository.save(user);
  }

  async deleteUser(user: User) {
    return this.repository.remove(user);
  }
}