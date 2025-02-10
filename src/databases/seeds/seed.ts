import { AppDataSource } from "../../data-source";
import { runSeeder } from "typeorm-extension";
import MainSeeder from "./main.seeder";

async function seed() {
  await AppDataSource.initialize();
  await runSeeder(AppDataSource, MainSeeder);
  
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding:", err);
  process.exit(1);
});
