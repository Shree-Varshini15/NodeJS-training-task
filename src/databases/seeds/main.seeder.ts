import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { IncidentType } from "../entity/IncidentType";

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = factoryManager.get(User);
    await userFactory.saveMany(2);  
    
    const incidentTypeFactory = factoryManager.get(IncidentType);
    await incidentTypeFactory.saveMany(3);
  }
}