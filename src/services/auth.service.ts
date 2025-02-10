import { UserRepository } from "../repositories/user.repository";
import { encrypt } from "../helpers/encrypt";
import { UserResponse } from "../dto/user.dto";

export class AuthService {
  private userRepository: UserRepository;
  
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signup(name: string, email: string, password: string, role: string) {
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
  
      const token = encrypt.generateToken({ id: Number(user.id) });
      return { user: userDataSent, token };
    } catch (err) {
      if (err instanceof Error) throw new Error(`${err.message}`);
    }
  }

  async login(email: string, password: string) {
    if (!email || !password) throw new Error("Email and password are required");

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    if (!encrypt.comparePassword(user.password, password)){
      throw new Error("Invalid credentials");
    }
    const userDataSent = new UserResponse()
    userDataSent.id = user.id;
    userDataSent.name = user.name;
    userDataSent.email= user.email;
    userDataSent.role = user.role;

    const token = encrypt.generateToken({ id: Number(user.id) });

    return { user: userDataSent, token };
  }
}