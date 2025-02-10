import request from "supertest";
import { httpServer } from "../../index";
import { AuthService } from "../../services/auth.service";
import { UserRoles } from "../../enums/user.enum";
import { redisConnection } from "../../config/redis-connection";

jest.mock("../../services/auth.service");

describe("AuthController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await redisConnection.quit();
  });

  describe("POST /signup", () => {
    it("should create a new user and return a token", async () => {
      const mockResponse = {
        user: 
        { 
            name: "Test User", 
            email: "test@example.com", 
            role: UserRoles.ADMIN
        },
        token: "fake-jwt-token",
      };

      (AuthService.prototype.signup as jest.Mock).mockResolvedValue(mockResponse);

      const newUser = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: UserRoles.ADMIN
      };

      const response = await request(httpServer)
                                .post("/auth/signup")
                                .send(newUser)
                                .expect(201);

      expect(response.body.message).toBe("User created successfully");
      expect(response.body.token).toBe(mockResponse.token);
      expect(response.body.user).toEqual(mockResponse.user);
    });

    it("should return an error if user already exists", async () => {
      const mockError = new Error("User already exists");
      (AuthService.prototype.signup as jest.Mock).mockRejectedValue(mockError);

      const newUser = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: UserRoles.ADMIN
      };

      const response = await request(httpServer)
        .post("/auth/signup")
        .send(newUser)
        .expect(422);

      expect(response.body.message).toBe("Internal server error");
      expect(response.body.error).toBe(mockError.message);
    });

    describe('Joi validation', () => {
        it('should return 400 if name is missing', async () => {
            const res = await request(httpServer)
                .post('/auth/signup')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    role: UserRoles.ADMIN
                });
        
            expect(res.status).toBe(400);
            expect(res.text).toBe('"name" is required');
        });
      
        it('should return 400 if email is invalid', async () => {
            const res = await request(httpServer)
                .post('/auth/signup')
                .send({
                    name: 'John Doe',
                    email: 'invalid-email',
                    password: 'password123',
                    role: UserRoles.FIRE_FIGHTER
                });
      
          expect(res.status).toBe(400);
          expect(res.text).toBe('"email" must be a valid email');
        });
      
        it('should return 400 if password is too short', async () => {
          const res = await request(httpServer)
            .post('/auth/signup')
            .send({
              name: 'John Doe',
              email: 'test@example.com',
              password: 'short',
              role: UserRoles.ADMIN
            });
      
          expect(res.status).toBe(400);
          expect(res.text).toBe('"password" length must be at least 6 characters long');
        });
      
        it('should return 200 if all fields are valid', async () => {
            (AuthService.prototype.signup as jest.Mock).mockResolvedValue({});
            const res = await request(httpServer)
                .post('/auth/signup')
                .send({
                    name: 'John Doe',
                    email: 'test1@example.com',
                    password: 'password123',
                    role: UserRoles.FIRE_FIGHTER
                });
            expect(res.status).toBe(201);
            expect(res.body.message).toBe("User created successfully");
        });
      
        it('should use default role as "fire_fighter" if no role is provided', async () => {
          (AuthService.prototype.signup as jest.Mock).mockResolvedValue({});
          const res = await request(httpServer)
            .post('/auth/signup')
            .send({
              name: 'John Doe',
              email: 'test2@example.com',
              password: 'password123'
            });
          expect(res.status).toBe(201);
          expect(res.body.message).toBe("User created successfully");
        });
    });
  });

  describe("POST /login", () => {
    it("should log in a user and return a token", async () => {
      const mockResponse = {
        user: { 
            name: "Test User", 
            email: "test@example.com", 
            role: "user" 
        },
        token: "fake-jwt-token",
      };
      (AuthService.prototype.login as jest.Mock).mockResolvedValue(mockResponse);

      const loginCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(httpServer)
        .post("/auth/login")
        .send(loginCredentials)
        .expect(200);

      expect(response.body.message).toBe("Logged in successfully");
      expect(response.body.token).toBe(mockResponse.token);
      expect(response.body.user).toEqual(mockResponse.user);
    });

    it("should return an error if user is not found", async () => {
      const mockError = new Error("User not found");
      (AuthService.prototype.login as jest.Mock).mockRejectedValue(mockError);

      const loginCredentials = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      const response = await request(httpServer)
        .post("/auth/login")
        .send(loginCredentials)
        .expect(400);

      expect(response.body.message).toBe(mockError.message);
    });

    it("should return an error if password is incorrect", async () => {
      const mockError = new Error("Invalid credentials");
      (AuthService.prototype.login as jest.Mock).mockRejectedValue(mockError);

      const loginCredentials = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const response = await request(httpServer)
        .post("/auth/login")
        .send(loginCredentials)
        .expect(400);

      expect(response.body.message).toBe(mockError.message);
    });
  });
});
