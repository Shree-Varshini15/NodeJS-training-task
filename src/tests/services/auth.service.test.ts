import { AuthService } from "../../services/auth.service";
import { AppDataSource } from "../../data-source";
import { User } from "../../databases/entity/User";
import { encrypt } from "../../helpers/encrypt";

import "jest";

describe("AuthService", () => {
  let authService: AuthService;
  let connection: typeof AppDataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
    authService = new AuthService(); 
  });

  afterAll(async () => {
    await connection.destroy();
  });

  beforeEach(async () => {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.delete({});
  });

  describe("-- Signup", () => {
    it("should successfully sign up a new user", async () => {

      const name = "John Doe";
      const email = "john.doe@example.com";
      const password = "Password123!";
      const role = "user";
  
      const result = await authService.signup(name, email, password, role);
  
      const user = result.user;
      expect(user.name).toBe(name);
      expect(user.email).toBe(email);
      expect(user.role).toBe(role);
  
      expect(result.token).toBeDefined();
      expect(result.token).toMatch(/^eyJ/); 
  
      const savedUser = await AppDataSource.getRepository(User).findOne({ where: { email } });
      expect(savedUser).not.toBeNull();
      expect(savedUser?.email).toBe(email);
      expect(savedUser?.role).toBe(role);
  
      expect(savedUser?.password).not.toBe(password);
      const isPasswordValid = await encrypt.comparePassword(savedUser?.password, password);
      expect(isPasswordValid).toBe(true);
    });
  
    it("should throw an error when email is already taken", async () => {
      const name = "John Doe";
      const email = "john.doe@example.com";
      const password = "Password123!";
      const role = "user";
      await authService.signup(name, email, password, role);
  
      await expect(authService.signup(name, email, password, role))
        .rejects
        .toThrow(/^User already exists$/);
    });
  
    it("should throw an error when name / email / password is not provided", async () => {
      const name = "John Doe";
      const email = "john.doe1@example.com";
      const password = "Password123!";
  
      await expect(authService.signup(undefined, email, password, undefined))
        .rejects
        .toThrow(/^Name, email and password are required$/);
  
      await expect(authService.signup(name, undefined, password, undefined))
        .rejects
        .toThrow(/^Name, email and password are required$/);
  
      await expect(authService.signup(name, email, undefined, undefined))
        .rejects
        .toThrow(/^Name, email and password are required$/);
    });
  });

  describe("-- Login", () => {
    it("should successfully log in a user with valid credentials", async () => {
      const name = "John Doe";
      const email = "john.doe@example.com";
      const password = "Password123!";
      const role = "user";
  
      await authService.signup(name, email, password, role);
  
      const result = await authService.login(email, password);
  
      const user = result.user;
      expect(user.name).toBe(name);
      expect(user.email).toBe(email);
      expect(user.role).toBe(role);
  
      expect(result.token).toBeDefined();
      expect(result.token).toMatch(/^eyJ/);
  
      const savedUser = await AppDataSource.getRepository(User).findOne({ where: { email } });
      expect(savedUser).not.toBeNull();
      expect(savedUser?.email).toBe(email);
      expect(savedUser?.role).toBe(role);
    });

    it("should throw an error when email is not found", async () => {
      const email = "nonexistent@example.com";
      const password = "Password123!";
  
      await expect(authService.login(email, password))
        .rejects
        .toThrow(/^User not found$/);
    });
  
    it("should throw an error when invalid password is provided", async () => {
      const name = "John Doe";
      const email = "john.doe@example.com";
      const password = "Password123!";
      const role = "user";
  
      await authService.signup(name, email, password, role);
  
      const wrongPassword = "WrongPassword123!";
  
      await expect(authService.login(email, wrongPassword))
        .rejects
        .toThrow(/^Invalid credentials$/);
    });
  
    it("should throw an error when email or password is missing", async () => {
      const name = "John Doe";
      const email = "john.doe@example.com";
      const password = "Password123!";
      const role = "user";
  
      await authService.signup(name, email, password, role);
  
      await expect(authService.login(undefined, password))
        .rejects
        .toThrow(/^Email and password are required$/);
  
      await expect(authService.login(email, undefined))
        .rejects
        .toThrow(/^Email and password are required$/);
    });
  })
})
