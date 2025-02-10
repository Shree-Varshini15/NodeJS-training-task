import { UserRepository } from "../repositories/user.repository";
import { UserResponse } from "../dto/user.dto";
import { IntegerType } from "typeorm";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository;
  }

  async createUser(name: string, email: string, password: string, role: string) {
    if (!name || !email || !password) throw new Error("Name, email and password are required");

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new Error("User already exists");

    try {
      const user = await this.userRepository.save(name, email, password, role);
  
      const userDataSent = new UserResponse()
      userDataSent.id = user.id;
      userDataSent.name = user.name;
      userDataSent.email= user.email;
      userDataSent.role = user.role;
  
      return { user: userDataSent };
    } catch (err) {
      if (err instanceof Error) throw new Error(`${err.message}`);
    }
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error("User not found");
    
    try {
      await this.userRepository.deleteUser(user);
    } catch (err) {
      throw new Error(`${err.message}`);
    }
  }
}