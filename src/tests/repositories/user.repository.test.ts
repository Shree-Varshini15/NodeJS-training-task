import { UserRepository } from "../../repositories/user.repository";
import { User } from "../../databases/entity/User";
import { AppDataSource } from "../../data-source";
import { Repository } from "typeorm";
import { UserRoles } from "../../enums/user.enum";

describe("UserRepository (Integration Test)", () => {
  let userRepository: UserRepository;
  let userRepositoryRepo: Repository<User>;
  let connection: typeof AppDataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
    userRepository = new UserRepository();
    userRepositoryRepo = AppDataSource.getRepository(User);
  });

  beforeEach(async () => {
    await userRepositoryRepo.delete({});
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("findByEmail", () => {
    it("should return a user when found by email", async () => {
      const email = "test@example.com";
      const name = "Test User";
      const password = "password";

      await userRepository.save(name, email, password, undefined);

      const user = await userRepository.findByEmail(email);

      expect(user).not.toBeNull();
      expect(user?.email).toBe(email);
    });

    it("should return null when no user is found by email", async () => {
      const email = "nonexistent@example.com";
      const user = await userRepository.findByEmail(email);

      expect(user).toBeNull();
    });
  });

  describe("save", () => {
    it("should save and return the user", async () => {
      const email = "save_test@example.com";
      const name = "Save Test User";
      const password = "password";
      const savedUser = await userRepository.save(name, email, password, undefined);

      expect(savedUser).not.toBeNull();
      expect(savedUser.email).toBe(email);
      expect(savedUser.name).toBe(name);
      expect(savedUser.role).toBe(UserRoles.FIRE_FIGHTER);
    });

    it("should not save the user if name validation fails", async () => {
      const email = "test1@example.com";
      const password = "password";

      try {
        const name = "";
        await userRepository.save(name, email, password, undefined);
      } catch (error) {
        expect(error.message).toMatch(/failed the following constraints: isLength/);
      }

      try {
        const name = "a".repeat(51);
        await userRepository.save(name, email, password, undefined);
      } catch (error) {
        expect(error.message).toMatch(/failed the following constraints: isLength/);
      }
    });

    it("should not save the user if email validation fails", async () => {
      const name = "Invalid User";
      const password = "password";
      let email = "test2@example.com";
      await userRepository.save(name, email, password, undefined);

      try {
        email = "invalid_email";
        await userRepository.save(name, email, password, undefined);
      } catch (error) {
        expect(error.message).toMatch(/failed the following constraints: isEmail/);
      }

      try {
        email = null;
        await userRepository.save(name, email, password, undefined);
      } catch (error) {
        expect(error.message).toMatch(/failed the following constraints: isEmail/);
      }
    });
  });
});
